"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import "../payment/payment-styles.css";
import "../globals.css";

import Image from "next/image";
import logo from "../assets/logo.png";

import CheckoutPage from "../../../components/CheckoutPage";
import convertToSubcurrency from "../../../lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("Missing Stripe public key");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PaymentScreen() {
  const router = useRouter();
  const amount = 1;

  useEffect(() => {
    const formattedAnswers = localStorage.getItem("formattedAnswers");
    if (!formattedAnswers) {
      router.replace("/"); // Redirect to home if no formattedanswers
    }
  }, [router]);

  return (
    <div className="payment-container">
      <div className="payment-header">
        <div className="logo">
          <Image src={logo} alt="Adventure Freaks Logo" />
        </div>
        <h1>Find your Destination</h1>
      </div>

      <div className="payment-main">
        <h2 className="payment-title">Pay to proceed for Results</h2>

        <div className="payment-content">
          <div className="payment-methods">
            <h3>Payment Method</h3>

            <Elements
              stripe={stripePromise}
              options={{
                mode: "payment",
                amount: convertToSubcurrency(amount),
                currency: "usd",
              }}
            >
              <CheckoutPage amount={amount} />
            </Elements>
          </div>
        </div>
      </div>

      <div className="payment-footer">
        <p>Copyright © 2025 Adventure Freakssss</p>
      </div>
    </div>
  );
}
