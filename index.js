import express from 'express';
import http from 'http';
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
import certificationRouter from './routes/certificationRoutes.js';
import newsLetterRouter from './routes/newsLetterRoutes.js';
import axios from 'axios';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Declaration
dotenv.config();
const app = express();

// CORS Policies
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:5173", "https://teach-happily.onrender.com", "https://www.teachhappily.qa", "https://teachhappily.qa", "http://174.142.205.14:3001", "http://174.142.205.14"],
    credentials: true,
    optionsSuccessStatus: 200,
}
));

// Configuration Middlewares
app.use(express.json({ limit: '1gb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1gb' }));
app.use(cookieParser());
app.use(express.static("uploads"));
app.use(express.static(".well-known", { dotfiles: "allow" }));

// Routes / APIs
app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/teacher', teacherRouter);
app.use('/course', courseRouter);
app.use('/email', emailRouter);
app.use('/feedback', feedbackRouter);
app.use('/digital-product', digitalProductRouter);
app.use('/certification', certificationRouter);
app.use('/news-letter', newsLetterRouter);


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


// Helper axios instance with auth
const mfClient = axios.create({
    baseURL: process.env.MYFATOORAH_BASE_URL,
    headers: {
        Authorization: `Bearer ${process.env.MYFATOORAH_TOKEN}`,
        'Content-Type': 'application/json',
    },
});


app.post("/api/payments/webhook", express.json(), async (req, res) => {
    try {
        const payload = req.body;
        console.log("🔔 Received webhook:", payload);

        const invoiceStatus = payload?.InvoiceStatus?.toLowerCase() || "";
        const paymentId = payload?.InvoiceId;
        const userDefinedField = payload?.UserDefinedField; // e.g. userId/itemId ref

        if (!paymentId || !userDefinedField) {
            return res.status(400).send("Missing paymentId or userDefinedField");
        }

        if (invoiceStatus === "paid") {
            // Get your Payment from DB using InvoiceId or UserDefinedField
            const payment = await Payment.findOne({ paymentId });

            if (!payment) {
                console.warn("⚠️ No matching payment found for InvoiceId:", paymentId);
                return res.status(404).send("Payment not found");
            }

            if (payment.status !== 'Paid') {
                payment.status = 'Paid';
                payment.raw = payload;
                await payment.save();

                // Enroll user
                const { userId, itemId, itemType } = payment;

                let enrollResult;
                if (itemType === 'course') {
                    enrollResult = await enrollInCourse(userId, itemId);
                } else if (itemType === 'product') {
                    enrollResult = await enrollInProduct(userId, itemId);
                }

                console.log(`✅ Payment ${paymentId} confirmed & user enrolled`);
            }
        }

        res.status(200).send("OK");
    } catch (err) {
        console.error("❌ Webhook handler error:", err);
        res.status(500).send("Error handling webhook");
    }
});

// 1. Initiate Session (to get SessionId + CountryCode)
app.post('/api/payments/initiate-session', async (req, res) => {
    try {
        // you can pass optional body data if required by your flow
        const response = await mfClient.post('/v2/InitiateSession', {
            // If there are any required body parameters, add here. 
            // According to docs, this endpoint has an empty body.
        });
        return res.json(response.data);
    } catch (err) {
        console.error('InitiateSession error', err.response?.data || err.message);
        return res.status(500).json({ error: 'Failed to initiate session' });
    }
});

// 2. Execute Payment (after frontend gets session and calls callback)
app.post('/api/payments/execute', async (req, res) => {
    try {
        const { sessionId, invoiceValue, customerReference, userDefinedField } = req.body;
        console.log('req body in execute payment: ', req.body);
        if (!sessionId || !invoiceValue) {
            return res.status(400).json({ error: 'sessionId and invoiceValue required' });
        }

        // Build request payload (customize per your use-case)
        const payload = {
            SessionId: sessionId,
            InvoiceValue: invoiceValue, // amount to charge
            // Optional:
            CustomerReference: customerReference || '',
            UserDefinedField: userDefinedField || '',
            CallBackUrl: `${process.env.FRONTEND_URL}/payment-complete`,
            ErrorUrl: `${process.env.FRONTEND_URL}/payment-error`,
            // CurrencyIso can be provided if needed; otherwise uses defaults from account
        };

        const response = await mfClient.post('/v2/ExecutePayment', payload);

        console.log("response after ExecutePayment api: ", response);
        // Return the payment URL for redirection
        return res.json({
            ...response.data,
            paymentUrl: response.data.Data.PaymentURL // Contains 3DS URL
        });
    } catch (err) {
        console.error('ExecutePayment error', err.response?.data || err.message);
        return res.status(500).json({ error: 'Failed to execute payment' });
    }
});

// 3. (Optional) GetPaymentStatus
app.get('/api/payments/status/:paymentId', async (req, res) => {
    try {
        const paymentId = req.params.paymentId;
        const response = await mfClient.get(`/v2/GetPaymentStatus`, {
            params: { Key: paymentId },
        });
        return res.json(response.data);
    } catch (err) {
        console.error('GetPaymentStatus error', err.response?.data || err.message);
        return res.status(500).json({ error: 'Failed to get payment status' });
    }
});


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


// Add this to your router
app.get('/payment/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.get('/payment/error', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// ✅ Multer file size/type error handling middleware
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: "الملف كبير جدًا، الحد الأقصى هو 1GB" });
    }
    if (err.message === "نوع الملف غير مدعوم") {
        return res.status(400).json({ error: err.message });
    }
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "حدث خطأ في الخادم أثناء الرفع" });
});


// Connect to server
const server = http.createServer(app);

server.setTimeout(15 * 60 * 1000); // ⏱️ 15 minutes timeout in milliseconds

server.listen(process.env.PORT, (error) => {
    if (!error) {
        console.log(`✅ Server Running On Port: ${process.env.PORT}`);
    } else {
        console.log("❌ Couldn't Connect To Server!");
        console.error(`Error: ${error}`);
    }
});

databaseConnection();