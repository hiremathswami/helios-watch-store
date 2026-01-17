const express = require("express");
const router = express.Router();
const User = require("../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


// ✅ Render register page
router.get("/register", (req, res) => {
  res.render("register");
});



// ✅ Handle user registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send("User already exists");
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.redirect("/auth/login");
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).send("Server error");
  }
});

// ✅ Render login page
router.get("/login", (req, res) => {
  res.render("login");
});

// ✅ Handle login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.send("Invalid credentials");
    }

    req.session.user = {
      name: user.name,
      email: user.email,
    };

    res.redirect("/");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
});

router.get("/forgot-password", (req, res) => {
  res.render("forgotPassword");
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.send("No account found with that email.");

  // Generate reset token
  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
  await user.save();

  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const resetLink = `http://localhost:3000/auth/reset-password/${token}`;

  await transporter.sendMail({
    to: user.email,
    from: process.env.SMTP_EMAIL,
    subject: "Password Reset Request - WatchStore",
    html: `
      <h2>Hi ${user.name || "User"},</h2>
      <p>You requested to reset your WatchStore password.</p>
      <p>Click the link below to create a new password:</p>
      <a href="${resetLink}" target="_blank">Reset My Password</a>
      <p>This link expires in 1 hour.</p>
    `,
  });

  res.send("✅ Password reset link sent to your email.");
});

// ---------------- RESET PASSWORD ----------------
router.get("/reset-password/:token", async (req, res) => {
  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) return res.send("Invalid or expired token.");

  res.render("resetPassword", { token: req.params.token });
});

router.post("/reset-password/:token", async (req, res) => {
  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) return res.send("Invalid or expired token.");

  if (req.body.password !== req.body.confirmPassword)
    return res.send("Passwords do not match.");

  user.password = req.body.password; // You should hash this in production
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  await user.save();

  res.redirect("/login");
});

// ✅ Handle logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});



module.exports = router;
