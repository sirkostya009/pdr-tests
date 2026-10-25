import { version } from "$app/env";
import { assets, immutable, prerendered } from "$app/manifest";
import { asset, resolve } from "$app/paths";
import { self as scope } from "$app/service-worker";

const CACHE = `cache-${version}`;
// the worker is served from the app root
const IMMUTABLE = new URL("_app/immutable/", location.href).pathname;

if (!import.meta.env.DEV) {
	scope.addEventListener("install", (event) => {
		scope.skipWaiting();
		event.waitUntil(
			caches
				.open(CACHE)
				.then((cache) =>
					Promise.allSettled([
						...[...immutable, ...prerendered].map(({ path }) => cache.add(resolve(path))),
						...assets.map(({ path }) => cache.add(asset(path))),
					]),
				),
		);
	});
}

scope.addEventListener("activate", (event) =>
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
			.then(() => scope.clients.claim()),
	),
);

async function fromNetwork(event: FetchEvent) {
	const { request } = event;
	try {
		const response = await fetch(request);
		if (response.status === 200 && response.type === "basic") {
			const clone = response.clone();
			event.waitUntil(caches.open(CACHE).then((cache) => cache.put(request, clone)));
		}
		return response;
	} catch {
		return (await caches.match(request)) ?? new Response("", { status: 503 });
	}
}

if (!import.meta.env.DEV) {
	scope.addEventListener("fetch", (event) => {
		const url = new URL(event.request.url);

		if (url.origin !== location.origin) return;
		if (event.request.method !== "GET") return;

		if (url.pathname.startsWith(IMMUTABLE)) {
			event.respondWith(caches.match(event.request).then((cached) => cached ?? fromNetwork(event)));
			return;
		}

		// pages and static files: serve the cached copy right away, refresh it in the background
		const network = fromNetwork(event);
		event.waitUntil(network);
		event.respondWith(caches.match(event.request).then((cached) => cached ?? network));
	});
}
