<script lang="ts">
	import Test from "$lib/Test.svelte";
	import { page } from "$app/state";
	import tests from "$lib/tests.map.json";
</script>

{#if page.params.test in tests}
	<Test
		name={page.params.test}
		test={tests[page.params.test as keyof typeof tests]}
	/>
{:else}
	<h2>test "{page.params.test}" not found</h2>
{/if}
