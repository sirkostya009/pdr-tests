export interface Question {
	name: string;
	answers: { text: string; isCorrect: boolean }[];
	image?: string;
	explanation?: {
		comment?: string;
		legal?: {
			title: string;
			html: string;
		};
	};
}

/** Index of the picked answer (-1 when unanswered) and whether it was correct. */
export type Answer = [number, boolean];
