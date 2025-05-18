"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "../suggestions/styles.css";
import "../globals.css";

import Image from "next/image";
import logo from "../assets/logo.png";
import { getRecommendations } from "../../../lib/service";
import {sendAnswersToEmail} from "../../../lib/service";

export default function ResultsPage() {
  const router = useRouter();
  // const [userAnswers, setUserAnswers] = useState("");
  const [destinations, setDestinations] = useState([]);
  // const [showSnackbar, setShowSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);
  const resultsRef = useRef(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  // const fetchRecommendations = async () => {
  //   const savedAnswers = localStorage.getItem("formattedAnswers");
  //   if (!savedAnswers) return;

  //   try {
  //     const result = await getRecommendations(savedAnswers);

  //     setDestinations(result);
  //   } catch (err) {
  //     console.error("Failed to fetch recommendations:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchRecommendations = async () => {
    const savedAnswers = localStorage.getItem("formattedAnswers");
    
    const cachedRecommendations = localStorage.getItem("cachedRecommendations");
    
    if (!savedAnswers) return;

    if (cachedRecommendations) {
      // Use cached result
      await handleSendEmail();
      setDestinations(JSON.parse(cachedRecommendations));
      setLoading(false);
      return;
    }

    try {
      const result = await getRecommendations(savedAnswers);

      // Save to state and cache
      setDestinations(result);
      localStorage.setItem("cachedRecommendations", JSON.stringify(result));
      await handleSendEmail();
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
  const email = "ahsenrasheedsh@gmail.com"; // get this from user input
  const answers = JSON.parse(localStorage.getItem('cachedRecommendations') || '{}');

  try {
    await sendAnswersToEmail(email, answers);
    alert("Email sent!");
  } catch (err) {
    alert("Failed to send email.");
  }
};

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

      {/* {showSnackbar && (
        <div className="snackbar">
          <div className="snackbar-content">
            <span className="snackbar-icon">✓</span>
            Screenshot copied to clipboard!
          </div>
        </div>
      )} */}
    </div>
  );
}
