import express from "express";
import { upload } from "../middlewares/multer.js";
import { createCourse, deleteCourse, getAllCourses, getAllCoursesForUser, getAllLatestSimilarCourses, getCourseBySlug, getCoursesByTeacherId, getLatest, updateCourse, addOrUpdateQuiz, submitQuizAnswers, trackCourseClick } from "../controllers/courseController.js";

const courseRouter = express.Router();


courseRouter.post("/create-course", upload.fields([
    { name: "image", maxCount: 1 }, // Single image for course thumbnail
    { name: "videos" }, // Multiple videos for course content
    { name: "materials" } // zip files (optional, 1 per video)
]), createCourse);

courseRouter.post("/get-all", getAllCourses);

courseRouter.post("/track", trackCourseClick);

courseRouter.post("/get-similar", getAllLatestSimilarCourses);

courseRouter.get("/get-latest", getLatest);

courseRouter.get("/get/:slug", getCourseBySlug);

courseRouter.get("/get-courses-enrolled/:userId", getAllCoursesForUser);

courseRouter.delete("/:id", deleteCourse);

courseRouter.patch("/:id", upload.fields([
    { name: "image", maxCount: 1 }, // Single image for course thumbnail
    { name: "videos" }, // Multiple videos for course content
    { name: "materials" }
]), updateCourse);

courseRouter.post("/get-teacher-courses", getCoursesByTeacherId);

courseRouter.post("/add-or-update-quiz", addOrUpdateQuiz);
courseRouter.post("/submit-quiz-answers", submitQuizAnswers);


export default courseRouter;