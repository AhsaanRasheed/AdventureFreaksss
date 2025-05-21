// app/api/recommendation/route.js
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { questions } = await req.json()

    if (!questions) {
      return NextResponse.json({ error: 'Missing questions' }, { status: 400 })
    }

    const prompt = generatePrompt(questions)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'o4-mini', // or 'gpt-3.5-turbo', 'o4-mini' if available
        messages: [
          {
            role: 'system',
            content: 'You are a helpful travel and relocation advisor.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 1,
      }),
    })

    const data = await response.json()

    let reply = data.choices?.[0]?.message?.content || '[]'
    let result

    try {
      result = reply
    } catch (e) {
      console.error('Failed to parse JSON reply from OpenAI:', reply)
      result = []
    }
    console.log("NextResponse:", NextResponse.json( result))

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Recommendation API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

function generatePrompt(questions) {
  return `
Based on the following responses to a lifestyle and travel quiz, recommend the top 3 countries that best suit the user’s preferences.

Do NOT just suggest countries selected by the user — include better budget-friendly and environmentally friendly matches if relevant.

Write a complete professional Personalized Relocation Report using the data and answers provided by the user and include user's name in the report title. The subtitle of report should be in a smaller font saying "Curated by Ré from Adventure Freaksss"
Show the top 3 countries as top picks, displaying each recommendation separately with country name, short attractive subheading, description, important points which describe benefits and other needs that meet user's preferences and in the end mentiona section which says "Why it's a fit for you". 
Conclude the report with final thoughts with summarizing the countries benefits in a table like format which shows, which country has what by marking tick, and which one suits the best.

Generate the response as asked **strictly in the following JSON format** (do not include any markdown or prose before or after the JSON):

{
  "title": "",
  "subtitle": "",
  "introduction": "",
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
    "description": "",
    "comparisonTable": {
      "factors": [],
      "country1": [],
      "country2": [],
      "country3": []
    },
    "conclusion": ""
  },
  "footer": {
    "regards": "Warmly,",
    "founder": "Ré",
    "signature": "Adventure Freaksss – Affordable Living Abroad Made Easy"
  }
}

Use the following user answers to guide the recommendations:
${questions}
`
}
