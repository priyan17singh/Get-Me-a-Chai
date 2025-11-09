"use client";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { initiate } from "@/actions/userActions";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const PaymentPage = ({ username }) => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [showGif, setShowGif] = useState(false);
  const [paymentform, setpaymentform] = useState({});
 

 useEffect(() => {
    const paymentDone = searchParams.get("paymentdone");
    if (paymentDone === "true") {
      setShowGif(true);
      const timer = setTimeout(() => setShowGif(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);
  
  // console.log(currUser)

  const handleChange = (e) => {
    setpaymentform({
      ...paymentform,
      name: session.user.email.split("@")[0],
      [e.target.name]: e.target.value,
      to_username: username,
    });
    // console.log(paymentform);
    // console.log(`${session.user.name}laa`)
  };

  const pay = async (amount) => {
    // console.log(paymentform);
    try {
      if (amount === null || amount <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      const a = await initiate(amount, paymentform);
      let orderId = a.order.id;

      const options = {
        key: process.env.NEXT_PUBLIC_KEY_ID, // ✅ client-safe env var
        amount: amount * 100,
        currency: "INR",
        name: "Chai acchi hai !!",
        description: "Acchi chai ke naam...",
        image: `${process.env.NEXT_PUBLIC_URL}/tea.gif`,
        order_id: orderId,
        callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay/`,
        prefill: {
          name: session?.user?.name || "Guest User",
          email: session?.user?.email || "guest@example.com",
          contact: "+919876543210",
        },
        notes: { address: "Khufia Rustum Chai-khana Office" },
        theme: { color: "#3399cc" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error("Payment error:", err);
    }

  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
{session?.user?.email.split("@")[0] !== username && (
            <>
              {/* {console.log("helo")} */}
              <div className="makePayment md:w-1/2 mb-2 bg-cyan-900 rounded-lg py-5">
                  <h2 className="text-2xl font-bold mb-3">Make a payment</h2>
                <form className="px-4" onSubmit={(e) => e.preventDefault()}>

                  <label
                    htmlFor="amount"
                    className="block text-sm mb-1 text-white"
                  >
                    Amount (₹)
                  </label>
                  <input
                    id="amount"
                    min="1"
                    onChange={handleChange}
                    value={paymentform.amount || ""}
                    name="amount"
                    type="number"
                    placeholder="Enter amount"
                    // defaultValue={5}
                    className="w-full mb-3 p-2 rounded border border-gray-400 text-black"
                    required
                  />

                  <label
                    htmlFor="message"
                    className="block text-sm mb-1 text-white"
                  >
                    Message (optional)
                  </label>
                  <input
                    id="message"
                    name="message"
                    onChange={handleChange}
                    value={paymentform.message || ""}
                    type="text"
                    placeholder="Say something nice..."
                    className="w-full mb-4 p-2 rounded border border-gray-400 text-black"
                  />

                  <div className="flex gap-3 justify-center">
                    <button
                      type="button"
                      onClick={() => pay(paymentform.amount || 100)}
                      className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-lg font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white dark:text-white"
                    >
                      <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                        Donate
                      </span>
                    </button>
                    
                  </div>
                </form>
              </div>

            </>
          )}
          {showGif && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <img
            src="https://media.tenor.com/s-37hkd0neIAAAAi/bubu-dudu-sseeyall.gif" // 👈 put your GIF in /public/success.gif
            alt="Payment Successful"
            className="w-64 h-64 object-contain"
          />
        </div>
      )}
      
    </>
  );
};

export default PaymentPage;


