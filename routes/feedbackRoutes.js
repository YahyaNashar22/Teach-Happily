import express from "express";
import { createFeedback, getCourseFeedbacks } from "../controllers/feedbackController.js";

const feedbackRouter = express.Router();

feedbackRouter.post("/create", createFeedback);
feedbackRouter.get("/:courseId", getCourseFeedbacks);


export default feedbackRouter;