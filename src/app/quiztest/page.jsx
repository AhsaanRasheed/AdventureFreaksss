'use client';
import { useState } from 'react';

export default function QuizPage() {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const questions = [
    {
      label: "1. What is your main reason for considering a move overseas?",
      type: "checkbox",
      options: [
        "To lower my cost of living", "For job opportunities",
        "To experience new adventures and personal growth",
        "Because the political climate in the U.S. feels too divided",
        "I feel the U.S. is becoming too liberal", "I feel the U.S. is becoming too conservative",
        "To pursue education", "Other – please share your reason below"
      ]
    },
    {
      label: "2. When would you like to move?",
      type: "radio",
      options: ["Within 6 months", "6 months to 1 year", "1 year to 2 years", "2 to 5 years"]
    },
    {
      label: "3. Choose your age group.",
      type: "radio",
      options: ["Under 25", "25-34", "35-44", "45-54", "55-64", "65+"]
    },
    {
      label: "4. Who will be relocating?",
      type: "radio",
      options: [
        "Just me (solo move)", "Two people (my spouse/partner and me)",
        "Three people (includes one dependent)", "Four people (includes two dependents)",
        "Five or more people"
      ]
    },
    {
      label: "5. What is your household's monthly budget in USD?",
      type: "radio",
      options: [
        "Under $1,000", "$1,000 - $2,000", "$2,000 - $3,000", "$3,000 - $4,000", "Over $4,000"
      ]
    },
    {
      label: "6. Which region of the world are you most interested in?",
      type: "radio",
      options: [
        "Eastern Europe", "Northern, Western, and Southern Europe", "North America (U.S., Canada, Mexico)",
        "Central America", "South America", "Asia", "Oceania (Australia, New Zealand)", "Africa"
      ]
    },
    {
      label: "7. What’s your preference?",
      type: "radio",
      options: [
        "Countries with higher costs but excellent infrastructure",
        "Affordable destinations where my money goes further",
        "I’m open to considering both options"
      ]
    },
    {
      label: "8. Which visa category best suits your situation?",
      type: "radio",
      options: [
        "Retirement Visa", "Work Visa", "Student/Education Visa", "Digital Nomad Visa", "Investor Visa"
      ]
    },
    {
      label: "9. How far would you like to be from your home country?",
      type: "radio",
      options: ["Less than 6 hours", "6-12 hours", "12-24 hours"]
    },
    {
      label: "10. What timezone do you prefer?",
      type: "checkbox",
      options: ["Eastern", "Central", "Mountain", "Pacific"]
    },
    {
      label: "11. Which languages do you speak?",
      type: "checkbox",
      options: [
        "English", "Spanish", "French", "Italian", "Portuguese",
        "Chinese/Mandarin", "Malay", "Thai", "Turkish",
        "Hindi", "German", "Dutch", "Arabic"
      ]
    },
    {
      label: "12. What is your preferred climate?",
      type: "radio",
      options: ["Tropical", "Temperate", "Mediterranean", "Desert", "Mountain", "Coastal", "Polar"]
    },
    {
      label: "13. What features do you prefer?",
      type: "checkbox",
      options: ["Mountains", "Beaches", "Cities", "Countryside", "Tropical Islands"]
    },
    {
      label: "14. How would you prefer to pay for healthcare?",
      type: "radio",
      options: [
        "Out-of-pocket", "Universal healthcare", "Private international insurance", "Insurance through your employer"
      ]
    },
    {
      label: "15. What level of healthcare quality do you prefer?",
      type: "radio",
      options: ["Top 10% of countries", "Top 25% of countries", "Top 50% of countries"]
    },
    {
      label: "16. What level of safety are you seeking?",
      type: "radio",
      options: ["Top 10% of countries", "Top 25% of countries", "Top 50% of countries"]
    },
    {
      label: "17. What level of infrastructure quality are you seeking?",
      type: "radio",
      options: ["Top 10% of countries", "Top 25% of countries", "Top 50% of countries"]
    },
    {
      label: "18. What legal rights or practices are important to you?",
      type: "checkbox",
      options: [
        "Abortion", "Handguns", "Gambling", "Medical cannabis",
        "Recreational cannabis", "Same-sex relationships", "Same-sex marriage"
      ]
    },
    {
      label: "19. What religious communities would you prefer to be present?",
      type: "checkbox",
      options: [
        "Atheist / No religion", "Buddhist", "Catholic", "Hindu", "Jewish", "Muslim", "Protestant"
      ]
    },
    {
      label: "20. Which countries are you considering?",
      type: "text"
    }
  ];

  const handleChange = (index, value, type) => {
    const key = questions[index].label;
    if (type === 'checkbox') {
      const prev = answers[key] || [];
      setAnswers({
        ...answers,
        [key]: prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      });
    } else {
      setAnswers({ ...answers, [key]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Format all questions to ensure answers are included (even if unanswered)
    const formattedQuestions = questions.map((q) => {
      const value = answers[q.label];
      return {
        answer:
        q.type === 'checkbox'
        ? Array.isArray(value) ? value : []
        : typeof value === 'string' ? value : '',
        question: q.label,
      };
    });

    const res = await fetch('/api/recommendation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions: formattedQuestions })
    });
  
    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };
  

  return (
    <div style={{ padding: '2rem', maxWidth: 800 }}>
      <h1>Relocation Quiz</h1>
      <form onSubmit={handleSubmit}>
        {questions.map((q, i) => (
          <div key={i} style={{ marginBottom: '1.5rem' }}>
            <label><strong>{q.label}</strong></label>
            <div>
              {q.type === 'text' && (
                <input
                  type="text"
                  onChange={(e) => handleChange(i, e.target.value, 'text')}
                  style={{ display: 'block', marginTop: '0.5rem', width: '100%' }}
                />
              )}
              {q.type === 'radio' && q.options.map((opt, j) => (
                <label key={j} style={{ display: 'block', marginTop: '0.5rem' }}>
                  <input
                    type="radio"
                    name={`q-${i}`}
                    value={opt}
                    onChange={() => handleChange(i, opt, 'radio')}
                  /> {opt}
                </label>
              ))}
              {q.type === 'checkbox' && q.options.map((opt, j) => (
                <label key={j} style={{ display: 'block', marginTop: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={(answers[q.label] || []).includes(opt)}
                    onChange={() => handleChange(i, opt, 'checkbox')}
                  /> {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit Quiz'}
        </button>
      </form>
      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Top 3 Country Recommendations</h2>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
