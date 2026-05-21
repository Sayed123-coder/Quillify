import User from "../models/User.js";
import bcrypt from "bcryptjs";


export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true }
    ).select("-password");

    return res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide both passwords" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    
    const user = await User.findById(req.user._id);

    
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};