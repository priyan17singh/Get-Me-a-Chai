import { NextResponse } from "next/server";
import connectDb from "@/db/connectDB";
import Post from "@/models/Post";
import User from "@/models/User";

export async function GET(req) {
  await connectDb();

  try {
    // Get the 'username' query parameter from the request URL
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    // console.log(`11${username}`)
    // Fetch posts
    let posts;
    if (username) {
      posts = await Post.find({ user: username }).sort({ createdAt: -1 });
    } else {
      posts = await Post.find().sort({ createdAt: -1 });
    }

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const body = await req.json();
  await connectDb();

  try {
    const newPost = await Post.create({
      user: body.user, // ✅ user passed from frontend
      title: body.title,
      caption: body.caption,
      mediaUrl: body.mediaUrl,
      mediaType: body.mediaType,
    });

    await User.findOneAndUpdate(
      { username: body.user },
      { $inc: { post_count: 1 } },
      { new: true }
    );

    return NextResponse.json(newPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
