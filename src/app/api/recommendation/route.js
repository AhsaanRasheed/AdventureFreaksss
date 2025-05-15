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
      result = JSON.parse(reply)
    } catch (e) {
      console.error('Failed to parse JSON reply from OpenAI:', reply)
      result = []
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Recommendation API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

function generatePrompt(questions) {
  return `
Based on the following responses to a lifestyle and travel quiz, recommend the top 3 countries that best suit the user’s preferences.

Do NOT just suggest countries selected by the user — include better matches if relevant.

Each recommendation should include 4–6 short reasons.

Return your answer strictly in this JSON format:

[
  {
    "name": "Country Name",
    "matches": ["reason 1", "reason 2", "reason 3", ...]
  },
  ...
]

The user has answered:
${questions}
`
}
