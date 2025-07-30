import mongoose from "mongoose";

const { Schema, model } = mongoose;

const newsLetterSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
)

const NewsLetter = model("NewsLetter", newsLetterSchema);
export default NewsLetter;