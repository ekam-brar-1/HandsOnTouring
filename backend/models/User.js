const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // UUID
  name: String,
  email: { type: String, unique: true },
  password: String,
  stripe_customer_id: String,
  is_subscribed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
