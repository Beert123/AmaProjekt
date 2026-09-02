import express from 'express';
import cors from "cors";
import path from 'path';
import { answers } from './Data/data.js';

const server = express();
const port = 3000;

server.use(cors());
server.use(express.json());

server.use(express.static(path.join(import.meta.dirname, '../Client')));


function findAnswer(question) {
    const answerObj = answers.find(item => item.question.toLowerCase() === question.toLowerCase());
    return answerObj ? answerObj.answer : "I'm sorry, I don't have an answer for that question.";     
}

// Endpoint to get the answers
server.get('/', (req, res) => {
    const fileName = 'index.html';
    res.sendFile(path.join(import.meta.dirname, `../Client/${fileName}`));
});

server.post('/ask', (req, res) => {
    const question = req.body.question;
    console.log(`Received question: ${question}`);
    // Here you can implement your logic to handle the question and generate a response
    const response = `You asked: ${question}`;
    res.json({ response });
});

server.get('/style', (req, res) => {
    const fileName = 'style.css';
    res.sendFile(path.join(import.meta.dirname, `../Client/${fileName}`));
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});