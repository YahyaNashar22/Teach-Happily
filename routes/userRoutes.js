import express from "express";
import { createStudent, login, logout } from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post("/create-student", createStudent);
userRouter.post("/login", login);

userRouter.get("/logout", logout);


export default userRouter;