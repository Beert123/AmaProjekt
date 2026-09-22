import express from 'express';
import cors from "cors";

import answersRoute from "./routes/answersRoute.js";
import messagesRoute from "./routes/messagesRoute.js";


const server = express();
const port = 3000;

server.use(cors());
server.use(express.json());

server.use("/answers", answersRoute);
server.use("/messages", messagesRoute);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});