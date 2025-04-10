import mongoose from "mongoose";

const { Schema, model } = mongoose;

// TODO: IMPLEMENT THE CONTROLLERS

const feedbackSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: false,
        },
        rating: {
            type: Number,
            required: false,
        },
    },
    {
        timestamps: true
    }
)

const Feedback = model("Feedback", feedbackSchema);
export default Feedback;