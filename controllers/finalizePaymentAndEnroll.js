import { getPaymentStatus } from '../utils/myfatoorah.js';
import Payment from '../models/Payment.js';
import { enrollInCourse, enrollInProduct } from '../services/enrollment.js';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const finalizePaymentAndEnroll = async (req, res) => {
  const {
    userId,
    itemId,
    itemType, // 'course' | 'product'
    paymentKey,
    amount,
    currency = 'QAR',
  } = req.body;

  console.log("Request body:", req.body);

  if (!userId || !itemId || !itemType || !amount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!paymentKey) return res.status(400).json({ message: 'Missing paymentKey' });

  try {
    let paymentRecord = await Payment.findOne({ paymentId: paymentKey });

    let paymentData;
    let invoiceStatus = '';
    let isPaid = false;

    // Retry up to 3 times, waiting 5 seconds each
    for (let retry = 0; retry < 3; retry++) {
      const statusResp = await getPaymentStatus(paymentKey);
      paymentData = statusResp?.Data || statusResp;

      invoiceStatus =
        paymentData?.InvoiceStatus || paymentData?.PaymentStatus || '';

      isPaid = typeof invoiceStatus === 'string'
        ? invoiceStatus.toLowerCase().includes('paid')
        : false;

      if (isPaid) break;

      await delay(5000); // wait 5 seconds before retrying
    }

    console.log('Final statusResp: ', paymentData);
    console.log('invoiceStatus:', invoiceStatus);

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
