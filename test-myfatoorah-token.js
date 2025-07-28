import axios from 'axios';

// Test MyFatoorah token authentication
async function testMyFatoorahToken() {
  const config = {
    test: {
      baseURL: 'https://demo.myfatoorah.com',
      apiKey: process.env.MYFATOORAH_TEST_TOKEN
    },
    production: {
      baseURL: 'https://api.myfatoorah.com', 
      apiKey: process.env.MYFATOORAH_PROD_TOKEN
    }
  };

  const environment = process.env.NODE_ENV === 'production' ? 'production' : 'test';
  const currentConfig = config[environment];

  console.log(`Testing ${environment} environment...`);
  console.log(`Base URL: ${currentConfig.baseURL}`);
  console.log(`Has Token: ${!!currentConfig.apiKey}`);

  if (!currentConfig.apiKey) {
    console.log('❌ No token found. Please set the environment variable.');
    return;
  }

  try {
    // Test basic API call to verify token
    const response = await axios.get(
      `${currentConfig.baseURL}/v2/GetPaymentMethods`,
      {
        headers: {
          'Authorization': `Bearer ${currentConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.IsSuccess) {
      console.log('✅ Token authentication successful!');
      console.log(`Available payment methods: ${response.data.Data.length}`);
    } else {
      console.log('❌ Token authentication failed');
      console.log('Error:', response.data.Message);
    }

  } catch (error) {
    console.log('❌ API call failed');
    console.log('Error:', error.response?.data || error.message);
  }
}

// Run test
testMyFatoorahToken(); 