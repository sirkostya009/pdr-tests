<script lang="ts">
	import Test from "#lib/Test.svelte";

	const { data, params } = $props();
</script>

<svelte:head>
	<title>{params.test} | Тести ПДР</title>
	<meta property="og:title" content="{params.test} | Тести ПДР" />
</svelte:head>

<Test name={params.test} test={data.test} />
