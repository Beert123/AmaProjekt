import express from 'express';
import cors from "cors";
import path from 'path';

const server = express();
const port = 3000;

server.use(cors());
server.use(express.json());

server.get('/', (req, res) => {

    const fileName = 'index.html';
    res.sendFile(path.join(import.meta.dirname, `../Client/${fileName}`));
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});