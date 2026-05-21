import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import passport from "./config/passport.js"; 
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config({ path: "./.env" });

const app = express();

connectDB();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(passport.initialize()); 

app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});