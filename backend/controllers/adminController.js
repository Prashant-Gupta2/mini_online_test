const Question = require("../models/Question");

const isValidQuestion = (question, options, correctAnswer) => {
  return (
    typeof question === "string" &&
    question.trim().length > 0 &&
    Array.isArray(options) &&
    options.length === 4 &&
    options.every(
      option => typeof option === "string" && option.trim()
    ) &&
    Number.isInteger(correctAnswer) &&
    correctAnswer >= 0 &&
    correctAnswer <= 3
  );
};

// Add question
exports.addQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;

    if (!isValidQuestion(question, options, correctAnswer)) {
      return res.status(400).json({
        message: "Invalid question or options"
      });
    }

    const newQuestion = await Question.create({
      question,
      options,
      correctAnswer
    });

    res.status(201).json({
      message: "Question added successfully",
      question: newQuestion
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to add question"
    });
  }
};

// Get all questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .sort({ createdAt: -1 });

    res.status(200).json(questions);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch questions"
    });
  }
};

// Update question
exports.updateQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;

    if (!isValidQuestion(question, options, correctAnswer)) {
      return res.status(400).json({
        message: "Invalid question data"
      });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { question, options, correctAnswer },
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    if (!updatedQuestion) {
      return res.status(404).json({
        message: "Question not found"
      });
    }

    res.json({
      message: "Question updated successfully",
      question: updatedQuestion
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update question"
    });
  }
};

// Delete question
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(
      req.params.id
    );

    if (!question) {
      return res.status(404).json({
        message: "Question not found"
      });
    }

    res.json({
      message: "Question deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete question"
    });
  }
};