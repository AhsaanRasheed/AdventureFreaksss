// app/api/recommendation/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { questions } = await req.json();
    console.log("Received questions:", JSON.stringify(questions, null, 2));
    

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
        model: "o4-mini", // or 'gpt-3.5-turbo', 'o4-mini' if available
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
You are a Travel Relocation Advisor helping expats and retirees find affordable and sustainable destinations to live abroad.

Your task is to generate a **Personalized Relocation Report** in JSON format for a user based on their quiz answers. This report must provide the top 3 best-fit countries based on their lifestyle goals, budget, visa eligibility, and practical needs.

Follow the criteria below carefully:
1. Recommend only countries where the user is likely eligible for a long-stay visa or residency, based on their age, income, nationality, visa type, etc.
2. Include affordable, eco-friendly, and emerging destination options—even if not explicitly requested—if they better fit the user's goals and lifestyle.
3. Do NOT suggest countries selected by the user **if better matches exist**.
4. Prioritize destinations with good infrastructure, healthcare, affordability, safety, and alignment with the user's values, lifestyle preferences, and timeline.
5. The tone should be professional, helpful, and warm. Always use the user's first name in the report title.

---

Before generating the report, take the following quiz input and normalize it into a structured object with clear key-value pairs (like 'name', 'budget', 'preferredRegion', 'visaType', etc.). Then use that structured data to build the report.

Once done, generate the final output **ONLY** in the following exact JSON structure – no markdown or extra text.

JSON format:
{
  "title": "Relocation Report for [User's Name]",
  "subtitle": "Curated by Ré from Adventure Freaksss",
  "introduction": "[Short professional welcome, recap of user's intent and how this report will help.]",
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
    "description": "[Summary paragraph of findings]",
    "comparisonTable": {
      "factors": ["Visa Availability", "Cost of Living", "Healthcare", "Community", "Climate"],
      "country1": ["✅", "✅", "✅", "✅", "✅"],
      "country2": ["✅", "✅", "❌", "✅", "✅"],
      "country3": ["✅", "❌", "✅", "✅", "✅"]
    },
    "conclusion": "[Warm, clear summary highlighting which country is the best overall match for the user based on their goals, why it fits best, and any secondary recommendations — written like personalized guidance and encouragement for their journey.]"
  },
  "footer": {
    "regards": "Warmly,",
    "founder": "Ré",
    "signature": "Adventure Freaksss – Affordable Living Abroad Made Easy"
  }
}

---

Use the following quiz data to guide your recommendations. Clean and normalize the input before processing.

RAW DATA:
${JSON.stringify(questions, null, 2)}
`;
}
