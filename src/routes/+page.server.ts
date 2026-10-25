import { tests } from "#lib/tests/index.js";

export const prerender = true;

export function load() {
	return {
		tests: Object.keys(tests).map((key) => key.replace("/src/lib/tests/", "").replace(".json", "")),
	};
}
