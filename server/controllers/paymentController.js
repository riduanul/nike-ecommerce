import Stripe from 'stripe';

// @desc    Create payment intent
// @route   POST /api/payment/create-intent
export const createPaymentIntent = async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency: 'usd',
      metadata: {
        userId: req.user._id.toString(),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Stripe webhook handler
// @route   POST /api/payment/webhook
export const handleWebhook = async (req, res) => {
  // Webhook handling for production — placeholder
  res.json({ received: true });
};
