import mongoose from 'mongoose';

const TemplatePricingSchema = new mongoose.Schema({
  templateId: { type: String, required: true, unique: true },
  price: { type: Number, required: true, default: 0 }, // in paise (29900 = ₹299)
  updatedAt: { type: Date, default: Date.now },
});

TemplatePricingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.TemplatePricing || mongoose.model('TemplatePricing', TemplatePricingSchema);
