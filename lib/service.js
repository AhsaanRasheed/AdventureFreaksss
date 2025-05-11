// src/services.js

export const fetchQuestions = async () => {
  try {
    const res = await fetch("/api/quiz", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch questions: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

export const createQuestion = async (question, answer) => {
  try {
    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
        answer: answer,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to create question: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
};

export const updateQuestion = async (id, question, answer) => {
  console.log("updateQuestion", id, question, answer); // Debugging line

  try {
    const res = await fetch(`/api/quiz`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        question,
        answer,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to update question: ${res.statusText}`);
    }

    console.log("res", res); // Debugging line

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

export const deleteQuestion = async (id) => {
  try {
    const response = await fetch(`/api/quiz`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete question: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting question:", error.message);
    throw error;
  }
};
