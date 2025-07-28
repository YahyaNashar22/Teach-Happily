import mongoose from "mongoose";

const { Schema, model } = mongoose;

const paymentSessionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        productId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        productType: {
            type: String,
            enum: ["course", "digitalProduct"],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: "QAR"
        },
        myFatoorahInvoiceId: {
            type: String,
            required: true
        },
        paymentId: {
            type: String
        },
        status: {
            type: String,
            enum: ["pending", "paid", "failed", "expired"],
            default: "pending"
        },
        paymentData: {
            type: Schema.Types.Mixed
        },
        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Index for querying by status and expiration
paymentSessionSchema.index({ status: 1, expiresAt: 1 });
paymentSessionSchema.index({ myFatoorahInvoiceId: 1 });

const PaymentSession = model("PaymentSession", paymentSessionSchema);
export default PaymentSession; 