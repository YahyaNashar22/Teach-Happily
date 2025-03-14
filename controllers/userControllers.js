import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { createToken, verifyToken } from "../utils/token.js";
import Course from "../models/courseModel.js";


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
        res.status(500).json({ message: 'Server error' });
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

        // Find if there are any unlocked videos for the course already
        const existingRecord = user.unlockedVideos.find(
            (record) => record.courseId.toString() === courseId
        );

        // If there's no existing record, create a new one for this course
        if (!existingRecord) {
            user.unlockedVideos.push({ courseId, videos: [videoIndex] });
        } else {
            // If the record exists, update it by adding the new unlocked video
            existingRecord.videos.push(videoIndex);
        }

        await user.save();

        return res.status(200).json({ message: "Video unlocked successfully." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
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
        res.status(500).json({ message: "something went wrong" })
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
        return res.status(500).json({ message: "Internal server error" });
    }
};




// TODO: ADD FORGET PASSWORD
// TODO: ADD CHANGE NAME FOR CERTIFICATE