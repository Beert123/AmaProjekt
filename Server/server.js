import express from 'express';
import cors from "cors";
import path from 'path';
import { answers } from './Data/data.js';
import fs from "node:fs/promises";

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

function findMostCommonSubject(stats) {
    let highestStat = "";
    let mostCommon = 0;
    for (const [topic, count] of Object.entries(stats)) {
        if (count > mostCommon) {
            mostCommon = count;
            highestStat = topic;
        }
    }
    return highestStat;
}

async function loadMessages(){
    const data = await fs.readFile("./data/messages.json","utf8");
    return JSON.parse(data);
}

async function saveMessages(messages){
    const json = await JSON.stringify(messages,null,2);
    await fs.writeFile("./data/messages.json", json);
}

async function loadTopicStats(){
    const data = await fs.readFile("./data/topicStats.json", "utf8");
    return JSON.parse(data);
}

async function saveTopicStats(topics){
    const json = await JSON.stringify(topics,null,2);
    await fs.writeFile("./data/topicStats.json", json);
}
// Endpoint to get the answers
server.get("/", async (req, res) => {
    const messages = await loadMessages();
    const topics = await loadTopicStats();
    res.render("index", { messages, error: "", topics });
});

server.post('/ask', async (req, res) => {
    const messages = await loadMessages();
    const topics = await loadTopicStats();

    const question = req.body.question;
    let error = "";
    if (!question) {
        error = "skriv et spørgsmål nørd";
    } else {
        const result = findBestAnswer(question);
        console.log(result);
        messages.push({ type: "question", text: question });
        messages.push({ type: "answer", text: result.answer })
        if (result.category) {
            topics[result.category] = topics[result.category] + 1;
        }
        console.log(topics);
    }
    await saveMessages(messages);
    await saveTopicStats(topics);

    res.render("index", { messages, error, topics });
});

server.post('/clearMessages', async (req, res) => {
    const messages = await loadMessages();
    const topics = await loadTopicStats();
    await saveMessages([]);
    await saveTopicStats({
        navn: 0,
        bosted: 0,
        fritid: 0
    })
    res.redirect('/');
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});