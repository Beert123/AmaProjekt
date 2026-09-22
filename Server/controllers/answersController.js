import { loadAnswers, saveAnswers } from "../data/answers.js";

export async function getAnswers(req,res) {
    const answers = await loadAnswers();

    res.json(answers);
}
export async function getAnswerByCategory(req, res) {
    const answers = await loadAnswers();

    const findAns = answers.find(
        (answer) => answer.category === req.params.category
    );

    res.json(findAns);
}


export async function createAnswer(req, res) {
    const answers = await loadAnswers();

    const newRule = {
        category: req.body.category,
        keywords: req.body.keywords,
        answer: req.body.answer
    };

    answers.push(newRule);

    await saveAnswers(answers);

    res.json(newRule);
}


export async function updateAnswer(req, res) {
    const answers = await loadAnswers();

    const findAns = answers.find(
        (answer) => answer.category === req.params.category
    );

    findAns.keywords = req.body.keywords;
    findAns.answer = req.body.answer;

    await saveAnswers(answers);

    res.json(findAns);
}


export async function deleteAnswer(req, res) {
    const answers = await loadAnswers();

    const updatedAnswers = answers.filter(
        (answer) => answer.category !== req.params.category
    );

    await saveAnswers(updatedAnswers);

    res.send();
}