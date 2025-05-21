const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define the event schema
const EventSchema = new mongoose.Schema({
  title: String,
  type: String,
  location: String,
  email: String,
  phone: String,
  subeventName: String,
  startDate: String,
  endDate: String,
  startTime: String,
  endTime: String,
  media: [String],
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', EventSchema);

// POST /api/events
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ message: 'Event created successfully' });
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

module.exports = router;
