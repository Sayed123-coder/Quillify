import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api from "../services/api";
import ImageUpload from "../components/ImageUpload";
import { toast } from "react-toastify";

const categories = ["Technology", "Lifestyle", "Health", "Education", "Entertainment", "Other"];

const quillModules = {
  toolbar: [
    [{ heading: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "blockquote", "code-block"],
    ["clean"],
  ],
};

const CreateBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    thumbnail: "",
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  const handleGenerate = async () => {
    if (!formData.title) {
      toast.error("Please enter a title first to generate blog");
      return;
    }
    setAiLoading(true);
    try {
      const response = await api.post("/ai/generate", { title: formData.title });
      const { blog } = response.data;
      setFormData({
        ...formData,
        title: blog.title,
        content: blog.content,
        category: blog.category,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "AI generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!formData.content || formData.content === "<p><br></p>") {
      toast.error("Please write some content first");
      return;
    }
    setAiLoading(true);
    try {
      const response = await api.post("/ai/improve", { content: formData.content });
      setFormData({ ...formData, content: response.data.improvedContent });
    } catch (err) {
      toast.error(err.response?.data?.message || "AI improvement failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (status) => {
    const isEmpty = !formData.content || formData.content === "<p><br></p>";
    if (!formData.title || isEmpty || !formData.category) {
      toast.error("Please provide title, content and category");
      return;
    }
    setLoading(true);
    try {
      await api.post("/blog/create", {
        ...formData,
        thumbnail: formData.thumbnail || "https://via.placeholder.com/800x400?text=Quillify+Blog",
        status,
      });
      toast.success("Blog saved successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-xl font-semibold text-gray-800 mb-1">Create a new blog</h1>
        <p className="text-sm text-gray-400 mb-6">Write your blog — or let AI generate it for you.</p>


        {/* Title */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-1 block">Blog title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter your blog title here..."
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 transition"
          />
        </div>

        {/* Thumbnail */}
        <div className="mb-4">
         <label className="text-sm text-gray-600 mb-1 block">Thumbnail</label>
         <ImageUpload
           value={formData.thumbnail}
           onChange={(url) => setFormData({ ...formData, thumbnail: url })}
           label="Upload thumbnail"
         />
       </div>

        {/* Content */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-1 block">Blog content</label>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              modules={quillModules}
              placeholder="Start writing your blog here..."
            />
            <div className="bg-indigo-50 border-t border-indigo-100 px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs text-indigo-600">✨ AI Assistant</span>
              <div className="flex gap-2">
                <button
                  onClick={handleImprove}
                  disabled={aiLoading}
                  className="text-xs px-3 py-1.5 border border-indigo-200 rounded-lg text-indigo-600 hover:bg-indigo-100 transition disabled:opacity-50"
                >
                  {aiLoading ? "Working..." : "Improve writing"}
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={aiLoading}
                  className="text-xs px-3 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
                >
                  {aiLoading ? "Generating..." : "Generate with AI"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="text-sm text-gray-600 mb-1 block">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 transition bg-white"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm px-5 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit("draft")}
            disabled={loading}
            className="text-sm px-5 py-2.5 border border-indigo-200 rounded-lg text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-50"
          >
            Save as draft
          </button>
          <button
            onClick={() => handleSubmit("pending")}
            disabled={loading}
            className="text-sm px-5 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish blog"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;