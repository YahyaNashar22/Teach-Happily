import express from "express";
import { upload } from "../middlewares/multer.js";
import { createProduct, downloadProduct, deleteProduct, getAllProducts, getAllProductsForUser, getProductsByTeacherId, updateProduct } from "../controllers/digitalProductControllers.js";

const digitalProductRouter = express.Router();


digitalProductRouter.post("/create", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "product", maxCount: 1 },

]), createProduct);

digitalProductRouter.post("/get-all", getAllProducts);

digitalProductRouter.get("/get-products-enrolled/:userId", getAllProductsForUser);

digitalProductRouter.delete("/:id", deleteProduct);

digitalProductRouter.patch("/:id", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "product", maxCount: 1 },
]), updateProduct);

digitalProductRouter.post("/get-teacher-products", getProductsByTeacherId);
digitalProductRouter.get("/:id/download", downloadProduct);



export default digitalProductRouter;