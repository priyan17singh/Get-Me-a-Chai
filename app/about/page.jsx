import Link from "next/link";
import { fetchUsers } from "@/actions/userActions";

export const dynamic = "force-dynamic"; // to fetch fresh data

const AboutPage = async () => {
  const users = await fetchUsers(); // fetch top 6 users already sorted by followersCount
  const topUsers = users?.slice(0, 6) || [];
  const firstUser = users[0];

  return (
    <div className="bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] text-white min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-6 md:px-20 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Support creators you love through virtual chai donations.
          </h1>
          <p className="text-gray-300 mb-6">
            We believe in creating a platform where creators can thrive by receiving support from their community in the most Indian way possible - through chai! Show appreciation while helping creators do what they love.
          </p>
          <div className="flex md:justify-around md:px-30 gap-4">
            <Link href="/login">
              <button className="bg-gradient-to-br from-purple-600 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition">
                Become a supporter
              </button>
            </Link>
            <Link href="/creators">
              <button className="bg-gradient-to-br from-purple-600 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition">
                Discover creators
              </button>
            </Link>
          </div>

          <ul className="flex  gap-6 mt-8 text-gray-400">
            <li>
              <strong>Direct support:</strong> Pay creators directly and unlock exclusive content.
            </li>
            <li>
              <strong>Flexible tiers:</strong> Create membership levels for every fan.
            </li>
            <li>
              <strong>Creator-first tools:</strong> Analytics, posts, and rewards to grow sustainably.
            </li>
          </ul>
        </div>

        {/* Hero card mock */}
        {/* {let u = users} */}
        <div className="flex-1 max-w-md bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="relative w-full h-40 bg-gradient-to-br  from-yellow-200 to-pink-300 rounded-xl mb-4"><img src={firstUser.coverPhoto || "ci-7.jpg"} className="object-cover object-center w-full h-full rounded-xl" alt="" /></div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full  bg-gradient-to-br from-pink-400 to-orange-500">
              <img src={firstUser.profilePic || "p2.webp"} alt="" className="rounded-full w-full h-full object-cover object-center"/>
              </div>
            <div>
              <div className="font-bold text-white">{firstUser.name}</div>
              <div className="text-gray-400 text-sm">{firstUser.desc} • {firstUser.followersCount} supporters</div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-1">Sketchbook: Behind the scenes</h4>
            <p className="text-gray-300 text-sm mb-2">
              Monthly sketch walkthrough and high-res downloads for supporters.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">From ₹149 / month</span>
              <Link href={`/${firstUser.username}`}>
              <button className="px-3 py-1 bg-blue-600 rounded-lg text-white text-sm">Join</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 md:px-20">
        <h2 className="text-3xl font-bold mb-8">Why creators choose us</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-2xl mb-2">💬</div>
            <h3 className="font-semibold mb-2">Direct relationship</h3>
            <p className="text-gray-300">Communicate directly with your most engaged fans and build lasting connections.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-2xl mb-2">💸</div>
            <h3 className="font-semibold mb-2">Predictable income</h3>
            <p className="text-gray-300">Recurring memberships help creators focus on their work without worrying about funding.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="font-semibold mb-2">Easy tools</h3>
            <p className="text-gray-300">Publish posts, manage tiers, and access analytics — all in one place.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-2xl mb-2">🌍</div>
            <h3 className="font-semibold mb-2">Global audience</h3>
            <p className="text-gray-300">Reach supporters around the world with local currencies and seamless onboarding.</p>
          </div>
        </div>
      </section>

      {/* Top creators */}
      <section className="py-16 px-6 md:px-20">
        <h2 className="text-3xl font-bold mb-8">Featured creators</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {topUsers.map((u, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col justify-between">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-orange-500"><img src={u.profilePic} alt="" className="w-full h-full object-cover"/>{console.log(u.profilePic)}
                </div>
                <div>
                  <div className="font-bold text-white">{u.username}</div>
                  <div className="text-gray-400 text-sm">{u.desc || "Creator"} · {u.followersCount} followers</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">{u.desc || "Exclusive content for supporters."}</p>
              <div className="flex gap-2 justify-end">
                <Link href={`/${u.username}`}>
                  <button className="px-3 py-1 text-sm rounded-lg border border-gray-600">View</button>
                </Link>
                <Link href={`/${u.username}`}>
                  <button className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white">Support</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 text-gray-400 py-12 px-6 md:px-20">
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
          <div>
            <strong className="text-white text-xl">Get Me A Chai</strong>
            <p>Helping creators build sustainable income.</p>
          </div>
          <div className="flex gap-12 flex-wrap">
            <div>
              <h4 className="text-white font-semibold mb-2">Product</h4>
              <ul className="space-y-1">
                <li><Link href="#">Features</Link></li>
                <li><Link href="#">Pricing</Link></li>
                <li><Link href="#">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Company</h4>
              <ul className="space-y-1">
                <li><Link href="#">About</Link></li>
                <li><Link href="#">Careers</Link></li>
                <li><Link href="#">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Support</h4>
              <ul className="space-y-1">
                <li><Link href="#">Help center</Link></li>
                <li><Link href="#">Contact</Link></li>
                <li><Link href="#">Status</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex  items-end justify-end text-sm text-gray-500">
          {/* <span>©  Get Me A Chai — Built for creators</span> */}
          <div className="flex gap-3">
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="YouTube">▶️</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
