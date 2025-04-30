import React, { useEffect, useState } from "react";

import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

import convertToSubcurrency from "../lib/convertToSubcurrency";

const CheckoutPage = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setIsLoading(false);
      return;
    } else {
      console.log("Payment succeeded!");
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: "http://localhost:3000/login", // Replace with your thank you page URL
      },
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      console.log("Payment succeeded!");
    }
    setIsLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            height: "2rem", // h-8 = 32px
            width: "2rem", // w-8 = 32px
            borderWidth: "4px",
            borderStyle: "solid",
            borderColor: "currentColor",
            borderRightColor: "transparent", // border-e-transparent
            borderRadius: "9999px", // rounded-full
            animation: "spin 1.5s linear infinite",
            verticalAlign: "-0.125em", // align-[-0.125em]
            color: "#ffffff", // dark:text-white (you can conditionally toggle based on theme)
          }}
          role="status"
        >
          <span
            style={{
              position: "absolute",
              margin: "-1px",
              height: "1px",
              width: "1px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              border: "0",
              padding: "0",
              clip: "rect(0, 0, 0, 0)",
            }}
          >
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "white",
        padding: "0.5rem",
        borderRadius: "0.375rem",
      }}
    >
      {clientSecret && <PaymentElement />}
      {errorMessage && <div>{errorMessage}</div>}
      <button
        disabled={!stripe || isLoading}
        style={{
          color: "white",
          width: "100%",
          padding: "1.25rem",
          backgroundColor: "black",
          marginTop: "0.5rem",
          borderRadius: "0.375rem",
          fontWeight: "bold",
        }}
      >
        {isLoading ? "Processing..." : `Pay $${amount}`}
      </button>
    </form>
  );
};

export default CheckoutPage;
