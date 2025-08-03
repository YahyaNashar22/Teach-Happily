import Certification from '../models/certificationModel.js';
import User from '../models/userModel.js';
import Course from '../models/courseModel.js';

export const generateCertification = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        const existing = await Certification.findOne({ studentId, courseId });
        if (existing) return res.status(400).json({ message: 'Certificate already exists' });

        // Fetch user and course
        const user = await User.findById(studentId);
        const course = await Course.findById(courseId);
        if (!user || !course) {
            return res.status(404).json({ message: 'User or course not found' });
        }

        // Find unlocked videos for this course
        const unlocked = user.unlockedVideos.find(
            (record) => record.courseId.toString() === courseId.toString()
        );
        const unlockedCount = unlocked ? unlocked.videos.length : 0;
        const totalVideos = course.content.length;

        if (unlockedCount < totalVideos) {
            return res.status(400).json({ message: 'Course not completed yet' });
        }

        const certification = new Certification({ studentId, courseId });
        await certification.save();
        await User.findByIdAndUpdate(studentId, { $addToSet: { certificates: certification._id } });

        return res.status(200).json({ payload: certification })

    } catch (error) {
        console.error('Error generating certificate:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


export const getCertificationById = async (req, res) => {
    try {
        const { id } = req.params;

        const certification = await Certification.findById(id)
            .populate({ path: 'studentId', select: 'fullName email' })
            .populate({
                path: 'courseId',
                select: 'title teacher',
                populate: {
                    path: 'teacher',
                    select: 'fullname'
                }
            });

        if (!certification) return res.status(404).json({ message: 'Certificate not found' });

        // Format response to match frontend expectations
        const payload = {
            _id: certification._id,
            student: certification.studentId,
            course: certification.courseId,
            created_at: certification.createdAt || certification.created_at,
        };

        return res.status(200).json({ payload })

    } catch (error) {
        console.error('Error generating certificate:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getCertificationsByUserId = async (req, res) => {
    try {
        const { studentId } = req.body;

        const certifications = await Certification.find({ studentId })
            .populate({ path: 'studentId', select: 'fullName email' })
            .populate({ path: 'courseId', select: 'title' });

        // Format response to match frontend expectations
        const payload = certifications.map(certification => ({
            _id: certification._id,
            student: certification.studentId,
            course: certification.courseId,
            created_at: certification.createdAt || certification.created_at,
        }));

        return res.status(200).json({ payload })

    } catch (error) {
        console.error('Error generating certificate:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

