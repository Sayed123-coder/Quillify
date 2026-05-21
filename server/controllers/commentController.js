import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";


export const getComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({
      blog: blogId,
      isDeleted: false,
    })
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({ comments });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};


export const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const blog = await Blog.findById(blogId);

    if (!blog || blog.isDeleted || !blog.isPublished) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      blog: blogId,
    });

    const populatedComment = await comment.populate("author", "name avatar");

    return res.status(201).json({ message: "Comment added", comment: populatedComment });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};


export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment || comment.isDeleted) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isAuthor = String(comment.author) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: "You cannot delete this comment" });
    }

    await Comment.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    return res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};