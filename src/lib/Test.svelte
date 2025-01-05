<script lang="ts">
	import { pushState } from "$app/navigation";
	import { page } from "$app/state";

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

	function* range(start: number, end: number, step = 1) {
		for (; start < end; start += step) {
			yield start;
		}
	}

	const answers = $state(
		range(0, test.length)
			.map(() => [-1, false])
			.toArray() as [number, boolean][]
	);
	let answered = $derived(answers[questionI][0] !== -1);

	let answerOptions: HTMLOListElement;
	let totalTimer: HTMLSpanElement;

	$effect.root(() => {
		const interval = setInterval(() => {
			// const delta = (Date.now() - start) / 1000;
			// const seconds = delta % 60;
			// const minutes = Math.floor(delta / 60);
			// totalTimer.innerText = `${minutes}:${seconds}`;
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<svelte:window
	onkeydown={(e) => {
		switch (e.key) {
			case "ArrowRight":
				if (questionI < test.length - 1) questionI++;
				break;
			case "ArrowLeft":
				if (questionI > 0) questionI--;
				break;
			case "ArrowUp": {
				const buttons = answerOptions.childNodes
					.values()
					.filter((n) => n instanceof HTMLButtonElement)
					.toArray() as HTMLButtonElement[];
				const currentFocus = buttons.findIndex(
					(b) => document.activeElement === b
				);
				if (currentFocus === -1 || currentFocus === 0) {
					buttons[buttons.length - 1].focus();
					return;
				} else {
					buttons[currentFocus - 1].focus();
				}
				break;
			}
			case "ArrowDown": {
				const buttons = answerOptions.childNodes
					.values()
					.filter((n) => n instanceof HTMLButtonElement)
					.toArray() as HTMLButtonElement[];
				const currentFocus = buttons.findIndex(
					(b) => document.activeElement === b
				);
				if (
					currentFocus === -1 ||
					currentFocus === buttons.length - 1
				) {
					buttons[0].focus();
					return;
				} else {
					buttons[currentFocus + 1].focus();
				}
				break;
			}
		}
	}}
	onpopstate={() => {
		const dialog = document.querySelector("dialog");
		if (dialog?.hasAttribute("open")) {
			dialog?.close();
		}
	}}
/>

<div class="container">
	<h1>
		<a href="/#/">{name}</a>
	</h1>

	<main>
		<section class="questions">
			{#each test as _, i}
				<button
					class:correct={answers[i][0] !== -1 && answers[i]}
					class:incorrect={answers[i][0] !== -1 && !answers[i][1]}
					class:current={questionI === i}
					onclick={() => (questionI = i)}
				>
					{i + 1}
				</button>
			{/each}
		</section>
		<section class="question">
			<h2 id="question-name">{question.name}</h2>
			{#if "image" in question}
				<img src={question.image} alt={question.name} />
			{/if}
			<ol bind:this={answerOptions} class="answers" class:answered>
				{#each question.answers as answer, i}
					<button
						type="button"
						class:answered={answers[questionI][0] === i}
						class:correct={answer.isCorrect}
						onclick={() => {
							if (answers[questionI][0] === -1) {
								answers[questionI] = [i, answer.isCorrect];
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
							document.querySelector("dialog")?.showModal();
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
	<dialog onclose={() => history.back()}>
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

				button {
					text-align: center;
					padding: 0.2rem 0.4rem;
					border: 1px solid black;
					border-radius: 4px;
					box-shadow: inset 0 0 0 1px rgb(55, 55, 55);

					&:hover {
						background-color: rgba(55, 55, 55, 0.7);
					}

					&.current {
						background-color: chocolate !important;
						box-shadow: unset;
					}

					&.correct {
						background-color: forestgreen;
						box-shadow: unset;
					}

					&.incorrect {
						background-color: brown;
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
					background-color: chocolate;
					padding: 0.5rem;
					font-size: 0.9rem;
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
						padding: 1rem;
					}

					&:not(.answered) li:hover {
						color: rgba(255, 255, 255, 0.7);
					}

					button {
						border-radius: 0.2rem;
						padding: 0.5rem;
					}

					&.answered {
						button.answered:not(.correct) {
							background-color: brown;
						}

						button.correct {
							background-color: forestgreen;
						}
					}

					&:not(.answered) button:focus {
						background-color: chocolate;
						border: 1px solid black;
						border-radius: 0.3rem;
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
						background-color: chocolate;
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
		background-color: brown;
		border-radius: 0.2rem;

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
					grid-template-columns: repeat(auto-fill, minmax(2rem, 1fr));
					align-self: center;
				}

				.question {
					width: 100%;

					.question-buttons button {
						padding: 0.5rem;
					}
				}
			}
		}

		dialog {
			width: 100%;
			height: 100%;
		}
	}
</style>
