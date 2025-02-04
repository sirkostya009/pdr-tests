<script lang="ts">
	import { pushState } from "$app/navigation";
	import { page } from "$app/state";
	import { tick } from "svelte";

	interface Question {
		name: string;
		answers: { text: string; isCorrect: boolean }[];
		image?: string;
		explanation?: {
			comment?: string;
			legal: {
				title: string;
				html: string;
			};
		};
	}

	interface Props {
		name: string | 'Рандом';
		test: Question[];
	}

	const { name, test }: Props = $props();

	const isRandom = name === 'Рандом';

	let questionI = $state(0);
	let question = $derived(test[questionI]);

	$effect(() => document
		.querySelector(`button[aria-label="${questionI + 1}"].current`)
		?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }));

	const answers = $state(test.map(() => [-1, false] as [number, boolean]));
	let answered = $derived(answers[questionI][0] !== -1);

	let legalDialog = $state<HTMLDialogElement>();
	let finishDialog = $state<HTMLDialogElement>();

	const start = Date.now();
	let elapsed = $state(0);
	let interval: number;

	$effect.pre(() => {
		if (isRandom) {
			interval = setInterval(() => elapsed = (Date.now() - start) / 1000, 1000) as unknown as number;

			return () => clearInterval(interval);
		}
	});

	function onkeydown({ key }: KeyboardEvent) {
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
			case '1':
			case '2':
			case '3':
			case '4':
			case '5': document.querySelector<HTMLButtonElement>(`button[aria-label="answer-${key}"`)?.focus();
		}
	}

	function onpopstate() {
		legalDialog?.close();
		finishDialog?.close();
	}

	function popstate(e: Event) {
		e.preventDefault();
		history.back();
	}
</script>

<svelte:window {onkeydown} {onpopstate} />

<div class="container">
	<h1>
		<a onclick={popstate} href="/#/">{name}</a>
	</h1>

	<main>
		{#if isRandom}
			{@const seconds = Math.floor(elapsed % 60)}
			{@const minutes = Math.floor(elapsed / 60)}
			<span>{(minutes < 10 ? '0' : '') + minutes}:{(seconds < 10 ? '0' : '') + seconds}</span>
		{/if}

		<section class="questions">
			{#each test as _, i}
				<button
					type="button"
					aria-label={`${i + 1}`}
					class:correct={answers[i][0] !== -1 && answers[i][1]}
					class:incorrect={answers[i][0] !== -1 && !answers[i][1]}
					class:current={questionI === i}
					onclick={({ currentTarget }) => questionI = +currentTarget.ariaLabel! - 1}
				></button>
			{/each}
		</section>
		<section class="question">
			<h2 id="question-name">{question.name}</h2>
			{#if "image" in question}
				<img src={question.image} alt={question.name} />
			{/if}
			<ol class="answers" class:answered>
				{#each question.answers as answer, i}
					<button
						aria-label="answer-{i + 1}"
						type="button"
						class:answered={answers[questionI][0] === i}
						class:correct={answer.isCorrect}
						onclick={async () => {
							if (answers[questionI][0] === -1) {
								answers[questionI] = [i, answer.isCorrect];
								await tick();
								document
									.querySelector('.question p')
									?.scrollIntoView({ behavior: 'smooth' });

								if (isRandom && answers.every(([i]) => i !== -1)) {
									pushState(page.url, {});
									finishDialog?.showModal();
									clearInterval(interval);
								}
							}
						}}
					>
						<li>
							{answer.text}
						</li>
					</button>
				{/each}
			</ol>
			{#if answered && question.explanation?.comment}
				<p>{question.explanation.comment}</p>
			{/if}
			<div class="question-buttons">
				{#if questionI < test.length - 1}
					<button
						type="button"
						onclick={async () => {
							questionI++;
							await tick();
							document
								.getElementById('question-name')
								?.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
						}}
					>
						{answered ? "Некст" : "Пропустити"}
					</button>
				{/if}
				{#if answered && question.explanation?.legal}
					<button
						type="button"
						onclick={() => {
							pushState(page.url, {});
							legalDialog?.showModal();
						}}
					>
						Стаття
					</button>
				{/if}
			</div>
		</section>
	</main>
</div>

{#if question.explanation?.legal}
	<dialog bind:this={legalDialog} class="legal">
		<form method="dialog">
			<h1>{question.explanation.legal.title}</h1>
			<button onclick={popstate}>X</button>
		</form>
		<article>
			{@html question.explanation.legal.html}
		</article>
	</dialog>
{/if}

{#if isRandom}
	{@const correctAnswers = answers.filter(([, correct]) => correct).length}
	{@const passed = test.length - correctAnswers <= 2}
	{@const seconds = Math.floor(elapsed % 60)}
	{@const minutes = Math.floor(elapsed / 60)}
	<dialog style:background-color="var(--{passed ? 'green' : 'red'}" bind:this={finishDialog} id="finish-stats">
		<h1 class:passed>{passed ? 'Здано' : 'Не здано'}</h1>
		<div class="count">
			<span>{correctAnswers}</span>
			<span>/</span>
			<span>{test.length}</span>
			<span>відповідей</span>
		</div>
		<div class="percent">{((correctAnswers / test.length) * 100).toFixed(0)}%</div>
		<div>{(minutes < 10 ? '0' : '') + minutes}:{(seconds < 10 ? '0' : '') + seconds}</div>
		<a href="/#/">На головну</a>
	</dialog>
{/if}

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;

		h1 {
			color: grey;
			margin: 3rem 0;
		}

		span {
			color: grey;
		}

		main {
			display: flex;
			flex-direction: row;
			gap: 1rem;

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

					&:hover {
						background-color: rgba(55, 55, 55, 0.7);
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
				}
			}

			.question {
				width: 50vw;
				display: flex;
				flex-direction: column;
				gap: 1rem;
				padding-bottom: 1rem;

				h2 {
					font-size: 1.5rem;
					font-weight: bold;
				}

				p {
					border-radius: 0.2rem;
					background-color: var(--main);
					padding: 0.5rem;
					font-size: 0.9rem;
					color: white;
				}

				img {
					width: 100%;
				}

				.answers {
					display: flex;
					flex-direction: column;
					gap: 1rem;

					li {
						list-style: decimal;
						list-style-position: inside;
					}

					button {
						border: 1px solid black;
						border-radius: 0.3rem;
						box-shadow: inset 0 0 0 1px rgb(55, 55, 55);
						padding: 0.5rem;
					}

					&:not(.answered) li:hover {
						color: rgba(255, 255, 255, 0.7);
					}

					&.answered {
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
					flex-direction: row-reverse;
					align-items: center;
					justify-content: space-around;

					button {
						width: 7rem;
						text-align: center;
						padding: 0.2rem;
						border: 1px solid black;
						border-radius: 0.3rem;
						box-shadow: inset 0 0 0 1px rgb(55, 55, 55);
						padding: 0.5rem;
						background-color: var(--main);
						color: white;
						cursor: pointer;
					}
				}
			}
		}
	}

	.legal {
		max-width: 1280px;
		width: 50%;
		height: 80%;
		margin: auto;
		background-color: var(--red);
		border-radius: 0.2rem;
		color: white;

		form {
			display: flex;
			justify-content: space-between;
			font-size: 2rem;
			font-weight: bold;
			padding: 0.5rem;
		}

		article {
			font-size: 0.8rem;
			padding: 0.5rem;
		}

		&::backdrop {
			background-color: rgba(0, 0, 0, 0.8);
		}
	}

	#finish-stats[open] {
		display: flex;
		margin: auto;
		max-width: 50%;
		max-height: 50%;
		padding: 1rem;
		border-radius: 0.5rem;
		flex-direction: column;
		align-items: center;

		h1 {
			margin: auto;
			outline: var(--red);
			border-color: var(--red);
			font-size: 3rem;

			&.passed {
				outline: var(--green);
			}
		}

		.count {
			padding: 0.5rem;
		}

		.percent {
			padding: 0.5rem;
		}

		a {
			background-color: var(--main);
			padding: 0.5rem;
			border-radius: 0.3rem;
		}

		&::backdrop {
			background-color: rgba(0, 0, 0, 0.8);
		}
	}

	@media (max-width: 1024px) {
		.container {
			h1 {
				display: none;
				margin: 0.5rem 0;
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
				}

				.question {
					width: 100%;
					padding-bottom: 3.75rem;

					.question-buttons {
						background-color: var(--bg-color);
						position: fixed;
						box-shadow: 0 0 0.5rem 0.05rem rgb(0 0 0 / 20%);
						width: 100%;
						left: 0;
						bottom: 0;

						button {
							margin: 0.5rem;
							padding: 0.5rem;
						}
					}
				}
			}
		}

		.legal {
			width: 100%;
			height: 100%;

			h1 {
				font-size: 2.25rem;
			}

			article {
				font-size: 1.5rem;
			}
		}

		#finish-stats[open] {
			margin: auto;
			min-width: 90%;
			min-height: 60%;
			justify-content: space-around;

			h1 {
				margin: 0;
			}

			.count {
				font-size: 2rem;
			}

			.percent {
				font-size: 2rem;
			}
		}
	}
</style>
