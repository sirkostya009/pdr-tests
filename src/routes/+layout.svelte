<script>
	import { page } from "$app/state";
	import { onMount } from "svelte";
	import "../globals.css";

	const { children } = $props();

	const home = $derived(page.url.pathname === "/");

	onMount(() => {
		const sw = navigator.serviceWorker;
		if (sw?.controller) sw.addEventListener("controllerchange", () => location.reload(), { once: true });
	});
</script>

<header class={[!home && "subpage"]}>
	<svelte:element this={home ? "h1" : "p"} class="brand">
		<a href="/">
			<img src="/icon.svg" alt="" />
			Тести ПДР
		</a>
	</svelte:element>
	<a href="https://github.com/sirkostya009/pdr-tests" class="github" title="GitHub" target="_blank" rel="noopener noreferrer">
		<picture>
			<source srcset="/github-mark.svg" media="(prefers-color-scheme: dark)" />
			<img src="/github-mark-white.svg" alt="GitHub" />
		</picture>
	</a>
</header>

{@render children()}

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
	}

	header {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
		height: 5rem;
		padding: 1rem;
		display: flex;
		align-items: center;

		.brand a {
			display: flex;
			align-items: center;
			gap: 0.6rem;
			font-family: var(--font-heading);
			font-size: var(--text-2xl);
			font-weight: bold;

			img {
				width: 2.5rem;
				height: 2.5rem;
			}
		}

		.github {
			position: fixed;
			top: 0;
			right: 0;
			width: 5rem;
			height: 5rem;
			background-color: var(--text-color);
			clip-path: polygon(0 0, 100% 0, 100% 100%);

			&:hover {
				background-color: var(--main);
			}

			img {
				position: absolute;
				top: 0.75rem;
				right: 0.75rem;
				width: 1.75rem;
				height: 1.75rem;
			}
		}
	}

	@media (max-width: 1024px) {
		header.subpage {
			display: none;
		}
	}
</style>
