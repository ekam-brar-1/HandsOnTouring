const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  userId: { type: String, required: true },             // same ID you use in favorites/reviews
  ownerName: { type: String, required: true },          
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  locationAddress: { type: String, required: true },
  enquiryEmail: { type: String, required: true },
  phone: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending','approved'],
    default: 'pending',
  },
  subscribed: {
    type: Boolean,
    default: false,
  },
  subscriptionDate: Date,
}, { timestamps: true });

module.exports = mongoose.model('Business', businessSchema);