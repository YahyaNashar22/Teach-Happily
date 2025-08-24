import mongoose from 'mongoose';
import Course from '../models/courseModel.js';
import DigitalProduct from '../models/digitalProductModel.js';
import User from '../models/userModel.js';


export async function enrollInCourse(userId, courseId) {
    try {
        const [course, user] = await Promise.all([
            Course.findById(courseId),
            User.findById(userId)
        ]);

        if (!course || !user) {
            throw new Error(course ? 'User not found' : 'Course not found');
        }

        // Check if already enrolled
        const alreadyEnrolled = course.enrolledStudents.some(
            u => u.toString() === userId
        );

        if (alreadyEnrolled) {
            return { already: true, course };
        }

        // Start transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Update course
            await Course.findByIdAndUpdate(
                courseId,
                { $addToSet: { enrolledStudents: userId } },
                { session }
            );

            // Update user
            await User.findByIdAndUpdate(
                userId,
                {
                    $addToSet: { enrolledCourses: courseId },
                    $push: {
                        unlockedVideos: {
                            courseId,
                            videos: [0] // First video unlocked by default
                        }
                    }
                },
                { session }
            );

            await session.commitTransaction();

            return { already: false, course };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error('Enrollment error:', error);
        throw error;
    }
}

export async function enrollInProduct(userId, productId) {
    const product = await DigitalProduct.findById(productId);
    if (!product) throw new Error('Product not found');

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const alreadyEnrolled = product.students.some(
        (u) => u.toString() === userId
    );
    if (alreadyEnrolled) return { already: true, product };

    product.students.push(userId);
    await product.save();

    return { already: false, product };
}
