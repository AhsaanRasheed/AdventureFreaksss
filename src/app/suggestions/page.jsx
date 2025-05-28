"use client";

import { useEffect } from "react";
import "../suggestions/styles.css";
import "../globals.css";
import Image from "next/image";
import logo from "../assets/logo.png";
import {
  getRecommendations,
  sendAnswersToEmail,
} from "../../../lib/service";

export default function ResultsPage() {
  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    const savedAnswers = localStorage.getItem("formattedAnswers");
    if (!savedAnswers) return;

    const cachedRecommendations = localStorage.getItem("cachedRecommendations");
    if (cachedRecommendations) {
      return;
    }

    try {
      const rawResult = await getRecommendations(savedAnswers);
      const parsed =
        typeof rawResult === "string"
          ? JSON.parse(rawResult.replace(/^```json\s*|\s*```$/g, ""))
          : rawResult;

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

      localStorage.setItem(
        "cachedRecommendations",
        JSON.stringify(formattedDestinations)
      );
      await handleSendEmail(formattedDestinations);
    } catch (err) {
      console.error("Failed to fetch or parse recommendations:", err);
    } finally {
    }
  };

  const handleSendEmail = async (formattedDestinations) => {
    const userInfo = localStorage.getItem("formattedAnswers") || "";
    const emailMatch = userInfo.match(/Email: ([^\s,]+)/);
    const email = emailMatch[1];

    try {
      await sendAnswersToEmail(email, formattedDestinations);
    } catch (err) {
      console.log("Failed to send email:", err);
    }
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
        <div className="action-buttons"></div>
      </header>
      <main className="results-main">
        <div className="report-container">
          <h2 className="report-title">
            Thank you for completing the ideal Destination Finder!
          </h2>
          <p className="report-subtitle">
            We’ve received your responses and payment, and your personalized
            report is now being carefully prepared based on the information you
            shared. In approximately one hour, you’ll receive your custom report
            via email, featuring our top recommended destination—plus two
            additional locations that closely match your preferences. We’re
            excited to help you take the next step toward a better life abroad.
            Thanks again for your trust in AdventureFreaksss—your ideal
            destinations are on the way!
          </p>
        </div>
      </main>

      <footer className="results-footer">
        <p>Copyright © 2025 Adventure Freaksss</p>
      </footer>
    </div>
  );
}
