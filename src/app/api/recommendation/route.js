// app/api/recommendation/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { questions } = await req.json();

  const prompt = generatePrompt(questions);
console.log('prompt', prompt);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'o4-mini',
      messages: [
        { role: 'system', content: 'You are a travel and relocation advisor.' },
        { role: 'user', content: prompt },
      ],
      temperature: 1,
    }),
  });

  const data = await response.json();
  
  const reply = data.choices?.[0]?.message?.content || 'No response';

  return NextResponse.json({ result: reply });
}

function generatePrompt(questions) {
    const qaList = questions.map((q, i) => {
      const answer = Array.isArray(q.answer)
        ? q.answer.filter(Boolean).join(', ')
        : q.answer || 'No answer';
  
      return `${i + 1}. ${q.question}\nAnswer(s): ${answer}`;
    }).join('\n\n');
  
    return `
  Based on the following responses to a lifestyle and travel quiz, recommend the top 3 countries that would best suit the user’s preferences. Provide a short 3 points reason for each recommendation. Do not suggest only those countries which are selected by the user, but also consider other countries if they are a more suitable match and return those in result.
  The user has answered the following questions:
  ${qaList}
  
  Format: Country - Explanation
  `;
  }
  
