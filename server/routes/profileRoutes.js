import express from "express";
import { getProfile, updateProfile, changePassword } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getProfile);
router.put("/update_profile", protect, updateProfile);
router.put("/change_password", protect, changePassword);

export default router;