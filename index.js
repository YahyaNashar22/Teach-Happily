import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import path from "path";
import { fileURLToPath } from 'url';

import databaseConnection from "./db/databaseConnection.js";
import userRouter from './routes/userRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import teacherRouter from './routes/teacherRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import transporter from './utils/nodemailerTransporter.js';
import emailRouter from './routes/emailRoutes.js';
import feedbackRouter from './routes/feedbackRoutes.js';
import digitalProductRouter from './routes/digitalProductRoutes.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Declaration
dotenv.config();
const app = express();

// CORS Policies
app.use(cors({
    origin: ["http://localhost:5173", "https://teach-happily.onrender.com", "https://www.teachhappily.qa", "https://teachhappily.qa"],
    credentials: true,
    optionsSuccessStatus: 200,
}
));

// Configuration Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("uploads"));

// Routes / APIs
app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/teacher', teacherRouter);
app.use('/course', courseRouter);
app.use('/email', emailRouter); s
app.use('/feedback', feedbackRouter);
app.use('/digital-product', digitalProductRouter);



// test nodemailer
app.post("/send-test-email", async (req, res) => {
    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: "yahyanashar22@gmail.com",
            subject: "How are you today?",
            text: "This is a test email from your Nodemailer setup!",
        };

        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent!", info });
    } catch (error) {
        console.error("Email error:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});



// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});



// Connect to server
app.listen(process.env.PORT, (error) => {
    if (!error) {
        console.log(`Server Running On Port: ${process.env.PORT}`);
    } else {
        console.log("Couldn't Connect To Server!");
        console.error(`Error: ${error}`);
    }
});
databaseConnection();