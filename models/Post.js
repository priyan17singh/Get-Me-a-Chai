import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    title: { type: String,required: true },
    caption: { type: String },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], required: true },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", postSchema);


