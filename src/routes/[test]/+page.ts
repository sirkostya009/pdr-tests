import { error } from "@sveltejs/kit";

const modules = import.meta.glob("$lib/tests/*.json");

export async function load({ params }) {
	const key = `/src/lib/tests/${params.test}.json`;
	const loader = modules[key];
	if (!loader) error(404, `test "${params.test}" not found`);
	const mod = (await loader()) as { default: Record<string, unknown>[] };
	return { name: params.test, test: mod.default };
}

export function entries() {
	return Object.keys(modules).map((key) => ({
		test: key.replace("/src/lib/tests/", "").replace(".json", ""),
	}));
}

export const prerender = true;
