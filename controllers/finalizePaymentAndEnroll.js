import { getPaymentStatus } from '../utils/myfatoorah.js';
import Payment from '../models/Payment.js';
import { enrollInCourse, enrollInProduct } from '../services/enrollment.js';

export const finalizePaymentAndEnroll = async (req, res) => {
  const {
    userId,
    itemId,
    itemType, // 'course' | 'product'
    paymentKey, // MyFatoorah payment key (used in GetPaymentStatus)
    amount,
    currency = 'QAR',
  } = req.body;

  console.log("Request body:", req.body);

  if (!userId || !itemId || !itemType || !amount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!paymentKey) return res.status(400).json({ message: 'Missing paymentKey' });

  try {
    // 1. Idempotent payment record lookup or creation
    let paymentRecord = await Payment.findOne({ paymentId: paymentKey });

    // 2. Verify actual status from MyFatoorah
    const statusResp = await getPaymentStatus(paymentKey);
    const paymentData = statusResp?.Data || statusResp;
    const invoiceStatus =
      paymentData?.InvoiceStatus || paymentData?.PaymentStatus || '';
    const isPaid =
      typeof invoiceStatus === 'string'
        ? invoiceStatus.toLowerCase().includes('paid')
        : false;

    if (!paymentRecord) {
      paymentRecord = new Payment({
        userId,
        itemId,
        itemType,
        amount,
        currency,
        paymentId: paymentKey,
        status: isPaid ? 'Paid' : 'Pending',
        raw: paymentData,
      });
    } else {
      if (isPaid && paymentRecord.status !== 'Paid') {
        paymentRecord.status = 'Paid';
        paymentRecord.raw = paymentData;
      }
    }

    await paymentRecord.save();

    if (!isPaid) {
      return res.status(400).json({
        message: 'Payment not completed yet',
        paymentStatus: invoiceStatus || 'Unknown',
      });
    }

    // 3. Enroll
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
      message: 'حدث خطأ أثناء إتمام الدفع/التسجيل',
      error: err.message || err,
    });
  }
};
