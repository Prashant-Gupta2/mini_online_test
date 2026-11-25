const Question = require("../models/Question");
const Attempt = require("../models/Attempt");

exports.startTest = async (req, res) => {
  try {
    const questions = await Question.aggregate([
      { $sample: { size: 10 } }
    ]);

    if (questions.length !== 10) {
      return res.status(400).json({
        message: "Not enough questions"
      });
    }

    const attempt = await Attempt.create({
      userId: req.userId,
      questions: questions.map(q => ({
        questionId: q._id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      })),
      startedAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    res.status(201).json({
      attemptId: attempt._id,
      expiresAt: attempt.expiresAt,
      questions: attempt.questions.map(q => ({
        _id: q.questionId,
        question: q.question,
        options: q.options
      }))
    });

  } catch (error) {
    res.status(500).json({
      message: "Unable to start test"
    });
  }
};
exports.saveAnswer = async (req, res) => {
  try {
    const { questionId, selectedAnswer } = req.body;

    if (
      typeof questionId !== "string" ||
      !/^[a-f0-9]{24}$/i.test(questionId) ||
      !Number.isInteger(selectedAnswer) ||
      selectedAnswer < 0 ||
      selectedAnswer > 3
    ) {
      return res.status(400).json({
        message: "Invalid answer"
      });
    }

    const attempt = await Attempt.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
        status: "in-progress",
        expiresAt: { $gt: new Date() },
        "questions.questionId": questionId
      },
      {
        $set: {
          "questions.$.selectedAnswer": selectedAnswer
        }
      }
    );

    if (!attempt) {
      return res.status(400).json({
        message: "Test expired or unavailable"
      });
    }

    res.json({ message: "Answer saved" });

  } catch (error) {
    res.status(500).json({
      message: "Unable to save answer"
    });
  }
};
exports.submitTest = async (req, res) => {
  try {
    const { id } = req.params;

    const attempt = await Attempt.findOne({
      _id: id,
      userId: req.userId
    });

    if (!attempt) {
      return res.status(404).json({
        message: "Attempt not found"
      });
    }

    // Prevent duplicate submission
    if (attempt.status === "submitted") {
      return res.status(200).json(attempt);
    }

    let score = 0;

    // Calculate score
    attempt.questions.forEach((question) => {
      question.isCorrect =
        question.selectedAnswer != null &&
        question.selectedAnswer === question.correctAnswer;

      if (question.isCorrect) {
        score++;
      }
    });

    attempt.score = score;
    attempt.status = "submitted";
    attempt.submittedAt = new Date();

    await attempt.save();

    return res.status(200).json(attempt);

  } catch (error) {
    console.error("SUBMIT TEST ERROR:", error);

    return res.status(500).json({
      message: "Submission failed",
      error: error.message
    });
  }
};
exports.getHistory = async (req, res) => {
  try {
    const attempts = await Attempt.find({
      userId: req.userId,
      status: "submitted"
    })
      .select("score totalQuestions submittedAt")
      .sort({ submittedAt: -1 });

    res.json(attempts);

  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch history"
    });
  }
};
exports.getResult = async (req, res) => {
  try {
    const result = await Attempt.findOne({
      _id: req.params.id,
      userId: req.userId,
      status: "submitted"
    });

    if (!result) {
      return res.status(404).json({
        message: "Result not found"
      });
    }

    res.json(result);

  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch result"
    });
  }
};