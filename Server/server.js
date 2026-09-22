import express from 'express';
import cors from "cors";
import { answers } from './Data/data.js';
import fs from "node:fs/promises";

const server = express();
const port = 3000;

server.use(cors());
server.use(express.json());


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

async function loadAnswers(){
    const data = await fs.readFile("./data/answers.json", "utf8");
    return JSON.parse(data);
}
async function saveAnswers (answers) {
    const json = JSON.stringify(answers,null,2);
    await fs.writeFile("./data/answers.json", json);
}
// Endpoint to get the answers

server.get("/messages", async (req, res) => {
  const messages = await loadMessages();
  res.json(messages);
});

server.get("/answers", async (req, res) =>{
    const answers = await loadAnswers();
    res.json(answers);
});

server.get("/answers/:category", async (req, res)=>{
    const answers = await loadAnswers();
    const findAns = answers.find((answer) => answer.category === req.params.category);
    res.json(findAns);
})

server.post("/answers", async (req, res) =>{
    const answers = await loadAnswers();
    
    const newRule = {category: req.body.category, keywords: req.body.keywords, answer: req.body.answer}
    answers.push(newRule);
    await saveAnswers(answers);
    res.json(newRule);
})

server.post("/messages", async (req, res) => {
  const messages = await loadMessages();
  const question = req.body.question.trim();
  if(!question){
    res.json({error: "FEJL FEJL FEJL"});
    return;
  }
  const qmsg = {type: "question", text: question, createdAt: new Date().toISOString() }
  messages.push(qmsg);

  let answer = findBestAnswer(question);
  const answerMsg = {type: "answer", text: answer, createdAt: new Date().toISOString()}
  messages.push(answerMsg);

  await saveMessages(messages);

  res.json({question: qmsg, answer: answerMsg});
});

server.put("/answers/:category", async (req,res) =>{
    const answers = await loadAnswers();
    const findAns = answers.find((answer) => answer.category === req.params.category);
    findAns.keywords = req.body.keywords;
    findAns.answer = req.body.answer;
    await saveAnswers(answers);

    res.json(findAns);
})
server.delete("/answers/:category", async (req,res)=>{
    const answers = await loadAnswers();
    const findans = answers.filter((answer) => answer.category !== req.params.category);
    await saveAnswers(findans);
    res.send();
})

server.delete("/messages", async (req,res)=>{
    await saveMessages([]);
    res.send();
})

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});