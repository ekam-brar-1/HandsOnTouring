
const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: String, 
    required: true,
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Location',
  }
}, { timestamps: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;
