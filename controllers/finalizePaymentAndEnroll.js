import { enrollInCourse, enrollInProduct } from '../services/enrollment.js';
import User from '../models/userModel.js';

export const finalizePaymentAndEnroll = async (userId, itemId, itemType) => {

  try {
    if (!userId || !itemId || !itemType) {
      throw new Error('Missing required fields');
    }

    const customer = await User.findById(userId);

    if (!customer) {
      throw new Error("Customer not found!")
    }


    // 3. Execute enrollment
    let enrollResult;
    if (itemType === 'course') {
      enrollResult = await enrollInCourse(userId, itemId);
    } else if (itemType === 'product') {
      enrollResult = await enrollInProduct(userId, itemId);
    } else {
      throw new Error("Invalid Item Type")
    }

    // 4. Return success
    return { success: true, enrollmentResult: enrollResult };

  } catch (err) {
    console.error('finalizePaymentAndEnroll error', err?.response?.data || err);
    throw new Error("Error completing enrollment")
  }
};
