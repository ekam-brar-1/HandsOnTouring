const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

router.post('/', async (req, res) => {
  const { userId, placeId, rating, comment } = req.body;

  try {
    const newReview = new Review({ userId, placeId, rating, comment });
    await newReview.save();
    res.status(201).json({ message: 'Review added', review: newReview });
  } catch (err) {
    console.error('Error while saving review:', err);
    res.status(500).json({ error: 'Failed to save review' });
  }
});


router.get('/:placeId', async (req, res) => {
  try {
    const reviews = await Review.find({ placeId: req.params.placeId })
      .populate('userId', 'name'); 
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;
