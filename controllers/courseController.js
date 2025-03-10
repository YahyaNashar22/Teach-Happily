import Course from "../models/courseModel.js";

import removeFile from "../utils/removeFile.js";


export const createCourse = async (req, res) => {
    try {
        const {
            title,
            level,
            duration,
            price,
            teacher,
            category,
            whatWillYouLearn,
            requirements,
            audience
        } = req.body;

        // Check if a course with the same title already exists
        const existingCourse = await Course.findOne({ title });
        if (existingCourse) {
            return res.status(400).json({ message: "هناك دورة بهذا الاسم بالفعل" });
        }


        const image = req.files?.image ? req.files.image[0].filename : null;


        // Handle file uploads (videos)
        const content = req.files?.videos
            ? req.files.videos.map(file => ({
                title: file.originalname,
                url: file.filename,
            }))
            : [];

        const course = new Course({
            title,
            level,
            duration,
            price,
            teacher,
            category,
            whatWillYouLearn,
            requirements,
            audience,
            image,
            content
        });

        await course.save();

        res.status(201).json({
            message: "تم انشاء الدورة بنجاح",
            payload: course,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}



export const getAllCourses = async (req, res) => {
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

        const courses = await Course.find(filter)
            .skip(skip)
            .limit(limitNumber)
            .populate('teacher', 'fullname')
            .populate('category', 'name');


        const totalCourses = await Course.countDocuments(filter);

        const totalPages =Math.max(1, Math.ceil(totalCourses / limitNumber));

        res.status(200).json({
            payload: courses, pagination: {
                currentPage: page,
                totalPages,
                totalCourses,
                limit: limitNumber,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}