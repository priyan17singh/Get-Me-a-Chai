"use server";
import Razorpay from "razorpay";
import Payment from "@/models/Payment"; // ✅ must be models (plural)
import connectDb from "@/db/connectDB";
import User from "@/models/User";
import Post from "@/models/Post";

export const initiate = async (amount, paymentform) => {
  await connectDb();

  try {
    // ✅ Create Razorpay instance
    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_KEY_ID, // public key
      key_secret: process.env.KEY_SECRET, // private secret key
    });

    // ✅ Create order options
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: "order_" + Math.random().toString(36).substring(7),
    };

    // ✅ Wait for Razorpay order creation
    const order = await instance.orders.create(options);
    console.log(paymentform);
    // ✅ Save payment info to DB
    await Payment.create({
      oid: order.id, // order.id returned from Razorpay
      amount: amount,
      from: paymentform.name || "Anonymous", // fallback if missing
      to: paymentform.to_username,
      status: "pending",
      message: paymentform.message || "",
    });

    return { success: true, order };
  } catch (err) {
    console.error("❌ Error in initiate:", err);
    return { success: false, error: err.message };
  }
};

export const fetchUser = async (username) => {
  try {
    await connectDb();

    const user = await User.findOne({ username:username }).lean();
    if (!user) return null;

    // ✅ Convert any MongoDB ObjectIds, Dates, etc. to plain strings
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
};

export const fetchUsers = async () => {
  try {
    await connectDb();

    const users = await User.aggregate([
      {
        $addFields: { followersCount: { $size: "$followers" } }
      },
      { $sort: { followersCount: -1 } },
      { $limit: 6 }
    ]);

    if (!users || users.length === 0) return null;

    // Convert to plain JS objects
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

export const fetchPayment = async (username) => {
  try {
    await connectDb();

    const payment = await Payment.find({ to: username })
      .sort({ amount: -1 })
      .lean();

    // ✅ Convert to pure JSON object
    // console.log(payment)
    return payment ? JSON.parse(JSON.stringify(payment)) : null;
  } catch (error) {
    console.error("Error fetching payment:", error);
    throw new Error("Failed to fetch payment");
  }
};


export const fetchRecentActivity = async (email) => {
  try {
    await connectDb();

    const user = await User.findOne({ email });
    
    if (!user) return [];
    
   let un = email.split("@")[0]
   
    // 🧩 1. Recent followers
    const followers = await User.find({ following: user._id })
      // .limit(1)
      .select("username")
      .lean();

    // 🧩 2. Recent donations received
    const donations = await Payment.find({ from: un, done: true })
      .sort({ createdAt: -1 })
      // .limit(3)
      .lean();

    // 🧩 3. Recent posts
    const posts = await Post.find({ user: un })
      .sort({ createdAt: -1 })
      // .limit(3)
      .lean();

    // Merge all into one list
    const activities = [];

    followers.forEach((f) =>
      activities.push({
        type: "follow",
        message: `@${f.username} just followed you`,
        time: "recently",
      })
    );

    donations.forEach((d) =>
      activities.push({
        type: "donation",
        message: `Donated ₹${d.amount} to @${d.to}`,
        time: new Date(d.createdAt).toLocaleString(),
      })
    );

    posts.forEach((p) =>
      activities.push({
        type: "post",
        message: `You posted: "${p.title}"`,
        time: new Date(p.createdAt).toLocaleString(),
      })
    );

    // Sort by recency (newest first)
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    // console.log(activities)
    return activities;
  } catch (error) {
    console.error("Error fetching activity:", error);
    return [];
  }
};


