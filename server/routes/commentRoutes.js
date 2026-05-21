import express from "express";
import { getComments, addComment, deleteComment } from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get_comment/:blogId", getComments);
router.post("/add_comment/:blogId", protect, addComment);
router.delete("/delete_comment/:id", protect, deleteComment);

export default router;