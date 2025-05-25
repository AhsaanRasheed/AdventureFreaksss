/**
 
 * @param {Object} destinations 
 * @returns {string} 
 */
export function generateEmailHTML(destinations) {
  if (!destinations || !destinations.topPicks) {
    return "<p>No destination data available.</p>"
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

  const topPicksHTML = destinations.topPicks
    .map(
      (country) => `
    <!-- Country Card for ${country.name} -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
      <tr>
        <td style="padding: 25px;">
          <!-- Country Header -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 15px; border-bottom: 1px solid #f0f0f0; padding-bottom: 15px; text-align: center;">
            <tr>
              <td>
                <div style="font-size: 48px; margin-bottom: 10px;">${getCountryFlag(country.name)}</div>
                <h3 style="font-size: 24px; font-weight: bold; color: #ff9800; margin-bottom: 5px; margin-top: 0;">${
                  country.name
                }</h3>
                <p style="font-size: 16px; color: #666; font-style: italic; margin-top: 5px;">${country.subheading}</p>
              </td>
            </tr>
          </table>
          
          <!-- Country Description -->
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px; color: #444;">${country.description}</p>
          
          <!-- Important Points -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
            <tr>
              <td>
                <h4 style="font-size: 18px; margin-bottom: 15px; color: #333; display: flex; align-items: center;">
                  <span style="margin-right: 8px;">✅</span> Key Benefits
                </h4>
                
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  ${country.importantPoints
                    .map(
                      (point) => `
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td width="30" valign="top">
                            <div style="display: inline-block; width: 24px; height: 24px; background-color: #ff9800; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold;">✓</div>
                          </td>
                          <td style="padding-left: 12px; line-height: 1.4; color: #444;">
                            ${point}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  `,
                    )
                    .join("")}
                </table>
              </td>
            </tr>
          </table>
          
          <!-- Why It Fits -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff9e6; border-radius: 8px; border-left: 3px solid #ff9800;">
            <tr>
              <td style="padding: 15px;">
                <h4 style="font-size: 18px; margin-bottom: 15px; color: #333;">
                  <span style="margin-right: 8px;">🎯</span> Why It's Perfect for You
                </h4>
                <p style="font-size: 16px; line-height: 1.5; color: #444; font-style: italic; margin: 0;">${
                  country.whyFits
                }</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    `,
    )
    .join("")

  let comparisonTableHTML = ""
  if (
    destinations.finalThoughts &&
    destinations.finalThoughts.comparisonTable &&
    destinations.finalThoughts.comparisonTable.factors
  ) {
    comparisonTableHTML = `
    <!-- Comparison Table -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0; border-collapse: collapse; text-align: center; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); border-radius: 8px; overflow: hidden;">
      <tr style="background-color: #f0f0f0;">
        <th style="padding: 12px 15px; border: 1px solid #e0e0e0; font-weight: bold; color: #333; text-align: left;">Factors</th>
        ${destinations.topPicks
          .map(
            (country) => `
        <th style="padding: 12px 15px; border: 1px solid #e0e0e0; font-weight: bold; color: #333;">
          ${getCountryFlag(country.name)} ${country.name}
        </th>
        `,
          )
          .join("")}
      </tr>
      
      ${destinations.finalThoughts.comparisonTable.factors
        .map(
          (factor, index) => `
      <tr ${index % 2 === 1 ? 'style="background-color: #f9f9f9;"' : ""}>
        <td style="padding: 12px 15px; border: 1px solid #e0e0e0; text-align: left;">
          <span style="margin-right: 8px;">${getCategoryIcon(factor)}</span> ${factor}
        </td>
        ${destinations.topPicks
          .map(
            (country, countryIndex) => `
        <td style="padding: 12px 15px; border: 1px solid #e0e0e0; font-size: 18px; font-weight: bold;">
          ${destinations.finalThoughts.comparisonTable[`country${countryIndex + 1}`][index]}
        </td>
        `,
          )
          .join("")}
      </tr>
      `,
        )
        .join("")}
    </table>
    `
  }

  let finalThoughtsHTML = ""
  if (destinations.finalThoughts) {
    finalThoughtsHTML = `
    <!-- Final Thoughts Section -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9f9f9; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
      <tr>
        <td>
          <h3 style="font-size: 24px; font-weight: bold; color: #333; text-align: center; margin-bottom: 20px;">
            <span style="margin-right: 8px;">🤔</span> Final Thoughts
          </h3>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px; text-align: center; color: #444;">
            ${destinations.finalThoughts.description || ""}
          </p>
          
          ${comparisonTableHTML}
          
          <!-- Conclusion -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #e9f7ef; padding: 20px; border-radius: 8px; border-left: 3px solid #28a745; margin-top: 25px;">
            <tr>
              <td>
                <h4 style="font-size: 20px; margin-bottom: 10px; color: #333;">
                  <span style="margin-right: 8px;">🏆</span> Our Recommendation
                </h4>
                <p style="font-size: 16px; line-height: 1.5; color: #444; margin: 0;">
                  ${destinations.finalThoughts.conclusion || ""}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    `
  }

  let footerHTML = ""
  if (destinations.footer) {
    footerHTML = `
    <!-- Report Footer -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
      <tr>
        <td>
          <p style="margin: 5px 0; color: #666;">${destinations.footer.regards || ""}</p>
          <p style="font-weight: bold; margin: 5px 0; font-size: 18px;">${destinations.footer.founder || ""}</p>
          <p style="font-style: italic; color: #666;">${destinations.footer.signature || ""}</p>
        </td>
      </tr>
    </table>
    `
  }

  const sectionDivider = `
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
    <tr>
      <td width="42%" style="border-bottom: 1px solid #e0e0e0;"></td>
      <td width="16%" style="text-align: center; font-size: 24px; color: #666;">✈️</td>
      <td width="42%" style="border-bottom: 1px solid #e0e0e0;"></td>
    </tr>
  </table>
  `

  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <p style="font-size: 12px; color: #666; margin-bottom: 20;">${
                  "Note: This report is based on the preferences and budget you submitted and is designed to inspire further exploration. Please consult official sources for the most current visa requirements."
                }</p>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${destinations.title || "Your Travel Destinations"}</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333; background-color: #f8f9fa;">
    <!-- Email Container -->
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);">
      <tr>
        <td style="padding: 30px;">
          <!-- Report Header -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="text-align: center; margin-bottom: 30px;">
            <tr>
              <td>
                <h2 style="font-size: 32px; font-weight: bold; color: #333; margin-bottom: 10px;">${
                  destinations.title || "Your Travel Destinations"
                }</h2>
                <p style="font-size: 18px; color: #666; margin-top: 0;">${
                  destinations.subtitle || "Personalized recommendations just for you"
                }</p>
              </td>
            </tr>
          </table>
          
          <!-- Introduction -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
            <tr>
              <td style="text-align: center;">
                <p style="font-size: 18px; line-height: 1.6; color: #444; margin: 0;">${
                  destinations.introduction ||
                  "Based on your preferences, we've found the perfect destinations for you."
                }</p>
              </td>
            </tr>
          </table>
          
          ${sectionDivider}
          
          <!-- Top Destinations Section -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
            <tr>
              <td style="text-align: center;">
                <h2 style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 30px;">
                  <span style="margin-right: 8px;">🌟</span> Top Destinations for You
                </h2>
              </td>
            </tr>
          </table>
          
          <!-- Country Cards -->
          ${topPicksHTML}
          
          ${sectionDivider.replace("✈️", "🧭")}
          
          <!-- Final Thoughts Section -->
          ${finalThoughtsHTML}
          
          ${sectionDivider.replace("✈️", "📝")}
          
          <!-- Report Footer -->
          ${footerHTML}
          
          
          
          <!-- Email Footer -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #6c757d; font-size: 14px;">
            <tr>
              <td>
                <p style="margin-bottom: 10px;">Copyright © 2025 Adventure Freaks</p>
                <p>If you have any questions, please contact us at <a href="mailto:support@adventurefreaks.com" style="color: #ff9800;">support@adventurefreaks.com</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
}
