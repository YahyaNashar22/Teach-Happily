import Course from '../models/courseModel.js';
import DigitalProduct from '../models/digitalProductModel.js';
import User from '../models/userModel.js';

export async function enrollInCourse(userId, courseId) {
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    console.log('user to enroll in course: ', user);
    console.log('course to be enrolled in: ', course);

    const alreadyEnrolled = course.enrolledStudents.some(
        (u) => u.toString() === userId
    );
    if (alreadyEnrolled) return { already: true, course };

    course.enrolledStudents.push(userId);
    await course.save();

    await User.findByIdAndUpdate(userId, { $addToSet: { enrolledCourses: courseId } });

    // unlockedVideos logic
    const existing = user.unlockedVideos.find(
        (entry) => entry.courseId.toString() === courseId
    );

    if (existing) {
        if (!existing.videos.includes(0)) existing.videos.push(0);
    } else {
        user.unlockedVideos.push({
            courseId,
            videos: [0],
        });
    }
    await user.save();

    console.log('course and user after enrollement: ', { course, user })

    return { already: false, course };
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
