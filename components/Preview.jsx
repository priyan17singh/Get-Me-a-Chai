"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
const ScrollableModal = ({ payments }) => {
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
          Preview
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed overflow-x-scroll bg-gray-900/70 inset-0 z-50 flex items-center justify-center text-white ">
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
              {payments && payments.length > 0 ? (
                <ul>
                  {payments
                    .filter((p) => p.status === "completed")
                    .map((p, idx) => (
                      <li
                        key={idx}
                        className="flex items-center mb-3 border-b pb-2"
                      >
                        <img
                          src="avatar.gif"
                          alt="0"
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div className="mb-2">
                          <p className="mb-1">
                            {p.from} donated{" "}
                            <span className="font-bold">₹{p.amount}</span>
                          </p>
                          <p className="text-gray-400 text-sm">
                            Message: {p.message || "No message"}
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-gray-600">No completed payments yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScrollableModal;
