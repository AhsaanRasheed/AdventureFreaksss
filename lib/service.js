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

export const createQuestion = async (text, options, isMultiSelect , enableOtherField, isTextOnly) => {
  try {
    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        options: options,
        isMultiSelect: isMultiSelect,
        enableOtherField: enableOtherField,
        isTextOnly: isTextOnly,
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

export const updateQuestion = async (id, text, options, isMultiSelect, enableOtherField) => {
  console.log("updateQuestion", id, text, options); // Debugging line

  try {
    const res = await fetch(`/api/quiz`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        text,
        options,
        isMultiSelect, 
        enableOtherField
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


//get recommendations

export const getRecommendations = async (formattedAnswers) => {
  const res = await fetch("/api/recommendation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ questions: formattedAnswers }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  const data = await res.json();
  return data.result; // You can directly return the result
};
