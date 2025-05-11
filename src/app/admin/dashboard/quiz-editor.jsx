"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import "./styles.css"
import "../../globals.css"

import Image from "next/image"
import logo from "../../assets/logo.png"

export default function AdminQuizEditor() {
  const router = useRouter()
  const questionListRef = useRef(null)
  const questionItemRefs = useRef({})
  const [adminEmail, setAdminEmail] = useState("")

  const [questions, setQuestions] = useState([
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

  useEffect(() => {
    const email = localStorage.getItem("adminEmail")
    if (email) {
      setAdminEmail(email)
    }
  }, [])

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const [isEditing, setIsEditing] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [showSaveNotification, setShowSaveNotification] = useState(false)
  const [hoveredQuestionIndex, setHoveredQuestionIndex] = useState(null)

  // Add a state to track if there are unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const [showSaveConfirmDialog, setShowSaveConfirmDialog] = useState(false)
  const [pendingQuestionIndex, setPendingQuestionIndex] = useState(null)

  // Initialize editing question when current question changes
  useEffect(() => {
    if (questions[currentQuestionIndex]) {
      setEditingQuestion(JSON.parse(JSON.stringify(questions[currentQuestionIndex])))
    }
  }, [currentQuestionIndex, questions])

  const handleLogout = () => {
    if (isEditing && hasUnsavedChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to logout?")) {
        localStorage.removeItem("adminAuthenticated")
        localStorage.removeItem("adminEmail")
        router.push("/admin")
      }
    } else {
      localStorage.removeItem("adminAuthenticated")
      localStorage.removeItem("adminEmail")
      router.push("/admin")
    }
  }

  // Handle scrolling to the current question in the sidebar
  useEffect(() => {
    if (questionListRef.current && questionItemRefs.current[currentQuestionIndex]) {
      const listElement = questionListRef.current
      const questionElement = questionItemRefs.current[currentQuestionIndex]

      const isMobileView = window.innerWidth <= 768

      if (isMobileView) {
        // For horizontal scrolling (mobile)
        const currentScrollLeft = listElement.scrollLeft
        const listWidth = listElement.clientWidth
        const questionLeft = questionElement.offsetLeft
        const questionWidth = questionElement.offsetWidth

        // Check if the question is not fully visible
        if (questionLeft < currentScrollLeft || questionLeft + questionWidth > currentScrollLeft + listWidth) {
          // Calculate new scroll position to show the current question and a few next ones
          const scrollLeft = Math.max(0, questionLeft - 20)

          listElement.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
          })
        }
      } else {
        // For vertical scrolling (desktop)
        const listHeight = listElement.clientHeight
        const questionHeight = questionElement.offsetHeight
        const questionsPerViewport = Math.floor(listHeight / questionHeight)
        if (currentQuestionIndex > 0) {
          const targetIndex = Math.max(0, currentQuestionIndex - 1)
          const targetElement = questionItemRefs.current[targetIndex]

          if (targetElement) {
            const scrollTop = targetElement.offsetTop

            listElement.scrollTo({
              top: scrollTop,
              behavior: "smooth",
            })
          }
        }
      }
    }
  }, [currentQuestionIndex])

  const currentQuestion = questions[currentQuestionIndex]

  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      if (isEditing && hasUnsavedChanges) {
        setPendingQuestionIndex(index)
        setShowDiscardDialog(true)
      } else {
        setCurrentQuestionIndex(index)
      }
    }
  }

  const handleStartEditing = () => {
    setIsEditing(true)
  }

  const handleDiscardChanges = () => {
    setIsEditing(false)
    setHasUnsavedChanges(false)
    setShowDiscardDialog(false)
    if (pendingQuestionIndex !== null) {
      setCurrentQuestionIndex(pendingQuestionIndex)
      setPendingQuestionIndex(null)
    }
  }

  const handleCancelDiscard = () => {
    setShowDiscardDialog(false)
    setPendingQuestionIndex(null)
  }

  const handleCancelEditing = () => {
    setEditingQuestion(JSON.parse(JSON.stringify(questions[currentQuestionIndex])))
    setIsEditing(false)
    setHasUnsavedChanges(false)
  }

  const handleSaveQuestion = () => {
    setShowSaveConfirmDialog(true)
  }

  const handleConfirmSave = () => {
    const updatedQuestions = [...questions]
    updatedQuestions[currentQuestionIndex] = { ...editingQuestion }
    setQuestions(updatedQuestions)
    setIsEditing(false)
    setHasUnsavedChanges(false)
    setShowSaveConfirmDialog(false)

    setShowSaveNotification(true)
    setTimeout(() => {
      setShowSaveNotification(false)
    }, 3000)
  }

  const handleCancelSave = () => {
    setShowSaveConfirmDialog(false)
  }

  const handleQuestionTextChange = (e) => {
    setEditingQuestion({
      ...editingQuestion,
      text: e.target.value,
    })
    setHasUnsavedChanges(true)
  }

  const handleOptionTextChange = (optionIndex, e) => {
    const updatedOptions = [...editingQuestion.options]
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      text: e.target.value,
    }

    setEditingQuestion({
      ...editingQuestion,
      options: updatedOptions,
    })
    setHasUnsavedChanges(true)
  }

  const handleAddOption = () => {
    const getNextOptionId = () => {
      const lastOption = editingQuestion.options[editingQuestion.options.length - 1]
      if (!lastOption) return "A"

      const lastId = lastOption.id
      if (lastId.length === 1) {
        if (lastId === "Z") return "AA"
        return String.fromCharCode(lastId.charCodeAt(0) + 1)
      }
      const firstChar = lastId.charAt(0)
      const secondChar = lastId.charAt(1)
      if (secondChar === "Z") {
        return String.fromCharCode(firstChar.charCodeAt(0) + 1) + "A"
      }
      return firstChar + String.fromCharCode(secondChar.charCodeAt(0) + 1)
    }

    const newOption = {
      id: getNextOptionId(),
      text: "New option",
    }

    setEditingQuestion({
      ...editingQuestion,
      options: [...editingQuestion.options, newOption],
    })
    setHasUnsavedChanges(true)
  }

  const handleRemoveOption = (optionIndex) => {
    const updatedOptions = [...editingQuestion.options]
    updatedOptions.splice(optionIndex, 1)

    setEditingQuestion({
      ...editingQuestion,
      options: updatedOptions,
    })
    setHasUnsavedChanges(true)
  }

  const handleToggleMultiSelect = () => {
    setEditingQuestion({
      ...editingQuestion,
      isMultiSelect: !editingQuestion.isMultiSelect,
    })
    setHasUnsavedChanges(true)
  }

  const handleToggleOtherField = () => {
    setEditingQuestion({
      ...editingQuestion,
      enableOtherField: !editingQuestion.enableOtherField,
    })
    setHasUnsavedChanges(true)
  }

  const handleAddQuestion = () => {
    const newQuestionId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1

    const newQuestion = {
      id: newQuestionId,
      text: "New Question",
      options: [
        { id: "A", text: "Option A" },
        { id: "B", text: "Option B" },
      ],
      isMultiSelect: false,
      enableOtherField: false,
      isTextOnly: false,
    }

    const updatedQuestions = [...questions, newQuestion]
    setQuestions(updatedQuestions)
    setCurrentQuestionIndex(updatedQuestions.length - 1)
  }

  const handleDeleteQuestion = () => {
    if (questions.length <= 1) {
      alert("You cannot delete the last question.")
      return
    }

    if (confirm("Are you sure you want to delete this question?")) {
      const updatedQuestions = questions.filter((_, index) => index !== currentQuestionIndex)
      setQuestions(updatedQuestions)

      if (currentQuestionIndex >= updatedQuestions.length) {
        setCurrentQuestionIndex(updatedQuestions.length - 1)
      }
    }
  }

  const handleExportQuestions = () => {
    const dataStr = JSON.stringify(questions, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "quiz-questions.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Import questions from JSON file (if needed)
  const handleImportQuestions = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedQuestions = JSON.parse(e.target.result)
        if (Array.isArray(importedQuestions) && importedQuestions.length > 0) {
          setQuestions(importedQuestions)
          setCurrentQuestionIndex(0)
        } else {
          alert("Invalid question format. Please import a valid JSON file.")
        }
      } catch (error) {
        alert("Error parsing JSON file: " + error.message)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="logo">
          <Image src={logo} alt="Adventure Freaks Logo" />
        </div>
        <h1>Quiz Admin Panel</h1>
        <div className="admin-actions">
          <div className="admin-user-info">
            <span className="admin-email">{adminEmail}</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <button className="admin-action-button" onClick={handleExportQuestions}>
            Export Questions
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="question-list" ref={questionListRef}>
          {questions.map((question, index) => (
            <div
              key={question.id}
              ref={(el) => (questionItemRefs.current[index] = el)}
              className={`question-item ${index === currentQuestionIndex ? "active" : ""}`}
              onClick={() => goToQuestion(index)}
              onMouseEnter={() => setHoveredQuestionIndex(index)}
              onMouseLeave={() => setHoveredQuestionIndex(null)}
            >
              <div className="question-number">{question.id}</div>
              <div className="question-text">{question.text}</div>
              {(hoveredQuestionIndex === index || index === currentQuestionIndex) && (
                <div
                  className="question-edit-icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToQuestion(index)
                    handleStartEditing()
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
                <div className="question-number-large">{editingQuestion.id}</div>
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
                      <div key={option.id} className="option-edit-row">
                        <div className="option-id">{option.id}</div>
                        <input
                          type="text"
                          className="option-text-input"
                          value={option.text}
                          onChange={(e) => handleOptionTextChange(index, e)}
                        />
                        <button className="remove-option-button" onClick={() => handleRemoveOption(index)}>
                          ✕
                        </button>
                      </div>
                    ))}
                    <button className="add-option-button" onClick={handleAddOption}>
                      + Add Option
                    </button>
                  </div>

                  <div className="question-actions">
                    <button className="delete-question-button" onClick={handleDeleteQuestion}>
                      Delete Question
                    </button>
                  </div>

                  <div className="edit-actions">
                    <button className="cancel-button" onClick={handleCancelEditing}>
                      Cancel
                    </button>
                    <button className="save-button" onClick={handleSaveQuestion}>
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
                        {editingQuestion.options.map((option) => (
                          <div key={option.id} className="option">
                            <div className="option-id">{option.id}</div>
                            <div className="option-text">{option.text}</div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  <div className="question-settings-display">
                    <div className="setting-display">
                      <span className="setting-label">Multiple Selection:</span>
                      <span className={`setting-value ${editingQuestion.isMultiSelect ? "enabled" : "disabled"}`}>
                        {editingQuestion.isMultiSelect ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div className="setting-display">
                      <span className="setting-label">"Other" Field:</span>
                      <span className={`setting-value ${editingQuestion.enableOtherField ? "enabled" : "disabled"}`}>
                        {editingQuestion.enableOtherField ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div className="setting-display">
                      <span className="setting-label">Text-Only Question:</span>
                      <span className={`setting-value ${editingQuestion.isTextOnly ? "enabled" : "disabled"}`}>
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
  )
}
