const express = require("express");
const auth = require("../middleware/authMiddleware");

const {
  startTest,
  saveAnswer,
  submitTest,
  getHistory,
  getResult
} = require("../controllers/testController");

const router = express.Router();

router.use(auth);

router.post("/start", startTest);
router.get("/history", getHistory);
router.patch("/:id/answer", saveAnswer);
router.post("/:id/submit", submitTest);
router.get("/:id/result", getResult);

module.exports = router;