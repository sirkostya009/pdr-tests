const modules = import.meta.glob("$lib/tests/*.json");

export function load() {
	const tests = Object.keys(modules).map((key) =>
		key.replace("/src/lib/tests/", "").replace(".json", ""),
	);
	return { tests };
}

export const prerender = true;
