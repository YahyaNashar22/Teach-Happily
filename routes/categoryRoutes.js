import express from "express";
import { upload } from "../middlewares/multer.js";
import { createCategory, getAllCategories } from "../controllers/categoryController.js";

const categoryRouter = express.Router();


categoryRouter.post("/create-category", upload.single("image"), createCategory);
categoryRouter.get("/", getAllCategories);



export default categoryRouter;