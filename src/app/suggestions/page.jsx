"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import "../suggestions/styles.css"
import "../globals.css"

import Image from "next/image"
import logo from "../assets/logo.png"

export default function ResultsPage() {
  const router = useRouter()
  const [userAnswers, setUserAnswers] = useState("")
  const [destinations, setDestinations] = useState([])
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [loading, setLoading] = useState(true)
  const resultsRef = useRef(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      const savedAnswers = localStorage.getItem("formattedAnswers")
      if (!savedAnswers) return

      setUserAnswers(savedAnswers)

      try {
        const res = await fetch("/api/recommendation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ questions: savedAnswers }),
        })

        const data = await res.json()
        const parsed = parseDestinations(data.result)
        setDestinations(parsed)
      } catch (err) {
        console.error("Failed to fetch recommendations:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  

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
          
        </div>

        {loading ? (
          <p>Loading recommendations...</p>
        ) : (
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
        )}
      </main>

      <footer className="results-footer">
        <p>Copyright © 2025 Adventure Freaksss</p>
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

function parseDestinations(responseText) {
  const lines = responseText.split("\n").map((l) => l.trim()).filter((l) => l.length > 0)

  const destinations = []
  let current = null

  lines.forEach((line) => {
    if (/^\d+\./.test(line)) {
      if (current) {
        current.matches.push(line.replace(/^\d+\.\s*/, ""))
      }
    } else {
      if (current) {
        destinations.push(current)
      }
      current = { name: line, matches: [] }
    }
  })

  if (current) destinations.push(current)

  return destinations
}
