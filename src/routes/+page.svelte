<script lang="ts">
	import { tests as modules } from "$lib/tests";

	const exam = [
		{ count: 10, test: "Загальні положення" },
		{ count: 4, test: "Додаткові питання щодо категорій B1, B (будова і терміни)" },
		{ count: 4, test: "Надання першої медичної допомоги" },
		{ count: 2, test: "Основи безпечного водіння" },
	];

	const tests = Object.keys(modules)
		.map((key) => key.replace("/src/lib/tests/", "").replace(".json", ""))
		.filter((test) => !exam.some((e) => e.test === test));

	let scrollY = $state(0);
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>Тести ПДР</title>
	<meta property="og:title" content="Тести ПДР" />
	<meta property="og:description" content="Безкоштовні тести Правил дорожнього руху України" />
</svelte:head>

<main>
	<section class="exam" aria-labelledby="exam-title">
		<h2 id="exam-title">
			<a href="/random" class="start">Пробний екзамен</a>
		</h2>
		<p>Екзамен містить питання:</p>
		<ul>
			{#each exam as { count, test }}
				<li>
					<span><data value={count}>{count}</data> з</span>
					<a href="/{test}">{test}</a>
				</li>
			{/each}
		</ul>
		<a href="#all-title" class={["more", scrollY > 0 && "hidden"]}>
			Інші тести
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M5.3 8.3a1 1 0 0 1 1.4 0L12 13.6l5.3-5.3a1 1 0 1 1 1.4 1.4l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.4Z" />
			</svg>
		</a>
	</section>

	<section class="all" aria-labelledby="all-title">
		<h2 id="all-title">Інші тести ({tests.length})</h2>
		<ol>
			{#each tests as test}
				<li>
					<a href="/{test}"><span>{test}</span></a>
				</li>
			{/each}
		</ol>
	</section>
</main>

<style>
	main {
		width: 100%;
		max-width: 1280px;
		margin: 0 auto;
		padding: 1rem;
		padding-bottom: 0;
	}

	:global(html:has(.more)) {
		scroll-snap-type: y mandatory;
	}

	:global(body:has(.more)) {
		height: auto;
		min-height: 100%;
	}

	.exam {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		position: relative;
		scroll-margin-top: 1rem;
		scroll-snap-align: start;
		min-height: calc(100svh - 1rem);
		padding-block: 2rem 6rem;

		.start {
			display: inline-block;
			font-size: var(--text-xl);
			--bg: var(--main);
			color: black;
			color: oklch(from var(--bg) clamp(0, (0.72 - l) * infinity, 1) 0 0);
			background-color: var(--bg);
			border-radius: 0.5rem;
			box-shadow: 0 8px 0 color-mix(in srgb, var(--main), black 30%);
			padding: 1rem 2.5rem;

			&:hover {
				--bg: color-mix(in srgb, var(--main), white 12%);
			}

			&:active {
				box-shadow: 0 4px 0 color-mix(in srgb, var(--main), black 30%);
				transform: translateY(4px);
			}
		}

		p {
			margin-bottom: -0.75rem;
			font-size: var(--text-sm);
			opacity: 0.7;
		}

		ul {
			display: grid;
			grid-template-columns: auto auto;
			column-gap: 0.3em;
		}

		li {
			display: grid;
			grid-column: span 2;
			grid-template-columns: subgrid;
		}

		li > * {
			padding-block: 0.5rem;
		}

		li > span {
			text-align: right;
			font-variant-numeric: tabular-nums;
			opacity: 0.6;
		}

		a:not(.start) {
			text-decoration: underline dotted;

			&:hover {
				color: var(--main);
			}
		}

		.more {
			position: absolute;
			bottom: 0.5rem;
			left: 50%;
			translate: -50%;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 0.5rem;
			font-size: var(--text-sm);
			white-space: nowrap;
			opacity: 0.6;
			transition:
				opacity 0.3s ease,
				visibility 0.3s;

			&:hover {
				opacity: 1;
			}

			&.hidden {
				opacity: 0;
				visibility: hidden;
			}

			svg {
				display: block;
				width: 2rem;
				height: 2rem;
			}
		}
	}

	.all {
		scroll-margin-top: 6rem;
		scroll-snap-align: start;
		padding-bottom: 1rem;

		h2 {
			text-align: center;
			font-size: var(--text-xl);
			font-weight: bold;
			padding-bottom: 1.5rem;
		}

		ol {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			font-size: var(--text-sm);

			li {
				list-style: none;
				counter-increment: test-list;

				a {
					display: flex;
					gap: 0.4rem;
					height: 100%;
					padding: 0.25rem 0.4rem;
					border-radius: 10px;

					&::before {
						content: counter(test-list, decimal-leading-zero) ".";
						flex-shrink: 0;
					}

					&:visited {
						color: rgb(255, 207, 135);
					}

					&:hover {
						background-color: var(--main);
						color: var(--on-main);
					}

					/* the same gold, dark or light depending on the accent behind it */
					@supports (color: oklch(from red l c h)) {
						&:visited:hover {
							color: oklch(from var(--main) calc(0.3 + 0.64 * clamp(0, (0.72 - l) * infinity, 1)) 0.1 75);
						}
					}
				}

				span {
					text-decoration: underline dotted;
				}
			}
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		:global(html:has(.more)) {
			scroll-behavior: smooth;
		}

		.exam .more svg {
			animation: bounce 1.6s ease-in-out infinite;
		}

		@supports (animation-timeline: scroll()) {
			.all {
				animation: reveal linear both;
				animation-timeline: view();
				animation-range: entry 0% entry 60%;
			}
		}
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(0.5rem);
		}
	}

	@keyframes reveal {
		from {
			opacity: 0;
			transform: translateY(3rem);
		}
	}

	@media (max-width: 1500px) {
		.all ol {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 1024px) {
		.all {
			h2 {
				padding-bottom: 1rem;
			}

			ol {
				grid-template-columns: 1fr;
				font-size: 1rem;
				gap: 0.25rem;
			}
		}
	}

	@media (max-width: 640px) {
		.exam .start {
			font-size: var(--text-lg);
			padding: 0.75rem 1.5rem;
		}
	}
</style>
