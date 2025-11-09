import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import connectDb from "@/db/connectDB";
import User from "@/models/User";
import LinkedInProvider from "next-auth/providers/linkedin";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    // ✅ GitHub login
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // ✅ LinkedIn login (OpenID Connect style)

    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      issuer: "https://www.linkedin.com/oauth", // 👈 From your JSON
      jwks_uri: "https://www.linkedin.com/oauth/openid/jwks",
      wellKnown:
        "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      authorization: {
        url: "https://www.linkedin.com/oauth/v2/authorization",
        params: { scope: "openid profile email" },
      },
      token: {
        url: "https://www.linkedin.com/oauth/v2/accessToken",
      },
      userinfo: {
        url: "https://api.linkedin.com/v2/userinfo",
      },
      profile(profile) {
        return {
          id: profile.sub, // ✅ Map `sub` to `id`
          name:
            profile.name ||
            `${profile.given_name || ""} ${profile.family_name || ""}`.trim(),
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // 🧠 When a user signs in
    async signIn({ user, account, profile, email, credentials }) {
      console.log("🧠 [NextAuth signIn triggered]");
      console.log("👉 provider:", account?.provider);
      console.log("👉 user:", user);

      try {
        await connectDb();
        console.log("⚙️ Connected to MongoDB");

        const existingUser = await User.findOne({ email: user.email });
        console.log("🔍 Existing user:", existingUser);

        if (!existingUser) {
          const newUser = new User({
            email: user.email,
            username: user.email?.split("@")[0] || "user",
          });
          await newUser.save();
          console.log("✅ New user saved:", newUser);
        } else {
          console.log("ℹ️ User already exists:", existingUser.email);
        }

        return true;
      } catch (error) {
        console.error("❌ Error during signIn:", error);
        return false;
      }
    },

    // 🧩 When a session is created
    async session({ session }) {
      await connectDb();
      const dbUser = await User.findOne({ email: session.user.email });

      if (dbUser) {
        session.user.name = dbUser.name || dbUser.userName;
        session.user.id = dbUser._id
        session.user.desc = dbUser.desc
        session.user.profilePic = dbUser.profilePic || session?.user?.image;
        session.user.coverPhoto = dbUser.coverPhoto || "/ci-7.jpg";
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
