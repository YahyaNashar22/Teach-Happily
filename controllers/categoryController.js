import Category from "../models/categoryModel.js";


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

    } catch (error) {
        console.log(error);
        res.status.json({ error: error });
    }
}


export const deleteCategory = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status.json({ error: error });
    }
}
