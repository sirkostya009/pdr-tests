<script lang="ts">
	import tests from "$lib/tests.json";

	const keys = Object.keys(tests);
</script>

<h1>{keys.length} тестів</h1>

<ol>
	{#each keys as test}
		<a href="/#/{test}">
			<li>{test}</li>
		</a>
	{/each}
</ol>

<style>
	h1 {
		text-align: center;
		font-size: 2rem;
		font-weight: bold;
		padding: 3rem 0;
	}

	ol {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		font-size: 0.85rem;
		padding: 1rem;

		a {
			text-decoration: underline dotted;
			padding: 0.25rem;

			li {
				padding-left: 0.4rem;
				list-style: decimal-leading-zero;
				list-style-position: inside;
			}

			&:hover {
				background-color: var(--main);
				border-radius: 10px;
			}

			&:visited {
				color: rgb(255, 207, 135);
			}

			&:visited li {
				color: rgb(255, 207, 135);
			}
		}
	}

	@media (max-width: 1500px) {
		ol {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 1024px) {
		ol {
			grid-template-columns: repeat(1, 1fr);
			font-size: 1rem;
			gap: 0.25rem;
			padding: 0.5rem;
		}
	}
</style>
