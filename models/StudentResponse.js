const mongoose = require("mongoose");

const studentResponseSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    // Student's actual answer
    // MCQ: store selected option ("A", "Paris", etc.)
    // Text: store full written response
    response: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // Store result after checking answer
    isCorrect: {
      type: Boolean,
      default: null, // null = not evaluated yet
    },

    // Extra feedback given by teacher/reviewer
    feedback: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentResponse", studentResponseSchema);
