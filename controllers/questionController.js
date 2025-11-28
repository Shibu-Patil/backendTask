const Question = require("../models/QuestionSchema");

// ---------------------- ADD QUESTION ----------------------
// exports.addQuestion = async (req, res) => {
//   try {
//     const {
//       questionId,
//       type,
//       questionText,
//       options,
//       correctAnswer,
//       explanation,
//       tags,
//       difficulty
//     } = req.body;

//     if (!questionId || !type || !questionText || !correctAnswer) {
//       return res.status(400).json({
//         success: false,
//         message: "questionId, type, questionText, and correctAnswer are required"
//       });
//     }

//     if (type === "mcq" && (!options || options.length < 2)) {
//       return res.status(400).json({
//         success: false,
//         message: "MCQ type must include at least 2 options"
//       });
//     }

//     const newQuestion = new Question({
//       questionId,
//       type,
//       questionText,
//       options: type === "mcq" ? options : [],
//       correctAnswer,
//       explanation,
//       tags,
//       difficulty
//     });

//     const savedQuestion = await newQuestion.save();

//     res.status(201).json({
//       success: true,
//       message: "Question added successfully",
//       data: savedQuestion
//     });
//   } catch (error) {
//     console.error("Error adding question:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };



// controllers/questionController.js
exports.addQuestion = async (req, res) => {
  try {
    const questions = req.body; // Expecting an array of question objects

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of questions",
      });
    }

    const savedQuestions = [];

    for (const q of questions) {
      const {
        questionId,
        type,
        questionText,
        options,
        correctAnswer,
        explanation,
        tags,
        difficulty,
      } = q;

      if (!questionId || !type || !questionText || !correctAnswer) {
        return res.status(400).json({
          success: false,
          message: "questionId, type, questionText, and correctAnswer are required for all questions",
        });
      }

      if (type === "mcq" && (!options || options.length < 2)) {
        return res.status(400).json({
          success: false,
          message: "MCQ type must include at least 2 options",
        });
      }

      const newQuestion = new Question({
        questionId,
        type,
        questionText,
        options: type === "mcq" ? options : [],
        correctAnswer,
        explanation,
        tags,
        difficulty,
      });

      const savedQuestion = await newQuestion.save();
      savedQuestions.push(savedQuestion);
    }

    res.status(201).json({
      success: true,
      message: `${savedQuestions.length} questions added successfully`,
      data: savedQuestions,
    });
  } catch (error) {
    console.error("Error adding questions:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// ---------------------- GET ALL QUESTIONS ----------------------
exports.getAllQuestions = async (req, res) => {
  try {
    const { type, difficulty, tag } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;
    if (tag) filter.tags = tag;

    const questions = (await Question.find(filter)).map((ele)=>({
      questionId:ele.questionId,
      type:ele.type,
      questionText:ele.questionText,

    }));


    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// ---------------------- GET SINGLE QUESTION ----------------------
exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question =
      await Question.findById(id) ||
      await Question.findOne({ questionId: id });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// ---------------------- UPDATE QUESTION ----------------------
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Question.findOneAndUpdate(
      { $or: [{ _id: id }, { questionId: id }] },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// ---------------------- DELETE QUESTION ----------------------
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Question.findOneAndDelete({
      $or: [{ _id: id }, { questionId: id }]
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Question deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
