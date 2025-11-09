import { NextResponse } from "next/server";
import connectDb from "@/db/connectDB";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDb();

    const { currentUserEmail, targetUsername } = await req.json();

    if (!currentUserEmail || !targetUsername) {
      return NextResponse.json(
        { error: "Missing currentUserEmail or targetUsername" },
        { status: 400 }
      );
    }

    // Find users
    const currentUser = await User.findOne({ email: currentUserEmail });
    const targetUser = await User.findOne({ username: targetUsername });

    if (!currentUser || !targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentUserId = currentUser._id.toString();
    const targetUserId = targetUser._id.toString();

    const isAlreadyFollowing = currentUser.following
      .map((id) => id.toString())
      .includes(targetUserId);

    if (isAlreadyFollowing) {
      // Unfollow
      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUser._id);
    } else {
      // Follow
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    // Return updated followers array (as strings)
    const updatedTargetUser = await User.findById(targetUser._id).select(
      "followers following username email"
    );

    return NextResponse.json({
      success: true,
      action: isAlreadyFollowing ? "unfollowed" : "followed",
      followers: updatedTargetUser.followers.map((id) => id.toString()),
      followingCount: updatedTargetUser.following.length,
      followersCount: updatedTargetUser.followers.length,
    });
  } catch (err) {
    console.error("Follow API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
