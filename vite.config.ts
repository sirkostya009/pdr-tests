import vercelAdapter from "@sveltejs/adapter-vercel";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig, type Plugin } from "vite";

// trims the service worker's precache lists at build time:
// links do full page loads, so only data of pages rendered without ssr is needed,
// and of static files only those the installed app uses
function precacheOnlyUsed(): Plugin {
	const filters: Record<string, (path: string) => boolean> = {
		__SVELTEKIT_MANIFEST_PRERENDERED__: (path) => !path.endsWith("__data.json") || path === "random/__data.json",
		__SVELTEKIT_MANIFEST_ASSETS__: (path) => /^(icon[\w-]*\.(svg|png)|manifest\.json)$/.test(path),
	};
	return {
		name: "precache-only-used",
		enforce: "pre",
		applyToEnvironment: (environment) => environment.name === "serviceWorker",
		transform(code, id) {
			if (!id.endsWith("/generated/build/app-manifest.js")) return;
			const define = this.environment.config.define!;
			for (const [key, keep] of Object.entries(filters)) {
				const entries: { path: string }[] = JSON.parse(define[key]);
				code = code.replace(key, JSON.stringify(entries.filter(({ path }) => keep(path))));
			}
			return code;
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
		precacheOnlyUsed(),
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
