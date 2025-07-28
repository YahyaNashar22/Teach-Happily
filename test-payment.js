import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Test payment configuration
async function testPaymentConfig() {
  try {
    console.log('Testing payment configuration...');
    const response = await axios.get(`${BASE_URL}/payment/test`);
    console.log('Payment config test result:', response.data);
    return response.data;
  } catch (error) {
    console.error('Payment config test failed:', error.response?.data || error.message);
    return null;
  }
}

// Test payment session creation
async function testPaymentSession() {
  try {
    console.log('Testing payment session creation...');
    const paymentData = {
      productId: 'test_product_id',
      userId: 'test_user_id',
      amount: 99.99, // QAR amount
      userEmail: 'test@example.com',
      userName: 'Test User',
      isDigitalProduct: true
    };
    
    const response = await axios.post(`${BASE_URL}/payment/myfatoorah`, paymentData, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('Payment session created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Payment session creation failed:', error.response?.data || error.message);
    return null;
  }
}

// Main test function
async function runTests() {
  console.log('Starting payment integration tests...\n');
  
  // Test 1: Payment configuration
  const configResult = await testPaymentConfig();
  if (configResult?.success) {
    console.log('✅ Payment configuration test passed\n');
  } else {
    console.log('❌ Payment configuration test failed\n');
  }
  
  // Test 2: Payment session creation
  const sessionResult = await testPaymentSession();
  if (sessionResult?.success) {
    console.log('✅ Payment session creation test passed\n');
  } else {
    console.log('❌ Payment session creation test failed\n');
  }
  
  console.log('Payment integration tests completed!');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { testPaymentConfig, testPaymentSession, runTests }; 