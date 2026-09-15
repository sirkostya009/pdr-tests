import type { Question } from "$lib/types";

export const tests = import.meta.glob<Question[]>("$lib/tests/*.json", { import: "default" });
