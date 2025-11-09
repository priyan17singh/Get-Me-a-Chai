import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
  },
  oid: {
    type: String, // Razorpay order_id
    required: true,
    unique: true,
  },
  payment_id: {
    type: String, // Razorpay payment_id (optional until verified)
  },
  done: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
