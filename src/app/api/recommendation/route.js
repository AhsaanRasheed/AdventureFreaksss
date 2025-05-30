// app/api/recommendation/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { questions } = await req.json();
    if (!questions) {
      return NextResponse.json({ error: "Missing questions" }, { status: 400 });
    }
    const prompt = generatePrompt(questions);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o", // or 'gpt-3.5-turbo', 'o4-mini' if available
        messages: [
          {
            role: "system",
            content: "You are a helpful travel and relocation advisor.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 1,
      }),
    });

    const data = await response.json();

    let reply = data.choices?.[0]?.message?.content || "[]";
    let result;

    try {
      result = reply;
    } catch (e) {
      console.error("Failed to parse JSON reply from OpenAI:", reply);
      result = [];
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Recommendation API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function generatePrompt(questions) {
  return `
You are a professional Travel Relocation Advisor helping expats and retirees find sustainable, affordable, and suitable destinations to move abroad. 

Your task is to generate a **Personalized Relocation Report** for a user based on their quiz answers. The report must recommend the **top 3 best-fit countries** based on the user's values, needs, budget, visa eligibility, timeline, healthcare expectations, safety preferences, and lifestyle goals.

---

🔒 Apply these strict rules:
1. ✅ Do **not** suggest countries where the total monthly cost of living typically **exceeds the user's selected budget** unless explicitly mentioned by the user.
2. ✅ Only suggest countries where the user is **likely eligible** for the visa category selected (retirement, digital nomad, student, etc.).
3. ✅ If the user prefers healthcare in the **top 10% or 25%**, avoid countries with poor healthcare systems.
4. ✅ Prioritize countries that **align with the user’s preferred climate, infrastructure, and safety level**.
5. ✅ If the user selects specific **legal rights**, recommend countries where those are protected or accessible.
6. ✅ Use the user’s preferred **regions, travel distance, timezone, and language** to narrow down results.
7. ✅ Ignore “countries the user is already considering” if better matches exist, but explain this respectfully in the report.
8. ✅ If religious preferences are listed, factor them into community fit.
9. ✅ Always stay within **budget + visa + lifestyle + timeline + safety** constraints.
10. ❌ Never recommend a country just because it’s popular — always justify it based on the user's goals.
11. ❌ Never suggest countries where:  
   - Cost of living exceeds the user’s budget (unless explicitly allowed).  
   - The user is unlikely to qualify for their selected visa type.  
   - Healthcare quality is below the user’s stated preference (e.g., avoid countries outside the top 10%/25% if required).
12. ❌ If no country fits all criteria, return fewer than 3 options and explain why in 'finalThoughts'.

---

🧠 Steps:
- First, parse and normalize the quiz answers into clear structured fields (like 'name', 'budget', 'ageGroup', 'visaType', 'regionPreferences', etc.)
- Then, generate the final output ONLY in the exact JSON structure below. Do not include Markdown or text outside the JSON.

---

📦 JSON FORMAT:
{
  "title": "Relocation Report for [User's Name]",
  "subtitle": "Curated by Ré from Adventure Freaksss",
  "introduction": "[Short warm intro that summarizes the user's motivation and how this report helps]",
  "topPicks": {
    "country1": {
      "name": "",
      "subheading": "",
      "description": "",
      "importantPoints": [],
      "whyFits": ""
    },
    "country2": {
      "name": "",
      "subheading": "",
      "description": "",
      "importantPoints": [],
      "whyFits": ""
    },
    "country3": {
      "name": "",
      "subheading": "",
      "description": "",
      "importantPoints": [],
      "whyFits": ""
    }
  },
  "finalThoughts": {
    "description": "[Wrap-up paragraph summarizing key considerations]",
    "comparisonTable": {
      "factors": ["Visa Availability", "Cost of Living", "Healthcare", "Community", "Climate"],
      "country1": [],
      "country2": [],
      "country3": []
    },
    "conclusion": "[Clear summary highlighting which country is the strongest match, why it fits best, and encouragement for next steps]"
  },
  "footer": {
    "regards": "Warmly,",
    "founder": "Ré",
    "signature": "Adventure Freaksss – Affordable Living Abroad Made Easy"
  }
}

---

📋 Quiz Data: Normalize this into structured input before starting the report.

RAW DATA:
${questions}
`;
}
