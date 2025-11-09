import { NextResponse } from "next/server";
import connectDb from "@/db/connectDB";
import User from "@/models/User";

export async function GET(req, { params }) {
  await connectDb();
  const { username } = await params;
   console.log(username)

  const user = await User.findOne({ username }).populate("following", "name username profilePic");
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user.following);
}
