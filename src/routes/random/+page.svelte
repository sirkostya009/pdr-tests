<script lang="ts">
	import { page } from "$app/state";

	function shuffleArray<T>(array: T[]) {
		var i = array.length - 1,
			j;
		for (i = array.length - 1; i >= 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
</script>

{#each page.url.searchParams.getAll("test") as name}
	<p>{name}</p>
{/each}
