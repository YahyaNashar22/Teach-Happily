import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';

import databaseConnection from "./db/databaseConnection.js";
import userRouter from './routes/userRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import teacherRouter from './routes/teacherRoutes.js';


// Declaration
dotenv.config();
const app = express();

// CORS Policies
app.use(cors({
    origin: ["http://localhost:5173"],
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