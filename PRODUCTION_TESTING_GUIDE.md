# Production Payment Testing Guide

## 🧪 Safe Testing with $1 Payments

Since you don't have access to the demo environment, you can safely test the production environment with small amounts like $1.

## 📋 Prerequisites

1. **Set your production token in `.env`:**
   ```env
   MYFATOORAH_PROD_TOKEN=your_production_token_here
   ```

2. **Start your server:**
   ```bash
   npm run dev
   ```

## 🚀 Testing Steps

### Step 1: Test Token and Configuration
```bash
node test-production-payment.js
```

This will:
- ✅ Verify your token is valid
- ✅ Test server configuration
- ✅ Create a $1 test payment session
- 🔗 Provide a payment URL for testing

### Step 2: Complete the Test Payment

1. **Open the payment URL** provided by the test script
2. **Use test card details:**
   - Card Number: `4111111111111111`
   - Expiry: `12/25`
   - CVV: `123`
   - Name: Any name

3. **Complete the payment** - this will charge $1 to your test card

### Step 3: Verify Payment Flow

After payment completion:
- ✅ Check if user enrollment is updated
- ✅ Verify payment session status
- ✅ Confirm callback handling

## 🔍 What to Test

### 1. **Token Validation**
- ✅ Token connects to MyFatoorah API
- ✅ Can retrieve payment methods
- ✅ No authentication errors

### 2. **Payment Session Creation**
- ✅ Can create payment sessions
- ✅ Returns valid payment URL
- ✅ Stores session in database

### 3. **Payment Processing**
- ✅ Payment page loads correctly
- ✅ Can complete payment with test card
- ✅ Payment callback works
- ✅ User enrollment updates

### 4. **Database Updates**
- ✅ Payment session status updates
- ✅ User enrolled courses/products updated
- ✅ Product students list updated

## 🛡️ Safety Measures

### Small Amount Testing
- Use $1 payments for testing
- Real charges but minimal cost
- Perfect for verifying integration

### Test Data
- Use test product/user IDs
- Don't affect real user data
- Easy to identify test transactions

### Monitoring
- Check MyFatoorah dashboard for transactions
- Monitor server logs for errors
- Verify database updates

## 🐛 Troubleshooting

### Common Issues:

1. **Token Invalid**
   - Check token in `.env` file
   - Verify token from MyFatoorah dashboard
   - Ensure no extra spaces

2. **Server Not Running**
   - Start server with `npm run dev`
   - Check port 5000 is available
   - Verify database connection

3. **Payment Page Errors**
   - Check callback URLs in payment data
   - Verify FRONTEND_URL in `.env`
   - Test with different browsers

4. **Database Issues**
   - Check MongoDB connection
   - Verify models are imported
   - Check for validation errors

## 📊 Expected Results

### Successful Test:
```
🚀 Starting Production Payment Tests

🔑 Testing MyFatoorah token directly...
✅ Token is valid!
Available payment methods: 8

🧪 Testing Production Payment with $1...

1. Testing payment configuration...
✅ Server is running
Environment: production
Has API Key: true
Base URL: https://api.myfatoorah.com

2. Creating test payment session...
✅ Payment session created successfully!
Invoice ID: 123456789
Session ID: 60f1a2b3c4d5e6f7g8h9i0j1

🔗 Payment URL: https://api.myfatoorah.com/payment/123456789

📝 You can now:
1. Open the payment URL in your browser
2. Complete the payment with a test card
3. Check if the callback works correctly
```

## 💡 Tips for Production Testing

1. **Start Small**: Always test with $1 before larger amounts
2. **Monitor Logs**: Watch server console for errors
3. **Check Dashboard**: Verify transactions in MyFatoorah dashboard
4. **Test Callbacks**: Ensure payment callbacks work correctly
5. **Verify Database**: Check that user enrollment updates properly

## 🔄 After Testing

Once you've verified everything works:
1. ✅ Update your frontend to use real product/user IDs
2. ✅ Test with actual users and products
3. ✅ Monitor real transactions
4. ✅ Set up proper error handling and logging

This approach lets you safely test the production environment without risking large amounts while ensuring everything works correctly! 