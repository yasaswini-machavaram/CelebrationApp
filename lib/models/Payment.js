import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invitationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invitation' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  amount: { type: Number, required: true }, // in paise
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  templateId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
