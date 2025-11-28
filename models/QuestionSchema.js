const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
      unique: true,
    },

    type: {
      type: String,
      enum: ["mcq", "text"],
      required: true,
    },

    questionText: {
      type: String,
      required: true,
    },

    // Only used when type = "mcq"
    options: {
      type: [String],
      default: [],
    },

    // For MCQ → correct option
    // For Text → correct full answer
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed, // string or number
      required: true,
    },

    explanation: {
      type: String,
    },

    tags: {
      type: [String],
      default: [],
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
