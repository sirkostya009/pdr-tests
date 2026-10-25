<script lang="ts">
	import Test from "#lib/Test.svelte";

	const { data } = $props();

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

	const test = $derived(
		shuffleArray([
			...shuffleArray(data.general).slice(-10),
			...shuffleArray(data.structure).slice(-4),
			...shuffleArray(data.medical).slice(-4),
			...shuffleArray(data.safety).slice(-2),
		]),
	);
</script>

<svelte:head>
	<title>Пробний екзамен | Тести ПДР</title>
	<meta property="og:title" content="Пробний екзамен | Тести ПДР" />
	<meta property="og:description" content="20 випадкових питань з ПДР" />
</svelte:head>

<Test name="Пробний екзамен" {test} />
