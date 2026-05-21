import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [blogFilter, setBlogFilter] = useState("all");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [blogRes, userRes] = await Promise.all([
          api.get("/admin/blogs"),
          api.get("/admin/users"),
        ]);
        setBlogs(blogRes.data.blogs);
        setUsers(userRes.data.users);
      } catch (err) {
        toast.error("Failed to load data",err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/admin/blogs/approve_blog/${id}`);
      setBlogs((prev) =>
        prev.map((blog) =>
          blog._id === id
            ? { ...blog, status: "approved", isPublished: true }
            : blog
        )
      );
      toast.success("Blog approved!");
    } catch (err) {
      toast.error("Failed to approve blog",err);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/admin/blogs/reject_blog/${id}`);
      setBlogs((prev) =>
        prev.map((blog) =>
          blog._id === id
            ? { ...blog, status: "rejected", isPublished: false }
            : blog
        )
      );
      toast.success("Blog rejected!");
    } catch (err) {
      toast.error("Failed to reject blog",err);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.delete(`/admin/blogs/delete_blog/${id}`);
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      toast.success("Blog deleted!");
    } catch (err) {
      toast.error("Failed to delete blog",err);
    }
  };

  const handleBlockUser = async (id) => {
    try {
      await api.patch(`/admin/users/block_user/${id}`);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isBlocked: true } : user
        )
      );
      toast.success("User blocked!")
    } catch (err) {
      toast.error("Failed to block user",err);
    }
  };

  const handleUnblockUser = async (id) => {
    try {
      await api.patch(`/admin/users/unblock_user/${id}`);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isBlocked: false } : user
        )
      );
      toast.success("User unblocked!");
    } catch (err) {
      toast.error("Failed to unblock user",err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const statusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-50 text-yellow-600 border-yellow-200",
      approved: "bg-green-50 text-green-600 border-green-200",
      rejected: "bg-red-50 text-red-600 border-red-200",
      draft: "bg-gray-100 text-gray-500 border-gray-200",
    };
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${styles[status] || styles.draft}`}>
        {status}
      </span>
    );
  };

  const filteredBlogs = blogs.filter((blog) => {
    if (blogFilter === "all") return true;
    return blog.status === blogFilter;
  });

  const totalBlogs = blogs.length;
  const pendingBlogs = blogs.filter((b) => b.status === "pending").length;
  const totalUsers = users.length;

  const sidebarLink = (section, label) => (
    <button
      onClick={() => setActiveSection(section)}
      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition ${
        activeSection === section
          ? "bg-indigo-50 text-indigo-600 font-medium"
          : "text-gray-500 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <div className="w-52 bg-white border-r border-gray-200 flex flex-col py-6 fixed h-full">

        {/* Logo */}
        <div className="px-4 mb-6 flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-800">
            Quill<span className="text-indigo-500">ify</span>
          </span>
          <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
            Admin
          </span>
        </div>

        <div className="flex flex-col gap-4 px-2 flex-1">

          {/* Overview */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-1">
              Overview
            </p>
            {sidebarLink("dashboard", "📊 Dashboard")}
          </div>

          {/* Blogs */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-1">
              Blogs
            </p>
            <button
              onClick={() => {
              setActiveSection("all-blogs");
              setBlogFilter("all");
              }}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition ${
              activeSection === "all-blogs" && blogFilter !== "pending"
              ? "bg-indigo-50 text-indigo-600 font-medium"
              : "text-gray-500 hover:bg-gray-50"
              }`}
            >
             📁 All blogs   
            </button>
            <button
             onClick={() => {
             setActiveSection("all-blogs");
             setBlogFilter("pending");
              }}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition ${
               activeSection === "all-blogs" && blogFilter === "pending"
               ? "bg-indigo-50 text-indigo-600 font-medium"
               : "text-gray-500 hover:bg-gray-50"
             }`}
            >
              ⏳ Pending
            </button>
          </div>

          {/* Users */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-1">
              Users
            </p>
            {sidebarLink("users", "👥 All users")}
          </div>

          {/* Other */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-1">
              Other
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full text-left text-sm px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-50 transition"
            >
              🏠 Home
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left text-sm px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition"
            >
              🚪 Logout
            </button>
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="ml-52 flex-1 p-6">

        {/* ── DASHBOARD ── */}
        {activeSection === "dashboard" && (
          <div>
            {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  <div
    onClick={() => setActiveSection("all-blogs")}
    className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-indigo-300 hover:shadow-sm transition"
  >
    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">📁</div>
    <p className="text-2xl font-semibold text-gray-800">{totalBlogs}</p>
    <p className="text-xs text-gray-400 mt-1">Total blogs</p>
  </div>

  <div
    onClick={() => { setActiveSection("all-blogs"); setBlogFilter("pending"); }}
    className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-yellow-300 hover:shadow-sm transition"
  >
    <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center mb-3">⏳</div>
    <p className="text-2xl font-semibold text-gray-800">{pendingBlogs}</p>
    <p className="text-xs text-gray-400 mt-1">Pending review</p>
  </div>

  <div
    onClick={() => setActiveSection("users")}
            className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-green-300 hover:shadow-sm transition"
          >
           <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mb-3">👥</div>
              <p className="text-2xl font-semibold text-gray-800">{totalUsers}</p>
              <p className="text-xs text-gray-400 mt-1">Total users</p>
           </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mb-3">💬</div>
               <p className="text-2xl font-semibold text-gray-800">—</p>
               <p className="text-xs text-gray-400 mt-1">Comments</p>
           </div>
          </div>

            {/* Quick blog table */}
            <p className="text-base font-semibold text-gray-800 mb-4">Recent blogs</p>
            <BlogTable
              blogs={blogs.slice(0, 5)}
              blogFilter="all"
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDeleteBlog}
              statusBadge={statusBadge}
            />
          </div>
        )}

        {/* ── ALL BLOGS ── */}
        {(activeSection === "all-blogs" || activeSection === "pending") && (
          <div>
            <p className="text-base font-semibold text-gray-800 mb-4">Blog management</p>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {["all", "pending", "approved", "rejected", "draft"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setBlogFilter(filter);
                    setActiveSection("all-blogs");
                  }}
                  className={`text-xs px-4 py-2 rounded-lg border transition capitalize ${
                    blogFilter === filter
                      ? "bg-indigo-500 text-white border-indigo-500"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {filter === "all" ? "All" : filter}
                  {filter === "pending" && pendingBlogs > 0 && (
                    <span className="ml-1.5 bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded-full text-xs">
                      {pendingBlogs}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <BlogTable
              blogs={filteredBlogs}
              blogFilter={blogFilter}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDeleteBlog}
              statusBadge={statusBadge}
            />
          </div>
        )}

        {/* ── USERS ── */}
        {activeSection === "users" && (
          <div>
            <p className="text-base font-semibold text-gray-800 mb-4">User management</p>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Table Head */}
              <div className="grid grid-cols-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider col-span-2">User</p>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</p>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</p>
              </div>

              {users.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-12">No users found.</p>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="grid grid-cols-4 px-4 py-3 border-b border-gray-100 items-center last:border-none"
                  >
                    {/* User info */}
                    <div className="flex items-center gap-3 col-span-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600 flex-shrink-0">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-800">{user.name}</p>
                          {user.isBlocked && (
                            <span className="text-xs bg-red-50 text-red-500 border border-red-200 px-1.5 py-0.5 rounded-full">
                              blocked
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>

                    {/* Role */}
                    <span className={`text-xs px-2.5 py-1 rounded-full border w-fit capitalize ${
                      user.role === "admin"
                        ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}>
                      {user.role}
                    </span>

                    {/* Action */}
                    <div>
                      {user.role !== "admin" && (
                        user.isBlocked ? (
                          <button
                            onClick={() => handleUnblockUser(user._id)}
                            className="text-xs px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlockUser(user._id)}
                            className="text-xs px-3 py-1.5 bg-red-50 text-red-500 border border-red-200 rounded-lg hover:bg-red-100 transition"
                          >
                            Block
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Blog Table — alag component banaya taaki reuse ho sake
const BlogTable = ({ blogs, onApprove, onReject, onDelete, statusBadge }) => {
  if (blogs.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-12">No blogs found.</p>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Head */}
      <div className="grid grid-cols-5 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider col-span-2">Blog title</p>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</p>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</p>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</p>
      </div>

      {/* Rows */}
      {blogs.map((blog) => (
        <div
          key={blog._id}
          className="grid grid-cols-5 px-4 py-3 border-b border-gray-100 items-center last:border-none"
        >
          <div className="col-span-2 pr-4">
            <p className="text-sm text-gray-800 truncate">{blog.title}</p>
            <p className="text-xs text-gray-400">by {blog.author?.name}</p>
          </div>
          <p className="text-sm text-gray-500">{blog.category}</p>
          <div>{statusBadge(blog.status)}</div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {blog.status === "pending" && (
              <>
                <button
                  onClick={() => onApprove(blog._id)}
                  className="text-xs px-2.5 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(blog._id)}
                  className="text-xs px-2.5 py-1.5 bg-red-50 text-red-500 border border-red-200 rounded-lg hover:bg-red-100 transition"
                >
                  Reject
                </button>
              </>
            )}
            {blog.status === "rejected" && (
              <button
                onClick={() => onApprove(blog._id)}
                className="text-xs px-2.5 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition"
              >
                Approve
              </button>
            )}
            <button
              onClick={() => onDelete(blog._id)}
              className="text-xs px-2.5 py-1.5 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;