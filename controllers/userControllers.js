import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { createToken, verifyToken } from "../utils/token.js";
import Course from "../models/courseModel.js";
import generateOTP from "../utils/generateOTP.js";
import transporter from "../utils/nodemailerTransporter.js";
import DigitalProduct from "../models/digitalProductModel.js";
import Certification from "../models/certificationModel.js";


export const createStudent = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "المستخدم موجود بالفعل" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        // Save user to database
        await user.save();

        // Generate JWT token
        const token = createToken(user);

        res.status(201).json({
            message: "User created successfully",
            payload: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;


        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "البريد ليس موجود" });
        }

        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "البريد او كلمة المرور غير صحيحين" });
        }

        // Generate JWT token
        const token = createToken(user);


        res.status(200).json({
            message: "Login successful",
            payload: token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


export const getUser = async (req, res) => {
    try {

        // Get the token from the authorization header
        const token = req.headers.authorization?.split(' ')[1]; // Bearer token

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token
        const decoded = verifyToken(token);

        // Find the user by the decoded user ID
        const user = await User.findById(decoded.payload._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user data (excluding sensitive information like password)
        res.status(200).json({ payload: decoded.payload });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا.' });
    }
};


export const unlockVideo = async (req, res) => {
    try {
        const { courseId, userId, videoIndex } = req.body;
        const course = await Course.findById(courseId);
        const user = await User.findById(userId);

        // Check if the user is enrolled in the course
        if (!course.enrolledStudents.includes(userId)) {
            return res.status(403).json({ message: "المتدربة ليست ملتحقة بهذه الدورة" });
        }

        // Check if previous video has a quiz and if it was passed
        if (videoIndex > 0) {
            const prevVideo = course.content[videoIndex - 1];
            if (prevVideo && prevVideo.quiz && prevVideo.quiz.questions && prevVideo.quiz.questions.length > 0) {
                const quizPassed = user.quizProgress.some(
                    (p) => p.courseId.toString() === courseId && p.videoIndex === videoIndex - 1 && p.passed
                );
                if (!quizPassed) {
                    return res.status(403).json({ message: "يجب اجتياز اختبار الفيديو السابق قبل المتابعة." });
                }
            }
        }

        // Find if there are any unlocked videos for the course already
        const existingRecord = user.unlockedVideos.find(
            (record) => record.courseId.toString() === courseId
        );

        // If there's no existing record, create a new one for this course
        if (!existingRecord) {
            user.unlockedVideos.push({ courseId, videos: [videoIndex] });
        } else {
            // If the record exists, update it by adding the new unlocked video
            if (!existingRecord.videos.includes(videoIndex)) {
                existingRecord.videos.push(videoIndex);
            }
        }

        await user.save();

        return res.status(200).json({ message: "Video unlocked successfully." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا." })
    }
}


export const getUnlockedVideos = async (req, res) => {
    try {
        const { userId, courseId } = req.query;

        const user = await User.findById(userId);
        const unlockedCourse = user.unlockedVideos.find(
            (record) => record.courseId.toString() === courseId
        );


        if (!unlockedCourse) {
            return res.status(200).json({ unlockedVideos: [] });
        }


        return res.status(200).json({ unlockedVideos: unlockedCourse.videos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا." })
    }
}

export const enrollCourse = async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        // Find the course by its ID
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if the user is already enrolled in the course
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is already enrolled
        const alreadyEnrolled = course.enrolledStudents.some(
            (user) => user.toString() === userId
        );
        if (alreadyEnrolled) {
            return res.status(400).json({ message: "User already enrolled" });
        }

        // Add the user to the course's enrolledStudents array
        course.enrolledStudents.push(userId);
        await course.save();
        await User.findByIdAndUpdate(userId, { $addToSet: { enrolledCourses: courseId } });

        // Add the first video to the user's unlockedVideos array (for this specific course)
        const userUnlockedVideos = user.unlockedVideos.find(
            (entry) => entry.courseId.toString() === courseId
        );

        if (userUnlockedVideos) {
            // If the course already exists in unlockedVideos, just add the first video
            userUnlockedVideos.videos.push(0);
        } else {
            // If the course does not exist in unlockedVideos, create a new entry for it
            user.unlockedVideos.push({
                courseId: courseId,
                videos: [0], // Unlock the first video by default
            });
        }

        await user.save();

        return res.status(200).json({ message: "Enrolled successfully", course });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا." });
    }
};


export const enrollProduct = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        // Find the product by its ID
        const product = await DigitalProduct.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the user is already enrolled in the product
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is already enrolled
        const alreadyEnrolled = product.students.some(
            (user) => user.toString() === userId
        );
        if (alreadyEnrolled) {
            return res.status(400).json({ message: "User already enrolled" });
        }

        // Add the user to the product's enrolledStudents array
        product.students.push(userId);
        await product.save();

        return res.status(200).json({ message: "Enrolled successfully", product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا." });
    }
};


export const sendForgotPasswordOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        await User.findOneAndUpdate(
            { email },
            { passwordResetOTP: otp, passwordResetExpires: expiresAt },
            { new: true, upsert: true }
        );

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "إعادة تعيين كلمة المرور - رمز التحقق (OTP)",
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #333;">طلب إعادة تعيين كلمة المرور</h2>
                <p style="font-size: 16px; color: #555;">
                    مرحباً، <br><br>
                    لقد قمت مؤخرًا بطلب إعادة تعيين كلمة المرور الخاصة بك. استخدم رمز التحقق (OTP) أدناه لإتمام العملية:
                </p>
                <div style="background: #f8f8f8; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; color: #222; border-radius: 5px;">
                    ${otp} 
                </div>
                <p style="font-size: 14px; color: #777; margin-top: 20px;">
                    هذا الرمز صالح لمدة 5 دقائق فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني.
                </p>
                <p style="font-size: 14px; color: #777;">مع تحيات، <br>فيوتشر إنسايتس</p>
            </div>
            `,
        };


        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent!", info });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا." });
    }
}



export const resetPassword = async (req, res) => {
    try {

        const { email, password, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user || !user.passwordResetOTP || !user.passwordResetExpires) {
            return res.status(403).json({ message: "رمز التحقق غير موجود أو منتهي الصلاحية" });
        }

        if (user.passwordResetExpires < new Date()) {
            return res.status(403).json({ message: "انتهت صلاحية رمز التحقق" });
        }

        if (user.passwordResetOTP !== otp) {
            return res.status(403).json({ message: "رمز التحقق غير صالح" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;

        // Clear OTP fields
        user.passwordResetOTP = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        return res.status(200).json({ message: "تم إعادة تعيين كلمة المرور بنجاح!" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا." });
    }
}


export const toggleWishlist = async (req, res) => {
    const { userId, courseId } = req.body;


    try {
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        const index = user.courseWishlist.findIndex(
            (id) => id.toString() === courseId
        );

        if (index === -1) {
            user.courseWishlist.push(courseId); // Add
            await user.save();
            return res.status(200).json({ message: "Added to wishlist", wishlist: user.courseWishlist });
        } else {
            user.courseWishlist.splice(index, 1); // Remove
            await user.save();
            return res.status(200).json({ message: "Removed from wishlist", wishlist: user.courseWishlist });
        }
    } catch (error) {
        console.error("Wishlist toggle error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};



export const getFavoriteCourses = async (req, res) => {
    const { userId } = req.body;

    try {

        const favorites = await User.findById(userId).populate("courseWishlist");

        return res.status(200).json({ payload: favorites });
    } catch (error) {
        console.error("Wishlist fetch error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCertificates = await Certification.countDocuments();

        const courses = await Course.find().select('title clickCount enrolledStudents');
        const products = await DigitalProduct.find().select('title students');

        // Use Promise.all for async mapping
        const courseStats = await Promise.all(
            courses.map(async (course) => ({
                title: course.title,
                clicks: course.clickCount,
                purchases: course.enrolledStudents.length,
                certificateCount: await Certification.countDocuments({ course: course._id }),
            }))
        );

        const productStats = products.map(product => ({
            title: product.title,
            purchases: product.students.length,
        }));

        res.json({
            totalUsers,
            totalCertificates,
            courseStats,
            productStats,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// TODO: ADD CHANGE NAME FOR CERTIFICATE