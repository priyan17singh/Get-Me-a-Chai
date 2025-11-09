"use client";

import ShowActivities from "./ShowActivity";
import React, { useEffect, useState } from "react";
import { fetchRecentActivity } from "@/actions/userActions";

export default function RecentActivity({ userEmail }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchRecentActivity(userEmail);
        setActivities(data);
      } catch (err) {
        console.error("Error fetching activity:", err);
      } finally {
        setLoading(false);
      }
    }
    if (userEmail) loadData();
  }, [userEmail]);

  if (loading)
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center text-gray-300">
        Loading recent activity...
      </div>
    );

  if (activities.length === 0)
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 my-auto text-gray-400">
        No recent activity yet.
      </div>
    );
      const filteredActivities = activities.filter((a, index, self) => {
  // Keep only the first follow activity
  if (a.type === "follow") {
    const firstFollowIndex = self.findIndex(item => item.type === "follow");
    return index === firstFollowIndex;
  }
  return true; // Keep all other activity types
});

  return (
    <div className="">
      <h3 className="text-2xl font-semibold mb-4 ">Recent Activity</h3>
      <ul className=" bg-white/10 backdrop-blur-lg p-6 rounded-2xl  text-white shadow-lg space-y-4 text-left mb-3">
        {filteredActivities.slice(0, 4).map((a, i) => (
          <li key={i} className="flex items-start space-x-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                a.type === "follow"
                  ? "bg-indigo-500"
                  : a.type === "donation"
                  ? "bg-emerald-500"
                  : "bg-pink-500"
              }`}
            >
              {a.type === "follow" ? "👤" : a.type === "donation" ? "💰" : "📝"}
            </div>
            <div>
              <p className="text-sm">{a.message}</p>
              <span className="text-xs text-gray-400">{a.time}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-auto bottom-0 mx-auto">
        {activities.length && <ShowActivities activities={activities} />}
      </div>
    </div>
  );
}
