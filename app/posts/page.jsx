import PostCard from "./components/PostCard";

export default async function PostsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts`, {
    cache: "no-store",
  });
  const posts = await res.json();

  return (
    <div className="md:max-w-[40%] max-w-[80%] mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">All Posts</h1>
      <div className="space-y-6">
        {posts.map((post, index) => {
          // console.log(post.title); // or post.user, etc.
          return <PostCard key={index} post={post} />;
        })}
      </div>
    </div>
  );
}
