import React, { useEffect, useState } from "react";

import "../src/app/payment/payment-styles.css";

import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

import "../src/app/globals.css";
import { createPaymentIntent } from "../lib/service";

const CheckoutPage = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("processing");
  const [isPaymentElementComplete, setIsPaymentElementComplete] =
    useState(false);
  const [isCheckboxChecked, setCheckBoxChecked] = useState(false);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      const clientSecret = await createPaymentIntent(amount);
      if (clientSecret) {
        setClientSecret(clientSecret);
      } else {
        // Optional: handle UI fallback if needed
        console.warn("Client secret not received. Possible error.");
      }
    };

    fetchPaymentIntent();
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPaymentStatus("processing");
    setErrorMessage(null); // Clear previous error

    if (!stripe || !elements) {
      setErrorMessage("Stripe has not loaded yet. Please wait and try again.");
      setIsLoading(false);
      return;
    }

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message);
        setIsLoading(false);
        return;
      }

      // Don't show modal until payment is confirmed
      // setShowPaymentModal(true);

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        // confirmParams: {
        //   return_url: "http://quiz.adventurefreaksss.com/suggestions",
        // },

        confirmParams: {
          return_url: "http://localhost:3000/suggestions",
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setPaymentStatus("error");
        setIsLoading(false);
        return;
      }

      // Payment succeeded (actually, confirmPayment typically redirects if successful)
      setPaymentStatus("success");
      setIsLoading(false);
    } catch (err) {
      // Catch any unexpected error
      setErrorMessage(err.message || "Unexpected error occurred.");
      setPaymentStatus("error");
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setCheckBoxChecked(checked);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="spinner" role="status"></div>
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
      {clientSecret && (
        <PaymentElement
          onChange={(event) => {
            setIsPaymentElementComplete(event.complete);
          }}
        />
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {/* Enhanced Checkbox Section */}
      <div className="disclaimer-container">
        <span className="checkbox-wrapper">
          <input
            type="checkbox"
            id="checkbox"
            checked={isCheckboxChecked}
            onChange={handleCheckboxChange}
            className="checkbox-checkmark"
          />
        </span>
        <span className="disclaimer-text">
          I understand this report is for informational purposes only and does
          not guarantee visa eligibility. I acknowledge it is my responsibility
          to verify visa requirements with official sources.{" "}
          <a
            href="https://adventurefreaksss.com/terms-of-use-and-disclaimer/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our full terms of use and disclaimer.
          </a>
        </span>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <button
          disabled={
            !stripe ||
            isLoading ||
            !isPaymentElementComplete ||
            !isCheckboxChecked
          }
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
                <p>
                  There was an error processing your payment. Please try again.
                </p>
                <button
                  className="try-again-button"
                  onClick={() => setShowPaymentModal(false)}
                >
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
