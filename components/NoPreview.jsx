"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
const NoPreview = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Button to open modal */}
      <button
                  onClick={()=>{setIsOpen(true)}}
                  type="button"
                  className="bottom relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-lg font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white dark:text-white"
                >
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                    Preview
                  </span>
                 </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed bg-gray-900/90 inset-0 z-50 flex items-center justify-center text-white ">
          <div className="bg-gray-900/70 border-gray-500 border min-h-[40%]  max-h-[75%] rounded-lg shadow-lg overflow-y-auto relative">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-4 text-red-400 hover:text-red-300 text-xl font-bold"
            >
              x
            </button>

            <div className="p-4 flex flex-col md:mt-5 mt-3">
              <h2 className="text-2xl font-bold mb-4">Dusaro ke pasio per aakh nahi marte hai!</h2>
              <img src="https://media1.tenor.com/m/i2okHEYP5EUAAAAd/no-bubu.gif" alt="Bhag yaha se!"  className="max-h-[60vh] object-cover"  />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NoPreview;
