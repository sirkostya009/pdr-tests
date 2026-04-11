<script lang="ts">
	import Test from "$lib/Test.svelte";

	const { data } = $props();
</script>

<Test name={data.name} test={data.test as any} />
