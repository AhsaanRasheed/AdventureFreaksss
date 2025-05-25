"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "../suggestions/styles.css";
import "../globals.css";
import Image from "next/image";
import logo from "../assets/logo.png";
import { getRecommendations, sendAnswersToEmail } from "../../../lib/service";

export default function ResultsPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const resultsRef = useRef(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    const savedAnswers = localStorage.getItem("formattedAnswers");
    if (!savedAnswers) return;

    const cachedRecommendations = localStorage.getItem("cachedRecommendations");

    if (cachedRecommendations) {
      // await handleSendEmail();
      setDestinations(JSON.parse(cachedRecommendations));
      setLoading(false);
      return;
    }

    try {
      const rawResult = await getRecommendations(savedAnswers);
      const parsed =
        typeof rawResult === "string" ? JSON.parse(rawResult) : rawResult;

      // Format data to keep consistent structure
      const formattedDestinations = {
        title: parsed.title || "",
        subtitle: parsed.subtitle || "",
        introduction: parsed.introduction || "",
        topPicks: Object.entries(parsed.topPicks || {}).map(
          ([key, country]) => ({
            id: key,
            name: country.name,
            subheading: country.subheading,
            description: country.description,
            importantPoints: country.importantPoints,
            whyFits: country.whyFits,
          })
        ),
        finalThoughts: {
          description: parsed.finalThoughts?.description || "",
          comparisonTable: parsed.finalThoughts?.comparisonTable || {},
          conclusion: parsed.finalThoughts?.conclusion || "",
        },
        footer: {
          regards: parsed.footer?.regards || "",
          founder: parsed.footer?.founder || "",
          signature: parsed.footer?.signature || "",
        },
      };

      setDestinations(formattedDestinations);
      localStorage.setItem(
        "cachedRecommendations",
        JSON.stringify(formattedDestinations)
      );
      await handleSendEmail(formattedDestinations);
      console.log("Recommendations fetched and cached:", formattedDestinations);
    } catch (err) {
      console.error("Failed to fetch or parse recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (formattedDestinations) => {
    const userInfo = localStorage.getItem("formattedAnswers") || "";
    const emailMatch = userInfo.match(/Email: ([^\s,]+)/);
    const email = emailMatch[1];

    try {
      await sendAnswersToEmail(email, formattedDestinations);
      setSnackbarMessage("Report sent to your email! ✉️");
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);
    } catch (err) {
      setSnackbarMessage("Failed to send email. Please try again.");
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="results-container">
      <header className="results-header">
        <div className="logo">
          <Image
            src={logo || "/placeholder.svg"}
            alt="Adventure Freaks Logo"
            width={60}
            height={60}
          />
        </div>
        <h1>Find your Destination</h1>
        <div className="action-buttons">
          {/* <button
            className="action-button email-button"
            onClick={handleSendEmail}
          >
            <span className="button-icon">✉️</span> Email Report
          </button> */}
          {/* <button
            className="action-button screenshot-button"
            onClick={handlePrint}
          >
            <span className="button-icon">🖨️</span> Print
          </button> */}
        </div>
      </header>
      <main className="results-main">
        <div className="report-container">
           <h2 className="report-title">Thankyou for completing the ideal Destination Finder!</h2>
          <p className="report-subtitle">We’ve received your responses and payment, and your personalized report is now being carefully prepared based on the information you shared.

          In approximately one hour, you’ll receive your custom report via email, featuring our top recommended destination—plus two additional locations that closely match your preferences.

          We’re excited to help you take the next step toward a better life abroad. Thanks again for your trust in AdventureFreaksss—your ideal destinations are on the way!
          </p>
        </div>
      </main>

      <footer className="results-footer">
        <p>Copyright © 2025 Adventure Freaksss</p>
      </footer>

      {showSnackbar && (
        <div className="snackbar">
          <div className="snackbar-content">
            <span className="snackbar-icon">✓</span>
            {snackbarMessage}
          </div>
        </div>
      )}
    </div>
  );
}
