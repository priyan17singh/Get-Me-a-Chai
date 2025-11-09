"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const FollowingList = ({ params }) => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = React.use(params);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const res = await fetch(`/api/users/${username.username}/following`);
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
    return (
      <p className="text-gray-500 text-center mt-6">Loading following...</p>
    );

  if (following.length === 0)
    return (
      <p className="text-gray-500 text-center mt-6">
        Not following anyone yet.
      </p>
    );

  return (
    <>
      <h2 className="text-white font-semibold text-lg text-center  my-4">
        Following
      </h2>
      <div className=" p-5 mx-auto md:w-3/4  mt-4">
        <div className="space-y-3">
          {following.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer bg-gray-900 shadow-md"
            >
              <img
                src={user.profilePic || "/p2.webp"}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <Link href={`/${user.username}`}>
              <div>
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-gray-400 text-sm">@{user.username}</p>
              </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default FollowingList;
