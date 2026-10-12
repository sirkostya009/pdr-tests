import vercelAdapter from "@sveltejs/adapter-vercel";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
	json: {
		namedExports: false,
	},
	build: {
		assetsInlineLimit: (path) => (path.includes("/src/lib/images/") ? false : undefined),
	},
	plugins: [
		enhancedImages(),
		sveltekit({
			// https://svelte.dev/docs/kit/integrations
			preprocess: vitePreprocess(),
			adapter: vercelAdapter(),
			prerender: {
				handleHttpError: "warn",
			},
			compilerOptions: {
				experimental: {
					async: true,
				},
			},
		}),
	],
});
