import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const response = await api.get("/blog/my_blogs");
        setBlogs(response.data.blogs);
      } catch (err) {
        toast.error("Failed to delete blog",err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.delete(`/blog/delete/${id}`);
      setBlogs(blogs.filter((blog) => blog._id !== id));
      toast.success("Blog deleted!");
    } catch (err) {
      toast.error("Failed to delete blog",err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/blog/update_blog/${id}`, {
        ...blogs.find((b) => b._id === id),
        status: newStatus,
      });
      setBlogs((prev) =>
        prev.map((blog) =>
          blog._id === id ? { ...blog, status: newStatus } : blog
        )
      );
      toast.success("Blog submitted for review!");
    } catch (err) {
      toast.error("Failed to update blog status",err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved": return "bg-green-50 text-green-700 border border-green-200";
      case "pending": return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case "rejected": return "bg-red-50 text-red-700 border border-red-200";
      default: return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  const totalBlogs = blogs.length;
  const publishedBlogs = blogs.filter((b) => b.status === "approved").length;
  const pendingBlogs = blogs.filter((b) => b.status === "pending").length;

  const filteredBlogs = statusFilter === "all"
    ? blogs
    : blogs.filter((b) => b.status === statusFilter);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <div className="w-52 bg-white border-r border-gray-200 flex flex-col py-6 fixed h-full">
        <div className="px-4 mb-6">
          <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-semibold text-indigo-600 mb-2">
            {user?.name?.charAt(0)}
          </div>
          <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>

        <div className="border-t border-gray-100 pt-4 flex flex-col gap-1 px-2">

          
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-indigo-600 bg-indigo-50 font-medium"
          >
            📊 Dashboard
          </Link>
          <Link
            to="/blog/create"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            ✏️ Write blog
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            📁 My blogs
          </Link>

          <Link
           to="/profile"
           className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
          >
           👤 Profile
          </Link>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            🏠 Home
          </Link>
        </div>

        <div className="mt-auto px-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="ml-52 flex-1 p-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div
            onClick={() => setStatusFilter("all")}
            className={`bg-white border rounded-xl p-4 cursor-pointer hover:shadow-sm transition ${
              statusFilter === "all" ? "border-indigo-300" : "border-gray-200"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center mb-3 text-base">
              📁
            </div>
            <p className="text-2xl font-semibold text-gray-800">{totalBlogs}</p>
            <p className="text-xs text-gray-400 mt-1">Total blogs</p>
          </div>

          <div
            onClick={() => setStatusFilter("approved")}
            className={`bg-white border rounded-xl p-4 cursor-pointer hover:shadow-sm transition ${
              statusFilter === "approved" ? "border-green-300" : "border-gray-200"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mb-3 text-base">
              ✅
            </div>
            <p className="text-2xl font-semibold text-gray-800">{publishedBlogs}</p>
            <p className="text-xs text-gray-400 mt-1">Published</p>
          </div>

          <div
            onClick={() => setStatusFilter("pending")}
            className={`bg-white border rounded-xl p-4 cursor-pointer hover:shadow-sm transition ${
              statusFilter === "pending" ? "border-yellow-300" : "border-gray-200"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center mb-3 text-base">
              ⏳
            </div>
            <p className="text-2xl font-semibold text-gray-800">{pendingBlogs}</p>
            <p className="text-xs text-gray-400 mt-1">Pending review</p>
          </div>
        </div>

        {/* Blog Table Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <p className="text-base font-semibold text-gray-800">My blogs</p>
            {statusFilter !== "all" && (
              <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full capitalize">
                {statusFilter}
                <button
                  onClick={() => setStatusFilter("all")}
                  className="ml-1.5 hover:text-indigo-800"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
          <Link
            to="/blog/create"
            className="text-sm px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            + New blog
          </Link>
        </div>

        {/* Blog Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

          {/* Table Head */}
          <div className="grid grid-cols-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Blog title</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</p>
          </div>

          {/* Rows */}
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              Loading...
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              {statusFilter === "all" ? (
                <>
                  No blogs yet —{" "}
                  <Link to="/blog/create" className="text-indigo-500 hover:underline">
                    write your first one!
                  </Link>
                </>
              ) : (
                `No ${statusFilter} blogs found.`
              )}
            </div>
          ) : (
            filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="grid grid-cols-4 px-4 py-3 border-b border-gray-100 items-center last:border-none"
              >
                <p className="text-sm text-gray-800 truncate pr-4">{blog.title}</p>
                <p className="text-sm text-gray-500">{blog.category}</p>
                <span className={`text-xs px-3 py-1 rounded-full w-fit capitalize ${getStatusStyle(blog.status)}`}>
                  {blog.status}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  {blog.status === "draft" && (
                    <button
                      onClick={() => handleStatusChange(blog._id, "pending")}
                      className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition"
                    >
                      Submit
                    </button>
                  )}
                  {blog.status === "rejected" && (
                    <button
                      onClick={() => handleStatusChange(blog._id, "pending")}
                      className="text-xs px-3 py-1.5 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition"
                    >
                      Resubmit
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/blog/edit/${blog._id}`)}
                    className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="text-xs px-3 py-1.5 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;