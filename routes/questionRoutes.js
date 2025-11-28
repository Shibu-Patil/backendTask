const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  addQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion
} = require("../controllers/questionController");

router.post("/add-question", protect, addQuestion);
router.put("/question/:id", protect, updateQuestion);
router.delete("/question/:id", protect, deleteQuestion);
router.get("/", getAllQuestions);
router.get("/question/:id", getQuestionById);


module.exports = router;
