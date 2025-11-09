import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true },
    desc: String,
    post_count: { type: Number, default: 0 },
    razorpayId: String,
    razorpaySecret: String,
    coverPhoto: { type: String, default: "ci-7.jpg" },
    profilePic: { type: String, default: "p2.webp" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
