import express from "express";
import { createBlog, deleteBlog, getAllBlogs, getBlogById, getMyBlogs, toggleLike, updateBlog } from "../controllers/blogController.js";
import {protect} from "../middleware/authMiddleware.js";
const router=express.Router();



router.post("/create",protect,createBlog);
router.get("/all",getAllBlogs);
router.get("/my_blogs",protect,getMyBlogs);
router.get("/get_blog/:id",getBlogById);
router.put("/update_blog/:id",protect,updateBlog);
router.delete("/delete_blog/:id",protect,deleteBlog);
router.patch("/like/:id", protect, toggleLike);

export default router;