<script lang="ts">
	const { data } = $props();
</script>

<svelte:head>
	<title>Тести ПДР</title>
	<meta property="og:title" content="Тести ПДР" />
	<meta property="og:description" content="Безкоштовні тести Правил дорожнього руху України" />
</svelte:head>

<main>
	<header>
		<h1>Тести ПДР</h1>
		<nav>
			<div class="random">
				<a href="/random" class="button">20 випадкових питань</a>
				<ul class="note">
					<li>10 з «Загальних положень»</li>
					<li>4 з «Будови і термінів»</li>
					<li>4 з «Першої медичної допомоги»</li>
					<li>2 з «Основ безпечного водіння»</li>
				</ul>
			</div>
			<a href="https://github.com/sirkostya009/pdr-tests" class="button" title="GitHub">
				<picture>
					<source srcset="/github-mark-white.svg" media="(prefers-color-scheme: dark)" />
					<img src="/github-mark.svg" alt="GitHub" />
				</picture>
			</a>
		</nav>
	</header>

	<section>
		<h2>{data.tests.length} тестів</h2>
		<ol>
			{#each data.tests as test}
				<li>
					<a href="/{test}">{test}</a>
				</li>
			{/each}
		</ol>
	</section>
</main>

<style>
	main {
		max-width: 1280px;
		margin: 0 auto;
		padding: 1rem;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 3rem 1rem;

		h1 {
			font-size: 2rem;
			font-weight: bold;
		}

		nav {
			display: flex;
			align-items: flex-start;
			gap: 0.5rem;

			.random {
				position: relative;
				display: flex;
				flex-direction: column;
				gap: 0.4rem;

				.button {
					justify-content: center;
				}

				.note {
					position: absolute;
					top: 100%;
					left: 0;
					transform: translateY(0.25rem);
					margin-top: 0.5rem;
					width: max-content;
					max-width: 18rem;
					font-size: 0.75rem;
					line-height: 1.4;
					list-style: disc;
					padding: 0.5rem 0.7rem 0.5rem 1.5rem;
					border-radius: 0.4rem;
					background-color: #1f1f1f;
					color: #fff;
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
					opacity: 0;
					pointer-events: none;
					transition:
						opacity 0.15s ease,
						transform 0.15s ease;
					z-index: 1;

					li {
						list-style: disc;

						&::marker {
							color: #fff;
						}
					}

					&::before {
						content: "";
						position: absolute;
						bottom: 100%;
						left: 2rem;
						border: 0.4rem solid transparent;
						border-bottom-color: #1f1f1f;
					}
				}

				&:hover .note {
					opacity: 1;
					transform: translateY(0);
				}
			}

			.button {
				display: flex;
				align-items: center;
				border-radius: 0.3rem;
				border: 2px solid var(--main);
				padding: 0.75rem 1rem;

				&:hover {
					background-color: var(--main);
					color: white;
				}
			}

			img {
				width: 1.5rem;
				height: 1.5rem;
				display: block;
			}
		}
	}

	section {
		h2 {
			text-align: center;
			font-size: 1.5rem;
			font-weight: bold;
			padding-bottom: 1.5rem;
		}

		ol {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			font-size: 0.85rem;

			li {
				list-style: none;
				display: flex;
				gap: 0.4rem;
				padding: 0.25rem 0.4rem;
				counter-increment: test-list;

				&::before {
					content: counter(test-list, decimal-leading-zero) ".";
					flex-shrink: 0;
				}

				a {
					text-decoration: underline dotted;
				}

				&:hover {
					background-color: var(--main);
					border-radius: 10px;
				}

				&:has(a:visited) {
					color: rgb(255, 207, 135);

					a {
						color: rgb(255, 207, 135);
					}
				}
			}
		}
	}

	@media (max-width: 1500px) {
		section ol {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 1024px) {
		header {
			flex-direction: column;
			justify-content: center;
			gap: 1rem;
			padding: 1rem 0;
			min-height: 50vh;
		}

		header nav .random .note {
			position: static;
			transform: none;
			margin-top: 0.4rem;
			width: auto;
			opacity: 0.7;
			padding: 0 0 0 1.2rem;
			background-color: transparent;
			color: inherit;
			border-radius: 0;
			box-shadow: none;
			pointer-events: auto;

			li::marker {
				color: inherit;
			}

			&::before {
				display: none;
			}
		}

		section {
			h2 {
				padding-bottom: 1rem;
			}

			ol {
				grid-template-columns: repeat(1, 1fr);
				font-size: 1rem;
				gap: 0.25rem;
			}
		}
	}
</style>
