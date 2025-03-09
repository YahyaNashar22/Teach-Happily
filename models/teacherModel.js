import mongoose from "mongoose";

const { Schema, model } = mongoose;

const teacherSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        profession: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true
    }
)

const Teacher = model("Teacher", teacherSchema);
export default Teacher;