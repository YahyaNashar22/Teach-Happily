import Course from "../models/courseModel.js";

import removeFile from "../utils/removeFile.js";


// TODO: ADD DEMO


export const createCourse = async (req, res) => {
    try {
        let {
            title,
            description,
            level,
            duration,
            price,
            teacher,
            category,
            whatWillYouLearn,
            requirements,
            audience,
            videoTitles
        } = req.body;

        // Check if a course with the same title already exists
        const existingCourse = await Course.findOne({ title });
        if (existingCourse) {
            return res.status(400).json({ message: "هناك دورة بهذا الاسم بالفعل" });
        }


        const image = req.files?.image ? req.files.image[0].filename : null;

        // Normalize videoTitles to always be an array
        const normalizedVideoTitles = Array.isArray(videoTitles) ? videoTitles : [videoTitles];

        // Ensure it's always an array
        // if (videoTitles && !Array.isArray(videoTitles)) {
        //     videoTitles = [videoTitles];
        // }

        // Handle file uploads (videos)
        const content = req.files?.videos
            ? req.files.videos.map((file, index) => ({
                title: normalizedVideoTitles?.[index] || file.originalname,
                url: file.filename,
            }))
            : [];

        const course = new Course({
            title,
            description,
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
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber)
            .populate('teacher', 'fullname')
            .populate('category', 'name');


        const totalCourses = await Course.countDocuments(filter);

        const totalPages = Math.max(1, Math.ceil(totalCourses / limitNumber));

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

export const getLatest = async (req, res) => {
    try {
        const courses = await Course.find()
            .sort({ createdAt: -1 })
            .limit(8)
            .populate('teacher', 'fullname')
            .populate('category', 'name');

        res.status(200).json({
            payload: courses,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}

export const getCourseBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const course = await Course.findOne({ slug })
            .populate('teacher')
            .populate('category', 'name');

        res.status(200).json({
            payload: course,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}

export const getAllCoursesForUser = async (req, res) => {
    try {
        // Get userId from request parameters (or from the authenticated user's token if necessary)
        const userId = req.params.userId;

        // Find all courses where the user is enrolled
        const courses = await Course.find({ enrolledStudents: userId })
            .populate("teacher", "name")
            .populate("category", "name");

        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "No courses found for this user." });
        }

        res.status(200).json({ payload: courses });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


export const deleteCourse = async (req, res) => {
    try {
        const id = req.params.id;

        const course = await Course.findById(id);

        if (course.enrolledStudents.length > 0) {
            return res.status(400).json({ message: "لا يمكن حذف دورة يوجد فيها متدربين" })
        }

        if (course.image) {
            removeFile(course.image)
        }

        if (course.content.length > 0) {
            course.content.map(video => removeFile(video.url));
        }

        await Course.findByIdAndDelete(id);

        res.status(200).json({
            message: "تم محو الدورة بنجاح"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


export const updateCourse = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            title,
            description,
            level,
            duration,
            price,
            whatWillYouLearn,
            requirements,
            audience,
            content: contentJSON
        } = req.body;

        const course = await Course.findById(id);
        if (!course) return res.status(404).json({ error: "Course not found" });

        // Handle new image
        const imageFile = req.files?.image?.[0];
        if (imageFile && course.image) removeFile(course.image);

        const image = imageFile?.filename || course.image;

        // Parse incoming content list
        const updatedContent = JSON.parse(contentJSON);

        // Remove deleted videos
        const updatedUrls = updatedContent.map(v => v.url);
        course.content.forEach(v => {
            if (!updatedUrls.includes(v.url)) removeFile(v.url);
        });

        // Handle newly uploaded videos
        const uploadedVideos = req.files?.videos || [];

        uploadedVideos.forEach((file) => {
            const match = updatedContent.find(v => v.url === file.originalname);
            if (match) match.url = file.filename;
        });

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            {
                $set: {
                    title,
                    description,
                    level,
                    duration,
                    price,
                    whatWillYouLearn,
                    requirements,
                    audience,
                    image,
                    content: updatedContent
                }
            },
            { new: true }
        );

        res.status(200).json({ payload: updatedCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update course" });
    }
};




export const getAllLatestSimilarCourses = async (req, res) => {
    try {
        const { category } = req.body;
        const limit = 3;

        const limitNumber = parseInt(limit, 8);

        const courses = await Course.find({ category })
            .sort({ createdAt: -1 })
            .limit(limitNumber)
            .populate('teacher', 'fullname')



        res.status(200).json({
            payload: courses
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


export const getCoursesByTeacherId = async (req, res) => {
    try {
        const { teacherId } = req.body;

        const courses = await Course.find({ teacher: teacherId });


        return res.status(200).json({ payload: courses });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}