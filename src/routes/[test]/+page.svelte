<script lang="ts">
	import Test from "$lib/Test.svelte";

	const { data } = $props();
</script>

<svelte:head>
	<title>{data.name} — Тести ПДР</title>
	<meta property="og:title" content="{data.name} — Тести ПДР" />
</svelte:head>

<Test name={data.name} test={data.test as any} />
