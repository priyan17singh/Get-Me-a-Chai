import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <div className="border rounded-xl  shadow-sm p-3">
      <Link href={`/${post.user}`}>
        <p className="font-bold text-blue-600">@{post.user}</p>
      </Link>
      <div className="flex break-words w-full">
        <div className="w-[60%]">
          {post.title && (
            <p className="my-3">
              <b>Title: </b>"{post.title}"
            </p>
          )}

          {post.caption && <p className="mt-2">{post.caption}</p>}
          <p className="text-xs text-gray-500 mt-1">
          {new Date(post.createdAt).toLocaleString()}
        </p>
        </div>
        <div className="w-[40%] object-cover">
          {post.mediaType === "image" ? (
            <img
              src={post.mediaUrl}
              alt={post.caption}
              className="rounded-lg p-3 "
            />
          ) : (
            <video src={post.mediaUrl} controls className="rounded-lg mt-2" />
          )}
        </div>
        
      </div>
    </div>
  );
}
