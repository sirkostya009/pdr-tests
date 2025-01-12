({
	name: /Тест ПДР: (.*)/.exec(
		document.querySelector("h1.block_title").innerText
	)[1],
	questions: await document
		.querySelectorAll("div[data-question-holder-id]")
		.values()
		.filter((div) => div.getAttribute("data-question-holder-id"))
		.reduce((promise, div) => promise.then(async (arr) => {
			const wait = (ms) => new Promise((res) => setTimeout(res, ms));

			await wait(10);

			div.querySelector(".question_answer_holder a").click();
			div.querySelector("a[data-question-comment-call]")?.click();

			await wait(100);

			return [
				...arr,
				{
					name: /№\d+\n?(.*)/
						.exec(div.querySelector(".question_holder").innerText)[1]
						?.trim(),
					answers: div
						.querySelectorAll("a[data-answer-question]")
						.values()
						.map((a) => ({
							text: a.innerText.trim(),
							isCorrect: a.classList.contains("correct"),
						}))
						.toArray(),
					image: div.querySelector(".question_block_in a")?.href,
					explanation: (div.querySelector("a[data-question-comment-call]") || undefined) && {
						comment: document
							.querySelector(".instructor_comment_text.content p")
							?.innerText?.trim(),
						legal: {
							title: document
								.querySelector(".pdr_i_head_text")
								?.innerText?.trim(),
							html: document.querySelector(".pdr_i_description.content")?.innerHTML,
						},
					},
				},
			];
		}), Promise.resolve([])),
});
