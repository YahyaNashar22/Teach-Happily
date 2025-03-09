import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { createToken, verifyToken } from "../utils/token.js";


export const createStudent = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
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
        res.status.json({ error: error });
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;


        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email does not exist" });
        }

        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = createToken(user);


        res.status(200).json({
            message: "Login successful",
            payload: token
        });
    } catch (error) {
        console.log(error);
        res.status.json({ error: error });
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log(error);
        res.status.json({ error: error });
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