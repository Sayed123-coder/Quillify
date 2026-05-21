import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { generateBlog, improveBlog, suggestTags } from "../controllers/aiController.js";
const router=express.Router();


router.post("/generate",protect,generateBlog);
router.post("/improve",protect,improveBlog);
router.post("/suggest-tags",protect,suggestTags);

export default router;