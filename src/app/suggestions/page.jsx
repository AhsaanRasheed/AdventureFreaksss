"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import "../suggestions/styles.css"
import "../globals.css"
import Image from "next/image"
import logo from "../assets/logo.png"
import { getRecommendations, sendAnswersToEmail } from "../../../lib/service"

export default function ResultsPage() {
  const router = useRouter()
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const resultsRef = useRef(null)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    const savedAnswers = localStorage.getItem("formattedAnswers")
    if (!savedAnswers) return

    const cachedRecommendations = localStorage.getItem("cachedRecommendations")

    if (cachedRecommendations) {
      
      await handleSendEmail();
      setDestinations(JSON.parse(cachedRecommendations))
      setLoading(false)
      return
    }

    try {
      const rawResult = await getRecommendations(savedAnswers)
      const parsed = typeof rawResult === "string" ? JSON.parse(rawResult) : rawResult

      // Format data to keep consistent structure
      const formattedDestinations = {
        title: parsed.title || "",
        subtitle: parsed.subtitle || "",
        introduction: parsed.introduction || "",
        topPicks: Object.entries(parsed.topPicks || {}).map(([key, country]) => ({
          id: key,
          name: country.name,
          subheading: country.subheading,
          description: country.description,
          importantPoints: country.importantPoints,
          whyFits: country.whyFits,
        })),
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
      }

      setDestinations(formattedDestinations)
      localStorage.setItem("cachedRecommendations", JSON.stringify(formattedDestinations))
      await handleSendEmail();
      console.log("Recommendations fetched and cached:", formattedDestinations)
    } catch (err) {
      console.error("Failed to fetch or parse recommendations:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmail = async () => {
    const userInfo = localStorage.getItem("formattedAnswers") || ""
    const emailMatch = userInfo.match(/Email: ([^\s,]+)/)
    const email = emailMatch ? emailMatch[1] : "ahsenrasheedsh@gmail.com"

    try {
      await sendAnswersToEmail(email, destinations)
      setSnackbarMessage("Report sent to your email! ✉️")
      setShowSnackbar(true)
      setTimeout(() => setShowSnackbar(false), 3000)
    } catch (err) {
      setSnackbarMessage("Failed to send email. Please try again.")
      setShowSnackbar(true)
      setTimeout(() => setShowSnackbar(false), 3000)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const getCountryFlag = (countryName) => {
    const flagMap = {
      Bulgaria: "🇧🇬",
      Romania: "🇷🇴",
      Poland: "🇵🇱",
      Portugal: "🇵🇹",
      Spain: "🇪🇸",
      Italy: "🇮🇹",
      France: "🇫🇷",
      Thailand: "🇹🇭",
      "Costa Rica": "🇨🇷",
      Mexico: "🇲🇽",
      Canada: "🇨🇦",
      Japan: "🇯🇵",
      Australia: "🇦🇺",
      "New Zealand": "🇳🇿",
      Germany: "🇩🇪",
      Netherlands: "🇳🇱",
      Sweden: "🇸🇪",
      Norway: "🇳🇴",
      Denmark: "🇩🇰",
      Finland: "🇫🇮",
      Iceland: "🇮🇸",
      Switzerland: "🇨🇭",
      Austria: "🇦🇹",
      Greece: "🇬🇷",
      Croatia: "🇭🇷",
      Montenegro: "🇲🇪",
      Malta: "🇲🇹",
      Cyprus: "🇨🇾",
      Panama: "🇵🇦",
      Colombia: "🇨🇴",
      Ecuador: "🇪🇨",
      Peru: "🇵🇪",
      Chile: "🇨🇱",
      Argentina: "🇦🇷",
      Brazil: "🇧🇷",
      Indonesia: "🇮🇩",
      Malaysia: "🇲🇾",
      Vietnam: "🇻🇳",
      Cambodia: "🇰🇭",
      Philippines: "🇵🇭",
      "South Korea": "🇰🇷",
      Taiwan: "🇹🇼",
      Singapore: "🇸🇬",
      "South Africa": "🇿🇦",
      Morocco: "🇲🇦",
      Egypt: "🇪🇬",
      Turkey: "🇹🇷",
      "United Arab Emirates": "🇦🇪",
      Qatar: "🇶🇦",
      Bahrain: "🇧🇭",
      Oman: "🇴🇲",
      Jordan: "🇯🇴",
      Israel: "🇮🇱",
    }

    return flagMap[countryName] || "🌍"
  }

  const getCategoryIcon = (category) => {
    const iconMap = {
      "Cost of Living": "💰",
      "Work Visa Friendly": "📝",
      "English-Friendly": "🗣️",
      "Eco-Friendly": "🌱",
      "Culture & Leisure": "🎭",
      Healthcare: "🏥",
      Safety: "🛡️",
      Climate: "☀️",
      Infrastructure: "🏗️",
      Education: "🎓",
      "Digital Nomad Friendly": "💻",
      "Family Friendly": "👨‍👩‍👧‍👦",
      Nightlife: "🌃",
      "Food Scene": "🍽️",
      "Outdoor Activities": "🏞️",
      "Public Transport": "🚆",
      "Internet Quality": "📶",
    }

    return iconMap[category] || "✨"
  }

  return (
    <div className="results-container">
      <header className="results-header">
        <div className="logo">
          <Image src={logo || "/placeholder.svg"} alt="Adventure Freaks Logo" width={60} height={60} />
        </div>
        <h1>Find your Destination</h1>
        <div className="action-buttons">
           <button className="action-button email-button" onClick={handleSendEmail}>
            <span className="button-icon">✉️</span> Email Report
          </button>
          <button className="action-button screenshot-button" onClick={handlePrint}>
            <span className="button-icon">🖨️</span> Print
          </button>
        </div>
      </header>

      <main className="results-main" ref={resultsRef}>
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Generating your personalized recommendations...</p>
            <p className="loading-subtext">We're analyzing your preferences to find your perfect destinations</p>
          </div>
        ) : (
          <div className="report-container">
            {destinations && (
              <>
                <div className="report-header">
                  <h2 className="report-title">{destinations.title}</h2>
                  <p className="report-subtitle">{destinations.subtitle}</p>
                </div>

                <div className="report-introduction">
                  <p>{destinations.introduction}</p>
                </div>

                <div className="section-divider">
                  <span className="divider-icon">✈️</span>
                </div>

                <h3 className="section-title">
                  <span className="section-icon">🌟</span> Top Destinations for You
                </h3>

                <div className="country-cards">
                  {destinations.topPicks &&
                    destinations.topPicks.map((country) => (
                      <div key={country.id} className="country-card">
                        <div className="country-header">
                          <div className="country-flag">{getCountryFlag(country.name)}</div>
                          <h3 className="country-name">{country.name}</h3>
                          <p className="country-subheading">{country.subheading}</p>
                        </div>
                        <p className="country-description">{country.description}</p>
                        <div className="important-points">
                          <h4>
                            <span className="section-icon">✅</span> Key Benefits
                          </h4>
                          <ul className="benefits-list">
                            {country.importantPoints.map((point, index) => (
                              <li key={index} className="benefit-item">
                                <span className="check-circle">✓</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="why-fits">
                          <h4>
                            <span className="section-icon">🎯</span> Why It's Perfect for You
                          </h4>
                          <p>{country.whyFits}</p>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="section-divider">
                  <span className="divider-icon">🧭</span>
                </div>

                {destinations.finalThoughts && (
                  <div className="final-thoughts">
                    <h3 className="section-title">
                      <span className="section-icon">🤔</span> Final Thoughts
                    </h3>
                    <p className="thoughts-description">{destinations.finalThoughts.description}</p>

                    {destinations.finalThoughts.comparisonTable &&
                      destinations.finalThoughts.comparisonTable.factors && (
                        <div className="comparison-table-container">
                          <table className="comparison-table">
                            <thead>
                              <tr>
                                <th>Factors</th>
                                {destinations.topPicks.map((country) => (
                                  <th key={country.id}>
                                    {getCountryFlag(country.name)} {country.name}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {destinations.finalThoughts.comparisonTable.factors.map((factor, index) => (
                                <tr key={index}>
                                  <td>
                                    <span className="factor-icon">{getCategoryIcon(factor)}</span> {factor}
                                  </td>
                                  {destinations.topPicks.map((country, countryIndex) => (
                                    <td key={`${country.id}-${index}`} className="comparison-cell">
                                      {destinations.finalThoughts.comparisonTable[`country${countryIndex + 1}`][index]}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                    <div className="conclusion">
                      <h4>
                        <span className="section-icon">🏆</span> Our Recommendation
                      </h4>
                      <p>{destinations.finalThoughts.conclusion}</p>
                    </div>
                  </div>
                )}

                <div className="section-divider">
                  <span className="divider-icon">📝</span>
                </div>

                {destinations.footer && (
                  <div className="report-footer">
                    <p>{destinations.footer.regards}</p>
                    <p className="founder">{destinations.footer.founder}</p>
                    <p className="signature">{destinations.footer.signature}</p>
                  </div>
                )}
              </>
            )}
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
            {snackbarMessage}
          </div>
        </div>
      )}
    </div>
  )
}
