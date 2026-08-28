import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Razorpay payment details",
        },
        { status: 400 },
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      console.error("RAZORPAY_KEY_SECRET is missing");

      return NextResponse.json(
        {
          success: false,
          error: "Razorpay configuration is missing",
        },
        { status: 500 },
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature, "utf8"),
      Buffer.from(razorpay_signature, "utf8"),
    );

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Razorpay payment signature",
        },
        { status: 400 },
      );
    }

    console.log("Razorpay payment verified:", {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("Razorpay verification error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to verify Razorpay payment",
      },
      { status: 500 },
    );
  }
}