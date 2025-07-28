# MyFatoorah Payment Integration Setup

## Environment Variables Required

Add these environment variables to your `.env` file:

```env
# MyFatoorah Test Environment
MYFATOORAH_TEST_TOKEN=your_test_token_here

# MyFatoorah Production Environment
MYFATOORAH_PROD_TOKEN=your_production_token_here

# Frontend URL (for payment callbacks)
FRONTEND_URL=http://localhost:5173
```

## Getting MyFatoorah API Keys

### Test Environment
1. Go to [MyFatoorah Test Portal](https://apitest.myfatoorah.com)
2. Sign up for a test account
3. Get your test token from the Integration tab in the dashboard

### Production Environment
1. Go to [MyFatoorah Production Portal](https://api.myfatoorah.com)
2. Sign up for a production account
3. Go to the Integration tab in your dashboard
4. Copy the token from the API Key section

## API Endpoints

### Test Payment Integration
```
GET /payment/test
```
Returns payment configuration status and environment info.

### Get Payment Configuration
```
GET /payment/config
```
Returns current payment environment and configuration.

### Create Payment Session
```
POST /payment/myfatoorah
```
Body:
```json
{
  "productId": "product_id",
  "userId": "user_id",
  "amount": 99.99,
  "userEmail": "user@example.com",
  "userName": "User Name",
  "isDigitalProduct": true
}
```
Note: Amount is in QAR (Qatar Riyal)

### Payment Callback (MyFatoorah will call this)
```
POST /payment/callback
```

### Get Payment Status
```
GET /payment/status/:paymentId
```

## MyFatoorah API Endpoints

### Get Payment Methods
```
GET https://api.myfatoorah.com/v2/GetPaymentMethods
```

### Execute Payment
```
POST https://api.myfatoorah.com/v2/ExecutePayment
```

### Get Payment Status
```
GET https://api.myfatoorah.com/v2/GetPaymentStatus
```

## Testing the Integration

1. Start your server
2. Test the payment configuration:
   ```bash
   curl http://localhost:5000/payment/test
   ```

3. Test creating a payment session:
   ```bash
   curl -X POST http://localhost:5000/payment/myfatoorah \
     -H "Content-Type: application/json" \
     -d '{
       "productId": "your_product_id",
       "userId": "your_user_id", 
       "amount": 99.99,
       "userEmail": "test@example.com",
       "userName": "Test User",
       "isDigitalProduct": true
     }'
   ```

## Frontend Integration

The frontend is already configured to call the payment endpoint. The `ProductCard.tsx` component will:

1. Call `/payment/myfatoorah` with product and user details
2. Redirect to the MyFatoorah payment page
3. Handle the payment callback to update user enrollment

## Important Notes

- The system automatically switches between test and production based on `NODE_ENV`
- Test environment uses `https://apitest.myfatoorah.com/v2`
- Production environment uses `https://api.myfatoorah.com/v2`
- Payment callbacks will update user enrollment automatically
- All payments are processed in QAR (Qatar Riyal) currency
- Payment sessions expire after 24 hours

## Troubleshooting

1. **API Key Issues**: Make sure your API keys are correct and have proper permissions
2. **Callback Issues**: Ensure your `FRONTEND_URL` is correctly set
3. **Database Issues**: Make sure your MongoDB connection is working
4. **CORS Issues**: Check that your CORS configuration includes the MyFatoorah domains

## Security Considerations

- Never expose API keys in client-side code
- Always verify payment status server-side
- Use HTTPS in production
- Implement proper error handling
- Log payment activities for audit purposes 