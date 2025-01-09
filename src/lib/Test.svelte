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
		name: string;
		test: Question[];
	}

	const { name, test }: Props = $props();

	let start = Date.now();

	let questionI = $state(0);
	let question = $derived(test[questionI]);

	$effect(() => document
		.querySelector(`button[aria-label="${questionI + 1}"].current`)
		?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }));

	const answers = $state(test.map(() => [-1, false] as [number, boolean]));
	let answered = $derived(answers[questionI][0] !== -1);

	let totalTimer: HTMLSpanElement;
	let dialog: HTMLDialogElement;

	$effect.pre(() => {
		const interval = setInterval(() => {
			// const delta = (Date.now() - start) / 1000;
			// const seconds = delta % 60;
			// const minutes = Math.floor(delta / 60);
			// totalTimer.innerText = `${minutes}:${seconds}`;
		}, 1000);

		return () => clearInterval(interval);
	});

	function onkeydown(e: KeyboardEvent) {
		switch (e.key) {
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
			case '5': document.querySelector<HTMLButtonElement>(`button[aria-label="answer-${e.key}"`)?.focus();
		}
	}

	function onpopstate() {
		if (dialog.hasAttribute("open")) {
			dialog.close();
		}
	}
</script>

<svelte:window {onkeydown} {onpopstate} />

<div class="container">
	<h1>
		<a href="/#/">{name}</a>
	</h1>

	<main>
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
							}
						}}
					>
						<li>
							{answer.text}
						</li>
					</button>
				{/each}
			</ol>
			{#if answered && "comment" in (question?.explanation ?? {})}
				<p>{question?.explanation?.comment}</p>
			{/if}
			<div class="question-buttons">
				{#if questionI < test.length - 1}
					<button type="button" onclick={() => questionI++}>
						{answered ? "Некст" : "Пропустити"}
					</button>
				{/if}
				{#if answered && question?.explanation?.legal}
					<button
						type="button"
						onclick={() => {
							pushState(page.url.toString(), {});
							dialog.showModal();
						}}
					>
						Стаття
					</button>
				{/if}
			</div>
		</section>
	</main>
</div>

{#if "explanation" in question && question?.explanation?.legal}
	<dialog bind:this={dialog} onclose={() => history.back()}>
		<form method="dialog">
			<h1>{question?.explanation?.legal?.title}</h1>
			<button>X</button>
		</form>
		<article>
			{@html question?.explanation?.legal?.html}
		</article>
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
						box-shadow: unset;
					}

					&.incorrect {
						background-color: var(--red);
						box-shadow: unset;
					}
				}
			}

			.question {
				width: 50vw;
				display: flex;
				flex-direction: column;
				gap: 1rem;

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

	dialog {
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
						position: fixed;
						background-color: rgb(55, 55, 55);
						width: 100%;
						left: 0;
						padding: 0.5rem;
						bottom: 0;

						button {
							padding: 0.5rem;
						}
					}
				}
			}
		}

		dialog {
			width: 100%;
			height: 100%;

			h1 {
				font-size: 2.25rem;
			}

			article {
				font-size: 1.5rem;
			}
		}
	}
</style>
