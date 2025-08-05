import express from "express";
import { createStudent, enrollCourse,enrollProduct, getAdminStats, getFavoriteCourses, getUnlockedVideos, getUser, login, logout, resetPassword, sendForgotPasswordOTP, toggleWishlist, unlockVideo } from "../controllers/userControllers.js";
import { finalizePaymentAndEnroll } from "../controllers/finalizePaymentAndEnroll.js";

const userRouter = express.Router();

userRouter.post("/create-student", createStudent);
userRouter.post("/login", login);

userRouter.get("/logout", logout);
userRouter.get("/get-user", getUser);

userRouter.post("/unlock-video", unlockVideo);
userRouter.get("/get-unlocked-videos", getUnlockedVideos);

userRouter.post("/enroll-course", enrollCourse);
userRouter.post("/enroll-product", enrollProduct);

userRouter.post('/finalize-payment-enroll', finalizePaymentAndEnroll);


userRouter.post("/forgot-password", sendForgotPasswordOTP);
userRouter.post("/reset-password", resetPassword);

userRouter.put("/course-wishlist", toggleWishlist);
userRouter.post("/get-favorite-courses", getFavoriteCourses);


userRouter.get("/stats", getAdminStats);





export default userRouter;