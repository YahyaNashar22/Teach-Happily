import express from "express";
import { createStudent, enrollCourse, getUnlockedVideos, getUser, login, logout, unlockVideo } from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post("/create-student", createStudent);
userRouter.post("/login", login);

userRouter.get("/logout", logout);
userRouter.get("/get-user", getUser);

userRouter.post("/unlock-video", unlockVideo);
userRouter.get("/get-unlocked-videos", getUnlockedVideos);
userRouter.post("/enroll-course", enrollCourse);



export default userRouter;