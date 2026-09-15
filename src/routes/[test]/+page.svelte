<script lang="ts">
	import { resolveImages } from "$lib/images";
	import Test from "$lib/Test.svelte";
	import { tests } from "$lib/tests";
	import { error } from "@sveltejs/kit";

	const { params } = $props();

	const test = $derived.by(async () => {
		const loader = tests[`/src/lib/tests/${params.test}.json`];
		if (!loader) error(404, `test "${params.test}" not found`);
		return resolveImages(await loader());
	});
</script>

<svelte:head>
	<title>{params.test} | Тести ПДР</title>
	<meta property="og:title" content="{params.test} | Тести ПДР" />
</svelte:head>

<Test name={params.test} test={await test} />
