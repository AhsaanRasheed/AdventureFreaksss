"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import "../suggestions/styles.css"
import "../globals.css"

import Image from "next/image"
import logo from "../assets/logo.png"

export default function ResultsPage() {
    const router = useRouter()
    const [userAnswers, setUserAnswers] = useState({})
    const [showSnackbar, setShowSnackbar] = useState(false)
    const resultsRef = useRef(null)
    
    const [destinations, setDestinations] = useState([
      {
        name: "Portugal",
        matches: [
          "Good for family of 3",
          "Matches your budget preferences",
          "Has your preferred climate",
          "Offers good healthcare options",
        ],
      },
      {
        name: "Costa Rica",
        matches: [
          "Good for family of 3",
          "Matches your climate preferences",
          "Has beautiful beaches and nature",
          "Offers good quality of life",
        ],
      },
      {
        name: "Thailand",
        matches: [
          "Good for family of 3",
          "Excellent cost of living for your budget",
          "Has your preferred tropical climate",
          "Rich cultural experiences",
        ],
      },
    ])
  
    useEffect(() => {
      // Get user answers from localStorage
      const savedAnswers = localStorage.getItem("quizAnswers")
      const savedOtherInputs = localStorage.getItem("quizOtherInputs")
  
      if (savedAnswers) {
        setUserAnswers(JSON.parse(savedAnswers))
      }
  
      // In a real app, you would use the answers to generate personalized destinations
      // For now, we'll just use the default destinations
    }, [])
  
    const handleTakeScreenshot = async () => {
      try {
        // Check if the browser supports the necessary APIs
        if (!navigator.clipboard || !window.html2canvas) {
          alert("Your browser doesn't support taking screenshots. Please try a different browser.")
          return
        }
  
        // Use html2canvas to capture the results section
        const canvas = await window.html2canvas(resultsRef.current)
        
        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
          try {
            // Create a ClipboardItem and write to clipboard
            const item = new ClipboardItem({ "image/png": blob })
            await navigator.clipboard.write([item])
            
            // Show success message
            setShowSnackbar(true)
            
            // Hide snackbar after 3 seconds
            setTimeout(() => {
              setShowSnackbar(false)
            }, 3000)
          } catch (err) {
            console.error("Failed to copy screenshot to clipboard:", err)
            alert("Failed to copy screenshot to clipboard. Please try again.")
          }
        })
      } catch (err) {
        console.error("Failed to take screenshot:", err)
        alert("Failed to take screenshot. Please try again.")
      }
    }
  
    return (
      <div className="results-container">
        <header className="results-header">
          <div className="logo">
            <Image src={logo} alt="Adventure Freaks Logo" />
          </div>
          <h1>Find your Destination</h1>
        </header>
  
        <main className="results-main" ref={resultsRef}>
          <div className="results-title-container">
            <h2 className="results-title">Here are the Top 3 Suggestions</h2>
            <button className="screenshot-button" onClick={handleTakeScreenshot}>
              Take a screenshot
            </button>
          </div>
  
          <div className="destinations-container">
            {destinations.map((destination, index) => (
              <div key={index} className="destination-card">
                <h3 className="destination-name">{destination.name}</h3>
                <ul className="destination-matches">
                  {destination.matches.map((match, matchIndex) => (
                    <li key={matchIndex} className="match-item">
                      <span className="check-circle">✓</span>
                      <span>{match}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </main>
  
        <footer className="results-footer">
          <p>Copyright © 2025 Adventure Freakssss</p>
        </footer>
  
        {showSnackbar && (
          <div className="snackbar">
            <div className="snackbar-content">
              <span className="snackbar-icon">✓</span>
              Screenshot copied to clipboard!
            </div>
          </div>
        )}
      </div>
    )
  }
  
  