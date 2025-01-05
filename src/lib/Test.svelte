<script lang="ts">
	interface Question {
		name: string;
		answers: { text: string; isCorrect: boolean }[];
		image?: string;
		explanation: {
			comment?: string;
			legal: {
				title?: string;
				html?: string;
			};
		} | null;
	}

	interface Props {
		name: string;
		test: Question[];
	}

	const { name, test }: Props = $props();

	let start = Date.now();

	let questionI = $state(0);
	let question = $derived(test[questionI]);
	const answers = $state(new Array(test.length));
	let answered = $derived(!!answers[questionI]);

	let answerOptions: HTMLOListElement;
	let totalTimer: HTMLSpanElement;

	$effect.root(() => {
		const interval = setInterval(() => {
			const delta = (Date.now() - start) / 1000;
			const seconds = delta % 60;
			const minutes = Math.floor(delta / 60);
			totalTimer.innerText = `${minutes}:${seconds}`;
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
					.map((n) => n?.firstChild)
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
					.map((n) => n?.firstChild)
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
/>

<div class="container">
	<h1>{name}</h1>

	<main>
		<section class="questions">
			{#each test as _, i}
				<button
					class:correct={answers[i]?.[0]}
					class:incorrect={answers[i]?.length && !answers[i][0]}
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
					<li>
						<button
							type="button"
							class:answered={answers[questionI]?.[1] === i}
							class:correct={answer.isCorrect}
							onclick={(e) => {
								if (!answers[questionI]) {
									e.currentTarget.classList.add("answered");
									answers[questionI] = [answer.isCorrect, i];
								}
							}}
						>
							{answer.text}
						</button>
					</li>
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
						onclick={() =>
							document.querySelector("dialog")?.showModal()}
					>
						Стаття
					</button>
				{/if}
			</div>
		</section>
	</main>
</div>

{#if question?.explanation?.legal}
	<dialog>
		<form method="dialog">
			<h1>{question?.explanation?.legal?.title}</h1>
			<button>X</button>
		</form>
		<article>
			<base href="https://pdr-online.com.ua" />
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
						background-color: greenyellow;
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

				.answers {
					display: flex;
					flex-direction: column;
					gap: 1rem;

					li {
						list-style: decimal;
					}

					:hover {
						color: rgba(255, 255, 255, 0.7);
					}

					button {
						border-radius: 0.2rem;
						width: 100%;
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
					}
				}

				.question-buttons {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-around;

					button {
						width: 7rem;
						text-align: center;
						padding: 0.2rem;
						border: 1px solid black;
						border-radius: 10px;
						box-shadow: inset 0 0 0 1px rgb(55, 55, 55);
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
				margin: 0.5rem 0;
			}

			main {
				flex-direction: column;
				align-items: center;
				width: 100%;
				padding-bottom: 1rem;

				.questions {
					align-self: center;
				}

				.question {
					width: 90vw;
				}

				.question-buttons button {
					padding: 1rem;
				}
			}
		}
	}
</style>
