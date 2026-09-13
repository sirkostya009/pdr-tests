export interface Question {
	name: string;
	answers: { text: string; isCorrect: boolean }[];
	image?: string;
	comment?: string;
	legal?: {
		headline: string;
		html: string;
		/** paragraph anchor in the act, e.g. 168 → #n168 */
		anchor: number;
	};
}

/** Index of the picked answer (-1 when unanswered) and whether it was correct. */
export type Answer = [number, boolean];
