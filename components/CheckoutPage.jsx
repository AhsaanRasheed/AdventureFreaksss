import React, { useEffect, useState } from "react";

import "../src/app/payment/payment-styles.css"

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("processing");
  const [isPaymentElementComplete, setIsPaymentElementComplete] = useState(false); 

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
    setPaymentStatus("processing");

    if (!stripe || !elements) {
      setPaymentStatus("error");
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setIsLoading(false);
      return;
    }

    setShowPaymentModal(true);

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: "https://adventure-freaksss.vercel.app/suggestions",
        // return_url: "http://localhost:3000/suggestions",
      },
    });

    if (error) {
      setPaymentStatus("error");
      setTimeout(() => {
        setShowPaymentModal(false);
      }, 2000);
      setErrorMessage(error.message);
    } else {
      setPaymentStatus("processing");
      setTimeout(() => {
        setPaymentStatus("success");
      }, 2000);
    }

    setIsLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="spinner" role="status"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: "white", padding: "0.5rem", borderRadius: "0.375rem" }}>
      {clientSecret && (
        <PaymentElement
          onChange={(event) => {
            setIsPaymentElementComplete(event.complete); 
          }}
        />
      )}
      {errorMessage && <div style="error-message">{errorMessage}</div>}
      <div style={{ marginTop: "1rem" }}>
        <button
          disabled={!stripe || isLoading || !isPaymentElementComplete} 
          className="pay-now-button"
        >
          {isLoading ? "Processing..." : `Pay $${amount}`}
        </button>
      </div>

      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            {paymentStatus === "processing" && (
              <div className="payment-processing">
                <div className="spinner"></div>
                <h3>Processing Payment</h3>
                <p>Please wait while we process your payment...</p>
              </div>
            )}
            {paymentStatus === "success" && (
              <div className="payment-success">
                <div className="success-icon">✓</div>
                <h3>Payment Successful!</h3>
                <p>Redirecting to your personalized results...</p>
              </div>
            )}
            {paymentStatus === "error" && (
              <div className="payment-error">
                <div className="error-icon">✗</div>
                <h3>Payment Failed</h3>
                <p>There was an error processing your payment. Please try again.</p>
                <button className="try-again-button" onClick={() => setShowPaymentModal(false)}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
};

export default CheckoutPage;