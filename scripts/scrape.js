/*
 * Інколи треба запустити скриптик двічі щоб правильні відповіді заскрапились правильно
 */

({
	name: /Тест ПДР: (.*)/.exec(
		document.querySelector("h1.block_title").innerText
	)[1],
	questions: await document
		.querySelectorAll("div[data-question-holder-id]")
		.values()
		.filter((div) => div.getAttribute("data-question-holder-id"))
		.reduce((promise, div) => promise.then(async (arr) => {
			await waitForUI();

			div.querySelector(".question_answer_holder a").click();
			div.querySelector("a[data-question-comment-call]")?.click();

			await waitForUI();

			arr.push({
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
							?.innerText?.trim()
							?.replace(/[\n\t]*/, " "),
						html: document
							.querySelector(".pdr_i_description.content")
							?.innerHTML?.trim()
							?.replaceAll(' class="fancybox"', "")
							?.replaceAll(/\n*\t*/g, "")
							?.replaceAll(' alt=\"\"', "")
							?.replaceAll('src="/', 'src="https://pdr-online.com.ua/')
							?.replaceAll('href="/', 'href="https://pdr-online.com.ua/'),
					},
				},
			});

			return arr;

			function waitForUI() {
				const { promise, resolve } = Promise.withResolvers();
				requestAnimationFrame(() => requestAnimationFrame(resolve));
				return promise;
			}
		}), Promise.resolve([])),
});
