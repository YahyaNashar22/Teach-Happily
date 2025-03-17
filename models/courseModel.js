import mongoose from "mongoose";
import slugify from "slugify";

const { Schema, model } = mongoose;

const courseSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            require: true,
        },
        level: {
            type: String,
            enum: ["مبتدئ", "متوسط", "متقدم"],
            default: "مبتدئ",
            required: true,
        },
        duration: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: [0, "السعر لا يمكن أن يكون أقل من 0"],
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        enrolledStudents: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false,
        }],
        whatWillYouLearn: [{
            type: String,
            required: false,
        }],
        requirements: [{
            type: String,
            required: false,
        }],
        audience: [{
            type: String,
            required: false,
        }],
        content: [
            {
                title: { type: String, required: true },
                url: { type: String, required: true },
            }
        ],
        slug: {
            type: String,
            unique: true,
        }
    },
    {
        timestamps: true
    }
)

// Middleware to generate slug before saving
courseSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = slugify(this.title + this._id, { lower: true, strict: true });
    }
    next();
});

const Course = model("Course", courseSchema);
export default Course;