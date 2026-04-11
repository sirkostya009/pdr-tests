<script lang="ts">
	import Test from "$lib/Test.svelte";
	import structure from "$lib/tests/Додаткові питання щодо категорій B1, B (будова і терміни).json";
	import general from "$lib/tests/Загальні положення.json";
	import medical from "$lib/tests/Надання першої медичної допомоги.json";
	import safety from "$lib/tests/Основи безпечного водіння.json";

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

	const test = shuffleArray([
		...shuffleArray(general).slice(-10),
		...shuffleArray(structure).slice(-4),
		...shuffleArray(medical).slice(-4),
		...shuffleArray(safety).slice(-2),
	]);
</script>

<svelte:head>
	<title>Рандом — Тести ПДР</title>
	<meta property="og:title" content="Рандом — Тести ПДР" />
	<meta property="og:description" content="20 випадкових питань з ПДР" />
</svelte:head>

<Test name="Рандом" test={test as any} />
