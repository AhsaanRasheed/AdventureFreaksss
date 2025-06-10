// /app/api/create-payment-intent/route.js
import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Example static coupons. In production, use a DB.
const VALID_COUPONS = {
  // ACTNOW15: 0.15, // 10% off
//   SAVE5: 0.05,  // 5% off
};

export async function POST(NextRequest) {
  try {
    const { amount, promoCode } = await NextRequest.json();

    if (!amount) {
      return NextResponse.json({ error: "Missing amount" }, { status: 400 });
    }

    // Apply discount if valid
    const normalizedCode = promoCode?.toUpperCase();
    const discountRate = normalizedCode && VALID_COUPONS[normalizedCode]
      ? VALID_COUPONS[normalizedCode]
      : 0;

    const finalAmount = Math.max(
      Math.round(amount * (1 - discountRate)),
      50 // Stripe requires min of 50 cents
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      originalAmount: amount,
      discountRate,
      finalAmount,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
