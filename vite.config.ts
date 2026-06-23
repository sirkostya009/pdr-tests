import vercelAdapter from "@sveltejs/adapter-vercel";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		sveltekit({
			// https://svelte.dev/docs/kit/integrations
			preprocess: vitePreprocess(),
			adapter: vercelAdapter(),
			prerender: {
				handleHttpError: "warn",
			},
		}),
	],
});
