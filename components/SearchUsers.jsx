"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const SearchUser = ({ showAllInitially = false }) => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
      setFiltered(showAllInitially ? data : []); // 👈 Show all only if prop true
    };
    fetchUsers();
  }, [showAllInitially]);

  useEffect(() => {
    const q = query.toLowerCase();

    if (q.length === 0) {
      setFiltered(showAllInitially ? users : []); // 👈 Hide or show all based on prop
    } else {
      setFiltered(
        users.filter(
          (u) =>
            u.name?.toLowerCase().includes(q) ||
            u.username?.toLowerCase().includes(q)
        )
      );
    }
  }, [query, users, showAllInitially]);

  return (
    <div className="p-5 mx-auto md:min-w-xl max-w-4xl  mt-4">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 rounded-md bg-gray-900 text-white border border-gray-700 outline-none focus:ring-2 focus:ring-cyan-700"
      />

      <div className="space-y-3 mt-4 max-h-60 overflow-y-auto">
        {filtered.length > 0 ? (
          filtered.map((user) => (
            <Link
              href={`/${user.username}`}
              key={user._id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition"
            >
              <img
                src={user.profilePic || "/p2.webp"}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-gray-400 text-sm">@{user.username}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center">
            {query.length > 0
              ? "No users found."
              : showAllInitially
              ? "No users yet."
              : "Start typing to search for users."}
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchUser;
