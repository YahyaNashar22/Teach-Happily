import mongoose from "mongoose";
import slugify from "slugify";

const { Schema, model } = mongoose;

const digitalProductSchema = new Schema(
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
        price: {
            type: Number,
            required: true,
            min: [0, "السعر لا يمكن أن يكون أقل من 0"],
        },
        product: {
            type: String,
            required: true
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
        students: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
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
digitalProductSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = slugify(this.title + this._id, { lower: true, strict: true });
    }
    next();
});

const DigitalProduct = model("DigitalProduct", digitalProductSchema);
export default DigitalProduct;