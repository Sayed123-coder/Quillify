import { adminOnly, protect } from "../middleware/authMiddleware.js";
import express from "express";
import { approveBlog, blockUser, deleteAnyBlog, getAllBlogs, getAllUsers, getBlogById, rejectBlog, unblockUser } from "../controllers/adminController.js";
const router=express.Router();

router.get("/blogs",protect,adminOnly,getAllBlogs);
router.get("/users",protect,adminOnly,getAllUsers);
router.get("/blogs/:id",protect,adminOnly,getBlogById);
router.delete("/blogs/delete_blog/:id",protect,adminOnly,deleteAnyBlog);
router.patch("/blogs/approve_blog/:id",protect,adminOnly,approveBlog);
router.patch("/blogs/reject_blog/:id", protect, adminOnly, rejectBlog);
router.patch("/users/block_user/:id",protect,adminOnly,blockUser);
router.patch("/users/unblock_user/:id",protect,adminOnly,unblockUser);




export default router;