import express from "express";
import { upload } from "../middlewares/multer.js";
import { createCourse, enroll, getAllCourses } from "../controllers/courseController.js";

const courseRouter = express.Router();


courseRouter.post("/create-course", upload.fields([
    { name: "image", maxCount: 1 }, // Single image for course thumbnail
    { name: "videos" } // Multiple videos for course content
]), createCourse);

courseRouter.post("/get-all", getAllCourses);

courseRouter.post("/enroll", enroll);




export default courseRouter;