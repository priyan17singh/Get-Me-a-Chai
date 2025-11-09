"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: session?.user?.email,
    desc: "",
    razorpayId: "",
    razorpaySecret: "",
    coverPhoto: null,
    profilePic: null,
  });

  const [previews, setPreviews] = useState({
    cover: session?.user?.coverPhoto || null,
    profile: session?.user?.profilePic || null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // --- Create object URLs for live previews ---
  useEffect(() => {
    if (formData.coverPhoto) {
      const url = URL.createObjectURL(formData.coverPhoto);
      setPreviews((p) => ({ ...p, cover: url }));

      // Position profile picture overlapping cover
      setTimeout(() => {
        const coverEl = document.querySelector(".relative.h-48");
        const profileWrapper = document.querySelector(
          ".mb-6.flex.justify-center .relative"
        );
        if (coverEl && profileWrapper) {
          const coverH = coverEl.getBoundingClientRect().height;
          profileWrapper.style.marginTop = `-${Math.round(coverH / 2)}px`;
          profileWrapper.style.zIndex = "10";
        }
      }, 0);
    }

    if (formData.profilePic) {
      const url = URL.createObjectURL(formData.profilePic);
      setPreviews((p) => ({ ...p, profile: url }));
    }

    return () => {
      if (previews.cover) URL.revokeObjectURL(previews.cover);
      if (previews.profile) URL.revokeObjectURL(previews.profile);
    };
  }, [formData.coverPhoto, formData.profilePic]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
    setMessage("");
  };

  const validate = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.desc.trim()) return "Desc is required";
    return null;
  };

  // --- Cloudinary upload helper ---
  const uploadToCloudinary = async (file) => {
    if (!file) return null;
    const data = new FormData();
    data.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });

    if (!res.ok) throw new Error("Upload failed");

    const json = await res.json();
    return json.url;
  };

  // --- Form submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const err = validate();
    if (err) {
      setMessage(err);
      return;
    }

    setLoading(true);
    try {
      // Upload files first
      const coverUrl = formData.coverPhoto
        ? await uploadToCloudinary(formData.coverPhoto)
        : null;
      const profileUrl = formData.profilePic
        ? await uploadToCloudinary(formData.profilePic)
        : null;

      // Prepare payload
      const payload = {
        name: formData.name,
        email: session.user.email,
        desc: formData.desc,
        razorpayId: formData.razorpayId,
        razorpaySecret: formData.razorpaySecret,
        coverPhoto: coverUrl || null,
        profilePic: profileUrl || null,
      };

      // Save profile to DB
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      setMessage("Profile saved successfully");
      router.push(`/${session.user.email.split("@")[0]}`);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto rounded-lg shadow-md p-8"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Dashboard
        </h1>

        {/* Cover Photo */}
        <div className="mb-6">
          <div className="relative h-48 rounded-lg bg-gray-200 overflow-hidden">
            {previews.cover ? (
              <img
                src={previews.cover}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Cover photo
              </div>
            )}
            <label className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-50">
              <span className="text-sm font-medium text-gray-700">
                Change Cover
              </span>
              <input
                type="file"
                name="coverPhoto"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>
        </div>

        {/* Profile Picture */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
              {previews.profile ? (
                <img
                  src={previews.profile}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Avatar
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer hover:bg-gray-50 shadow-md">
              <span className="sr-only">Change Profile Picture</span>
              <input
                type="file"
                name="profilePic"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 text-gray-300">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder={session?.user?.name || "Your name"}
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              aria-required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Caption
            </label>
            <input
              type="text"
              name="desc"
              placeholder="Creating music videos"
              value={formData.desc}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              aria-required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Razorpay ID
            </label>
            <input
              type="text"
              name="razorpayId"
              placeholder="Your razorpayId(optional)"
              value={formData.razorpayId}
              onChange={handleInputChange}
              className="mt-1  block w-full rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Razorpay Secret
            </label>
            <input
              type="password"
              name="razorpaySecret"
              placeholder="Your razorpaySecret(optional)"
              value={formData.razorpaySecret}
              onChange={handleInputChange}
              className="mt-1 border block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {message !== "Profile saved successfully" ? (
            <p className="text-center text-sm text-red-400 mt-2" role="status">
              {message}
            </p>
          ):(
            <p className="text-center text-sm text-green-500 mt-2" role="status">
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Dashboard;
