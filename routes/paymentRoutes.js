import express from 'express';
import {
  createPaymentSession,
  handlePaymentCallback,
  getPaymentStatus,
  testPayment,
  getPaymentConfig,
  cleanupExpiredSessions
} from '../controllers/paymentController.js';

const router = express.Router();

// Test endpoint to check payment integration
router.get('/test', testPayment);

// Get payment configuration (for debugging)
router.get('/config', getPaymentConfig);

// Create MyFatoorah payment session
router.post('/myfatoorah', createPaymentSession);

// Handle payment callback from MyFatoorah
router.post('/callback', handlePaymentCallback);

// Get payment status by payment ID
router.get('/status/:paymentId', getPaymentStatus);

// Cleanup expired payment sessions
router.post('/cleanup', cleanupExpiredSessions);

export default router; 