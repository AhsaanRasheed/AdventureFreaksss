"use client";

import { useState, useEffect } from "react";
import {
  fetchQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../../../../lib/service";

const AdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [answerList, setAnswerList] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editingAnswer, setEditingAnswer] = useState({
    questionId: null,
    answerIndex: null,
  });
  const [editedQuestionText, setEditedQuestionText] = useState("");
  const [editedAnswerText, setEditedAnswerText] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    getQuestions();
  }, []);

  const getQuestions = async () => {
    try {
      const data = await fetchQuestions();
      setQuestions(data);
    } catch (error) {
      setError("Failed to fetch questions. Please try again later.");
    }
  };
  const handleAddAnswer = () => {
    if (newAnswer.trim() !== "") {
      setAnswerList([...answerList, newAnswer]);
      setNewAnswer("");
    }
  };

  const handleRemoveAnswer = (answerToRemove) => {
    setAnswerList(answerList.filter((a) => a !== answerToRemove));
  };

  const handleAddQuestion = async () => {
    if (newQuestion.trim() === "") {
      setError("Question cannot be empty.");
      return;
    }
    if (answerList.length < 2) {
      setError("A question must have at least two answers.");
      return;
    }

    // const newQuestionAnswer = { question: newQuestion, answers: answerList };

    try {
      await createQuestion(newQuestion, answerList); // Add question to the database
      await getQuestions();
      setNewQuestion("");
      setAnswerList([]);
      setError(null);
    } catch (error) {
      setError("Failed to add question. Please try again later.");
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await deleteQuestion(id);
      await getQuestions();
    } catch (error) {
      setError("Failed to delete question. Please try again later.");
    }
  };

  const startEditingQuestion = (question) => {
    setEditingQuestionId(question._id);
    setEditedQuestionText(question.question);
  };

  const startEditingAnswer = (questionId, index, answer) => {
    setEditingAnswer({ questionId, answerIndex: index });
    setEditedAnswerText(answer);
  };

  const cancelEditingQuestion = () => {
    setEditingQuestionId(null);
    setEditedQuestionText("");
  };

  const cancelEditingAnswer = () => {
    setEditingAnswer({ questionId: null, answerIndex: null });
    setEditedAnswerText("");
  };

  const saveEditedContent = async (questionId, answerIndex = null) => {
    try {
      const updatedQuestion = questions.find((q) => q._id === questionId);

      let updatedQuestionText = updatedQuestion.question;
      let updatedAnswers = [...updatedQuestion.answer];

      if (editingQuestionId === questionId && answerIndex === null) {
        // Editing the question text
        updatedQuestionText = editedQuestionText;
      }

      if (editingAnswer.questionId === questionId && answerIndex !== null) {
        // Editing an answer
        updatedAnswers[answerIndex] = editedAnswerText;
      }

      await updateQuestion(questionId, updatedQuestionText, updatedAnswers);

      // Update the state with the updated question
      await getQuestions();

      setEditingQuestionId(null);
      setEditedQuestionText("");
      setEditingAnswer({ questionId: null, answerIndex: null });
      setEditedAnswerText("");
    } catch (error) {
      setError("Failed to update content.");
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}

      {/* Add New Question */}
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        <h2>Add a New Question</h2>
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Enter a new question"
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Enter an answer"
            style={{ width: "80%", padding: "8px", marginRight: "10px" }}
          />
          <button onClick={handleAddAnswer} style={{ padding: "8px 12px" }}>
            Add Answer
          </button>
        </div>

        {answerList.length > 0 && (
          <div style={{ marginBottom: "10px" }}>
            <h4>Answers</h4>
            <ul>
              {answerList.map((answer, idx) => (
                <li key={idx} style={{ marginBottom: "5px" }}>
                  {answer}
                  <button
                    onClick={() => handleRemoveAnswer(answer)}
                    style={{
                      marginLeft: "10px",
                      padding: "4px 8px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleAddQuestion}
          style={{
            marginTop: "10px",
            padding: "10px 15px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Question
        </button>
      </div>

      {/* Existing Questions */}
      <div>
        <h2>Existing Questions</h2>
        {questions.length > 0 ? (
          questions.map((question) => (
            <div
              key={String(question._id)}
              style={{
                marginBottom: "20px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              {/* Question Text */}
              <div style={{ display: "flex", alignItems: "center" }}>
                {editingQuestionId === question._id ? (
                  <>
                    <input
                      type="text"
                      value={editedQuestionText}
                      onChange={(e) => setEditedQuestionText(e.target.value)}
                      style={{
                        flexGrow: 1,
                        marginRight: "10px",
                        padding: "5px",
                      }}
                    />
                    {error && (
                      <div style={{ color: "red", marginBottom: "10px" }}>
                        {error}
                      </div>
                    )}
                    <button
                      onClick={() => saveEditedContent(question._id)}
                      style={{
                        backgroundColor: "green",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        border: "none",
                        marginRight: "5px",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => cancelEditingQuestion()}
                      style={{
                        backgroundColor: "gray",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        border: "none",
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <h3 style={{ flexGrow: 1 }}>{question.question}</h3>
                    <button
                      onClick={() => startEditingQuestion(question)}
                      style={{
                        backgroundColor: "blue",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        border: "none",
                      }}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>

              {/* Answers */}
              <ul style={{ marginTop: "10px" }}>
                {question.answer?.map((ans, index) => (
                  <li
                    key={index}
                    style={{
                      marginBottom: "5px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {editingAnswer.questionId === question._id &&
                    editingAnswer.answerIndex === index ? (
                      <>
                        <input
                          type="text"
                          value={editedAnswerText}
                          onChange={(e) => setEditedAnswerText(e.target.value)}
                          style={{
                            flexGrow: 1,
                            marginRight: "10px",
                            padding: "5px",
                          }}
                        />
                        {error && (
                          <div style={{ color: "red", marginBottom: "10px" }}>
                            {error}
                          </div>
                        )}
                        <button
                          onClick={() => saveEditedContent(question._id, index)}
                          style={{
                            backgroundColor: "green",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "5px",
                            border: "none",
                            marginRight: "5px",
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => cancelEditingAnswer()}
                          style={{
                            backgroundColor: "gray",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "5px",
                            border: "none",
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span style={{ flexGrow: 1 }}>{ans}</span>
                        <button
                          onClick={() =>
                            startEditingAnswer(question._id, index, ans)
                          }
                          style={{
                            backgroundColor: "orange",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "5px",
                            border: "none",
                            marginLeft: "10px",
                          }}
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteQuestion(question._id)}
                style={{
                  marginTop: "10px",
                  backgroundColor: "red",
                  color: "white",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete Question
              </button>
            </div>
          ))
        ) : (
          <p>No questions available. Add a new question to get started!</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
