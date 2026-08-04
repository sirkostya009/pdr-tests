<script lang="ts">
	import { untrack } from "svelte";
	import type { Answer, Question } from "./types";

	interface Props {
		test: Question[];
		answers: Answer[];
		elapsed: number;
		onreview: (i: number) => void;
	}

	const { test, answers, elapsed, onreview }: Props = $props();

	const correct = $derived(answers.filter(([, ok]) => ok).length);
	const passed = $derived(test.length - correct <= 2);
	const percent = $derived(Math.round((correct / test.length) * 100));
	const missed = $derived(test.map((q, i) => ({ q, i })).filter(({ i }) => !answers[i][1]));

	const time = $derived.by(() => {
		const seconds = Math.floor(elapsed % 60);
		const minutes = Math.floor(elapsed / 60);
		return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
	});

	const POOLS = {
		passed: ["🎉", "🎊", "✨", "🥳", "🏆", "👏", "🌟", "🔥", "🚗", "💛", "🍾", "🤩"],
		failed: ["😭", "💀", "🤡", "🚧", "🙈", "😵‍💫", "📉", "🛑", "🥲", "🫠", "😬", "🪦"],
	};

	const rand = (min: number, max: number) => min + Math.random() * (max - min);

	// one emoji per run, drawn from the pool; frozen at mount so re-renders don't reshuffle mid-fall
	const emoji = untrack(() => {
		const pool = POOLS[passed ? "passed" : "failed"];
		return pool[Math.floor(Math.random() * pool.length)];
	});

	const shower = Array.from({ length: 24 }, () => ({
		left: rand(0, 100),
		delay: rand(0, 2.5),
		duration: rand(3.5, 6),
		size: rand(1.2, 2.4),
		drift: rand(-8, 8),
		spin: rand(-540, 540),
	}));
</script>

<div class="shower" aria-hidden="true">
	{#each shower as p, i (i)}
		<span
			style:left="{p.left}%"
			style:animation-delay="{p.delay}s"
			style:animation-duration="{p.duration}s"
			style:font-size="{p.size}rem"
			style:--drift="{p.drift}rem"
			style:--spin="{p.spin}deg"
		>
			{emoji}
		</span>
	{/each}
</div>

<main class="results" class:passed>
	<header>
		<p class="percent">{percent}%</p>
		<h1>{passed ? "Здано" : "Не здано"}</h1>
	</header>

	<dl class="stats">
		<div>
			<dt>Правильних</dt>
			<dd>{correct} / {test.length}</dd>
		</div>
		<div>
			<dt>Помилок</dt>
			<dd>{test.length - correct}</dd>
		</div>
		<div>
			<dt>Час</dt>
			<dd><time>{time}</time></dd>
		</div>
	</dl>

	{#if missed.length}
		<section class="missed">
			<h2>Помилки</h2>
			<ol>
				{#each missed as { q, i } (i)}
					<li>
						<button type="button" onclick={() => onreview(i)}>
							<span class="n">{i + 1}</span>
							<span class="name">{q.name}</span>
						</button>
					</li>
				{/each}
			</ol>
		</section>
	{/if}

	<a class="home" href="/">На головну</a>
</main>

<style>
	.shower {
		position: fixed;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 1;

		span {
			position: absolute;
			top: 0;
			line-height: 1;
			animation-name: fall;
			animation-timing-function: linear;
			animation-fill-mode: both;
			will-change: transform;
		}
	}

	@keyframes fall {
		from {
			transform: translate3d(0, -15vh, 0) rotate(0deg);
			opacity: 0;
		}

		10% {
			opacity: 1;
		}

		85% {
			opacity: 1;
		}

		to {
			transform: translate3d(var(--drift), 105vh, 0) rotate(var(--spin));
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.shower {
			display: none;
		}
	}

	.results {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		max-width: 40rem;
		margin: 0 auto;
		padding: 3rem 1rem;

		header {
			display: flex;
			flex-direction: column;
			align-items: center;

			.percent {
				font-size: var(--text-display);
				font-weight: bold;
				line-height: 1;
				color: var(--red);
			}

			h1 {
				font-size: var(--text-lg);
				color: grey;
			}
		}

		&.passed header .percent {
			color: var(--green);
		}

		.stats {
			display: flex;
			gap: 1rem;
			width: 100%;

			div {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 0.2rem;
				padding: 0.75rem 0.5rem;
				border: 1px solid var(--main);
				border-radius: 0.3rem;
			}

			dt {
				font-size: var(--text-xs);
				color: grey;
			}

			dd {
				font-weight: bold;
			}
		}

		.missed {
			width: 100%;

			h2 {
				font-size: var(--text-sm);
				color: grey;
				padding-bottom: 0.5rem;
			}

			ol {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
				counter-reset: none;
			}

			button {
				display: flex;
				align-items: baseline;
				gap: 0.5rem;
				width: 100%;
				/* `all: unset` in globals resets box-sizing back to content-box */
				box-sizing: border-box;
				text-align: left;
				font-size: var(--text-sm);
				padding: 0.5rem;
				border: 1px solid var(--red);
				border-radius: 0.3rem;
				transition: background-color 0.15s;

				.n {
					font-weight: bold;
					flex-shrink: 0;
				}

				@media (hover: hover) {
					&:hover {
						background-color: var(--red);
						color: white;
					}
				}
			}
		}

		.home {
			border: 2px solid var(--main);
			border-radius: 0.3rem;
			padding: 0.5rem 1rem;
			color: var(--main);
			transition:
				background-color 0.15s,
				color 0.15s;

			@media (hover: hover) {
				&:hover {
					background-color: var(--main);
					color: white;
				}
			}
		}
	}
</style>
