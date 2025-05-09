import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// TODO: Add the correct nodeMailer credentials

const transporter = nodemailer.createTransport({
    host: "aiden.h2m.me",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
    },
});

// port – is the port to connect to (defaults to 587 if is secure is false or 465 if true)

export default transporter;