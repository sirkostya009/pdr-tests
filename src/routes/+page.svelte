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
			<a href="/random" class="button">20 випадкових питань</a>
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
			align-items: stretch;
			gap: 0.5rem;

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
