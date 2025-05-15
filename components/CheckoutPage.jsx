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
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState("processing") // processing, success, error

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
    setPaymentStatus("processing")

    if (!stripe || !elements) {
      setPaymentStatus("error")
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setIsLoading(false);
      return;
    } else {
      setShowPaymentModal(true)
      
      setPaymentStatus("processing")
      // setTimeout(() => {
      // setPaymentStatus("success")
      // }, 2000)
      
      // setTimeout(() => {
      //   router.push("http://localhost:3000/suggestions")
      // }, 1000)
      
      // console.log("Payment succeeded!");
      const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: "/suggestions", 
      },
    });
    console.log("payment error")

    if (error) {
      setShowPaymentModal(true)
      setPaymentStatus("error")
      setTimeout(()=>{
        setShowPaymentModal(false)
      }, 2000)
      setErrorMessage(error.message);
    } else {
     setShowPaymentModal(true)
      
      setPaymentStatus("processing")
      setTimeout(() => {
      setPaymentStatus("success")
      }, 2000)
      
      // setTimeout(() => {
      //   router.push("http://localhost:3000/suggestions")
      // }, 1000)
      
      
    }
    setIsLoading(false);
  };
    }

    

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
            height: "2rem", 
            width: "2rem", 
            borderWidth: "4px",
            borderStyle: "solid",
            borderColor: "currentColor",
            borderRightColor: "transparent", 
            borderRadius: "9999px", 
            animation: "spin 1.5s linear infinite",
            verticalAlign: "-0.125em",
            color: "#ffffff", 
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
      <div>

        <button disabled={!stripe || isLoading} className="pay-now-button">
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
