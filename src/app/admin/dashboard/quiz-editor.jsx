import { useEffect } from "react";
import "./styles.css";
import "../../globals.css";

import Image from "next/image";
import logo from "../../assets/logo.png";

import { signOut } from "next-auth/react";

export default function AdminQuizEditor({
  questionListRef,
  questionItemRefs,
  currentQuestionIndex,
  // setAdminEmail,
  isEditing,
  editingQuestion,
  setEditingQuestion,
  showSaveNotification,
  hoveredQuestionIndex,
  setHoveredQuestionIndex,
  showDiscardDialog,
  showSaveConfirmDialog,
  questions,
  getQuestions,
  goToQuestion,
  handleStartEditing,
  handleAddQuestion,
  handleQuestionTextChange,
  handleToggleMultiSelect,
  handleToggleOtherField,
  handleOptionTextChange,
  handleRemoveOption,
  handleAddOption,
  handleDeleteQuestion,
  handleCancelEditing,
  handleSaveQuestion,
  handleCancelDiscard,
  handleDiscardChanges,
  handleCancelSave,
  handleConfirmSave,
}) {
  // useEffect(() => {
  //   const email = localStorage.getItem("adminEmail")
  //   if (email) {
  //     setAdminEmail(email)
  //   }
  // }, [])

  // Fetch questions from the server

  useEffect(() => {
    getQuestions();
  }, []);

  // Initialize editing question when current question changes
  useEffect(() => {
    if (questions[currentQuestionIndex]) {
      setEditingQuestion(
        JSON.parse(JSON.stringify(questions[currentQuestionIndex]))
      );
    }
  }, [currentQuestionIndex, questions]);

  // Handle scrolling to the current question in the sidebar
  useEffect(() => {
    if (
      questionListRef.current &&
      questionItemRefs.current[currentQuestionIndex]
    ) {
      const listElement = questionListRef.current;
      const questionElement = questionItemRefs.current[currentQuestionIndex];

      const isMobileView = window.innerWidth <= 768;

      if (isMobileView) {
        // For horizontal scrolling (mobile)
        const currentScrollLeft = listElement.scrollLeft;
        const listWidth = listElement.clientWidth;
        const questionLeft = questionElement.offsetLeft;
        const questionWidth = questionElement.offsetWidth;

        // Check if the question is not fully visible
        if (
          questionLeft < currentScrollLeft ||
          questionLeft + questionWidth > currentScrollLeft + listWidth
        ) {
          // Calculate new scroll position to show the current question and a few next ones
          const scrollLeft = Math.max(0, questionLeft - 20);

          listElement.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
          });
        }
      } else {
        // For vertical scrolling (desktop)
        const listHeight = listElement.clientHeight;
        const questionHeight = questionElement.offsetHeight;
        if (currentQuestionIndex > 0) {
          const targetIndex = Math.max(0, currentQuestionIndex - 1);
          const targetElement = questionItemRefs.current[targetIndex];

          if (targetElement) {
            const scrollTop = targetElement.offsetTop;

            listElement.scrollTo({
              top: scrollTop,
              behavior: "smooth",
            });
          }
        }
      }
    }
  }, [currentQuestionIndex]);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="logo">
          <Image src={logo} alt="Adventure Freaks Logo" />
        </div>
        <h1>Quiz Admin Panel</h1>
        <div className="admin-actions">
          <div className="admin-user-info">
            {/* <span className="admin-email">{adminEmail}</span> */}
            <button
              className="logout-button"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Logout
            </button>
          </div>
          {/* <button className="admin-action-button" onClick={handleExportQuestions}>
            Export Questions
          </button> */}
        </div>
      </div>

      <div className="admin-content">
        <div className="question-list" ref={questionListRef}>
          {questions.map((question, index) => (
            <div
              key={index}
              ref={(el) => (questionItemRefs.current[index] = el)}
              className={`question-item ${
                index === currentQuestionIndex ? "active" : ""
              }`}
              onClick={() => goToQuestion(index)}
              onMouseEnter={() => setHoveredQuestionIndex(index)}
              onMouseLeave={() => setHoveredQuestionIndex(null)}
            >
              <div className="question-text">{question.text}</div>
              {(hoveredQuestionIndex === index ||
                index === currentQuestionIndex) && (
                <div
                  className="question-edit-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToQuestion(index);
                    handleStartEditing();
                  }}
                >
                  ✎
                </div>
              )}
            </div>
          ))}
          <div className="add-question-button" onClick={handleAddQuestion}>
            + Add New Question
          </div>
        </div>

        <div className="question-content">
          {editingQuestion ? (
            <>
              <div className="question-header">
                {isEditing ? (
                  <input
                    type="text"
                    className="question-title-input"
                    value={editingQuestion.text}
                    onChange={handleQuestionTextChange}
                  />
                ) : (
                  <h2 className="question-title">{editingQuestion.text}</h2>
                )}
                {!isEditing && (
                  <button className="edit-button" onClick={handleStartEditing}>
                    Edit Question
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="editing-container">
                  <div className="question-settings">
                    <div className="setting-group">
                      <label className="setting-label">
                        <input
                          type="checkbox"
                          checked={editingQuestion.isMultiSelect}
                          onChange={handleToggleMultiSelect}
                        />
                        Allow Multiple Selections
                      </label>
                    </div>
                    <div className="setting-group">
                      <label className="setting-label">
                        <input
                          type="checkbox"
                          checked={editingQuestion.enableOtherField}
                          onChange={handleToggleOtherField}
                        />
                        Enable "Other" Field
                      </label>
                    </div>
                  </div>

                  <div className="options-editor">
                    <h3>Options</h3>
                    {editingQuestion.options.map((option, index) => (
                      <div key={index} className="option-edit-row">
                        <input
                          type="text"
                          className="option-text-input"
                          value={option.text}
                          onChange={(e) => handleOptionTextChange(index, e)}
                        />
                        <button
                          className="remove-option-button"
                          onClick={() => handleRemoveOption(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      className="add-option-button"
                      onClick={handleAddOption}
                    >
                      + Add Option
                    </button>
                  </div>

                  <div className="question-actions">
                    <button
                      className="delete-question-button"
                      onClick={() => handleDeleteQuestion(editingQuestion._id)}
                    >
                      Delete Question
                    </button>
                  </div>

                  <div className="edit-actions">
                    <button
                      className="cancel-button"
                      onClick={handleCancelEditing}
                    >
                      Cancel
                    </button>
                    <button
                      className="save-button"
                      onClick={handleSaveQuestion}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="options-container-wrapper">
                  <div className="options-container">
                    {editingQuestion.isTextOnly ? (
                      <div className="text-input-container">
                        <textarea
                          className="text-input"
                          placeholder="Type your answer here..."
                          rows={4}
                          disabled
                        ></textarea>
                      </div>
                    ) : (
                      <>
                        {editingQuestion.options.map((option, index) => (
                          <div key={index} className="option">
                            <div className="option-text">{option.text}</div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  <div className="question-settings-display">
                    <div className="setting-display">
                      <span className="setting-label">Multiple Selection:</span>
                      <span
                        className={`setting-value ${
                          editingQuestion.isMultiSelect ? "enabled" : "disabled"
                        }`}
                      >
                        {editingQuestion.isMultiSelect ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div className="setting-display">
                      <span className="setting-label">"Other" Field:</span>
                      <span
                        className={`setting-value ${
                          editingQuestion.enableOtherField
                            ? "enabled"
                            : "disabled"
                        }`}
                      >
                        {editingQuestion.enableOtherField
                          ? "Enabled"
                          : "Disabled"}
                      </span>
                    </div>
                    <div className="setting-display">
                      <span className="setting-label">Text-Only Question:</span>
                      <span
                        className={`setting-value ${
                          editingQuestion.isTextOnly ? "enabled" : "disabled"
                        }`}
                      >
                        {editingQuestion.isTextOnly ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="loading-message">Loading question...</div>
          )}
        </div>
      </div>

      <div className="admin-footer">
        <p>Copyright © 2025 Adventure Freakssss</p>
      </div>

      {showSaveNotification && (
        <div className="save-notification">
          <div className="save-notification-content">
            <span className="save-icon">✓</span>
            Changes saved successfully!
          </div>
        </div>
      )}

      {showDiscardDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>Discard Changes?</h3>
            <p>You have unsaved changes. Do you want to discard them?</p>
            <div className="dialog-buttons">
              <button className="cancel-button" onClick={handleCancelDiscard}>
                Cancel
              </button>
              <button className="confirm-button" onClick={handleDiscardChanges}>
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaveConfirmDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>Save Changes?</h3>
            <p>Are you sure you want to save these changes?</p>
            <div className="dialog-buttons">
              <button className="cancel-button" onClick={handleCancelSave}>
                Cancel
              </button>
              <button className="confirm-button" onClick={handleConfirmSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
