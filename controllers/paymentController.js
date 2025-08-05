import axios from 'axios';
import crypto from 'crypto-js';
import User from '../models/userModel.js';
import Course from '../models/courseModel.js';
import DigitalProduct from '../models/digitalProductModel.js';
import PaymentSession from '../models/paymentSessionModel.js';

// MyFatoorah Configuration
const MYFATOORAH_CONFIG = {
  // Test Environment
  test: {
    baseURL: 'https://apitest.myfatoorah.com/v2',
    apiKey: process.env.MYFATOORAH_TEST_TOKEN
  },
  // Production Environment
  production: {
    baseURL: 'https://api-qa.myfatoorah.com/',
    apiKey: process.env.MYFATOORAH_PROD_TOKEN
  }
};

// Get current environment
const getEnvironment = () => {
  // If NODE_ENV is not set, default to production for testing
  return process.env.NODE_ENV === 'production' || !process.env.NODE_ENV ? 'production' : 'test';
};

// Get MyFatoorah config based on environment
const getMyFatoorahConfig = () => {
  const env = getEnvironment();
  return MYFATOORAH_CONFIG[env];
};

// Generate signature for MyFatoorah (if needed for future use)
const generateSignature = (data, secretKey) => {
  const jsonString = JSON.stringify(data);
  return crypto.HmacSHA256(jsonString, secretKey).toString();
};

// Create MyFatoorah payment session
export const createPaymentSession = async (req, res) => {
  try {
    const {
      productId,
      userId,
      amount,
      cardName,
      cardNumber,
      cardExpiry,
      cardCVV,
      userEmail,
      userName,
      isDigitalProduct = false
    } = req.body;

    // Validate required fields
    if (!productId || !userId || !amount || !userEmail || !userName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Get user and product details (allow test IDs for testing)
    let user = null;
    let product = null;
    
    if (userId.startsWith('test_')) {
      // Use test data for testing
      user = {
        fullName: 'Test User',
        email: userEmail,
        phone: '',
        address: 'Test Address',
        city: 'Test City',
        country: 'Qatar'
      };
      product = {
        title: 'Test Product',
        price: amount
      };
    } else {
      // Use real data from database
      user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (isDigitalProduct) {
        product = await DigitalProduct.findById(productId);
      } else {
        product = await Course.findById(productId);
      }

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
    }

    const config = getMyFatoorahConfig();
    
    // Prepare payment data for MyFatoorah
    const paymentData = {
      InvoiceValue: parseFloat(amount),
      PaymentMethodId: 2, // Default payment method (you can make this configurable)
      CallBackUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success`,
      ErrorUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/error`,
      CustomerName: userName,
      CustomerEmail: userEmail,
      CustomerMobile: user.phone || '',
      Language: 'AR',
      CurrencyIso: 'QAR', // Qatar Riyal
      UserDefinedField: JSON.stringify({
        ProductId: productId,
        UserId: userId,
        IsDigitalProduct: isDigitalProduct.toString()
      }),
      InvoiceItems: [
        {
          ItemName: product.title,
          Quantity: 1,
          UnitPrice: parseFloat(amount)
        }
      ]
    };

    // Create MyFatoorah payment request
    const myFatoorahResponse = await axios.post(
      `${config.baseURL}/ExecutePayment`,
      paymentData,
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (myFatoorahResponse.data.IsSuccess) {
      const paymentUrl = myFatoorahResponse.data.Data.PaymentURL;
      const invoiceId = myFatoorahResponse.data.Data.InvoiceId;

      // Store payment session in database
      const paymentSession = new PaymentSession({
        userId,
        productId,
        productType: isDigitalProduct ? 'digitalProduct' : 'course',
        amount: parseFloat(amount),
        myFatoorahInvoiceId: invoiceId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });
      
      await paymentSession.save();

      return res.status(200).json({
        success: true,
        paymentUrl,
        invoiceId,
        sessionId: paymentSession._id,
        message: 'Payment session created successfully'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Failed to create payment session',
        error: myFatoorahResponse.data.Message
      });
    }

  } catch (error) {
    console.error('Payment session creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Handle payment callback from MyFatoorah
export const handlePaymentCallback = async (req, res) => {
  try {
    const { paymentId, invoiceId, status, transactionId } = req.body;

    // Verify payment with MyFatoorah
    const config = getMyFatoorahConfig();
    
    const verificationResponse = await axios.get(
      `${config.baseURL}/GetPaymentStatus`,
      {
        params: { Key: paymentId, KeyType: 'PaymentId' },
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (verificationResponse.data.IsSuccess) {
      const paymentData = verificationResponse.data.Data;
      
      if (paymentData.InvoiceStatus === 'Paid') {
        // Payment successful - update user and product
        const userDefinedField = paymentData.UserDefinedField ? JSON.parse(paymentData.UserDefinedField) : {};
        const userId = userDefinedField.UserId;
        const productId = userDefinedField.ProductId;
        const isDigitalProduct = userDefinedField.IsDigitalProduct === 'true';
        const invoiceId = paymentData.InvoiceId;

        // Update payment session status
        await PaymentSession.findOneAndUpdate(
          { myFatoorahInvoiceId: invoiceId },
          { 
            status: 'paid',
            paymentId: paymentId,
            paymentData: paymentData
          }
        );

        // Update user's enrolled products
        const user = await User.findById(userId);
        if (user) {
          if (isDigitalProduct) {
            // Add digital product to user's purchased products
            if (!user.purchasedProducts) user.purchasedProducts = [];
            if (!user.purchasedProducts.includes(productId)) {
              user.purchasedProducts.push(productId);
            }
          } else {
            // Add course to user's enrolled courses
            if (!user.enrolledCourses) user.enrolledCourses = [];
            if (!user.enrolledCourses.includes(productId)) {
              user.enrolledCourses.push(productId);
            }
          }
          await user.save();
        }

        // Update product's students list
        if (isDigitalProduct) {
          await DigitalProduct.findByIdAndUpdate(
            productId,
            { $addToSet: { students: userId } }
          );
        } else {
          await Course.findByIdAndUpdate(
            productId,
            { $addToSet: { students: userId } }
          );
        }

        return res.status(200).json({
          success: true,
          message: 'Payment successful',
          paymentData
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Payment failed or pending',
          status: paymentData.InvoiceStatus
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

  } catch (error) {
    console.error('Payment callback error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const config = getMyFatoorahConfig();
    
    const response = await axios.get(
      `${config.baseURL}/GetPaymentStatus`,
      {
        params: { Key: paymentId, KeyType: 'PaymentId' },
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.IsSuccess) {
      return res.status(200).json({
        success: true,
        paymentData: response.data.Data
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Failed to get payment status',
        error: response.data.Message
      });
    }

  } catch (error) {
    console.error('Get payment status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Test endpoint for payment integration
export const testPayment = async (req, res) => {
  try {
    const config = getMyFatoorahConfig();
    
    return res.status(200).json({
      success: true,
      message: 'Payment integration test successful',
      environment: getEnvironment(),
      baseURL: config.baseURL,
      hasApiKey: !!config.apiKey
    });

  } catch (error) {
    console.error('Payment test error:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment test failed',
      error: error.message
    });
  }
};

// Get MyFatoorah configuration (for debugging)
export const getPaymentConfig = async (req, res) => {
  try {
    const config = getMyFatoorahConfig();
    
    return res.status(200).json({
      success: true,
      environment: getEnvironment(),
      baseURL: config.baseURL,
      hasApiKey: !!config.apiKey
    });

  } catch (error) {
    console.error('Get payment config error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get payment config',
      error: error.message
    });
  }
};

// Cleanup expired payment sessions
export const cleanupExpiredSessions = async (req, res) => {
  try {
    const result = await PaymentSession.updateMany(
      { 
        status: 'pending',
        expiresAt: { $lt: new Date() }
      },
      { status: 'expired' }
    );

    return res.status(200).json({
      success: true,
      message: 'Expired payment sessions cleaned up',
      updatedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Cleanup expired sessions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to cleanup expired sessions',
      error: error.message
    });
  }
}; 