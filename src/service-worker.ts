/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, prerendered, version } from "$service-worker";

const scope = self as unknown as ServiceWorkerGlobalScope;
const CACHE = `cache-${version}`;

if (!import.meta.env.DEV) {
	scope.addEventListener("install", (event) => {
		scope.skipWaiting();
		event.waitUntil(
			caches
				.open(CACHE)
				.then((cache) => Promise.allSettled([...build, ...prerendered].map((path) => cache.add(path)))),
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

async function fromNetwork(request: Request) {
	try {
		const response = await fetch(request);
		if (response.status === 200 && response.type === "basic") {
			const clone = response.clone();
			caches.open(CACHE).then((cache) => cache.put(request, clone));
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

		event.respondWith(fromNetwork(event.request));
	});
}
