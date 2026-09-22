import express from "express";
import { getMessages } from "../controllers/messageController.js";
import { createMessage } from "../controllers/messageController.js";
import { deleteMessages } from "../controllers/messageController.js";

const router = express.Router();

router.get("/", getMessages);
router.post("/", createMessage);
router.delete("/", deleteMessages);

export default router;