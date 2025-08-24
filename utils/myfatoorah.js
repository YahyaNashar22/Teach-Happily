// utils/myfatoorah.js
import axios from 'axios';

const mfClient = axios.create({
  baseURL: process.env.MYFATOORAH_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.MYFATOORAH_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Step 1 - Execute Payment (after you created a sessionId from InitiateSession)
 * Docs: https://docs.myfatoorah.com/docs/execute-payment
 */
export const executePayment = async (sessionId, amount, customerEmail) => {
  try {
    const response = await mfClient.post('/v2/ExecutePayment', {
      SessionId: sessionId,
      InvoiceValue: amount,
      CustomerEmail: customerEmail || "test@example.com", // required by API
      CallBackUrl: `${process.env.BACKEND_URL}/api/payments/success`,
      ErrorUrl: `${process.env.BACKEND_URL}/api/payments/failed`,
    });

    return response.data;
  } catch (error) {
    console.error("Error executing payment:", error?.response?.data || error);
    throw new Error("Failed to execute payment");
  }
};

/**
 * Step 2 - Get Payment Status (verify payment result)
 * Docs: https://docs.myfatoorah.com/docs/get-payment-status
 */
export async function getPaymentStatus(paymentId) {
  try {
    const res = await mfClient.post('/v2/GetPaymentStatus', {
      Key: paymentId,       // MUST be the PaymentId returned by ExecutePayment
      KeyType: 'PaymentId', // not InvoiceId
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching payment status:", error?.response?.data || error);
    throw new Error("Failed to fetch payment status");
  }
}


