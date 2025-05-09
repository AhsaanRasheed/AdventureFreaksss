"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import "../quiz/quiz-styles.css"
import"../globals.css"
import Image from "next/image"

import logo from "../assets/logo.png"

export default function QuizApp() {
  const router = useRouter()

  // Complete quiz data with all 20 questions
  const [questions] = useState([
    {
      id: 1,
      text: "What is your main reason for considering a move overseas?",
      options: [
        { id: "A", text: "To lower my cost of living" },
        { id: "B", text: "For job opportunities" },
        { id: "C", text: "To experience new adventures and personal growth" },
        { id: "D", text: "Because the political climate in the U.S. feels too divided" },
        { id: "E", text: "I feel the U.S. is becoming too liberal" },
        { id: "F", text: "I feel the U.S. is becoming too conservative" },
        { id: "G", text: "To pursue education" },
        { id: "H", text: "Other – please share your reason below" },
      ],
      isMultiSelect: false,
      enableOtherField: true,
    },
    {
      id: 2,
      text: "When would you like to move?",
      options: [
        { id: "A", text: "Within 6 months" },
        { id: "B", text: "6 months to 1 year" },
        { id: "C", text: "1 year to 2 years" },
        { id: "D", text: "2 to 5 years" },
      ],
      isMultiSelect: false,
      enableOtherField: false,
    },
    {
      id: 3,
      text: "Choose your age group.",
      options: [
        { id: "A", text: "Under 25" },
        { id: "B", text: "25-34" },
        { id: "C", text: "35-44" },
        { id: "D", text: "45-54" },
        { id: "E", text: "55-64" },
        { id: "F", text: "65+" },
      ],
      isMultiSelect: false,
      enableOtherField: false,
    },
    {
      id: 4,
      text: "Who will be relocating?",
      options: [
        { id: "A", text: "Just me (solo move)" },
        { id: "B", text: "Two people (my spouse/partner and me)" },
        { id: "C", text: "Three people (includes one dependent)" },
        { id: "D", text: "Four people (includes two dependents)" },
        { id: "E", text: "Five or more people" },
      ],
      isMultiSelect: false,
      enableOtherField: false,
    },
    {
      id: 5,
      text: "What is your household's monthly budget in USD?",
      options: [
        { id: "A", text: "Under $1,000" },
        { id: "B", text: "$1,000 - $2,000" },
        { id: "C", text: "$2,000 - $3,000" },
        { id: "D", text: "$3,000 - $4,000" },
        { id: "E", text: "Over $4,000" },
      ],
      isMultiSelect: false,
      enableOtherField: false,
    },
    {
      id: 6,
      text: "Which region of the world are you most interested in?",
      options: [
        { id: "A", text: "Eastern Europe" },
        { id: "B", text: "Northern, Western, and Southern Europe" },
        { id: "C", text: "North America (U.S., Canada, Mexico)" },
        { id: "D", text: "Central America" },
        { id: "E", text: "South America" },
        { id: "F", text: "Asia" },
        { id: "G", text: "Oceania (Australia, New Zealand)" },
        { id: "H", text: "Africa" },
      ],
      isMultiSelect: false,
      enableOtherField: false,
    },
    {
      id: 7,
      text: "What's your preference?",
      options: [
        { id: "A", text: "Countries with higher costs but excellent infrastructure" },
        {
          id: "B",
          text: "Affordable destinations where my money goes further, allowing for a more luxurious lifestyle than in the U.S. or Canada",
        },
        { id: "C", text: "I'm open to considering both options" },
      ],
      isMultiSelect: false,
      enableOtherField: false,
    },
    {
      id: 8,
      text: "Which visa category best suits your situation?",
      options: [
        { id: "A", text: "Retirement Visa" },
        { id: "B", text: "Work Visa (employment within the country)" },
        { id: "C", text: "Student/Education Visa (studying abroad)" },
        { id: "D", text: "Digital Nomad Visa (remote work)" },
        { id: "E", text: "Investor Visa (real estate, starting a business, or investing in a business)" },
      ],
      isMultiSelect: false,
      enableOtherField: true,
    },
    {
      id: 9,
      text: "How far would you like to be from your home country?",
      options: [
        { id: "A", text: "Less than 6 hours" },
        { id: "B", text: "6-12 hours" },
        { id: "C", text: "12-24 hours" },
      ],
      isMultiSelect: false,
      enableOtherField: false,
    },
    {
      id: 10,
      text: "What timezone do you prefer? (Select all that apply or skip if you have no preference)",
      options: [
        { id: "A", text: "Eastern" },
        { id: "B", text: "Central" },
        { id: "C", text: "Mountain" },
        { id: "D", text: "Pacific" },
      ],
      isMultiSelect: true,
      enableOtherField: false,
    },
    {
      id: 11,
      text: "Which languages do you speak? (Select all that apply)",
      options: [
        { id: "A", text: "English" },
        { id: "B", text: "Spanish" },
        { id: "C", text: "French" },
        { id: "D", text: "Italian" },
        { id: "E", text: "Portuguese" },
        { id: "F", text: "Chinese/Mandarin" },
        { id: "G", text: "Malay" },
        { id: "H", text: "Thai" },
        { id: "I", text: "Turkish" },
        { id: "J", text: "Hindi" },
        { id: "K", text: "German" },
        { id: "L", text: "Dutch" },
        { id: "M", text: "Arabic" },
      ],
      isMultiSelect: true,
      enableOtherField: true,
    },
    {
      id: 12,
      text: "What is your preferred climate?",
      options: [
        { id: "A", text: "Tropical (warm and humid throughout the year)" },
        { id: "B", text: "Temperate (mild with four distinct seasons)" },
        { id: "C", text: "Mediterranean (hot, dry summers and mild, wet winters)" },
        { id: "D", text: "Desert (hot and dry most of the year)" },
        { id: "E", text: "Mountain (cooler temperatures year-round)" },
        { id: "F", text: "Coastal (mild temperatures with ocean breezes)" },
        { id: "G", text: "Polar (cold year-round)" },
      ],
      isMultiSelect: true,
      enableOtherField: false,
    },
    {
      id: 13,
      text: "What features do you prefer?",
      options: [
        { id: "A", text: "Mountains" },
        { id: "B", text: "Beaches" },
        { id: "C", text: "Cities" },
        { id: "D", text: "Countryside" },
        { id: "E", text: "Tropical Islands" },
      ],
      isMultiSelect: true,
      enableOtherField: false,
    },
    {
      id: 14,
      text: "How would you prefer to pay for healthcare while living abroad?",
      options: [
        { id: "A", text: "Out-of-pocket" },
        { id: "B", text: "Universal healthcare" },
        { id: "C", text: "Private international insurance" },
        { id: "D", text: "Insurance through your employer" },
      ],
      isMultiSelect: false,
      enableOtherField: false,
    },
    {
      id: 15,
      text: "What level of healthcare quality do you prefer?",
      options: [
        { id: "A", text: "Top 10% of countries" },
        { id: "B", text: "Top 25% of countries" },
        { id: "C", text: "Top 50% of countries" },
      ],
      isMultiSelect: false,
      enableOtherField: false,
    },
    {
      id: 16,
      text: "What level of safety are you seeking?",
      options: [
        { id: "A", text: "Top 10% of countries" },
        { id: "B", text: "Top 25% of countries" },
        { id: "C", text: "Top 50% of countries" },
      ],
      isMultiSelect: false,
      enableOtherField: false,
    },
    {
      id: 17,
      text: "What level of infrastructure quality are you seeking?",
      options: [
        { id: "A", text: "Top 10% of countries" },
        { id: "B", text: "Top 25% of countries" },
        { id: "C", text: "Top 50% of countries" },
      ],
      isMultiSelect: false,
      enableOtherField: false,
    },
    {
      id: 18,
      text: "What legal rights or practices are important to you in your new country?",
      options: [
        { id: "A", text: "Abortion" },
        { id: "B", text: "Handguns" },
        { id: "C", text: "Gambling" },
        { id: "D", text: "Medical cannabis" },
        { id: "E", text: "Recreational cannabis" },
        { id: "F", text: "Same-sex relationships" },
        { id: "G", text: "Same-sex marriage" },
      ],
      isMultiSelect: true,
      enableOtherField: true,
    },
    {
      id: 19,
      text: "What religious communities would you prefer to be present in your new country?",
      options: [
        { id: "A", text: "Atheist / No religion" },
        { id: "B", text: "Buddhist" },
        { id: "C", text: "Catholic" },
        { id: "D", text: "Hindu" },
        { id: "E", text: "Jewish" },
        { id: "F", text: "Muslim" },
        { id: "G", text: "Protestant" },
      ],
      isMultiSelect: true,
      enableOtherField: true,
    },
    {
      id: 20,
      text: "Which countries are you considering?",
      options: [],
      isMultiSelect: false,
      enableOtherField: true,
      isTextOnly: true,
    },
  ])

  // State to track user answers
  const [userAnswers, setUserAnswers] = useState({})

  // State to track "other" text inputs
  const [otherInputs, setOtherInputs] = useState({})

  // Current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // Calculate completion percentage
  const [completionPercentage, setCompletionPercentage] = useState(0)

  // Add a helper message that appears when trying to click Next without answering
  const [showHelper, setShowHelper] = useState(false)

  // Add these refs after the state declarations (after the showHelper state)
  const questionListRef = useRef(null)
  const questionItemRefs = useRef({})

  // Update completion percentage whenever userAnswers changes
  useEffect(() => {
    const answeredQuestions = Object.keys(userAnswers).length
    const percentage = Math.round((answeredQuestions / questions.length) * 100)
    setCompletionPercentage(percentage)
  }, [userAnswers, questions.length])

  // Add this useEffect after the completion percentage useEffect
  // This will handle scrolling to the current question
  useEffect(() => {
    // Make sure refs are available
    if (questionListRef.current && questionItemRefs.current[currentQuestionIndex]) {
      const listElement = questionListRef.current
      const questionElement = questionItemRefs.current[currentQuestionIndex]
  
      // Check if we're in mobile view (horizontal scroll)
      const isMobileView = window.innerWidth <= 768
  
      if (isMobileView) {
        const currentScrollLeft = listElement.scrollLeft
        const listWidth = listElement.clientWidth
        const questionLeft = questionElement.offsetLeft
        const questionWidth = questionElement.offsetWidth
  
        // Check if the question is not fully visible
        if (questionLeft < currentScrollLeft || questionLeft + questionWidth > currentScrollLeft + listWidth) {
          // Calculate how much of the question is out of view
          let scrollAdjustment = 0;
          
          if (questionLeft < currentScrollLeft) {
            // Question is off to the left - scroll just enough to make it visible
            scrollAdjustment = questionLeft - currentScrollLeft - 30; // 20px buffer
          } else {
            // Question is off to the right - scroll just enough to make it visible
            scrollAdjustment = (questionLeft + questionWidth) - (currentScrollLeft + listWidth) + 30; // 20px buffer
          }
          
          // Apply the minimal scroll adjustment
          listElement.scrollBy({
            left: scrollAdjustment,
            behavior: "smooth",
          });
        }
      } else {
        const currentScrollTop = listElement.scrollTop
        const listHeight = listElement.clientHeight
        const questionTop = questionElement.offsetTop
        const questionHeight = questionElement.offsetHeight
  
        // Check if the question is not fully visible
        if (questionTop < currentScrollTop || questionTop + questionHeight > currentScrollTop + listHeight) {
          // Calculate how much of the question is out of view
          let scrollAdjustment = 0;
          
          if (questionTop < currentScrollTop) {
            // Question is above the visible area - scroll up just enough to make it visible
            scrollAdjustment = questionTop - currentScrollTop - 30; // 20px buffer from top
          } else {
            // Question is below the visible area - scroll down just enough to make it visible
            scrollAdjustment = (questionTop + questionHeight) - (currentScrollTop + listHeight) + 30; // 20px buffer from bottom
          }
          
          // Apply the minimal scroll adjustment
          listElement.scrollBy({
            top: scrollAdjustment,
            behavior: "smooth",
          });
        }
      }
    }
  }, [currentQuestionIndex])

  // Current question
  const currentQuestion = questions[currentQuestionIndex]

  // Check if we're on the last question
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  // Handle option selection
  const handleOptionSelect = (optionId) => {
    const questionId = currentQuestion.id

    if (currentQuestion.isMultiSelect) {
      // For multi-select questions
      setUserAnswers((prev) => {
        const currentSelections = prev[questionId] || []

        // If option is already selected, remove it; otherwise, add it
        if (currentSelections.includes(optionId)) {
          return {
            ...prev,
            [questionId]: currentSelections.filter((id) => id !== optionId),
          }
        } else {
          return {
            ...prev,
            [questionId]: [...currentSelections, optionId],
          }
        }
      })
    } else {
      // For single-select questions
      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: [optionId],
      }))
    }
  }

  // Handle text input for "other" fields or text-only questions
  const handleTextInput = (e) => {
    const questionId = currentQuestion.id
    const text = e.target.value

    setOtherInputs((prev) => ({
      ...prev,
      [questionId]: text,
    }))

    // For text-only questions, also mark as answered when text is entered
    if (currentQuestion.isTextOnly && text.trim() !== "") {
      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: ["TEXT_INPUT"],
      }))
    } else if (currentQuestion.isTextOnly && text.trim() === "") {
      // Remove from answered if text is cleared
      setUserAnswers((prev) => {
        const newAnswers = { ...prev }
        delete newAnswers[questionId]
        return newAnswers
      })
    }
  }

  // Check if an option is selected
  const isOptionSelected = (optionId) => {
    const questionId = currentQuestion.id
    return userAnswers[questionId]?.includes(optionId) || false
  }

  // Check if "other" option is selected
  const isOtherSelected = () => {
    const questionId = currentQuestion.id
    const lastOption = currentQuestion.options[currentQuestion.options.length - 1]

    if (!lastOption) return false

    return userAnswers[questionId]?.includes(lastOption.id) || false
  }

  // Add a function to check if a question is answered
  const isQuestionAnswered = (questionId) => {
    return !!userAnswers[questionId]
  }

  // Add a function to check if the current question is answered
  const isCurrentQuestionAnswered = () => {
    return isQuestionAnswered(currentQuestion.id)
  }

  // Modify the goToNextQuestion function to show the helper message if needed
  const goToNextQuestion = () => {
    const questionId = currentQuestion.id
    // Only allow proceeding if the current question has been answered
    if (userAnswers[questionId] && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (!userAnswers[questionId]) {
      // Show helper message
      setShowHelper(true)
      // Hide it after 3 seconds
      setTimeout(() => {
        setShowHelper(false)
      }, 3000)
    }
  }

  // Navigate to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // Navigate to a specific question
  const goToQuestion = (index) => {
    // Allow navigation to the current question or any previous answered question
    if (index >= 0 && index < questions.length && (index <= currentQuestionIndex || userAnswers[questions[index].id])) {
      setCurrentQuestionIndex(index)
    }
  }

  // Handle finish button click
  const handleFinish = () => {
    const questionId = currentQuestion.id

    // Make sure the last question is answered
    if (userAnswers[questionId]) {
      // Store all answers in localStorage for the payment page to access
      localStorage.setItem("quizAnswers", JSON.stringify(userAnswers))
      localStorage.setItem("quizOtherInputs", JSON.stringify(otherInputs))

      // Navigate to payment page
      router.push("/payment")
    } else {
      // Show helper message if the last question isn't answered
      setShowHelper(true)
      setTimeout(() => {
        setShowHelper(false)
      }, 3000)
    }
  }

  return (
    <div className="quiz-container">
      <div className="header">
        <div className="logo">
          <Image src={logo} alt="Adventure Freaks Logo" />
        </div>
        <h1>Find your Destination</h1>
      </div>

      <div className="progress-bar">
        <div className="progress-indicator" style={{ width: `${completionPercentage}%` }}></div>
      </div>
      <div className="completion-text">{completionPercentage}% Complete</div>

      <div className="quiz-content">
        <div className="question-list" ref={questionListRef}>
          {questions.map((question, index) => (
            <div
              key={question.id}
              ref={(el) => (questionItemRefs.current[index] = el)}
              className={`question-item 
                ${index === currentQuestionIndex ? "active" : ""} 
                ${userAnswers[question.id] ? "answered" : ""} 
                ${index > currentQuestionIndex && !userAnswers[question.id] ? "disabled" : ""}`}
              onClick={() => goToQuestion(index)}
            >
              <div className="question-number">{question.id}</div>
              <div className="question-text">{question.text}</div>
            </div>
          ))}
        </div>

        <div className="question-content">
          <div className="question-header">
            <div className="question-number-large">{currentQuestion.id}</div>
            <h2 className="question-title">{currentQuestion.text}</h2>
          </div>

          <div className="options-container-wrapper">
            <div className="options-container">
              {currentQuestion.isTextOnly ? (
                <div className="text-input-container">
                  <textarea
                    className="text-input"
                    placeholder="Type your answer here..."
                    value={otherInputs[currentQuestion.id] || ""}
                    onChange={handleTextInput}
                    rows={4}
                  ></textarea>
                </div>
              ) : (
                <>
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      className={`option ${isOptionSelected(option.id) ? "selected" : ""}`}
                      onClick={() => handleOptionSelect(option.id)}
                    >
                      <div className="option-id">{option.id}</div>
                      <div className="option-text">{option.text}</div>
                      {isOptionSelected(option.id) && <div className="check-icon">✓</div>}
                    </div>
                  ))}

                  {/* Other text input field */}
                  {currentQuestion.enableOtherField && isOtherSelected() && (
                    <div className="other-input-container">
                      <input
                        type="text"
                        className="other-input"
                        placeholder="Please specify..."
                        value={otherInputs[currentQuestion.id] || ""}
                        onChange={handleTextInput}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Update the navigation buttons to show Finish on the last question */}
          <div className="navigation-buttons">
            <button className="prev-button" onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0}>
              Previous
            </button>
            <div className={`navigation-helper ${showHelper ? "visible" : ""}`}>
              Please answer this question before proceeding
            </div>
            {isLastQuestion ? (
              <button className="finish-button" onClick={handleFinish} disabled={!isCurrentQuestionAnswered()}>
                Finish
              </button>
            ) : (
              <button className="next-button" onClick={goToNextQuestion} disabled={!isCurrentQuestionAnswered()}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="footer">
        <p>Copyright © 2025 Adventure Freakssss</p>
      </div>
    </div>
  )
}
