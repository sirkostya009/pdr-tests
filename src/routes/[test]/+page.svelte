<script lang="ts">
	import Test from "$lib/Test.svelte";
	import { page } from "$app/state";
	import tests from "$lib/tests.map.json";

	function shuffleArray<T>(t: T[]) {
		var array = [...t];
		var i = array.length - 1,
			j;
		for (; i >= 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}
</script>

{#if page.params.test in tests}
	<Test
		name={page.params.test}
		test={tests[page.params.test as keyof typeof tests]}
	/>
{:else if page.params.test === 'random'}
	{@const test = shuffleArray([
		...shuffleArray(tests["Загальні положення"]).slice(-10),
		...shuffleArray(tests["Додаткові питання щодо категорій B1, B (будова і терміни)"]).slice(-4),
		...shuffleArray(tests["Надання першої медичної допомоги"]).slice(-4),
		...shuffleArray(tests["Основи безпечного водіння"]).slice(-2),
	])}

	<Test name="Рандом" {test} />
{:else}
	<h2>test "{page.params.test}" not found</h2>
{/if}
