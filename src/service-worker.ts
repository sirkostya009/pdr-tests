/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, version } from "$service-worker";

const scope = self as unknown as ServiceWorkerGlobalScope;
const CACHE = `cache-${version}`;

scope.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(build))));

scope.addEventListener("activate", (event) =>
	event.waitUntil(
		caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))),
	),
);

scope.addEventListener("fetch", (event) => {
	const url = new URL(event.request.url);

	if (url.origin !== location.origin) return;
	if (event.request.method !== "GET") return;

	event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
