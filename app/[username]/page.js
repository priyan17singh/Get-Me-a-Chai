"use client";
import Link from "next/link";
import PageNotFound from "../not-found";
import { useSession } from "next-auth/react";
import NoPreview from "@/components/NoPreview";
import SearchUser from "@/components/SearchUsers";
import PaymentPage from "@/components/PaymentPage";
import React, { useState, useEffect } from "react";
import ScrollableModal from "@/components/Preview";

import RecentActivity from "@/components/RecentActivity";
import { fetchPayment, fetchUser } from "@/actions/userActions";

const Username = ({ params }) => {
  const { data: session, status } = useSession();
  const { username } = React.use(params);

  const [currUser, setCurrUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user & payments
  const getData = async () => {
    const userData = await fetchUser(username);
    setLoading(false);
    if (!userData) return setCurrUser(null);
    setCurrUser(userData);
    const dbPayments = await fetchPayment(username);
    setPayments(dbPayments);
  };

  // Handle follow/unfollow
  const handleFollow = async () => {
    if (!session) return alert("Please log in first");

    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUserEmail: session.user.email,
          targetUsername: username,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Update currUser followers & counts
        setCurrUser((prev) => ({
          ...prev,
          followers: data.followers,
          followersCount: data.followersCount,
          followingCount: data.followingCount,
        }));

        // Update isFollowing state
        setIsFollowing(data.followers.some((id) => id === session.user._id));
      }
    } catch (err) {
      console.error("Follow API error:", err);
    }
  };

  // Initial load
  useEffect(() => {
    if (username) getData();
  }, [username]);

  // Set initial isFollowing state
  useEffect(() => {
    if (currUser && session) {
      const sessionUserId = session.user.id || session.user._id; // ensure you have _id in session
      setIsFollowing(
        currUser.followers.some(
          (followerId) => followerId.toString() === sessionUserId.toString()
        )
      );
    }
  }, [currUser, session]);

  if (loading)
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center text-gray-300">
        Loading user...
      </div>
    );
  if (!currUser) return <PageNotFound />;
  if (!session) return <PageNotFound />;

  return (
    <>
      {/* Cover */}
      <div className="cover md:h-[40vh] h-[25vh] w-full relative flex flex-col bg-red-50">
        <img
          src={currUser.coverPhoto || "/ci-7.jpg"}
          alt={`${username}'s cover image`}
          className="w-full h-full object-cover object-center"
        />
        <div className="profile-pic">
          <img
            src={currUser.profilePic || "/p2.webp"}
            alt={`${username} profile pic`}
            className="absolute bottom-[-8vh] md:bottom-[-10vh] left-1/2 transform -translate-x-1/2 rounded-full border-2 border-white w-[16vh] h-[16vh] md:w-[20vh] md:h-[20vh] shadow-lg object-center object-cover"
          />
        </div>
      </div>

      {/* Info */}
      <div className="info text-center mb-4 w-full md:mt-[11vh] mt-[9vh] text-xl flex flex-col font-mono">
        <div className="username font-bold text-xl">@{username}</div>
        <div className="abo text-slate-400">{currUser.desc}</div>
        <div className="followers text-slate-400 mt-1">
          <Link href={`/${username}/followers`}>
          {currUser.followers.length} members 
          </Link>
          • {currUser.post_count}{" "}
          <Link href={`posts/${username}/`}>posts </Link>•{" "}
          <Link href={`/${username}/following`}>
          {currUser.following.length} following
          </Link>
        </div>
        <SearchUser showAllInitially={false} />

        {/* Follow Button */}
        {session?.user?.email !== currUser.email && (
          <div className="follow-button mt-3">
            <button
              onClick={handleFollow}
              className={`px-4 py-2 rounded-lg font-semibold ${
                isFollowing
                  ? "bg-gray-200 text-black"
                  : "bg-blue-600 text-white"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        )}

        {/* Supporters & Payments */}
        <div className="donation&supporters md:flex w-[80%] gap-3 mt-14 mx-auto">
          <div className="flex flex-col supporters md:w-1/2 mb-2  bg-cyan-900 rounded-lg px-2 py-5">
            <h2 className="text-2xl font-bold mb-3  text-white">Supporters</h2>
            <div className="bg-white/10 backdrop-blur-md h-[70%] rounded-xl p-6 mb-2">
              <ul>
                {payments.length > 0 ? (
                  payments
                    .filter((p) => p.status === "completed")
                    .slice(0, 4)
                    .map((item, index) => (
                      <li
                        key={index}
                        className="flex justify-center my-2 items-center text-white"
                      >
                        <img
                          src="avatar.gif"
                          width={36}
                          alt="user avatar"
                          className="mr-2"
                        />
                        <div>
                          {item.from} donated{" "}
                          <span className="font-bold">₹{item.amount}</span> with
                          message "<b>{item.message || "No message"}</b>"
                        </div>
                      </li>
                    ))
                ) : (
                  <div className="text-white text-center">
                    <p>No supporters yet. Be the first one!</p>
                    <img
                      src="https://media.tenor.com/hDQbEt368GcAAAAj/game.gif"
                      alt="Gareebo ko daan dena chaiyae!"
                      className="mx-auto"
                    />
                  </div>
                )}
              </ul>
            </div>
            {session.user.email.split("@")[0] == username &&
              payments.length > 0 && (
                <div className=" mx-auto mt-auto    ">
                  <ScrollableModal payments={payments} />
                </div>
              )}
            {session.user.email.split("@")[0] !== username &&
              payments.length > 0 && (
                <div className=" mx-auto mt-auto ">
                  <NoPreview />
                </div>
              )}
          </div>

          <PaymentPage username={username} />
          {session.user.email.split("@")[0] == username && (
            <div className="recentActivity flex flex-col  md:w-1/2 mb-2  bg-cyan-900 rounded-lg px-2 py-5 ">
              <RecentActivity userEmail={session?.user?.email} />
            </div>
          )}
        </div>
      </div>
      {session?.user?.email === currUser.email && (
        <div className="w-full  h-14 flex justify-center items-center ">
          <p>Add</p>
          <Link href={"/posts/create/"}>
            <button className="cursor-pointer">
              <img className="w-12 h-full mx-auto" src="/plus2.gif" alt="" />
            </button>
          </Link>
          <p>Post</p>
        </div>
      )}
    </>
  );
};

export default Username;
