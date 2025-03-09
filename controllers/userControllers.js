import User from "../models/userModel.js";
import bcrypt from "bcryptjs";


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

        res.status(201).json({ message: "User created successfully", payload: user });

    } catch (error) {
        console.log(error);
        res.status.json(error);
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

        // Set the token in an HTTP-only cookie (secure in production)
        res.cookie("token", token, {
            httpOnly: true,  // Makes it inaccessible to JavaScript
            secure: process.env.NODE_ENV === "production",  // Set to true in production (HTTPS)
            sameSite: "None",  // To work in cross-site requests
            maxAge: 60 * 60 * 1000,  // Token expires in 1 hour (adjust as needed)
        });


        res.status(200).json({
            message: "Login successful",
        });
    } catch (error) {
        console.log(error);
        res.status.json(error);
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log(error);
        res.status.json(error);
    }
}
