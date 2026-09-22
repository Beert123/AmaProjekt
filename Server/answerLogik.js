import { loadAnswers } from "./Data/answers";


function countMatches(keywords, normalizedQuestion) {
    const matches = keywords.filter((keyword) => {
        if (normalizedQuestion.includes(keyword)) {
            return true;
        } else {
            return false;
        }
    });
    return matches.length;
}

export function findBestAnswer(question, answers) {
    const normalizedQuestion = question.toLowerCase();
    let bestScore = 0;
    let bestAns = "Intet svar";
    let bestCategory = "";

    for (const answerGroup of answers) {
        const currScore = countMatches(answerGroup.keywords, normalizedQuestion);
        
        if (currScore > bestScore) {
            bestCategory = answerGroup.category;
            bestScore = currScore;
            bestAns = answerGroup.answer;
        }
    }
    return {
        answer: bestAns,
        category: bestCategory
    };
}