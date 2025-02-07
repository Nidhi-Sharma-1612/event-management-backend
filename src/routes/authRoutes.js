const express = require("express");
const { registerUser, loginUser } = require("../services/authService");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  try {
    const { user, token } = await registerUser(req.body);
    res
      .status(201)
      .json({ message: "User registered successfully", user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { user, token } = await loginUser(req.body);
    res.json({ message: "Login successful", user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
