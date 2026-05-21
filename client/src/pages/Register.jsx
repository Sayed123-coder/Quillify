import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-md shadow-sm">

        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-semibold text-gray-800">
            Quill<span className="text-indigo-500">ify</span>
          </Link>
          <p className="text-sm text-gray-400 mt-1">Join thousands of writers!</p>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-1">Create your account</h2>
        <p className="text-sm text-gray-400 mb-6">Start writing amazing blogs today</p>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Full name</label>
            <input
              type="text"
              placeholder="Arjun Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 transition"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 transition"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 transition"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
           <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
           <div className="flex-1 h-px bg-gray-200" />
          </div>  

        {/* Google Login */}
        <a
          href="http://localhost:5000/api/auth/google"
          className="w-full py-2.5 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
       <img
          src="https://www.google.com/favicon.ico"
          alt="Google"
          className="w-4 h-4"
       />
         Continue with Google
        </a>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;