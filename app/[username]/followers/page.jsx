"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const FollowersList = ({ params }) => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = React.use(params);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        // console.log(username)
        const res = await fetch(`/api/users/${username.username}/followers`);
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
    return (
      <p className="text-gray-500 text-center mt-6">Loading followers...</p>
    );

  if (followers.length === 0)
    return <p className="text-gray-500 text-center mt-6">No followers yet.</p>;

  return (
    <>
        <h2 className="text-white text-center font-semibold text-lg mb-4">Followers</h2>
      <div className=" p-5 mx-auto md:w-3/4  mt-4">
        {console.log(followers)}
        <div className="space-y-3">
          {/* {console.log(followers)} */}
          {followers.map((follower) => (
            <div
              key={follower._id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer bg-gray-900 shadow-md "
            >
              <img
                src={follower.profilePic || "/p2.webp"}
                alt={follower.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <Link href={`/${follower.username}`}>
              <div>
                <p className="text-white font-medium">{follower.name}</p>
                <p className="text-gray-400 text-sm">@{follower.username}</p>
              </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FollowersList;
