import express from "express";
import { generateCertification, getCertificationById, getCertificationsByUserId } from "../controllers/certificationController.js";

const certificationRouter = express.Router();


certificationRouter.post('/generate', generateCertification);
certificationRouter.post('/user-certifications', getCertificationsByUserId);
certificationRouter.get('/:id', getCertificationById);


export default certificationRouter;


