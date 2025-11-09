"use client";
import React, { useEffect, useState } from "react";

export default function FollowersList({ username }) {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await fetch(`/api/users/${username}/followers`);
        const data = await res.json();
        setFollowers(data);
      } catch (err) {
        console.error("Error fetching followers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowers();
  }, [username]);

  if (loading)
    return <p className="text-gray-500 text-center mt-6">Loading followers...</p>;

  if (followers.length === 0)
    return <p className="text-gray-500 text-center mt-6">No followers yet.</p>;

  return (
    <div className="bg-gray-900 rounded-2xl p-5 shadow-md mt-4">
      <h2 className="text-white font-semibold text-lg mb-4">Followers</h2>
      <div className="space-y-3">
        {followers.map((follower) => (
          <div
            key={follower._id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
          >
            <img
              src={follower.profilePic || "/p2.webp"}
              alt={follower.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-white font-medium">{follower.name}</p>
              <p className="text-gray-400 text-sm">@{follower.username}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
