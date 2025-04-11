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

        unlockedVideos: [
            {
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: "Course", // Reference to the Course model
                    required: true
                },
                videos: [
                    {
                        type: Number, // The index of the unlocked video
                        required: true
                    }
                ]
            }
        ],

        courseWishlist: [
            {
                type: Schema.Types.ObjectId,
                ref: "Course",
                required: true
            }
        ],

        passwordResetOTP: {
            type: String,
            required: false
        },

        passwordResetExpires: {
            type: Date,
            required: false,
            expires: 300 // 300 seconds = 5 minutes
        },
    },
    {
        timestamps: true
    }
)

const User = model("User", userSchema);
export default User;