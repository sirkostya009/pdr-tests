const questions = [];

for (let i = questions.length - 1; i >= 0; --i) {
	const question = questions[i];

	// фікс зміщених пояснень
	question.explanation =
		questions[i > 0 ? i - 1 : questions.length - 1].explanation;
}

console.log(JSON.stringify(questions, null, "\t"));
