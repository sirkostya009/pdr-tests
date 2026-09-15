<script lang="ts">
	import { pushState } from "$app/navigation";
	import { page } from "$app/state";
	import { tick } from "svelte";
	import Results from "./Results.svelte";
	import type { Answer, Question } from "./types";

	interface Props {
		name: string | "Рандом";
		test: Question[];
	}

	const { name, test }: Props = $props();

	const isRandom = $derived(name === "Рандом");

	let questionI = $state(0);
	let question = $derived(test[questionI]);

	let loadedQuestion = $state<Question>();
	const imageLoading = $derived(loadedQuestion !== question);
	const onImageSettled = () => (loadedQuestion = question);

	const finished = $derived(!!page.state.finished);

	// depends on `finished` too: returning from the results screen remounts the nav,
	// and the current button has to be recentred even though questionI didn't change
	$effect(() => {
		if (finished) return;

		document
			.querySelector(`button[aria-label="${questionI + 1}"].current`)
			?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
	});


	const answers = $state(test.map(() => [-1, false] as Answer));
	let answered = $derived(answers[questionI][0] !== -1);

	const start = Date.now();
	let elapsed = $state(0);
	let interval: number;

	$effect.pre(() => {
		if (isRandom) {
			interval = setInterval(() => (elapsed = (Date.now() - start) / 1000), 1000) as unknown as number;

			return () => clearInterval(interval);
		}
	});

	function onkeydown({ key }: KeyboardEvent) {
		if (finished) return;

		switch (key) {
			case "ArrowRight":
				if (questionI < test.length - 1) questionI++;
				break;
			case "ArrowLeft":
				if (questionI > 0) questionI--;
				break;
			case "ArrowUp": {
				const currentRow = Math.floor(questionI / 10);
				if (currentRow > 0) {
					questionI -= 10;
				}
				break;
			}
			case "ArrowDown": {
				const currentRow = Math.floor(questionI / 10);
				const maxRows = Math.floor(test.length / 10);
				if (currentRow < maxRows) {
					questionI += 10;
				}
				break;
			}
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
				document.querySelector<HTMLButtonElement>(`button[aria-label="answer-${key}"`)?.focus();
				break;
			case "Enter":
			case " ":
				if (
					document.activeElement instanceof HTMLButtonElement &&
					document.activeElement.ariaLabel?.startsWith("answer-")
				)
					document.activeElement.click();
		}
	}

	function popstate(e: Event) {
		e.preventDefault();
		history.back();
	}

	let touchStartX = 0;
	let touchStartY = 0;

	function ontouchstart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
	}

	function ontouchend(e: TouchEvent) {
		const dx = e.changedTouches[0].clientX - touchStartX;
		const dy = e.changedTouches[0].clientY - touchStartY;
		if (Math.abs(dx) < 50) return;
		// ignore diagonal/vertical gestures so scrolling doesn't switch tests
		if (Math.abs(dx) < Math.abs(dy) * 1.5) return;
		if (dx < 0 && questionI < test.length - 1) questionI++;
		else if (dx > 0 && questionI > 0) questionI--;
	}

	$effect(() => {
		void questionI;
		(document.activeElement as HTMLElement | null)?.blur();
	});

	async function goto(i: number) {
		questionI = i;
		await tick();
		document.getElementById("question-name")?.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
	}

	function review(i: number) {
		questionI = i;
		history.back();
	}
</script>

<svelte:window {onkeydown} />

{#if finished}
	<Results {test} {answers} {elapsed} onreview={review} />
{:else}
	<div class="container">
		<header>
			<a class="back" onclick={popstate} href="/" aria-label="Назад">⟵</a>
			<span class="title">{name}</span>
			{#if isRandom}
				{const seconds = $derived(Math.floor(elapsed % 60))}
				{const minutes = $derived(Math.floor(elapsed / 60))}
				<time>{(minutes < 10 ? "0" : "") + minutes}:{(seconds < 10 ? "0" : "") + seconds}</time>
			{:else}
				<span class="back-spacer" aria-hidden="true">⟵</span>
			{/if}
		</header>

		<main>
			<nav class="questions" aria-label="Питання">
				{#each test as _, i}
					<button
						type="button"
						aria-label={`${i + 1}`}
						class:correct={answers[i][0] !== -1 && answers[i][1]}
						class:incorrect={answers[i][0] !== -1 && !answers[i][1]}
						class:current={questionI === i}
						onclick={({ currentTarget }) => (questionI = +currentTarget.ariaLabel! - 1)}
					></button>
				{/each}
			</nav>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<section class="question" {ontouchstart} {ontouchend}>
				<h2 id="question-name">{question.name}</h2>
				<!-- recreate the element so the previous question's image isn't shown while the next one loads -->
				{#key question}
					{#if question.picture}
						<enhanced:img
							class={["picture", imageLoading && "loading"]}
							src={question.picture}
							alt={question.name}
							sizes="(max-width: 1024px) 100vw, 50vw"
							style:max-width="{question.picture.img.w}px"
							onload={onImageSettled}
							onerror={onImageSettled}
						/>
					{:else if question.vector}
						<img
							class={["vector", question.image?.startsWith("composites/") && "composite", imageLoading && "loading"]}
							src={question.vector}
							alt={question.name}
							onload={onImageSettled}
							onerror={onImageSettled}
						/>
					{/if}
				{/key}
				<ol class="answers" class:answered>
					{#each question.answers as answer, i}
						<li>
							<button
								aria-label="answer-{i + 1}"
								type="button"
								class:answered={answers[questionI][0] === i}
								class:correct={answer.isCorrect}
								onclick={async () => {
									if (answers[questionI][0] === -1) {
										answers[questionI] = [i, answer.isCorrect];
										await tick();

										const target = document.querySelector(".notes") ?? document.querySelector(".question-buttons");
										if (target) {
											const rect = target.getBoundingClientRect();
											const fullyVisible = rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
											if (!fullyVisible) {
												target.scrollIntoView({ behavior: "smooth", block: "end" });
											}
										}

										if (isRandom && answers.every(([i]) => i !== -1)) {
											clearInterval(interval);
											elapsed = (Date.now() - start) / 1000;
											pushState("", { finished: true });
										}
									}
								}}
							>
								{answer.text}
							</button>
						</li>
					{/each}
				</ol>
				<nav class="question-buttons" aria-label="Навігація по питаннях">
					<button
						type="button"
						class="arrow"
						aria-label="Попереднє питання"
						disabled={questionI === 0}
						onclick={() => goto(questionI - 1)}
					>
						←
					</button>
					<button
						type="button"
						class="arrow"
						aria-label="Наступне питання"
						disabled={questionI === test.length - 1}
						onclick={() => goto(questionI + 1)}
					>
						→
					</button>
				</nav>
				{#if answered && (question.comment || question.legal)}
					<div class="notes">
						{#if question.comment}
							<p class="comment">{question.comment}</p>
						{/if}
						{#if question.comment && question.legal}
							<hr />
						{/if}
						{#if question.legal}
							<div class="legal">
								<article>
									<b>{question.legal.clause}</b> {@html question.legal.html}
									<p>
										<a href="https://zakon.rada.gov.ua/laws/show/1306-2001-%D0%BF#n{question.legal.anchor}" target="_blank" rel="noopener">
											Текст ПДР
										</a>
									</p>
								</article>
							</div>
						{/if}
					</div>
				{/if}
			</section>
		</main>
	</div>
{/if}

<style>
	.container {
		display: grid;
		grid-template-columns: max-content;
		grid-template-rows: auto 1fr;
		justify-content: center;
		height: 100%;

		header {
			display: grid;
			grid-template-columns: 1fr auto 1fr;
			align-items: center;
			gap: 0.5rem;
			width: 100%;
			color: grey;
			margin: 3rem 0;

			.back {
				justify-self: start;
				color: grey;
				font-size: var(--text-lg);
				font-weight: 400;
				line-height: 1;
				text-decoration: none;
			}

			.back-spacer {
				justify-self: end;
				font-size: var(--text-lg);
				font-weight: 400;
				line-height: 1;
				visibility: hidden;
			}

			.title {
				justify-self: center;
				text-align: center;
			}

			time {
				justify-self: end;
			}
		}

		time {
			min-width: 3ch;
			color: grey;
			font-variant-numeric: tabular-nums;
		}

		main {
			display: flex;
			flex-direction: row;
			gap: 1rem;
			flex: 1;

			.questions {
				display: grid;
				grid-template-columns: repeat(10, 1fr);
				gap: 0.3rem;
				align-self: flex-start;
				counter-reset: button-n;

				button {
					counter-increment: button-n;
					text-align: center;
					min-width: 2rem;
					min-height: 2rem;
					/* padding: 0.2rem 0.5rem; */
					border: 1px solid black;
					border-radius: 0.3rem;
					box-shadow: inset 0 0 0 1px rgb(55, 55, 55);

					&::before {
						content: counter(button-n);
					}

					&.current {
						background-color: var(--main) !important;
						box-shadow: unset;
					}

					&.correct {
						background-color: var(--green);
						color: white;
						box-shadow: unset;
					}

					&.incorrect {
						background-color: var(--red);
						color: white;
						box-shadow: unset;
					}

					&.current.correct {
						box-shadow: inset 0 0 0 2px var(--green);
					}

					&.current.incorrect {
						box-shadow: inset 0 0 0 2px var(--red);
					}
				}
			}

			.question {
				width: 50vw;
				display: flex;
				flex-direction: column;
				gap: 1rem;
				padding-bottom: 1rem;

				h2 {
					font-size: var(--text-xl);
					font-weight: bold;
				}

				enhanced\:img {
					display: block;
					width: 100%;
					height: auto;
					margin-inline: auto;
				}

				.picture.loading,
				.vector.loading {
					min-height: 12rem;
					border-radius: 0.3rem;
					color: transparent;
					background: linear-gradient(90deg, #0000000d 25%, #0000001f 50%, #0000000d 75%) 0 0 / 200% 100%;
					animation: shimmer 1.2s linear infinite;
				}

				.vector {
					display: block;
					width: 100%;
					max-width: 14rem;
					max-height: 14rem;
					object-fit: contain;
					margin-inline: auto;

					&.composite {
						width: auto;
						max-width: 100%;
						max-height: none;
						height: auto;
					}
				}

				.answers {
					display: flex;
					flex-direction: column;
					gap: 1rem;
					counter-reset: answer;

					li {
						list-style: none;
						counter-increment: answer;

						button {
							display: block;
							width: 100%;
							box-sizing: border-box;
							border: 1px solid black;
							border-radius: 0.3rem;
							box-shadow: inset 0 0 0 1px rgb(55, 55, 55);
							padding: 0.5rem;

							&::before {
								content: counter(answer) ". ";
								font-weight: bold;
							}
						}
					}

					@media (hover: hover) {
						&:not(.answered) li:hover button {
							background-color: var(--main);
							color: white;
						}
					}

					&.answered {
						button.answered {
							border: 2px solid var(--main);
							box-shadow: none;
						}

						button.answered:not(.correct) {
							color: white;
							background-color: var(--red);
						}

						button.correct {
							color: white;
							background-color: var(--green);
						}
					}

					&:not(.answered) button:focus {
						background-color: var(--main);
						border: 1px solid black;
						border-radius: 0.3rem;
						box-shadow: inset 0 0 0 2px white;
					}
				}

				.question-buttons {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					gap: 1rem;

					button {
						min-width: 5rem;
						text-align: center;
						line-height: 1.5rem;
						border: 2px solid var(--main);
						border-radius: 0.3rem;
						padding: 0.5rem 1rem;
						background-color: transparent;
						color: var(--main);
						cursor: pointer;
						transition:
							background-color 0.15s,
							color 0.15s;

						&.arrow {
							font-size: var(--text-lg);
						}

						@media (hover: hover) {
							&:hover {
								background-color: var(--main);
								color: white;
							}
						}

						/* keeps the layout slot so the other arrow stays put */
						&:disabled {
							visibility: hidden;
						}
					}
				}

				.notes {
					border: 2px solid var(--main);
					border-radius: 0.3rem;
					padding: 0.5rem;

					hr {
						border: none;
						border-top: 2px solid var(--main);
						margin: 0.5rem 0;
					}

					.comment {
						margin: 0;
					}

					.legal {
						article :global(p:first-of-type) {
							display: inline;
							margin: 0;
						}

						b {
							color: var(--main);
						}

						article :global(img[src$=".svg"]) {
							height: 1.5em;
							width: auto;
							vertical-align: middle;
						}

						a {
							display: inline-block;
							margin-top: 0.5rem;
							color: var(--main);
							font-size: var(--text-sm);
							text-decoration: underline dotted;
						}
					}
				}
			}
		}
	}

	@keyframes shimmer {
		to {
			background-position: -200% 0;
		}
	}

	@media (max-width: 1024px) {
		.container {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;

			header {
				box-sizing: border-box;
				grid-template-columns: auto minmax(0, 1fr) auto;
				width: 100%;
				margin: 0;
				margin-top: 1rem;
				padding: 0 1rem;
				font-size: var(--text-sm);

				.title {
					justify-self: stretch;
					min-width: 0;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					text-align: center;
				}
			}

			main {
				width: 100%;
				flex-direction: column;
				align-items: center;
				padding: 1rem;

				.questions {
					width: 100%;
					display: flex;
					flex-wrap: nowrap;
					overflow-x: auto;
					align-self: center;

					/* the smaller root size would leave these below a comfortable tap target */
					button {
						min-width: 2.5rem;
						min-height: 2.5rem;
					}
				}

				.question {
					width: 100%;
				}
			}
		}
	}
</style>
