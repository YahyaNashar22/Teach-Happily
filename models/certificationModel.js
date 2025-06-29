import mongoose from "mongoose";

const { Schema, model } = mongoose;

const certificationModel = new Schema(
    {
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
    },
    {
        timestamps: true
    }
)

const Certification = model("Certification", certificationModel);
export default Certification;