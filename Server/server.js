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
    const answerObj = answers.find(item => item.question.toLowerCase() === question.toLowerCase());
    return answerObj ? answerObj.answer : "I'm sorry, I don't have an answer for that question.";     
}

// Endpoint to get the answers
const questions = [];



server.get("/", (req,res) => {
    res.render("index", { 
        question: "",
        answer: "",
        error : ""
    });
});

server.post('/ask', (req, res) => {
    console.log(req.body);

    const question = req.body.question;
    const answer = findAnswer(question);
    console.log(answer);

    let error ="";
    if(!question || question.trim() ===""){
        error = "Skriv et spørgsmål nørd";
    }

    res.render("index", { 
        question: question,
        answer: answer,
        error: error
     });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});