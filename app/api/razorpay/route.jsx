import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";

import Payment from "@/models/Payment.js";
import connectDb from "@/db/connectDB";
import User from "../../../models/User.js";

export const POST = async (req) => {
    await connectDb()
    let body = await req.formData()
    body = Object.fromEntries(body)
        // console.log("api/razorpay")

    // Check if razorpayOrderId is present on the server
    let p = await Payment.findOne({oid: body.razorpay_order_id})
    if(!p){
        // console.log("Order Id not found")
        return NextResponse.json({success: false, message:"Order Id not found"})
    }

    // fetch the secret of the user who is getting the payment 
    let user = await User.findOne({username: p.to})
    const secret = process.env.KEY_SECRET;

    // Verify the payment
    let valid = validatePaymentVerification({"order_id": body.razorpay_order_id, "payment_id": body.razorpay_payment_id}, body.razorpay_signature, secret)
    // console.log(valid)
    if(valid){
        // Update the payment status
        const updatedPayment = await Payment.findOneAndUpdate({oid: body.razorpay_order_id}, {done:true, status: "completed"}, {new: true})
        // console.log("ho gaya")
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/${updatedPayment.to}?paymentdone=true`)  
        
    }

    else{
        // console.log("nahi hua")
        return NextResponse.json({success: false, message:"Payment Verification Failed"})
    }

}
