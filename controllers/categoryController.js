import Category from "../models/categoryModel.js";
import removeFile from "../utils/removeFile.js";


export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const image = req.file?.filename;

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "الفئة موجودة بالفعل" });
        }

        const category = new Category({
            name,
            image,
        });

        await category.save();

        res.status(201).json({
            message: "تم انشاء الفئة بنجاح",
            payload: category,
        });
    } catch (error) {
        console.log(error);
        res.status.json({ error: error });
    }
}



export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();

        res.status(200).json({ payload: categories });
    } catch (error) {
        console.log(error);
        res.status.json({ error: error });
    }
}



export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        res.status(200).json({ payload: category });
    } catch (error) {
        console.log(error);
        res.status.json({ error: error });
    }
}


export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (category.image) {
            removeFile(category.image);
        }

        await Category.findByIdAndDelete(id);
    } catch (error) {
        console.log(error);
        res.status.json({ error: error });
    }
}


export const updateCategory = async (req, res) => {

    try {
        const { name } = req.body;
        const image = req.file?.filename;

        const category = await Category.findById(id);

        if (image && category.image) {
            removeFile(category.image);
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, {
            $set: {
                name: name ? name : category.name,
                image: image ? image : category.image
            }

        },
            {
                new: true
            }
        )

        res.status(200).json({ payload: updatedCategory })
    } catch (error) {
        console.log(error);
        res.status.json({ error: error });
    }
}