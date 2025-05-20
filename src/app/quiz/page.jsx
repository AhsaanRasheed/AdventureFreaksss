"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "../quiz/quiz-styles.css";
import "../globals.css";
import Image from "next/image";
import logo from "../assets/logo.png";
import { fetchQuestions } from "../../../lib/service";

export default function QuizApp() {
  const router = useRouter();

  const [userAnswers, setUserAnswers] = useState({});
  const [otherInputs, setOtherInputs] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [showHelper, setShowHelper] = useState(false);
  const [helperMessage, setHelperMessage] = useState(
    "Please answer this question before proceeding"
  );
  const questionListRef = useRef(null);
  const questionItemRefs = useRef({});

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatAnswersForAI = () => {
    let formattedString = "";

    Object.entries(userAnswers).forEach(([question, answers], index) => {
      formattedString += `Question ${index + 1}: ${question}\n`;

      if (Array.isArray(answers) && answers.length > 0) {
        formattedString += `Answer${
          answers.length > 1 ? "s" : ""
        }: ${answers.join(", ")}`;

        const otherText = otherInputs[question];
        if (
          otherText &&
          answers.some((answer) => answer.toLowerCase().includes("other"))
        ) {
          formattedString += ` (${otherText})`;
        }
      }

      formattedString += "\n\n";
    });
    return formattedString.trim();
  };

  const getQuizQuestions = async () => {
    try {
      const data = await fetchQuestions();
      const formattedData = data.map((question) => {
        const processedOptions = question.options.map((option, index) => {
          // Generate option ID (A, B, C, etc.) based on index
          const optionId = String.fromCharCode(65 + index);
          return {
            id: optionId,
            text:
              option.text ||
              option.label ||
              option.value ||
              `Option ${optionId}`,
            isOther:
              (option.text || option.label || "")
                .toLowerCase()
                .includes("other") || false,
          };
        });

        return {
          id: question._id?.$oid || question._id,
          text: question.text,
          options: processedOptions,
          isMultiSelect: question.isMultiSelect,
          enableOtherField: question.enableOtherField,
          isTextOnly: question.isTextOnly,
        };
      });
      setQuestions(formattedData); // Set the formatted quiz data
    } catch (err) {
      setError(err.message); // Handle any errors
    } finally {
      setLoading(false); // Stop loading once the data is fetched
    }
  };

  useEffect(() => {
    getQuizQuestions(); // Call the function to fetch quiz questions
  }, []);

  useEffect(() => {
    const answered = Object.keys(userAnswers).length;
    const percentage = Math.round((answered / questions.length) * 100);
    setCompletionPercentage(percentage || 0);
  }, [userAnswers, questions.length]);

  useEffect(() => {
    if (
      questionListRef.current &&
      questionItemRefs.current[currentQuestionIndex]
    ) {
      const listElement = questionListRef.current;
      const questionElement = questionItemRefs.current[currentQuestionIndex];
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        const currentScrollLeft = listElement.scrollLeft;
        const listWidth = listElement.clientWidth;
        const questionLeft = questionElement.offsetLeft;
        const questionWidth = questionElement.offsetWidth;

        if (
          questionLeft < currentScrollLeft ||
          questionLeft + questionWidth > currentScrollLeft + listWidth
        ) {
          const scrollAdjustment =
            questionLeft < currentScrollLeft
              ? questionLeft - currentScrollLeft - 30
              : questionLeft +
                questionWidth -
                (currentScrollLeft + listWidth) +
                30;

          listElement.scrollBy({ left: scrollAdjustment, behavior: "smooth" });
        }
      } else {
        const currentScrollTop = listElement.scrollTop;
        const listHeight = listElement.clientHeight;
        const questionTop = questionElement.offsetTop;
        const questionHeight = questionElement.offsetHeight;

        if (
          questionTop < currentScrollTop ||
          questionTop + questionHeight > currentScrollTop + listHeight
        ) {
          const scrollAdjustment =
            questionTop < currentScrollTop
              ? questionTop - currentScrollTop - 30
              : questionTop +
                questionHeight -
                (currentScrollTop + listHeight) +
                30;

          listElement.scrollBy({ top: scrollAdjustment, behavior: "smooth" });
        }
      }
    }
  }, [currentQuestionIndex]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleOptionSelect = (optionId) => {
    if (!currentQuestion) return;

    const questionText = currentQuestion.text;
    const selectedOption = currentQuestion.options.find(
      (option) => option.id === optionId
    );

    if (!selectedOption) return;

    const answerText = selectedOption.text;

    if (currentQuestion.isMultiSelect) {
      setUserAnswers((prev) => {
        const currentSelections = prev[questionText] || [];

        if (currentSelections.includes(answerText)) {
          return {
            ...prev,
            [questionText]: currentSelections.filter(
              (text) => text !== answerText
            ),
          };
        } else {
          return {
            ...prev,
            [questionText]: [...currentSelections, answerText],
          };
        }
      });
    } else {
      setUserAnswers((prev) => ({
        ...prev,
        [questionText]: [answerText],
      }));
    }
  };

  const handleTextInput = (e) => {
    if (!currentQuestion) return;

    const questionText = currentQuestion.text;
    const text = e.target.value;

    setOtherInputs((prev) => ({ ...prev, [questionText]: text }));

    if (currentQuestion.isTextOnly) {
      setUserAnswers((prev) => {
        const updated = { ...prev };
        if (text.trim() === "") {
          delete updated[questionText];
        } else {
          updated[questionText] = ["TEXT_INPUT"];
        }
        return updated;
      });
    }
  };

  const isOptionSelected = (optionId) => {
    if (!currentQuestion) return false;

    const questionText = currentQuestion.text;
    const option = currentQuestion.options.find((opt) => opt.id === optionId);

    if (!option) return false;

    const answers = userAnswers[questionText] || [];
    return answers.includes(option.text);
  };

  const isOtherSelected = () => {
    if (!currentQuestion) return false;

    const questionText = currentQuestion.text;
    const answers = userAnswers[questionText] || [];

    return answers.some((answer) => answer.toLowerCase().includes("other"));
  };

  const isCurrentQuestionAnswered = () => {
    if (!currentQuestion) return false;

    const questionText = currentQuestion.text;

    if (!userAnswers[questionText] || userAnswers[questionText].length === 0)
      return false;

    if (isOtherSelected()) {
      const otherText = otherInputs[questionText];
      return otherText && otherText.trim() !== "";
    }
    return true;
  };

  const goToNextQuestion = () => {
    if (
      isOtherSelected() &&
      (!otherInputs[currentQuestion.text] ||
        otherInputs[currentQuestion.text].trim() === "")
    ) {
      setHelperMessage("Please provide details for the 'Other' option");
      setShowHelper(true);
      setTimeout(() => setShowHelper(false), 3000);
      return;
    }

    if (isCurrentQuestionAnswered() && !isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setHelperMessage("Please answer this question before proceeding");
    } else if (!isCurrentQuestionAnswered()) {
      setHelperMessage("Please answer this question before proceeding");
      setShowHelper(true);
      setTimeout(() => setShowHelper(false), 3000);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setHelperMessage("Please answer this question before proceeding");
    }
  };

  const goToQuestion = (index) => {
    const q = questions[index];
    if (
      q &&
      index >= 0 &&
      index < questions.length &&
      (index <= currentQuestionIndex || userAnswers[q.text])
    ) {
      setCurrentQuestionIndex(index);
      setHelperMessage("Please answer this question before proceeding");
    }
  };

  const handleFinish = () => {
    if (
      isOtherSelected() &&
      (!otherInputs[currentQuestion.text] ||
        otherInputs[currentQuestion.text].trim() === "")
    ) {
      setHelperMessage("Please provide details for the 'Other' option");
      setShowHelper(true);
      setTimeout(() => setShowHelper(false), 3000);
      return;
    }

    if (isCurrentQuestionAnswered()) {
      const formattedAnswers = formatAnswersForAI();

      // localStorage.setItem("quizAnswers", JSON.stringify(userAnswers));
      // localStorage.setItem("quizOtherInputs", JSON.stringify(otherInputs));
      localStorage.removeItem("cachedRecommendations");
      localStorage.setItem("formattedAnswers", formattedAnswers);
      router.push("/payment");
    } else {
      setHelperMessage("Please answer this question before proceeding");
      setShowHelper(true);
      setTimeout(() => setShowHelper(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="quiz-container">
        <div className="error-message">
          <h2>No Questions Available</h2>
          <p>There are no quiz questions available at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="header">
        <div className="logo">
          <Image src={logo || "/placeholder.svg"} alt="Adventure Freaks Logo" />
        </div>
        <h1>Find your Destination</h1>
      </div>

      <div className="progress-bar">
        <div
          className="progress-indicator"
          style={{ width: `${completionPercentage}%` }}
        ></div>
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
                ${userAnswers[question.text] ? "answered" : ""} 
                ${
                  index > currentQuestionIndex && !userAnswers[question.text]
                    ? "disabled"
                    : ""
                }`}
              onClick={() => goToQuestion(index)}
            >
              <div className="question-number">{index + 1}</div>
              <div className="question-text">{question.text}</div>
            </div>
          ))}
        </div>

        <div className="question-content">
          <div className="question-header">
            <div className="question-number-large">
              {currentQuestionIndex + 1}
            </div>
            <h2 className="question-title">{currentQuestion.text}</h2>
          </div>

          <div className="options-container-wrapper">
            <div className="options-container">
              {currentQuestion.isTextOnly ? (
                <div className="text-input-container">
                  <textarea
                    className="text-input"
                    placeholder="Type your answer here..."
                    value={otherInputs[currentQuestion.text] || ""}
                    onChange={handleTextInput}
                    rows={4}
                  />
                </div>
              ) : (
                <>
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      className={`option ${
                        isOptionSelected(option.id) ? "selected" : ""
                      }`}
                      onClick={() => handleOptionSelect(option.id)}
                    >
                      <div className="option-id">{option.id}</div>
                      <div className="option-text">{option.text}</div>
                      {isOptionSelected(option.id) && (
                        <div className="check-icon">✓</div>
                      )}
                    </div>
                  ))}

                  {/* Show the "Other" text input field if the "Other" option is selected */}
                  {isOtherSelected() && (
                    <div className="other-input-container">
                      <input
                        type="text"
                        className="other-input"
                        placeholder="Please specify..."
                        value={otherInputs[currentQuestion.text] || ""}
                        onChange={handleTextInput}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="navigation-buttons">
            <button
              className="prev-button"
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <div className={`navigation-helper ${showHelper ? "visible" : ""}`}>
              {helperMessage}
            </div>
            {isLastQuestion ? (
              <button
                className="finish-button"
                onClick={handleFinish}
                disabled={!isCurrentQuestionAnswered()}
              >
                Finish
              </button>
            ) : (
              <button
                className="next-button"
                onClick={goToNextQuestion}
                disabled={!isCurrentQuestionAnswered()}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
