const express = require("express");
const router = express.Router();

const {
  submitMultipleResponses,
  getAllResponses,
  getResponsesByStudent,
  getResponsesByQuestion,
  updateResponse,
  deleteResponse
} = require("../controllers/studentResponseController");

const { protect } = require("../middleware/authMiddleware");

// Student submits multiple responses
router.post("/multi", submitMultipleResponses);

// Admin-protected routes
router.get("/", protect, getAllResponses);
router.get("/student/:studentId", protect, getResponsesByStudent);
router.get("/question/:questionId", protect, getResponsesByQuestion);

router.put("/:id", protect, updateResponse);
router.delete("/:id", protect, deleteResponse);

module.exports = router;
