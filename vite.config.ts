import vercelAdapter from "@sveltejs/adapter-vercel";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig, type Plugin } from "vite";

// links do full page loads, so the service worker only needs data of pages rendered without ssr
function precacheOnlyUsedData(): Plugin {
	return {
		name: "precache-only-used-data",
		enforce: "pre",
		applyToEnvironment: (environment) => environment.name === "serviceWorker",
		transform(code, id) {
			if (!id.endsWith("/generated/build/app-manifest.js")) return;
			const prerendered: { path: string }[] = JSON.parse(
				this.environment.config.define!.__SVELTEKIT_MANIFEST_PRERENDERED__,
			);
			const used = prerendered.filter(({ path }) => !path.endsWith("__data.json") || path === "random/__data.json");
			return code.replace("__SVELTEKIT_MANIFEST_PRERENDERED__", JSON.stringify(used));
		},
	};
}

export default defineConfig({
	json: {
		namedExports: false,
	},
	build: {
		cssTarget: ["chrome87", "edge88", "firefox78", "safari14"],
		assetsInlineLimit: (path) => (path.includes("/src/lib/images/") ? false : undefined),
	},
	plugins: [
		enhancedImages(),
		precacheOnlyUsedData(),
		sveltekit({
			// https://svelte.dev/docs/kit/integrations
			preprocess: vitePreprocess(),
			adapter: vercelAdapter(),
			// registered in app.html so pages without csr get it too
			serviceWorker: {
				register: false,
			},
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
