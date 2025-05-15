const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: String,
  rating: Number,
  description: String,
  media: [String], 
}, {
  timestamps: true
});

const Location = mongoose.model('Location', locationSchema, 'event'); // 👈 collection name: 'event'

module.exports = Location;
