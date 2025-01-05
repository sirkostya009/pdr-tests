<script lang="ts">
	import tests from "$lib/tests-amalgated.json";

	const keys = Object.keys(tests);
</script>

<h1>{keys.length} тестів</h1>

<ul>
	{#each keys as test}
		<li><a href="/#/{test}">{test}</a></li>
	{/each}
</ul>

<style>
	h1 {
		text-align: center;
		font-size: 2rem;
		font-weight: bold;
		padding: 3rem 0;
	}

	ul {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		font-size: 0.85rem;

		:has(a):hover {
			color: rgba(255, 255, 255, 0.7);
			background-color: chocolate;
			border-radius: 10px;
		}

		li {
			padding-left: 0.4rem;

			a {
				text-decoration: underline dotted;
			}
		}
	}

	@media (max-width: 1500px) {
		ul {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 1024px) {
		ul {
			grid-template-columns: repeat(1, 1fr);
			font-size: 1rem;
			gap: 0.1rem;

			li {
				padding: 0.5rem;

				a {
					width: min-content;
				}
			}
		}
	}
</style>
