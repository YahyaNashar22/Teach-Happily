import Teacher from "../models/teacherModel.js";
import removeFile from "../utils/removeFile.js";


export const createTeacher = async (req, res) => {
    try {
        const { name, profession } = req.body;
        const image = req.file?.filename;


        const teacher = new Teacher({
            fullname: name,
            profession,
            image,
        });

        await teacher.save();

        res.status(201).json({
            message: "تم انشاء المدربة بنجاح",
            payload: teacher,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}



export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();

        res.status(200).json({ payload: teachers });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}



export const getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;

        const teacher = await Teacher.findById(id);

        res.status(200).json({ payload: teacher });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


export const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await Teacher.findById(id);

        if (teacher.image) {
            removeFile(teacher.image);
        }

        await Teacher.findByIdAndDelete(id);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


export const updateTeacher = async (req, res) => {

    try {
        const id = req.params.id;
        const { name, profession } = req.body;
        const image = req.file?.filename;

        const teacher = await Teacher.findById(id);

        if (image && teacher.image) {
            removeFile(teacher.image);
        }

        const updatedTeacher = await Teacher.findByIdAndUpdate(id, {
            $set: {
                fullname: name ? name : teacher.fullname,
                profession: profession ? profession : teacher.profession,
                image: image ? image : teacher.image
            }

        },
            {
                new: true
            }
        )

        res.status(200).json({ payload: updatedTeacher })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}