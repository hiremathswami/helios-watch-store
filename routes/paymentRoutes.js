const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
require('dotenv').config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create order
router.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // convert ₹ to paise
      currency: 'INR',
      receipt: 'receipt_' + Date.now(),
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error('Razorpay Error:', err);
    res.status(500).send('Payment order creation failed');
  }
});

module.exports = router;
