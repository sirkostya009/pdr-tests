<main>
	<a href="/#/list">
		Список усіх тем
	</a>

	<a href="/#/random">
		Симуляція "реального" тесту
	</a>

	<a href="https://github.com/sirkostya009/pdr-tests" title="GitHub">
		<picture>
			<source srcset="/github-mark-white.svg" media="(prefers-color-scheme: dark)" />
			<img src="/github-mark.svg" alt="GitHub" style="max-width: 2rem; max-height: 2rem;" />
		</picture>
	</a>
</main>

<style>
	main {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		width: 100%;
		height: 100%;
		padding: 0 0.5rem;
		justify-content: center;
		align-items: center;

		a {
			border-radius: 0.2rem;
			background-color: lightslategrey;
			padding: 1rem;
			color: white;

			&:hover {
				background-color: var(--main);
			}
		}
	}

	@media (max-width: 1024px) {
		main {
			flex-direction: column;
		}
	}
</style>
