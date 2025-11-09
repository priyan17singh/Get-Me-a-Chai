import React from "react";
import Link from "next/link";
import PostCard from "../components/PostCard";
const page = async ({ params }) => {
  const { username } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/posts?username=${username}`,
    {
      cache: "no-store",
    }
  );
  const posts = await res.json();
  if (posts.length === 0)
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 h-full mt-5 my-auto text-gray-400">
        No posts yet.
      </div>
    );

  return (
    <>
      <div className="md:max-w-[40%] max-w-[80%] mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">All Posts</h1>
        <div className="space-y-6">
          {/* {console.log(posts)} */}
          {posts.map((post, index) => {
            // console.log(post.title); // or post.user, etc.
            return <PostCard key={index} post={post} />;
          })}
        </div>
      </div>
      <div className=" w-screen mb-2 flex justify-center">
        <Link href={"/posts"}>
          <button
            type="button"
            className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium hover:text-gray-400"
          >
            See all posts
            <svg
              className="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </Link>
      </div>
    </>
  );
};

export default page;
