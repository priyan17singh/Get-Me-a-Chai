"use client";
import React, { useEffect, useState } from "react";

export default function FollowingList({ username }) {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const res = await fetch(`/api/users/${username}/following`);
        const data = await res.json();
        setFollowing(data);
      } catch (err) {
        console.error("Error fetching following:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowing();
  }, [username]);

  if (loading)
    return <p className="text-gray-500 text-center mt-6">Loading following...</p>;

  if (following.length === 0)
    return <p className="text-gray-500 text-center mt-6">Not following anyone yet.</p>;

  return (
    <div className="bg-gray-900 rounded-2xl p-5 shadow-md mt-4">
      <h2 className="text-white font-semibold text-lg mb-4">Following</h2>
      <div className="space-y-3">
        {following.map((user) => (
          <div
            key={user._id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
          >
            <img
              src={user.profilePic || "/p2.webp"}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-white font-medium">{user.name}</p>
              <p className="text-gray-400 text-sm">@{user.username}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
