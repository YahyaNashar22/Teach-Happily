import DigitalProduct from "../models/digitalProductModel.js";

import removeFile from "../utils/removeFile.js";

import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export const createProduct = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            teacher,
            category,
        } = req.body;

        // Check if a product with the same title already exists
        const existingProduct = await DigitalProduct.findOne({ title });
        if (existingProduct) {
            return res.status(400).json({ message: "هناك منتج بهذا الاسم بالفعل" });
        }

        const image = req.files?.image ? req.files.image[0].filename : null;
        const product = req.files?.product ? req.files.product[0].filename : null;


        const newProduct = new DigitalProduct({
            title,
            description,
            price,
            teacher,
            category,
            image,
            product
        });

        await newProduct.save();

        res.status(201).json({
            message: "تم انشاء المنتج بنجاح",
            payload: newProduct,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


export const getAllProducts = async (req, res) => {
    try {
        const { category, priceType, page = 1, limit = 10 } = req.body;
        let filter = {};

        if (category) {
            filter.category = category;
        }

        if (priceType) {
            if (priceType === 'free') {
                filter.price = 0;
            } else if (priceType === 'paid') {
                filter.price = { $ne: 0 };
            }
        }

        const skip = (page - 1) * limit;
        const limitNumber = parseInt(limit, 8);

        const products = await DigitalProduct.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber)
            .populate('teacher', 'fullname')
            .populate('category', 'name');


        const totalProducts = await DigitalProduct.countDocuments(filter);

        const totalPages = Math.max(1, Math.ceil(totalProducts / limitNumber));

        res.status(200).json({
            payload: products, pagination: {
                currentPage: page,
                totalPages,
                totalProducts,
                limit: limitNumber,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


export const getAllProductsForUser = async (req, res) => {
    try {
        // Get userId from request parameters (or from the authenticated user's token if necessary)
        const userId = req.params.userId;

        // Find all products where the user is enrolled
        const products = await DigitalProduct.find({ students: userId })
            .populate("teacher", "name")
            .populate("category", "name");

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found for this user." });
        }

        res.status(200).json({ payload: products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await DigitalProduct.findById(id);

        if (product.students.length > 0) {
            return res.status(400).json({ message: "لا يمكن حذف المنتج يوجد فيها متدربين" })
        }


        if (product.image) {
            removeFile(product.image)
        }

        await DigitalProduct.findByIdAndDelete(id);

        res.status(200).json({
            message: "تم محو المنتج بنجاح"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


export const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            title,
            description,
            price,
            category,
            teacher
        } = req.body;

        const product = await DigitalProduct.findById(id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        // Handle new image
        const imageFile = req.files?.image?.[0];
        if (imageFile && product.image) {
            removeFile(product.image);
        }


        // Handle new product
        const productFile = req.files?.product?.[0];
        if (productFile && product.product) {
            removeFile(product.product);
        }

        const image = imageFile?.filename || product.image;
        const newProductFile = productFile?.filename || product.product;


        const updatedProduct = await DigitalProduct.findByIdAndUpdate(
            id,
            {
                $set: {
                    title,
                    description,
                    price,
                    image,
                    product: newProductFile,
                    category,
                    teacher
                }
            },
            { new: true }
        );

        res.status(200).json({ payload: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update product" });
    }
};


export const getProductsByTeacherId = async (req, res) => {
    try {
        const { teacherId } = req.body;

        const products = await DigitalProduct.find({ teacher: teacherId });


        return res.status(200).json({ payload: products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


export const downloadProduct = async (req, res) => {
    try {
        const product = await DigitalProduct.findById(req.params.id);
        if (!product) return res.status(404).send("Product not found");

        // Construct the full file path in the uploads directory
        const filePath = path.join(__dirname, "..", "uploads", product.fileName);

        return res.download(filePath); // Triggers download
    } catch (error) {
        console.log("Download error:", error);
        return res.status(500).json({ error: "File download failed" });
    }
};