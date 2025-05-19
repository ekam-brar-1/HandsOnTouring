const express = require('express');
const Stripe = require('stripe');
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// You must use express.raw for Stripe webhooks
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  if (!sig) {
    return res.status(400).send('Missing Stripe signature');
  }

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the successful subscription
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerId = session.customer;

    try {
      // Example DB update (customize based on your DB system)
      await db.users.updateOne(
        { stripe_customer_id: customerId },
        { $set: { is_subscribed: true } }
      );
      console.log('✅ Subscription recorded for customer:', customerId);
    } catch (dbErr) {
      console.error('DB update failed:', dbErr);
    }
  }

  res.sendStatus(200);
});

module.exports = router;
f