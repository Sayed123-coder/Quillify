import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuth from "../hooks/useAuth";
import ImageUpload from "../components/ImageUpload";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: "",
    avatar: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile");
        const { name, avatar } = response.data.user;
        setProfileData({ name, avatar: avatar || "" });
      } catch (err) {
        toast.error("Failed to load profile",err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async () => {
    if (!profileData.name) {
      setProfileMsg({ type: "error", text: "Name cannot be empty" });
      return;
    }
    setProfileLoading(true);
    setProfileMsg({ type: "", text: "" });
    try {
      const response = await api.put("/profile/update_profile", profileData);
      setProfileMsg({ type: "success", text: "Profile updated successfully" });
      toast.success("Profile updated!");
      // AuthContext mein bhi user update karo
      if (updateUser) updateUser(response.data.user);
    } catch (err) {
      setProfileMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordMsg({ type: "error", text: "Please fill all fields" });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match" });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg({ type: "", text: "" });
    try {
      await api.put("/profile/change_password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordMsg({ type: "success", text: "Password changed successfully" });
      toast.success("Password changed!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to change password",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <div className="w-52 bg-white border-r border-gray-200 flex flex-col py-6 fixed h-full">
        <div className="px-4 mb-6">
          <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-semibold text-indigo-600 mb-2">
            {profileData.name?.charAt(0)}
          </div>
          <p className="text-sm font-semibold text-gray-800">{profileData.name}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>

        <div className="border-t border-gray-100 pt-4 flex flex-col gap-1 px-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => navigate("/blog/create")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            ✏️ Write blog
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            📁 My blogs
          </button>
          <button
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-indigo-600 bg-indigo-50 font-medium"
          >
            👤 Profile
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            🏠 Home
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="ml-52 flex-1 p-6 max-w-2xl">

        <h1 className="text-xl font-semibold text-gray-800 mb-1">Profile</h1>
        <p className="text-sm text-gray-400 mb-8">Manage your account details.</p>

        {/* Profile Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Personal information
          </h2>

          {profileMsg.text && (
            <div className={`text-sm px-4 py-3 rounded-lg mb-4 ${
              profileMsg.type === "success"
                ? "bg-green-50 border border-green-200 text-green-600"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}>
              {profileMsg.text}
            </div>
          )}

          {/* Avatar preview */}
          <div className="flex items-center gap-4 mb-6">
            {profileData.avatar ? (
              <img
                src={profileData.avatar}
                alt="avatar"
                className="w-14 h-14 rounded-full object-cover border border-gray-200"
                onError={(e) => (e.target.style.display = "none")}
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-semibold text-indigo-600">
                {profileData.name?.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-800">{profileData.name}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Full name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 transition"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <input
                type="text"
                value={user?.email}
                disabled
                className="w-full px-4 py-2.5 border border-gray-100 rounded-lg text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
            </div>
            <div>
             <label className="text-sm text-gray-600 mb-1 block">Avatar</label>
            <ImageUpload
                value={profileData.avatar}
                onChange={(url) => setProfileData({ ...profileData, avatar: url })}
               label="Upload avatar"
            />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleProfileSubmit}
              disabled={profileLoading}
              className="text-sm px-5 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
            >
              {profileLoading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Change password
          </h2>

          {passwordMsg.text && (
            <div className={`text-sm px-4 py-3 rounded-lg mb-4 ${
              passwordMsg.type === "success"
                ? "bg-green-50 border border-green-200 text-green-600"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}>
              {passwordMsg.text}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Current password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 transition"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">New password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 transition"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Confirm new password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Re-enter new password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 transition"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handlePasswordSubmit}
              disabled={passwordLoading}
              className="text-sm px-5 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
            >
              {passwordLoading ? "Changing..." : "Change password"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;