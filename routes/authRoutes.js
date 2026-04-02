const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

// 🔐 AUTH ROUTES
router.post("/signup", signup);
router.post("/login", login);

// 🔐 VALIDATE CURRENT USER
router.get("/me", verifyToken, async (req, res) => {
  try {
    return res.status(200).json({
      user: req.user,
    });
  } catch (err) {
    console.error("Auth /me error:", err);
    return res.status(500).json({
      message: "Failed to validate user",
    });
  }
});

module.exports = router;
