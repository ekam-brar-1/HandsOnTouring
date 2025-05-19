import express from "express";
import Stripe from "stripe";
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET);

router.post("/create-subscription", async (req, res) => {
  const { email, customerId } = req.body;

  try {
    let customer = customerId;
    if (!customerId) {
      const newCustomer = await stripe.customers.create({ email });
      customer = newCustomer.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: 999,
            recurring: { interval: "month" },
            product_data: {
              name: "HandsOnTouring Business Subscription",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/subscription-success`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription-cancelled`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Subscription failed." });
  }
});

export default router;
