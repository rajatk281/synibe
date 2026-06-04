import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export const POST = async(req: Request)=>{
    try {
        const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_SECRET_ID;

        if (!key_id || !key_secret) {
            console.error("Razorpay API keys are missing from environment variables.");
            return NextResponse.json(
                { error: "Payment gateway configuration is missing" },
                { status: 500 }
            );
        }

        const razorpay = new Razorpay({
            key_id, 
            key_secret
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