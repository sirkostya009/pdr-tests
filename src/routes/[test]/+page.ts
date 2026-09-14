import { resolveImages } from "$lib/images";
import type { Question } from "$lib/types";
import { error } from "@sveltejs/kit";

const modules = import.meta.glob<Question[]>("$lib/tests/*.json", { import: "default" });

export async function load({ params }) {
	const key = `/src/lib/tests/${params.test}.json`;
	const loader = modules[key];
	if (!loader) error(404, `test "${params.test}" not found`);
	return { name: params.test, test: await resolveImages(await loader()) };
}

export function entries() {
	return Object.keys(modules).map((key) => ({
		test: key.replace("/src/lib/tests/", "").replace(".json", ""),
	}));
}

export const prerender = true;
