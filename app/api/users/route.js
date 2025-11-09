import { NextResponse } from "next/server";
import connectDb from "@/db/connectDB";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDb();

    // Fetch all users but exclude sensitive info (like razorpaySecret)
    const users = await User.find({}, "name username profilePic email").sort({ name: 1 });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
