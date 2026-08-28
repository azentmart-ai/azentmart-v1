import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Make sure Razorpay credentials are available
    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error("Razorpay credentials are missing");

      return NextResponse.json(
        {
          success: false,
          error: "Razorpay configuration is missing",
        },
        { status: 500 },
      );
    }

    // Read request body
    const body = await request.json();

    const credits = Number(body.credits || 250);

    // For our current demo:
    // 1 credit = ₹1
    // Razorpay expects amount in paise
    const amountInRupees = credits;
    const amountInPaise = amountInRupees * 100;

    // Create Razorpay client
    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `azentmart_${Date.now()}`,
      notes: {
        product: "AzentmartAI Credits",
        credits: String(credits),
      },
    });

    console.log("Razorpay order created:", order.id);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      credits,
      keyId: razorpayKeyId,
    });
  } catch (error) {
    console.error("Razorpay create order error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create Razorpay order",
      },
      { status: 500 },
    );
  }
}