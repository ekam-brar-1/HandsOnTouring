const express = require('express');
const mongoose = require('mongoose');
const Business = require('../models/Business');
const router = express.Router();

// 1️⃣ Request business account
router.post('/request', async (req, res) => {
  const { userId, ownerName, businessName, businessType, locationAddress, enquiryEmail, phone } = req.body;
  try {
    const exists = await Business.findOne({ userId });
    if (exists) return res.status(400).json({ error: 'Already requested' });

    const biz = new Business({ userId, ownerName, businessName, businessType, locationAddress, enquiryEmail, phone });
    await biz.save();
    res.status(201).json({ message: 'Request submitted' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot submit request' });
  }
});

// 2️⃣ Get status for a user
router.get('/status/:userId', async (req, res) => {
  try {
    const biz = await Business.findOne({ userId: req.params.userId });
    if (!biz) return res.json({ status: 'none' });
    if (biz.subscribed) return res.json({ status: 'subscribed' });
    return res.json({ status: biz.status });  // 'pending' or 'approved'
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot fetch status' });
  }
});

// 3️⃣ Admin approves a business request
router.post('/approve', async (req, res) => {
  const { businessId } = req.body;
  try {
    const biz = await Business.findByIdAndUpdate(businessId, { status: 'approved' });
    if (!biz) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Approved' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot approve' });
  }
});

// 4️⃣ Subscribe after approval
router.post('/subscribe', async (req, res) => {
  const { userId } = req.body;
  try {
    const biz = await Business.findOne({ userId });
    if (!biz || biz.status !== 'approved') return res.status(400).json({ error: 'Not approved' });

    biz.subscribed = true;
    biz.subscriptionDate = new Date();
    await biz.save();
    res.json({ message: 'Subscribed' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot subscribe' });
  }
});

module.exports = router;