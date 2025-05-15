const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Favorite = require('../models/Favorite');

router.post('/', async (req, res) => {
  const { userId, placeId } = req.body;
  try {
    const existing = await Favorite.findOne({ userId, placeId: new mongoose.Types.ObjectId(placeId) });
    if (existing) return res.status(400).json({ error: 'Already in favorites' });

    const favorite = new Favorite({ 
      userId: userId, 
      placeId: new mongoose.Types.ObjectId(placeId)
    });

    await favorite.save();
    res.status(201).json({ message: 'Added to favorites', favorite });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});


router.delete('/', async (req, res) => {
  const { userId, placeId } = req.body;
  if (!userId || !placeId) {
    return res.status(400).json({ error: 'userId and placeId are required' });
  }
  try {
    const removed = await Favorite.findOneAndDelete({ 
      userId: userId, 
      placeId: new mongoose.Types.ObjectId(placeId)
    });
    if (!removed) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    res.status(200).json({ message: 'Removed from favorites', favorite: removed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});


router.get('/:userId', async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId }).populate('placeId');
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

module.exports = router;
