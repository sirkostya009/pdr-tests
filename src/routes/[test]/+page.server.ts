import { error } from "@sveltejs/kit";
import { resolveImages } from "#lib/images/index.js";
import { tests } from "#lib/tests/index.js";

export function entries() {
	return Object.keys(tests).map((key) => ({
		test: key.replace("/src/lib/tests/", "").replace(".json", ""),
	}));
}

export const prerender = true;

export async function load({ params }) {
	const loader = tests[`/src/lib/tests/${params.test}.json`];
	if (!loader) error(404, `test "${params.test}" not found`);
	return { test: await resolveImages(await loader()) };
}
