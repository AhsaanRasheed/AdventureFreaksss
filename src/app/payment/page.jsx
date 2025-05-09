"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import "../payment/payment-styles.css"
import "../globals.css"

import Image from "next/image"
import visa from "../assets/visa.png"
import mastercard from "../assets/mastercard.png"
import unionpay from "../assets/unionpay.png"
import paypal from "../assets/paypal.png"
import logo from "../assets/logo.png"

export default function PaymentScreen() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("credit")
  const [formData, setFormData] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  })
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState("processing") // processing, success, error

  // Handle payment method selection
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method)
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value,
    })
  }

  // Handle payment submission
  const handlePayNow = () => {
    // Show payment processing modal
    setShowPaymentModal(true)
    setPaymentStatus("processing")

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus("success")

      // Navigate to results page after showing success message
      setTimeout(() => {
        router.push("/suggestions")
      }, 2000)
    }, 3000)
  }

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

            <div className="payment-method-option">
              <label className="payment-method-label">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "paypal"}
                  onChange={() => handlePaymentMethodChange("paypal")}
                />
                <div className="payment-method-details">
                  <div className="payment-method-text">
                    <span className="payment-method-name">PayPal</span>
                    <span className="payment-method-description">
                      Safe payment online. Credit card needed. Paypal account needed
                    </span>
                  </div>
                  <div className="payment-method-logo">
                    <Image src={paypal} alt="PayPal" className="paypal-logo" />
                  </div>
                </div>
              </label>
            </div>

            <div className={`payment-method-option ${paymentMethod === "credit" ? "selected" : ""}`}>
              <label className="payment-method-label">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "credit"}
                  onChange={() => handlePaymentMethodChange("credit")}
                />
                <div className="payment-method-details">
                  <div className="payment-method-text">
                    <span className="payment-method-name">Debit/ Credit Card</span>
                    <span className="payment-method-description">
                      Safe payment online. Credit card needed. Debit Card account needed
                    </span>
                  </div>
                  <div className="payment-method-logos">
                    <Image src={visa} alt="Visa" className="card-logo" />
                    <Image src={mastercard} alt="Mastercard" className="card-logo" />
                    <Image src={unionpay} alt="JCB" className="card-logo" />
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="billing-details">
            <div className="billing-header">
              <h3>Billing Details</h3>
              <div className="fee-display">
                <span>Fee</span>
                <span className="fee-amount">$1</span>
              </div>
            </div>

            <div className="billing-form">
              <div className="form-group">
                <label htmlFor="cardHolderName">Card Holder Name</label>
                <input
                  type="text"
                  id="cardHolderName"
                  placeholder="Card Holder Name"
                  value={formData.cardHolderName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="1234 1234 1234 1234"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="expiryDate">Expiration Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    placeholder="MM / YY"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group half">
                  <label htmlFor="cvc">CVC (3 digit)</label>
                  <input type="text" id="cvc" placeholder="CVC" value={formData.cvc} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <button className="pay-now-button" onClick={handlePayNow}>
              Pay Now
            </button>
          </div>
        </div>
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

      <div className="payment-footer">
        <p>Copyright © 2025 Adventure Freakssss</p>
      </div>
    </div>
  )
}
