<script>
	import { onMount } from "svelte";
	import "../globals.css";

	const { children } = $props();

	onMount(() => {
		const sw = navigator.serviceWorker;
		if (sw?.controller) sw.addEventListener("controllerchange", () => location.reload(), { once: true });
	});
</script>

{@render children()}
