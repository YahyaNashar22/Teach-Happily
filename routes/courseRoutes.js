import express from "express";
import { upload } from "../middlewares/multer.js";
import { createCourse, deleteCourse, getAllCourses, getAllCoursesForUser, getCourseBySlug, getLatest } from "../controllers/courseController.js";

const courseRouter = express.Router();


courseRouter.post("/create-course", upload.fields([
    { name: "image", maxCount: 1 }, // Single image for course thumbnail
    { name: "videos" } // Multiple videos for course content
]), createCourse);

courseRouter.post("/get-all", getAllCourses);

courseRouter.get("/get-latest", getLatest);

courseRouter.get("/get/:slug", getCourseBySlug);

courseRouter.get("/get-courses-enrolled/:userId", getAllCoursesForUser);

courseRouter.delete("/delete/:id", deleteCourse);




export default courseRouter;