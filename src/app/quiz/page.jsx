"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import "../quiz/quiz-styles.css";
import "../globals.css";

import { fetchQuestions } from "../../../lib/service";
import QuizFunctions from "./quiz-functions";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

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

  // const normalizeAnswers = (userAnswers) => {
  //   const normalized = {};

  //   // Normalize key access by trimming and comparing known label set
  //   const get = (label) => {
  //     const key = Object.keys(userAnswers).find(
  //       (k) => k.trim() === label.trim()
  //     );
  //     return userAnswers[key] || [];
  //   };

  //   // Extract email and name
  //   const userInfo = get("User name and email");
  //   const emailMatch =
  //     Array.isArray(userInfo) && userInfo[0]
  //       ? userInfo[0].match(/Name:\s*(.*),\s*Email:\s*(.*)/)
  //       : null;

  //   if (emailMatch) {
  //     normalized.name = emailMatch[1]?.trim();
  //     normalized.email = emailMatch[2]?.trim();
  //   } else {
  //     normalized.name = "";
  //     normalized.email = "";
  //   }

  //   // Extract other fields
  //   normalized.currentLocation = get("Where do you live?")[0] || "";
  //   normalized.ageGroup = get("Choose your age group.")[0] || "";
  //   normalized.reasonForMove = get("What is your main reason for considering a move overseas?")[0] || "";
  //   normalized.moveTimeline = get("When would you like to move?")[0] || "";
  //   normalized.relocatingWith = get("Who will be relocating?")[0] || "";
  //   normalized.monthlyBudgetUSD = get("What is your household's monthly budget in USD?")[0] || "";
  //   normalized.preferredRegion = get("Which region of the world are you most interested in? (Select all that apply)")|| [];
  //   normalized.lifestylePreference = get("What’s your preference?")[0] || "";
  //   normalized.visaCategory = get("Which visa category best suits your situation?")[0] || "";
  //   normalized.preferredTimezones = get("What timezone do you prefer? (Select all that apply or skip if you have no preference)") || [];
  //   normalized.languagesSpoken = get("Which languages do you speak? (Select all that apply)") || [];
  //   normalized.distanceFromHome = get("How far would you like to be from your home country?")[0] || "";
  //   normalized.preferredClimate = get("What is your preferred climate? (Select all that apply)") || [];
  //   normalized.geographicFeatures = get("What features do you prefer? (Select all that apply)") || [];
  //   normalized.healthcarePayment = get("How would you prefer to pay for healthcare while living abroad?")[0] || "";
  //   normalized.healthcareQuality = get("What level of healthcare quality do you prefer?")[0] || "";
  //   normalized.safetyLevel = get("What level of safety are you seeking? (Rankings are based on stability, war, violent crime, and petty crime. For reference, the U.S. is in the top 50 percentile.)")[0] || "";
  //   normalized.infrastructureQuality = get("What level of infrastructure quality are you seeking? (This includes overall infrastructure, roads, public transportation, and electrical systems. For reference, the U.S. ranks in the top 10%.)")[0] || "";
  //   normalized.legalPreferences = get("What legal rights or practices are important to you in your new country? (Select all that apply)") || [];
  //   normalized.religiousCommunities = get("What religious communities would you prefer to be present in your new country? ") [0] || "";
  //   normalized.countriesConsidered = get("Which countries are you considering? Please list them in the box below.") || [];

  //   return normalized;
  // };

  const getQuizQuestions = async () => {
    try {
      const initialQuestion = {
        id: "1",
        text: "Please provide your name and email",
        options: [],
        isMultiSelect: false,
        enableOtherField: false,
        isTextOnly: false,
      };
      const data = await fetchQuestions();
      const formattedData = data.map((question) => {
        const processedOptions = question.options.map((option, index) => {
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
      const allQuestions = [initialQuestion, ...formattedData];
      setQuestions(allQuestions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setName(name);

    const questionText = "User name and email";
    updateContactInfo(questionText, name, email);
  };

  const handleEmailChange = (e) => {
    const mail = e.target.value;
    setEmail(mail);
    if (mail && !validateEmail(mail)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }

    const questionText = "User name and email";
    updateContactInfo(questionText, name, mail);
  };

  const updateContactInfo = (questionText, name, email) => {
    if (name.trim() !== "" && email.trim() !== "" && validateEmail(email)) {
      setUserAnswers((prev) => ({
        ...prev,
        [questionText]: [`Name: ${name}, Email: ${email}`],
      }));
    } else {
      setUserAnswers((prev) => {
        const updated = { ...prev };
        delete updated[questionText];
        return updated;
      });
    }
  };

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
          updated[questionText] = [text];
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

    if (currentQuestionIndex == 0) {
      return name.trim() !== "" && email.trim() !== "" && !emailError;
    }

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
      localStorage.setItem("formattedAnswers", formattedAnswers);
      router.push("/payment");
    } else {
      setHelperMessage("Please answer this question before proceeding");
      setShowHelper(true);
      setTimeout(() => setShowHelper(false), 3000);
    }
  };

  return (
    <QuizFunctions
      getQuizQuestions={getQuizQuestions}
      questions={questions}
      loading={loading}
      error={error}
      currentQuestion={currentQuestion}
      isLastQuestion={isLastQuestion}
      isCurrentQuestionAnswered={isCurrentQuestionAnswered}
      handleOptionSelect={handleOptionSelect}
      handleTextInput={handleTextInput}
      isOptionSelected={isOptionSelected}
      isOtherSelected={isOtherSelected}
      handleNameChange={handleNameChange}
      handleEmailChange={handleEmailChange}
      handleFinish={handleFinish}
      goToNextQuestion={goToNextQuestion}
      goToPreviousQuestion={goToPreviousQuestion}
      goToQuestion={goToQuestion}
      completionPercentage={completionPercentage}
      setCompletionPercentage={setCompletionPercentage}
      showHelper={showHelper}
      helperMessage={helperMessage}
      questionListRef={questionListRef}
      questionItemRefs={questionItemRefs}
      userAnswers={userAnswers}
      currentQuestionIndex={currentQuestionIndex}
      name={name}
      email={email}
      emailError={emailError}
      otherInputs={otherInputs}
    />
  );
}
