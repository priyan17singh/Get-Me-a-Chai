
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";


export default function CreatePostBox() {
  const { data: session } = useSession();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image or video.");

    setLoading(true);
    try {
      // Upload file to Cloudinary or local API
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const { url, type } = await uploadRes.json();

      // Save post in DB
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: session?.user?.email.split("@")[0],
          title,
          caption,
          mediaUrl: url,
          mediaType: type,
        }),
      });

      setTitle("");
      setCaption("");
      setFile(null);
      setPreviewUrl(null);
      // alert("✅ Post created successfully!");
      // router.push(`/${session?.user?.email.split("@")[0]}`)

      await new Promise((res) => setTimeout(res, 1200));

      // Show success modal
      setShowSuccess(true);

      // Hide modal and redirect after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        router.push(`/${session?.user?.email.split("@")[0]}`);
      }, 2000);

    } catch (error) {
      console.error("Error creating post:", error);
      alert("❌ Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null; // Hide if user not logged in

  return (
    <>
    <div className="min-h-[80%] p-2">

    <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-5 border border-gray-200 dark:border-gray-700 md:mt-[10%] md:mx-auto mt-[50%] ">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={session?.user?.image || "/p2.webp"}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
          Create a Post
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-2 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-2 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows="3"
        />

        {previewUrl && (
          <div className="mt-3">
            {file.type.startsWith("image/") ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="rounded-lg max-h-60 object-cover border border-gray-300"
              />
            ) : (
              <video
                src={previewUrl}
                controls
                className="rounded-lg max-h-60 border border-gray-300"
                />
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="cursor-pointer flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700">
            📎 Upload
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
              />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
    </div>
    <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1a1a1a] rounded-2xl p-8 flex flex-col items-center justify-center text-center w-[320px]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 rounded-full p-[3px]">
                <div className="bg-[#1a1a1a] rounded-full p-4 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="url(#grad)"
                    strokeWidth="2.5"
                    className="w-12 h-12"
                  >
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-white text-lg font-medium mt-4">
                Your post has been shared.
              </h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
            </>
  );
}
