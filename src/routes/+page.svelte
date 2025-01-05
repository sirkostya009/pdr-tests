<script lang="ts">
	import tests from "$lib/tests-amalgated.json";

	const keys = Object.keys(tests);
</script>

<main>
	<details name="menu" open class="topics">
		<summary>{keys.length} тестів</summary>
		<ul>
			{#each keys as test}
				<li>
					<a href="/#/{test}">{test}</a>
				</li>
			{/each}
		</ul>
	</details>

	<details name="menu" class="random">
		<summary>рандомні</summary>
		<form action="/#/random">
			<ul>
				{#each keys as test}
					<li>
						<label>
							{test}
							<input name="test" type="checkbox" value={test} />
						</label>
					</li>
				{/each}
			</ul>
			<button>Почати</button>
		</form>
	</details>
</main>

<style>
	main {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
		width: 100%;
		height: 100%;
	}

	details {
		margin: auto 0.5rem;
		width: 100%;

		&[open] > summary::after {
			transform: translateY(50%) rotate(180deg);
		}
	}

	summary {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem;
		border-radius: 0.2rem;
		background-color: red;

		&::after {
			content: "\25BC";
			width: 1rem;
			height: 1rem;
			/* background-size: cover; */
			transition: 0.2s;
		}
	}

	ul {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		font-size: 0.85rem;

		:has(a):hover {
			color: rgba(255, 255, 255, 0.7);
			background-color: var(--secondary-main-color);
			border-radius: 10px;
		}

		li {
			padding-left: 0.4rem;
		}
	}

	.random button {
		width: 7rem;
		text-align: center;
		padding: 0.2rem;
		border: 1px solid black;
		border-radius: 10px;
		box-shadow: inset 0 0 0 1px rgb(55, 55, 55);
		background-color: var(--secondary-main-color);
		color: white;
	}
</style>
