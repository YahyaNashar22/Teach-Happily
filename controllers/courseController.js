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

        console.log(req.body)


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

