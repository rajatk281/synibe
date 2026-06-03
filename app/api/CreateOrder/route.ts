import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export const POST = async(req: Request)=>{
    try {
        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string, 
            key_secret: process.env.RAZORPAY_SECRET_ID as string
        });

        const {amount} = await req.json()
        const order = await razorpay.orders.create({
            amount: Number(amount) * 100,
            currency: "USD",
            receipt: `receipt_${Date.now()}`
        })
        return NextResponse.json(order)
    } catch (error) {
        console.error("CreateOrder error:", error)
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        )
    }
}