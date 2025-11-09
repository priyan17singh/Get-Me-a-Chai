"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
const ShowActivities = ({ activities }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {/* Button to open modal */}
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        type="button"
        className="bottom relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-lg font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white dark:text-white"
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
          Show Activities
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed bg-gray-900/70 inset-0 z-50 flex items-center justify-center text-left overflow-x-scroll text-white ">
          <div className="bg-gray-900/80 border-gray-500 border w-11/12 min-h-[60%] md:w-2/3 max-h-[80vh] rounded-lg shadow-lg overflow-y-auto relative">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-4 text-red-400 hover:text-red-300 text-xl font-bold"
            >
              x
            </button>

            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Supporters</h2>
              {activities.map((a, i) => (
                <li
                  key={i}
                  className=" space-x-3 flex items-center mb-3 border-b pb-2"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      a.type === "follow"
                        ? "bg-indigo-500"
                        : a.type === "donation"
                        ? "bg-emerald-500"
                        : "bg-pink-500"
                    }`}
                  >
                    {a.type === "follow"
                      ? "👤"
                      : a.type === "donation"
                      ? "💰"
                      : "📝"}
                  </div>
                  <div>
                    <p className="text-sm">{a.message}</p>
                    <span className="text-xs text-gray-400">{a.time}</span>
                  </div>
                </li>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowActivities;
