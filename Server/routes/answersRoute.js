import express from "express";
import { getAnswers } from "../controllers/answersController.js";
import { getAnswerByCategory } from "../controllers/answersController.js";
import { createAnswer } from "../controllers/answersController.js";
import { updateAnswer } from "../controllers/answersController.js";
import { deleteAnswer } from "../controllers/answersController.js";

const router = express.Router();

router.get("/", getAnswers);
router.get("/:category", getAnswerByCategory);

router.post("/", createAnswer);

router.put("/:category", updateAnswer);

router.delete("/:category", deleteAnswer);

export default router;