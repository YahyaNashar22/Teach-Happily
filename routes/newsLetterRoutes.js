import express from "express";
import { addEmail, deleteEmail, getEmails } from "../controllers/newsLetterController.js";

const newsLetterRouter = express.Router();

newsLetterRouter.get("/", getEmails);
newsLetterRouter.post("/add-email", addEmail);
newsLetterRouter.delete("/:id", deleteEmail);


export default newsLetterRouter;