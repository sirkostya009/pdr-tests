import type { Picture } from "@sveltejs/enhanced-img";

export interface Question {
	name: string;
	answers: { text: string; isCorrect: boolean }[];
	/** path relative to `src/lib/images` */
	image?: string;
	picture?: Picture;
	comment?: string;
	legal?: {
		clause: string;
		html: string;
		/** paragraph anchor in the act, e.g. 168 → #n168 */
		anchor: number;
	};
}

/** Index of the picked answer (-1 when unanswered) and whether it was correct. */
export type Answer = [number, boolean];
