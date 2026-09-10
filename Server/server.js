import express from 'express';
import cors from "cors";
import path from 'path';
import { answers } from './Data/data.js';

const server = express();
const port = 3000;

server.set("views", path.join(import.meta.dirname, "../Client/views"));
server.set("view engine", "ejs");

server.use(express.urlencoded({ extended: true }));

server.use(cors());
server.use(express.json());
server.use(express.static(path.join(import.meta.dirname, '../client/public')));

function findAnswer(question) {
    const normalizedQuestion = question.toLowerCase();
    const answerObj = answers.find(item => item.keywords.some((keyword) => normalizedQuestion.includes(keyword)));
    return answerObj ? answerObj.answer : "I'm sorry, I don't have an answer for that question.";
}

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

function findBestAnswer(question) {
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

const messageList = [];

const topicStats = {
    navn: 0,
    bosted: 0,
    fritid: 0
};

// Endpoint to get the answers
server.get("/", (req, res) => {
    res.render("index", { messageList, error: "", topicStats });
});

server.post('/ask', (req, res) => {
    console.log(req.body);
    const question = req.body.question;
    let error = "";
    if (!question) {
        error = "skriv et spørgsmål nørd";
    } else {
        const result = findBestAnswer(question);
        console.log(result);
        messageList.push({ type: "question", text: question });
        messageList.push({ type: "answer", text: result.answer })
        if (result.category) {
            topicStats[result.category] = topicStats[result.category] + 1;
        }
        console.log(topicStats);
    }

    res.render("index", { messageList, error, topicStats });
});

server.post('/clearMessages', (req, res) => {
    messageList.length = 0;
    res.redirect('/');
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});