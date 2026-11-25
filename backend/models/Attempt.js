const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    questions: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        question: String,
        options: [String],
        correctAnswer: Number,
        selectedAnswer: {
          type: Number,
          default: null
        },
        isCorrect: Boolean
      }
    ],
    score: {
      type: Number,
      default: 0
    },
    totalQuestions: {
      type: Number,
      default: 10
    },
    startedAt: Date,
    expiresAt: Date,
    submittedAt: Date,
    status: {
      type: String,
      enum: ["in-progress", "submitted"],
      default: "in-progress"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Attempt",
  attemptSchema
);