import { useState } from "react";
import api from "../services/api";
import AuthContext from "./AuthContext.js";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      if (token && savedUser) {
        return JSON.parse(savedUser);
      }
      return null;
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
  setLoading(true);
  try {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    setUser(response.data.user);
    return response.data.user; 
  } finally {
    setLoading(false);
  }
};

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ← naya function
  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;