"use client"

import { useRouter } from "next/navigation"
import "../home/styles.css"
import "../globals.css"

import Image from "next/image"
import logo from "../assets/logo.png"
import landingImage from "../assets/landing-page-image.png"

export default function LandingPage() {
  const router = useRouter()

  const handleStartQuiz = () => {
    router.push("/quiz")
  }

  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="logo">
          <Image src={logo} alt="Adventure Freaks Logo" />
        </div>
        <button className="take-quiz-button" onClick={handleStartQuiz}>
          Take Quiz
        </button>
      </header>

      <main className="landing-main">
        <div className="landing-content">
          <h1 className="landing-title">Let the Adventure Begin</h1>
          <p className="landing-description">
            Find Your Ideal Budget-Friendly Destination Abroad. Our Trusted Resources Help You Find The Perfect Place To
            Live Abroad, Just answer a few questions and we will suggest you your best destination.
          </p>
          <button className="find-destination-button" onClick={handleStartQuiz}>
            Find your Destination
          </button>
        </div>
        <div className="landing-image">
          <div className="quiz-preview">
            <Image src={landingImage} alt="Quiz Preview" className="quiz-preview-image" />
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <p>Copyright © 2025 Adventure Freakssss</p>
      </footer>
    </div>
  )
}
