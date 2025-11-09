"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const [showDropDown, setShowDropDown] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between py-2 md:px-4 h-16 bg-gray-900 text-white items-center">
      {/* Logo */}
      <div className="font-bold text-lg flex justify-center items-center gap-1">
        <img src="/tea.gif" className="invert-25" width={40} alt="logo" />
        <Link href="/">Get Me a Chai</Link>
      </div>

      {/* Buttons Section */}
      <div className="relative">
        {session ? (
          <>
            {/* Dropdown Button */}
            <button
              id="dropdownDefaultButton"
              onBlur={() => {setTimeout(() => setShowDropDown(false), 300)}}
              onClick={() => {setShowDropDown(!showDropDown)}}
              className="text-white mr-2 border border-gray-600 bg-gray-800 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-800 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center dark:bg-gray-800 dark:hover:bg-cyan-950 dark:focus:ring-gray-900"
            >
              {session.user.email}
              <svg
                className="w-2.5 h-2.5 ms-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute left-9 z-10 ${
                showDropDown ? "" : "hidden"
              } bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700`}
            >
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => setShowDropDown(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${session.user.email.split("@")[0]}`}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => setShowDropDown(false)}
                  >
                    Your Page
                  </Link>
                </li>
                <li>
                  <Link
                    href="/posts"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => setShowDropDown(false)}
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>

            {/* Optional Logout Button */}
           <button
              onClick={() => signOut()}
              type="button"
              className="hidden md:inline-block py-2 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              LogOut
            </button>
          </>
        ) : (
          <>
            {/* <Link href="/signUp">
              <button className="py-2 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                SignUp
              </button>
            </Link> */}

            <Link href="/login">
              <button className="py-2 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                SignUp
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
