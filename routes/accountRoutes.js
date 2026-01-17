const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Middleware to ensure login
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect("/login");
}

// Render Account Page
router.get("/account", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) return res.redirect("/login");
    res.render("account", { user });
  } catch (err) {
    console.error("Error loading account:", err);
    res.status(500).send("Server error");
  }
});

// Handle Account Update
router.post("/account/update", isAuthenticated, async (req, res) => {
  try {
    const { name, address, mobile } = req.body;

    // Update the user in MongoDB
    await User.findByIdAndUpdate(req.session.user.id, {
      name,
      address,
      mobile
    });

    console.log("Account updated successfully!");
    res.redirect("/account");
  } catch (err) {
    console.error("Error updating account:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
