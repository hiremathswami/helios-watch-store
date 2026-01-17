const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');


// Routes
const pageRoutes = require('./routes/pageRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const accountRoutes = require('./routes/accountRoutes');
const blogRoutes = require('./routes/blogRoutes');



// Models
const Product = require('./models/product');
const User = require('./models/user');

// Middleware
const isAdmin = require('./middlewares/isAdmin');
// -------------------- AUTH MIDDLEWARE --------------------
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect('/login');
  }
}


const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/watchstore';

// -------------------- Middleware Setup --------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ SESSION MUST BE BEFORE ROUTES
app.use(session({
  secret: "yourSecretKey",
  resave: false,
  saveUninitialized: true,
}));

// ✅ Initialize empty cart if not exist
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

// Make user & cart available globally in all EJS views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.cart = req.session.cart || [];
  next();
});

// -------------------- MongoDB Connection --------------------
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// -------------------- Multer Setup --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'public/images')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// -------------------- Views Setup --------------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// -------------------- Routes --------------------

// 🏠 Home Page - Show Only 5 Featured Watches

app.get('/', async (req, res) => {
  try {
    const products = await Product.find().limit(8);
    res.render('index', { products });
  } catch (err) {
    console.error('❌ Error loading products:', err);
    res.status(500).send('Error loading featured watches');
  }
});

// 🧑‍💻 Authentication Routes
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.send('User not found');
    if (user.password !== password) return res.send('Incorrect password');

    // Save full user info in session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
    };

    // Redirect by role
    if (user.role === 'admin') {
      req.session.isAdmin = true;
      res.redirect('/admin');
    } else {
      req.session.isAdmin = false;
      res.redirect('/account');
    }
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).send('Server error');
  }
});


app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.send('User already exists');

    const newUser = new User({ name, email, password, role: 'user' });
    await newUser.save();
    console.log('✅ Registration successful:', newUser.email);
    res.redirect('/login');
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Server error');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// 👑 Admin Dashboard
app.get('/admin', isAdmin, (req, res) => res.render('admin_dashboard'));
app.get('/add-product', isAdmin, (req, res) => res.render('add-product'));

// 🛒 CART HANDLING
app.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  res.render('cart', { cart, cartTotal });
});

app.get('/cart/add/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');

    req.session.cart.push({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    console.log('🛒 Added to cart:', product.name);
    res.redirect('/cart');
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).send('Error adding product to cart');
  }
});

app.get('/cart/remove/:id', (req, res) => {
  req.session.cart = req.session.cart.filter(item => item.id != req.params.id);
  res.redirect('/cart');
});

app.get("/forgot-password", (req, res) => {
  res.render("forgotPassword");
});

app.get('/account', isAuthenticated, (req, res) => {
  res.render('account', { user: req.session.user });
});

// -------------------- Mount Route Files --------------------
app.use('/', pageRoutes);
app.use('/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/payment', paymentRoutes);
app.use('/', accountRoutes);
app.use('/', blogRoutes);


// -------------------- Start Server --------------------
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

module.exports = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.redirect('/login'); // redirect to login if not admin
  }
};

