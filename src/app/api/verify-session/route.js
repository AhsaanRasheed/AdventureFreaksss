import Stripe from "stripe";
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { paymentIntentId, name, email } = await req.json();

    if (!paymentIntentId || !name || !email) {
      return NextResponse.json(
        { success: false, message: "Missing payment information" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      const { db } = await connectToDatabase();
      await db.collection("paymentHistory").insertOne({
        name,
        email,
        amount: paymentIntent.amount / 100,
        status: paymentIntent.status,
        intentId: paymentIntent.id,
        createdAt: new Date(),
      });
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, message: "Payment not completed" },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error("Stripe paymentIntent error:", err.message);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
