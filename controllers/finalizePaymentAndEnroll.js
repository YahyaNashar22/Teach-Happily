import { getPaymentStatus } from '../utils/myfatoorah.js';
import Payment from '../models/Payment.js';
import { enrollInCourse, enrollInProduct } from '../services/enrollment.js';

export const finalizePaymentAndEnroll = async (req, res) => {
  const { paymentKey, userId, itemId, itemType, amount } = req.body;

  try {
    // 1. Verify payment status
    let isPaid = false;
    let paymentData;

    // Check up to 5 times with 2 second delays
    for (let i = 0; i < 5; i++) {
      const statusResp = await getPaymentStatus(paymentKey);
      paymentData = statusResp?.Data || statusResp;
      isPaid = paymentData?.InvoiceStatus?.toLowerCase() === 'paid';

      if (isPaid) break;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (!isPaid) {
      return res.status(400).json({
        message: 'Payment not completed yet',
        paymentStatus: paymentData?.InvoiceStatus || 'Pending'
      });
    }

    // 2. Create/update payment record
    const paymentRecord = await Payment.findOneAndUpdate(
      { paymentId: paymentKey },
      {
        userId,
        itemId,
        itemType,
        amount,
        currency: 'QAR',
        status: 'Paid',
        raw: paymentData
      },
      { upsert: true, new: true }
    );

    // 3. Execute enrollment
    let enrollResult;
    if (itemType === 'course') {
      enrollResult = await enrollInCourse(userId, itemId);
    } else if (itemType === 'product') {
      enrollResult = await enrollInProduct(userId, itemId);
    } else {
      return res.status(400).json({ message: 'Invalid itemType' });
    }

    return res.status(200).json({
      message: 'Payment verified and enrollment processed',
      payment: paymentRecord,
      enrollment: enrollResult,
    });
  } catch (err) {
    console.error('finalizePaymentAndEnroll error', err);
    return res.status(500).json({
      message: 'Error completing enrollment',
      error: err.message
    });
  }
};