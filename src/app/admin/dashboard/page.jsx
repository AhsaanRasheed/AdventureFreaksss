"use client";
import { useState, useRef } from "react";
import AdminQuizEditor from "./quiz-editor";
import {
  fetchQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../../../../lib/service";

export default function AdminPage() {
  const questionListRef = useRef(null);
  const questionItemRefs = useRef({});
  // const [adminEmail, setAdminEmail] = useState("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [hoveredQuestionIndex, setHoveredQuestionIndex] = useState(null);

  // Add a state to track if there are unsaved change
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [showSaveConfirmDialog, setShowSaveConfirmDialog] = useState(false);
  const [pendingQuestionIndex, setPendingQuestionIndex] = useState(null);
  const [questions, setQuestions] = useState([]);

  const getQuestions = async () => {
    try {
      const data = await fetchQuestions();
      setQuestions(data);
    } catch (error) {
      setError("Failed to fetch questions. Please try again later.");
    }
  };

  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      if (isEditing && hasUnsavedChanges) {
        setPendingQuestionIndex(index);
        setShowDiscardDialog(true);
      } else {
        console.log("Setting current question index to", index);

        setCurrentQuestionIndex(index);
      }
    }
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleDiscardChanges = () => {
    setIsEditing(false);
    setHasUnsavedChanges(false);
    setShowDiscardDialog(false);
    if (pendingQuestionIndex !== null) {
      setCurrentQuestionIndex(pendingQuestionIndex);
      setPendingQuestionIndex(null);
    }
  };

  const handleCancelDiscard = () => {
    setShowDiscardDialog(false);
    setPendingQuestionIndex(null);
  };

  const handleCancelEditing = () => {
    setEditingQuestion(
      JSON.parse(JSON.stringify(questions[currentQuestionIndex]))
    );
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  const handleSaveQuestion = () => {
    setShowSaveConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    try {
      // Update on the backend
      await updateQuestion(
        editingQuestion._id, // or questionId
        editingQuestion.text, // updated question text
        editingQuestion.options, // updated answers/options
        editingQuestion.isMultiSelect, // updated isMultiSelect
        editingQuestion.enableOtherField, // updated enableOtherField
        editingQuestion.isTextOnly // updated isTextOnly
      );

      // Update in UI
      await getQuestions();

      setIsEditing(false);
      setHasUnsavedChanges(false);
      setShowSaveConfirmDialog(false);

      setShowSaveNotification(true);
      setTimeout(() => {
        setShowSaveNotification(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save changes:", error);
      setError("Failed to save changes.");
    }
  };

  const handleCancelSave = () => {
    setShowSaveConfirmDialog(false);
  };

  const handleQuestionTextChange = (e) => {
    setEditingQuestion({
      ...editingQuestion,
      text: e.target.value,
    });
    setHasUnsavedChanges(true);
  };

  const handleOptionTextChange = (optionIndex, e) => {
    const updatedOptions = [...editingQuestion.options];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      text: e.target.value,
    };

    setEditingQuestion({
      ...editingQuestion,
      options: updatedOptions,
    });
    setHasUnsavedChanges(true);
  };

  const handleAddOption = () => {
    const newOption = {
      text: "New option",
    };

    setEditingQuestion((prevQuestion) => ({
      ...prevQuestion,
      options: [...prevQuestion.options, newOption],
    }));

    setHasUnsavedChanges(true);
  };

  const handleRemoveOption = (optionIndex) => {
    const updatedOptions = [...editingQuestion.options];
    updatedOptions.splice(optionIndex, 1);

    setEditingQuestion({
      ...editingQuestion,
      options: updatedOptions,
    });
    setHasUnsavedChanges(true);
  };

  const handleToggleMultiSelect = () => {
    console.log("Toggle multi-select", !editingQuestion.isMultiSelect);
    
    setEditingQuestion({
      ...editingQuestion,
      isMultiSelect: !editingQuestion.isMultiSelect,
    });
    setHasUnsavedChanges(true);
  };

  const handleToggleOtherField = () => {
    setEditingQuestion({
      ...editingQuestion,
      enableOtherField: !editingQuestion.enableOtherField,
    });
    setHasUnsavedChanges(true);
  };

  const handleAddQuestion = async () => {
    const newQuestion = {
      text: "New Question",
      options: [{ text: "Option A" }, { text: "Option B" }],
      isMultiSelect: false,
      enableOtherField: false,
      isTextOnly: false,
    };

    try {
      await createQuestion(
        newQuestion.text,
        newQuestion.options,
        newQuestion.isMultiSelect,
        newQuestion.enableOtherField,
        newQuestion.isTextOnly
      );
      const updatedQuestions = [...questions, newQuestion];
      await getQuestions();
      setCurrentQuestionIndex(updatedQuestions.length - 1);
      handleStartEditing();
    } catch (error) {
      setError("Failed to add question. Please try again later.");
    }
  };

  const handleDeleteQuestion = async (id) => {
    console.log("Deleting question", id);

    if (questions.length <= 1) {
      alert("You cannot delete the last question.");
      return;
    }

    if (confirm("Are you sure you want to delete this question?")) {
      const updatedQuestions = questions.filter(
        (_, index) => index !== currentQuestionIndex
      );

      try {
        await deleteQuestion(id);
        await getQuestions();
      } catch (error) {
        setError("Failed to delete question. Please try again later.");
      }

      if (currentQuestionIndex >= updatedQuestions.length) {
        console.log(
          "Setting current question index to last question",
          updatedQuestions.length - 1
        );

        setCurrentQuestionIndex(updateQuestion.length - 1);
      }
      goToQuestion(updatedQuestions.length - 1);
    }
  };

  // const handleExportQuestions = () => {
  //   const dataStr = JSON.stringify(questions, null, 2)
  //   const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

  //   const exportFileDefaultName = "quiz-questions.json"

  //   const linkElement = document.createElement("a")
  //   linkElement.setAttribute("href", dataUri)
  //   linkElement.setAttribute("download", exportFileDefaultName)
  //   linkElement.click()
  // }

  // Import questions from JSON file (if needed)
  // const handleImportQuestions = (e) => {
  //   const file = e.target.files[0]
  //   if (!file) return

  //   const reader = new FileReader()
  //   reader.onload = (e) => {
  //     try {
  //       const importedQuestions = JSON.parse(e.target.result)
  //       if (Array.isArray(importedQuestions) && importedQuestions.length > 0) {
  //         setQuestions(importedQuestions)
  //         setCurrentQuestionIndex(0)
  //       } else {
  //         alert("Invalid question format. Please import a valid JSON file.")
  //       }
  //     } catch (error) {
  //       alert("Error parsing JSON file: " + error.message)
  //     }
  //   }
  //   reader.readAsText(file)
  // }

  return (
    <AdminQuizEditor
      questions={questions}
      currentQuestionIndex={currentQuestionIndex}
      isEditing={isEditing}
      editingQuestion={editingQuestion}
      showSaveNotification={showSaveNotification}
      hoveredQuestionIndex={hoveredQuestionIndex}
      hasUnsavedChanges={hasUnsavedChanges}
      showDiscardDialog={showDiscardDialog}
      showSaveConfirmDialog={showSaveConfirmDialog}
      questionListRef={questionListRef}
      questionItemRefs={questionItemRefs}
      setEditingQuestion={setEditingQuestion}
      setHoveredQuestionIndex={setHoveredQuestionIndex}
      getQuestions={getQuestions}
      goToQuestion={goToQuestion}
      handleStartEditing={handleStartEditing}
      handleDiscardChanges={handleDiscardChanges}
      handleCancelDiscard={handleCancelDiscard}
      handleCancelEditing={handleCancelEditing}
      handleSaveQuestion={handleSaveQuestion}
      handleConfirmSave={handleConfirmSave}
      handleCancelSave={handleCancelSave}
      handleQuestionTextChange={handleQuestionTextChange}
      handleOptionTextChange={handleOptionTextChange}
      handleAddOption={handleAddOption}
      handleRemoveOption={handleRemoveOption}
      handleToggleMultiSelect={handleToggleMultiSelect}
      handleToggleOtherField={handleToggleOtherField}
      handleAddQuestion={handleAddQuestion}
      handleDeleteQuestion={handleDeleteQuestion}
      // handleExportQuestions={handleExportQuestions}
      // handleImportQuestions={handleImportQuestions}
    />
  );
}
