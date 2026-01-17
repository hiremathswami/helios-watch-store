const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/product');
const User = require('../models/user');
const isAdmin = require('../middlewares/isAdmin'); 

// ==== MULTER SETUP FOR IMAGE UPLOAD ====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/images/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ==== ADMIN DASHBOARD ====
router.get('/', isAdmin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5);
    res.render('admin/dashboard', { totalProducts, totalUsers, recentProducts });
  } catch (err) {
    console.error('Dashboard Error:', err);
    res.status(500).send('Server Error');
  }
});

router.get('/products', (req, res) => res.redirect('/admin/manage-products'));


// ==== MANAGE PRODUCTS ====
router.get('/manage-products', isAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render('admin/manage-products', { products });
  } catch (err) {
    console.error(' Product Fetch Error:', err);
    res.status(500).send('Error loading products');
  }
});

// ==== ADD PRODUCT FORM ====
router.get('/add-product', isAdmin, (req, res) => {
  res.render('admin/add-product');
});

router.post('/add-product', isAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const { name, brand, gender, movement, description, price } = req.body;
    const imagePaths = req.files.map(file => '/images/' + file.filename);

    const newProduct = new Product({
      name,
      brand,
      gender,
      movement,
      description,
      price,
      images: imagePaths
    });

    await newProduct.save();
    res.redirect('/admin/manage-products');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding product');
  }
});

router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('admin/users', { users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading users');
  }
});


// ==== EDIT PRODUCT FORM ====
router.get('/products/edit/:id', isAdmin, async (req, res) => {

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.render('admin/edit-product', { product });
  } catch (err) {
    console.error('Edit Fetch Error:', err);
    res.status(500).send('Server error');
  }
});

// ==== HANDLE PRODUCT UPDATE ====
router.post('/edit-product/:id', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, brand, gender, movement } = req.body;
    const updateData = { name, price, description, brand, gender, movement };

    if (req.file) updateData.image = '/images/' + req.file.filename;

    await Product.findByIdAndUpdate(req.params.id, updateData);
    console.log('Product updated successfully');
    res.redirect('/admin/manage-products');
  } catch (err) {
    console.error(' Product Update Error:', err);
    res.status(500).send('Error updating product');
  }
});

// ==== DELETE PRODUCT ====
router.get('/delete-product/:id', isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    console.log('Product deleted successfully!');
    res.redirect('/admin/manage-products');
  } catch (err) {
    console.error(' Product Delete Error:', err);
    res.status(500).send('Error deleting product');
  }
});

// ==== MANAGE USERS ====
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('admin/users', { users });
  } catch (err) {
    console.error('Users Fetch Error:', err);
    res.status(500).send('Error loading users');
  }
});

module.exports = router;
