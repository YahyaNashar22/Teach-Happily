import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["student", "teacher", "admin"],
            default: "student",
            required: true
        },
    },
    {
        timestamps: true
    }
)

const User = model("User", userSchema);
export default User;