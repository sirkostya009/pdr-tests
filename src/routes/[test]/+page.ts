import { tests } from "$lib/tests";

export function entries() {
	return Object.keys(tests).map((key) => ({
		test: key.replace("/src/lib/tests/", "").replace(".json", ""),
	}));
}

export const prerender = true;
