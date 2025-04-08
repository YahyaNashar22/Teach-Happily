import express from "express";
import { sendContactEmail, sendDigitalProductEmail, sendTeachWithUsEmail } from "../controllers/emailsControllers.js";
import { upload } from "../middlewares/multer.js";

const emailRouter = express.Router();


emailRouter.post("/contact-email", sendContactEmail);
emailRouter.post("/teach-with-us-email", upload.single('file'), sendTeachWithUsEmail);
emailRouter.post("/digital-product-email", upload.single('image'), sendDigitalProductEmail);


export default emailRouter;