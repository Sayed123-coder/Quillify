import express from "express";
import { register, login } from "../controllers/authController.js";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Existing routes
router.post("/register", register);
router.post("/login", login);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login", session: false }),
  (req, res) => {
    // JWT token banao
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // User data
    const user = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
    };

    // Frontend par redirect karo token ke saath
    res.redirect(
      `http://localhost:5173/auth/google/success?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`
    );
  }
);

export default router;