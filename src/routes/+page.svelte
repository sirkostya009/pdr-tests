<main>
	<a href="/#/list">
		Список усіх тестів
	</a>

	<a href="/#/random">
		20 рандомних питань з вибіркових тестів
	</a>

	<!-- <div>
		Симуляція реального тесту категорії B
	</div> -->
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

		* {
			border-radius: 0.2rem;
			background-color: gray;
			padding: 1rem;

			&:hover {
				background-color: lightcoral;
			}
		}
	}

	@media (max-width: 1024px) {
		main {
			flex-direction: column;
		}
	}
</style>
