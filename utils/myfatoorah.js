import axios from 'axios';

const mfClient = axios.create({
  baseURL: process.env.MYFATOORAH_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.MYFATOORAH_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export async function getPaymentStatus(paymentKey) {
  const res = await mfClient.post('/v2/GetPaymentStatus', {
    Key: paymentKey,
    KeyType: 'InvoiceId', // or 'InvoiceId'  || 'PaymentId'
  });
  return res.data;
}
