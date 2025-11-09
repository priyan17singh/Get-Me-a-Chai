import { NextResponse } from "next/server";
import connectDb from "@/db/connectDB"; // your DB connection
import User from "@/models/User"; // your User model

export async function POST(req) {
  try {
    await connectDb();

    const data = await req.json();

    const {
      name,
      email,
      desc,
      razorpayId,
      razorpaySecret,
      coverPhoto,
      profilePic,
    } = data;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find existing user
    const user = await User.findOneAndUpdate(
      { email },
      {
        name,
        desc,
        razorpayId,
        razorpaySecret,
        profilePic,
        coverPhoto,
      },
      { new: true, upsert: true }
    );

    await user.save();

    return NextResponse.json(
      { message: "Profile saved successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error saving profile:", error);
    return NextResponse.json(
      { error: "Failed to save profile", details: error.message },
      { status: 500 }
    );
  }
}
