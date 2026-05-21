import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuth from "../hooks/useAuth";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "react-toastify";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [readProgress, setReadProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);



  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const [blogRes, commentRes] = await Promise.all([
          api.get(`/blog/get_blog/${id}`),
          api.get(`/comment/get_comment/${id}`),
        ]);
        setBlog(blogRes.data.blog);
        setLikesCount(blogRes.data.blog.likes?.length || 0);
        setLiked(blogRes.data.blog.likes?.includes(user?._id));
        setComments(commentRes.data.comments);
      } catch (err) {
        setError("Blog not found or unavailable",err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id,user?._id]);

  useEffect(() => {
  const interval = setInterval(() => {
    setNow(Date.now());
  }, 60000); 

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
    setReadProgress(progress);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      const response = await api.post(`/comment/add_comment/${id}`, {
        content: newComment,
      });
      setComments([response.data.comment, ...comments]);
      toast.success("Comment added!");
      setNewComment("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment",err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comment/delete_comment/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success("Comment deleted!");
    } catch (err) {
      toast.error("Failed to delete comment",err);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatCommentDate = (dateStr) => {
    const diff = Math.floor((now - new Date(dateStr)) / 60000);
    if (diff < 1) return "just now";
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  const getReadTime = (htmlContent) => {
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    const text = div.textContent || div.innerText || "";
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const handleLike = async () => {
  if (!user) {
    toast.error("Please login to like this blog");
    return;
  }
  try {
    const response = await api.patch(`/blog/like/${id}`);
    if (response.data.liked) {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    } else {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    }
  } catch (err) {
    toast.error("Something went wrong",err);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading blog...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-gray-500">{error || "Blog not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Go back
        </button>
      </div>
    );
  }

  return (
   <>
     {/* Reading Progress Bar */}
     <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div
       className="h-full bg-indigo-500 transition-all duration-100"
       style={{ width: `${readProgress}%` }}
      />  
     </div>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-indigo-500 transition mb-6 flex items-center gap-1"
        >
          ← Back
        </button>

        {/* Category */}
        <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
          {blog.category}
        </span>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mt-4 mb-4 leading-snug">
          {blog.title}
        </h1>

        {/* Author + Date + Read time */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-600">
            {blog.author?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">{blog.author?.name}</p>
            <p className="text-xs text-gray-400">
              {formatDate(blog.createdAt)} · {getReadTime(blog.content)} min read . {blog.views} views
            </p>
          </div>
        </div>

        {/* Thumbnail */}
        {blog.thumbnail && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-64 object-cover"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}

        {/* Content */}
        <div
          className="ql-editor !p-0 text-gray-700 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
         {/* Like Button */}
          <div className="flex items-center gap-3 mt-8">
            <button
             onClick={handleLike}
             className={`flex items-center gap-2 px-4 py-2 rounded-full border transition text-sm ${
             liked
             ? "bg-red-50 border-red-200 text-red-500"
             : "border-gray-200 text-gray-500 hover:bg-gray-50"
             }`}
            >
           {liked ? "❤️" : "🤍"} {likesCount} {likesCount === 1 ? "Like" : "Likes"}
          </button>
          </div>
        {/* Divider */}
        <div className="border-t border-gray-200 mt-10 mb-8" />

        {/* Comments Section */}
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-6">
            Comments ({comments.length})
          </h2>

          {/* Comments List */}
          {comments.length === 0 ? (
            <p className="text-sm text-gray-400 mb-8">
              No comments yet — be the first to comment!
            </p>
          ) : (
            <div className="space-y-5 mb-8">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600 flex-shrink-0">
                    {comment.author?.name?.charAt(0)}
                  </div>

                  {/* Comment body */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800">
                          {comment.author?.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatCommentDate(comment.createdAt)}
                        </span>
                      </div>

                      {/* Delete button — sirf author ya admin dekh sakta hai */}
                      {user &&
                        (user._id === comment.author?._id ||
                          user.role === "admin") && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-xs text-red-400 hover:text-red-600 transition"
                          >
                            Delete
                          </button>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment */}
          {user ? (
            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Add your comment
              </p>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment here..."
                rows={3}
                className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-indigo-400 transition resize-none mb-3"
              />
              <button
                onClick={handleAddComment}
                disabled={commentLoading || !newComment.trim()}
                className="text-sm px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
              >
                {commentLoading ? "Posting..." : "Submit"}
              </button>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl p-4 bg-white text-center">
              <p className="text-sm text-gray-500">
                Please{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-indigo-500 hover:underline"
                >
                  login
                </button>{" "}
                to add a comment.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
    </>
  );
};

export default BlogDetail;