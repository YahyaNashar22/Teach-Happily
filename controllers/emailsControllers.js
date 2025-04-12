import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import transporter from '../utils/nodemailerTransporter.js';

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// TODO: CHANGE THE RECIPIENT'S TO TEACH HAPPILY

export const sendContactEmail = async (req, res) => {
    try {

        const { email, message } = req.body;

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: "yahyanashar22@gmail.com",
            subject: 'نرغب بسماع ارائك',
            html: `
      <html dir='rtl' lang='ar'>
    <body style="font-family: Arial, sans-serif; background-color: #ffffff; color: #31363a; padding: 20px; text-align: right;">
        <h2 style="color: #8f438c; ">رسالة من المستخدم</h2>
        <p style="font-size: 16px; line-height: 1.5;">
            <strong style="color: #000000; display: block;">البريد الالكتروني</strong> ${email}
        </p>
        <p style="font-size: 16px; line-height: 1.5;">
            <strong style="color: #000000; display: block;">الرسالة:</strong>
        </p>
        <p style="font-size: 16px; line-height: 1.5; color: #31363a;">  
            ${message}
        </p>
        <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #757c8e;">
            <p style="font-size: 20px;">
                موقع: <a href="https://www.teachhappily.qa/" target="_blank" style="color: #ffba0d; text-decoration: none;">علم بسعادة</a>
            </p>
        </footer>
    </body>
</html>
        `,
        };

        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent!", info });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "يتعذر ارسال البريد الان. الرجاء المحاولة لاحقا"
        })
    }
}



export const sendDigitalProductEmail = async (req, res) => {
    try {
        const { fullName, email, message, projectTitle } = req.body;
        const image = req.file; // Multer will attach the uploaded image to req.file

        if (!image) {
            return res.status(400).json({ message: "يرجى تحميل صورة." });
        }

        // Prepare the image path
        const imagePath = path.join(__dirname, "../uploads", image.filename);

        // Prepare mail options
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: "yahyanashar22@gmail.com",
            subject: " أرغب بعرض منتج رقمي",
            html: `
   <html dir="rtl" lang="ar">
    <body style="font-family: Arial, sans-serif; background-color: #ffffff; color: #31363a; padding: 20px; text-align: right;">
        <h2 style="color: #8f438c;">طلب لعرض منتج رقمي</h2>

        <p style="font-size: 16px; line-height: 1.5;">
            <strong style="color: #000000; display: block;">الاسم الكامل:</strong> ${fullName}
        </p>

        <p style="font-size: 16px; line-height: 1.5;">
            <strong style="color: #000000; display: block;">البريد الإلكتروني:</strong> ${email}
        </p>

        <p style="font-size: 16px; line-height: 1.5;">
            <strong style="color: #000000; display: block;">عنوان المنتج:</strong> ${projectTitle}
        </p>

        <p style="font-size: 16px; line-height: 1.5;">
            <strong style="color: #000000; display: block;">الرسالة:</strong>
        </p>
        <p style="font-size: 16px; line-height: 1.5; color: #31363a;">
            ${message}
        </p>

        <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #757c8e;">
            <p style="font-size: 20px;">
                موقع: <a href="https://www.teachhappily.qa/" target="_blank" style="color: #ffba0d; text-decoration: none;">علم بسعادة</a>
            </p>
        </footer>
    </body>
</html>
            `,
            attachments: [
                {
                    filename: image.filename,
                    path: imagePath, // Use the image path from the upload
                    cid: 'product-image' // Content-ID for embedding the image
                }
            ],
        };

        const info = await transporter.sendMail(mailOptions);

        if (info.accepted.length > 0) {
            res.status(200).json({
                message: "تم إرسال الرسالة بنجاح!",
            });
        } else {
            res.status(500).json({
                message: "يتعذر إرسال البريد الآن. الرجاء المحاولة لاحقًا.",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "حدث خطأ أثناء معالجة البيانات.",
        });
    }
};


export const sendTeachWithUsEmail = async (req, res) => {
    try {
        const { fullName, email, profession, message } = req.body;
        const file = req.file;  // The file uploaded using multer

        if (!file) {
            return res.status(400).json({ message: "يرجى تحميل ملف PDF." });
        }

        // Prepare the file path
        const filePath = path.join(__dirname, '../uploads', file.filename);

        // Create the email options
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: "yahyanashar22@gmail.com",
            subject: " أرغب بالانضمام  ",
            html: `
                <html dir="rtl" lang="ar">
                    <body style="font-family: Arial, sans-serif; background-color: #ffffff; color: #31363a; padding: 20px; text-align: right;">
                        <h2 style="color: #8f438c;">طلب انضمام   </h2>
                        <p style="font-size: 16px; line-height: 1.5;">
                            <strong style="color: #000000; display: block;">الاسم الكامل:</strong> ${fullName}
                        </p>
                        <p style="font-size: 16px; line-height: 1.5;">
                            <strong style="color: #000000; display: block;">البريد الإلكتروني:</strong> ${email}
                        </p>
                        <p style="font-size: 16px; line-height: 1.5;">
                            <strong style="color: #000000; display: block;">المهنة:</strong> ${profession}
                        </p>
                        <p style="font-size: 16px; line-height: 1.5;">
                            <strong style="color: #000000; display: block;">الرسالة:</strong>
                        </p>
                        <p style="font-size: 16px; line-height: 1.5; color: #31363a;">
                            ${message}
                        </p>
                        <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #757c8e;">
                            <p style="font-size: 20px;">
                                موقع: <a href="https://www.teachhappily.qa/" target="_blank" style="color: #ffba0d; text-decoration: none;">علم بسعادة</a>
                            </p>
                        </footer>
                    </body>
                </html>
            `,
            attachments: [
                {
                    filename: file.originalname,
                    path: filePath, // File path of the uploaded PDF
                    contentType: 'application/pdf'
                }
            ]
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "تم إرسال رسالتك بنجاح!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "يتعذر ارسال البريد الان. الرجاء المحاولة لاحقا"
        });
    }
};