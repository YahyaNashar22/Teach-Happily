import express from "express";
import { upload } from "../middlewares/multer.js";
import { createTeacher, deleteTeacher, getAllTeachers, getTeacherById, updateTeacher } from "../controllers/teacherController.js";

const teacherRouter = express.Router();


teacherRouter.post("/create-teacher", upload.single("image"), createTeacher);
teacherRouter.get("/", getAllTeachers);
teacherRouter.get("/:id", getTeacherById);
teacherRouter.patch("/:id", upload.single("image"), updateTeacher);
teacherRouter.delete("/:id", deleteTeacher);




export default teacherRouter;