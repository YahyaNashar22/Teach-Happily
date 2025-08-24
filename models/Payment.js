import mongoose from 'mongoose';

const { Schema } = mongoose;

const PaymentSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        itemId: { type: Schema.Types.ObjectId, required: true },
        itemType: { type: String, required: true, enum: ['course', 'product'] },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'QAR' },
        sessionId: { type: String, required: true, unique: true }, // e.g., payment key from MyFatoorah
        status: { type: String, required: true, default: 'Pending' },
        // raw: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;
