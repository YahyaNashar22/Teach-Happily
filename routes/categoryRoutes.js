import express from "express";
import { upload } from "../middlewares/multer.js";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/categoryController.js";

const categoryRouter = express.Router();


categoryRouter.post("/create-category", upload.single("image"), createCategory);
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.patch("/:id", upload.single("image"), updateCategory);
categoryRouter.delete("/:id", deleteCategory);




export default categoryRouter;