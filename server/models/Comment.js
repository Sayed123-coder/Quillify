import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);