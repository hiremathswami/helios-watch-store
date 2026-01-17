const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// 🏠 GET ALL PRODUCTS + FILTERS
router.get('/', async (req, res) => {
  try {
    const { brand, gender, movement, price, sort } = req.query;
    const filter = {};

    if (brand && brand !== 'All') filter.brand = brand;
    if (gender && gender !== 'All') filter.gender = gender;
    if (movement && movement !== 'All') filter.movement = movement;

    // ✅ Price Range Filter
    if (price) {
      const ranges = {
        '1000-20000': { $gte: 1000, $lt: 20000 },
        '20000-40000': { $gte: 20000, $lt: 40000 },
        '40000-60000': { $gte: 40000, $lt: 60000 },
        '60000-80000': { $gte: 60000, $lt: 80000 },
        '80000-100000': { $gte: 80000, $lt: 100000 },
        'above-100000': { $gte: 100000 },
      };
      filter.price = ranges[price];
    }

    // ✅ Sorting
    let sortOption = {};
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };

    const products = await Product.find(filter).sort(sortOption);

    // ✅ Dynamic filters for EJS dropdowns
    const brands = await Product.distinct('brand');
    const movements = await Product.distinct('movement');
    const genders = await Product.distinct('gender');

    res.render('products', {
      products,
      brands,
      movements,
      genders,
      selected: { brand, gender, movement, price, sort },
    });
  } catch (err) {
    console.error('❌ Error loading products:', err);
    res.status(500).send('Error loading watches');
  }
});


// 🧩 CATEGORY FILTER (Men / Women / Unisex)
router.get('/category/:gender', async (req, res) => {
  try {
    const genderParam = req.params.gender.toLowerCase();
    let filter = {};

    if (genderParam === 'men') {
      filter.gender = { $regex: /^men$/i };
    } else if (genderParam === 'women') {
      filter.gender = { $regex: /^women$/i };
    } else if (genderParam === 'unisex') {
      filter.gender = { $regex: /^unisex$/i };
    } else {
      return res.status(400).send('Invalid category');
    }

    const products = await Product.find(filter);

    const brands = await Product.distinct('brand');
    const movements = await Product.distinct('movement');
    const genders = await Product.distinct('gender');

    console.log('🧭 Category Filter Applied:', filter);
    console.log('✅ Found Products:', products.length);

    res.render('products', {
      products,
      brands,
      movements,
      genders,
      selected: { brand: 'All', gender: genderParam, movement: 'All' },
      title: `${genderParam.charAt(0).toUpperCase() + genderParam.slice(1)} Watches`,
    });
  } catch (err) {
    console.error('❌ Error loading category products:', err);
    res.status(500).send('Server Error: Unable to load category');
  }
});


// 🕰️ PRODUCT DETAILS PAGE
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.render('productDetails', { product });
  } catch (err) {
    console.error('❌ Error loading product details:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
