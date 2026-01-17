const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const User = require("../models/user");

router.get('/', (req, res) => {
  res.render('index', { 
    user: req.session.user || null  // ✅ Make sure user is available in home.ejs
  });
});

router.get('/account', (req, res) => {
  // In future: you can fetch user details from req.user
  res.render('account', { user: req.user || null });
});

// 🕰️ Watches Page (All Products)
router.get('/watches', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products', { 
      products, 
      user: req.session.user || null  // ✅ Pass user session here too
    });
  } catch (err) {
    console.error('Error loading watches:', err);
    res.status(500).send('Error loading watches');
  }
});
router.get('/support', (req, res) => {
  res.render('support');
});




module.exports = router;
