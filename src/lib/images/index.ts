import type { Picture } from "@sveltejs/enhanced-img";
import type { Question } from "../types";

// separate queries: effort/quality would otherwise apply to webp too
const avif = import.meta.glob<Picture>("./{base,tests}/*", {
	query: { enhanced: true, w: "800;1200;1600", format: "avif", effort: 2, quality: 50 },
	import: "default",
});
const webp = import.meta.glob<Picture>("./{base,tests}/*", {
	query: { enhanced: true, w: "800;1200;1600", format: "webp" },
	import: "default",
});

// icons inlined into legal html; rendered via {@html} so they can't be <enhanced:img>
const icons = import.meta.glob<string>("./{road-signs,road-markings,markdown-images}/**/*", {
	query: "?url",
	import: "default",
	eager: true,
});

async function picture(path: string): Promise<Picture | undefined> {
	const key = `./${path}`;
	if (!avif[key]) return;
	const [a, w] = await Promise.all([avif[key](), webp[key]()]);
	// imagetools leaves `sources` empty when a single format resolves to a single width
	return {
		img: w.img,
		sources: {
			avif: a.sources.avif ?? `${a.img.src} ${a.img.w}w`,
			webp: w.sources.webp ?? `${w.img.src} ${w.img.w}w`,
		},
	};
}

export async function resolveImages(test: Question[]): Promise<Question[]> {
	return Promise.all(
		test.map(async (question) => ({
			...question,
			picture: question.image ? await picture(question.image) : undefined,
			legal: question.legal && {
				...question.legal,
				html: question.legal.html.replaceAll(/src="([^"]+)"/g, (match, path) => {
					const url = icons[`./${path}`];
					return url ? `src="${url}"` : match;
				}),
			},
		})),
	);
}
