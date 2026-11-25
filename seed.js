require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Question = require("./models/Question");

const questions = [
  {
    question: "Which keyword declares a block-scoped variable?",
    options: ["var", "let", "function", "return"],
    correctAnswer: 1
  },
  {
    question: "What is the full form of DOM?",
    options: [
      "Document Object Model",
      "Data Object Model",
      "Digital Object Model",
      "Document Order Model"
    ],
    correctAnswer: 0
  },
  {
    question: "Which hook is used to manage React state?",
    options: [
      "useEffect", "useRef", "useState", "useMemo"
    ],
    correctAnswer: 2
  },
  {
    question: "Which database is used in MERN?",
    options: ["MySQL", "Oracle", "Redis", "MongoDB"],
    correctAnswer: 3
  },
  {
    question: "Which HTTP method commonly creates resources?",
    options: ["GET", "POST", "DELETE", "HEAD"],
    correctAnswer: 1
  },
  {
    question: "What does JWT stand for?",
    options: [
      "Java Web Token",
      "JavaScript Web Tool",
      "JSON Web Token",
      "JSON Web Type"
    ],
    correctAnswer: 2
  },
  {
    question: "Which package is used for password hashing?",
    options: ["bcryptjs", "cors", "axios", "nodemon"],
    correctAnswer: 0
  },
  {
    question: "Which operator checks strict equality?",
    options: ["=", "==", "!=", "==="],
    correctAnswer: 3
  },
  {
    question: "Which framework runs on Node.js?",
    options: ["React", "Express", "Tailwind", "HTML"],
    correctAnswer: 1
  },
  {
    question: "Which status code means Unauthorized?",
    options: ["200", "404", "401", "500"],
    correctAnswer: 2
  }
];

async function seedQuestions() {
  try {
    await connectDB();

    for (const question of questions) {
      await Question.updateOne(
        { question: question.question },
        { $setOnInsert: question },
        { upsert: true }
      );
    }

    console.log("Questions inserted successfully");

  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;

  } finally {
    await mongoose.disconnect();
  }
}

seedQuestions();