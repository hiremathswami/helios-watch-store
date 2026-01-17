const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// View Cart
router.get('/', (req, res) => {
  if (!req.session.cart) req.session.cart = [];

  // Calculate total price
  let total = req.session.cart.reduce((sum, item) => sum + Number(item.price), 0);

  // Render cart page
  res.render('cart', { cart: req.session.cart, cartTotal: total });
});

//  Add to Cart
router.post('/add-to-cart/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');

    if (!req.session.cart) req.session.cart = [];

    req.session.cart.push({
      id: product._id,
      name: product.name,
      price: Number(product.price),
      image: product.image
    });

    res.redirect('/cart');
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).send('Server error');
  }
});

//  Remove from Cart
router.get('/remove/:id', (req, res) => {
  if (!req.session.cart) return res.redirect('/cart');
  req.session.cart = req.session.cart.filter(item => item.id != req.params.id);
  res.redirect('/cart');
});

module.exports = router;
