import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Home = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ["All", "Technology", "Lifestyle", "Health", "Education", "Entertainment", "Other"];

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/blog/all?page=${currentPage}&limit=6&search=${search}&category=${activeCategory}`
        );
        setBlogs(response.data.blogs);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Failed to load blogs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [currentPage, search, activeCategory]);

  const getExcerpt = (htmlContent) => {
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    const text = div.textContent || div.innerText || "";
    return text.slice(0, 120) + (text.length > 120 ? "..." : "");
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-white border-b border-gray-200 py-16 px-6 text-center">
        <div className="inline-flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-full mb-6">
          ✨ AI-powered blog generation
        </div>
        <h1 className="text-4xl font-semibold text-gray-900 mb-4 leading-tight">
          Your thoughts deserve <br />
          a <span className="text-indigo-500">beautiful</span> home.
        </h1>
        <p className="text-gray-500 text-base max-w-md mx-auto mb-8 leading-relaxed">
          Write, publish, and grow with AI by your side. Quillify helps you create blogs that people actually want to read.
        </p>
        <div className="flex max-w-lg mx-auto border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <input
            type="text"
            placeholder="Search for blogs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 px-4 py-3 text-sm outline-none text-gray-700"
          />
          <button className="px-6 py-3 bg-indigo-500 text-white text-sm hover:bg-indigo-600 transition">
            Search
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex gap-2 flex-wrap justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setCurrentPage(1);
            }}
            className={`text-xs px-4 py-2 rounded-full border transition ${
              activeCategory === cat
                ? "bg-indigo-50 text-indigo-600 border-indigo-300"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blogs */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
          Latest Blogs
        </p>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <p className="text-sm text-gray-400">Loading blogs...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-16">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* No blogs found */}
        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-gray-400">No blogs found.</p>
          </div>
        )}

        {/* Blog Grid */}
        {!loading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link to={`/blog/${blog._id}`} key={blog._id} className="h-full">
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer flex flex-col h-full">
                  {/* Thumbnail */}
                  {blog.thumbnail ? (
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="h-40 w-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="h-40 bg-gray-100 items-center justify-center"
                    style={{ display: blog.thumbnail ? "none" : "flex" }}
                  >
                    <span className="text-gray-300 text-4xl">🖼</span>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit">
                      {blog.category}
                    </span>
                    <h2 className="text-sm font-semibold text-gray-800 mt-3 mb-2 leading-snug">
                      {blog.title}
                    </h2>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                      {getExcerpt(blog.content)}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600">
                          {blog.author?.name?.charAt(0)}
                        </div>
                        <span className="text-xs text-gray-500">{blog.author?.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(blog.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="text-sm px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition disabled:opacity-40"
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`text-sm w-9 h-9 rounded-lg border transition ${
                  currentPage === page
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="text-sm px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Newsletter */}
      <div className="bg-white border-t border-gray-200 py-12 px-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Never miss a blog</h2>
        <p className="text-sm text-gray-500 mb-6">
          Subscribe to get the latest blogs, tech news, and exclusive content.
        </p>
        <div className="flex max-w-md mx-auto border border-gray-200 rounded-xl overflow-hidden">
          <input
            type="email"
            placeholder="Enter your email..."
            className="flex-1 px-4 py-3 text-sm outline-none text-gray-700"
          />
          <button className="px-6 py-3 bg-indigo-500 text-white text-sm hover:bg-indigo-600 transition">
            Subscribe
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 px-6 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="text-lg font-semibold text-gray-800 mb-2">
              Quill<span className="text-indigo-500">ify</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              A platform to write, share, and inspire — powered by AI.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-gray-500 hover:text-indigo-500 transition">Home</Link>
              <Link to="/" className="text-sm text-gray-500 hover:text-indigo-500 transition">All blogs</Link>
              <Link to="/register" className="text-sm text-gray-500 hover:text-indigo-500 transition">Write a blog</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Follow us</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-sm text-gray-500 hover:text-indigo-500 transition">Twitter</a>
              <a href="#" className="text-sm text-gray-500 hover:text-indigo-500 transition">Instagram</a>
              <a href="#" className="text-sm text-gray-500 hover:text-indigo-500 transition">YouTube</a>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-8">
          Copyright 2025 © Quillify — All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default Home;