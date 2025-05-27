import { useEffect } from "react";
import "../quiz/quiz-styles.css";
import "../globals.css";
import Image from "next/image";
import logo from "../assets/logo.png";

export default function QuizFunctions({
  getQuizQuestions,
  questions,
  loading,
  error,
  currentQuestion,
  isLastQuestion,
  isCurrentQuestionAnswered,
  handleOptionSelect,
  handleTextInput,
  isOptionSelected,
  isOtherSelected,
  handleNameChange,
  handleEmailChange,
  handleFinish,
  goToNextQuestion,
  goToPreviousQuestion,
  goToQuestion,
  completionPercentage,
  setCompletionPercentage,
  showHelper,
  helperMessage,
  questionListRef,
  questionItemRefs,
  userAnswers,
  currentQuestionIndex,
  name,
  email,
  emailError,
  otherInputs
}) {
  useEffect(() => {
    localStorage.removeItem("cachedRecommendations");
    localStorage.removeItem("formattedAnswers");
    getQuizQuestions();
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
              {currentQuestionIndex == 0 ? (
                <div className="contact-info-container">
                  <div className="form-group">
                    <input
                      type="text"
                      id="name"
                      className="contact-input"
                      placeholder="Enter your name"
                      value={name}
                      onChange={handleNameChange}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      id="email"
                      className="contact-input"
                      placeholder="Enter your email"
                      value={email}
                      onChange={handleEmailChange}
                    />
                    {emailError && (
                      <div className="email-error">{emailError}</div>
                    )}
                  </div>
                </div>
              ) : currentQuestion.isTextOnly ? (
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
                {currentQuestionIndex == 0 ? "Start Quiz" : "Next"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
