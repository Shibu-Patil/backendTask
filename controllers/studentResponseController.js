const StudentResponse = require("../models/StudentResponse");
const Question = require("../models/QuestionSchema");
const Student = require('../models/Student');

// ---------------------- SUBMIT MULTIPLE RESPONSES ----------------------
// exports.submitMultipleResponses = async (req, res) => {
//   try {
//     const { studentId, responses } = req.body;

//     if (!studentId || !Array.isArray(responses)) {
//       return res.status(400).json({
//         success: false,
//         message: "studentId and responses array are required",
//       });
//     }

//     let results = [];

//     for (const item of responses) {
//       const { questionId, response } = item;

//       if (!questionId || response === undefined) continue;

//       // const question = await Question.findById(questionId);
//       const question = await Question.findOne({ questionCode: questionId });

//       if (!question) continue;

//       let isCorrect = null;

//       // Auto-evaluate MCQ
//       if (question.type === "mcq") {
//         isCorrect = question.correctAnswer == response;
//       }

//       const saved = await StudentResponse.create({
//         studentId,
//         questionId,
//         response,
//         isCorrect,
//       });

//       results.push(saved);
//     }

//     res.status(201).json({
//       success: true,
//       message: "Responses submitted successfully",
//       count: results.length,
//       data: results,
//     });

//   } catch (error) {
//     console.error("Error submitting responses:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// exports.submitMultipleResponses = async (req, res) => {
//   try {
//     const { studentId, responses } = req.body;

//     if (!studentId || !Array.isArray(responses)) {
//       return res.status(400).json({
//         success: false,
//         message: "studentId and responses array are required",
//       });
//     }

//     const results = [];

//     for (const item of responses) {
//       const { questionId, response } = item;
//       if (!questionId || response === undefined) continue;

//       // Find the question by questionCode
//       // const question = await Question.findOne({ questionCode: questionId });
//       const question = await Question.findOne({ questionId: questionId });
//       console.log(question);
      
//       if (!question) continue;

//       const saved = await StudentResponse.create({
//         studentId,          // must be ObjectId of student
//         questionId: question._id,  // ObjectId of question
//         response,
//         isCorrect: question.type === "mcq" ? question.correctAnswer == response : null
//       });

//       results.push(saved);
//     }

//     res.status(201).json({
//       success: true,
//       message: "Responses submitted successfully",
//       count: results.length,
//       data: results
//     });

//   } catch (err) {
//     console.error("Error submitting responses:", err);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err.message
//     });
//   }
// };


exports.submitMultipleResponses = async (req, res) => {
  try {
    const { studentId, responses } = req.body;

    if (!studentId || !Array.isArray(responses)) {
      return res.status(400).json({
        success: false,
        message: "studentId and responses array are required",
      });
    }

    const results = [];

    for (const item of responses) {
      const { questionId, response } = item;
      if (!questionId || response === undefined) continue;

      // Find the question by questionId
      const question = await Question.findOne({ questionId: questionId });
      if (!question) continue;

      const saved = await StudentResponse.create({
        studentId,           // ObjectId of student
        questionId: question._id,  // ObjectId of question
        response,
        isCorrect: question.type === "mcq" ? question.correctAnswer == response : null
      });

      results.push(saved);
    }

    // ✅ Mark student as submitted
    await Student.findByIdAndUpdate(studentId, { isSubmitted: true });

    res.status(201).json({
      success: true,
      message: "Responses submitted successfully",
      count: results.length,
      data: results
    });

  } catch (err) {
    console.error("Error submitting responses:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
};

// ---------------------- GET ALL RESPONSES ----------------------
exports.getAllResponses = async (req, res) => {
  try {
    const responses = await StudentResponse
      .find()
      .populate("studentId", "name email")
      .populate("questionId", "questionText type");

    res.status(200).json({
      success: true,
      count: responses.length,
      data: responses,
    });

  } catch (error) {
    console.error("Error fetching responses:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ---------------------- GET RESPONSES BY STUDENT ----------------------
exports.getResponsesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const responses = await StudentResponse
      .find({ studentId })
      .populate("questionId", "questionText correctAnswer type");

    res.status(200).json({
      success: true,
      data: responses,
    });

  } catch (error) {
    console.error("Error fetching student responses:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ---------------------- GET RESPONSES BY QUESTION ----------------------
exports.getResponsesByQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const responses = await StudentResponse
      .find({ questionId })
      .populate("studentId", "name email");

    res.status(200).json({
      success: true,
      data: responses,
    });

  } catch (error) {
    console.error("Error fetching question responses:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ---------------------- UPDATE RESPONSE ----------------------
exports.updateResponse = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await StudentResponse.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Response not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Response updated successfully",
      data: updated,
    });

  } catch (error) {
    console.error("Error updating response:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ---------------------- DELETE RESPONSE ----------------------
exports.deleteResponse = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await StudentResponse.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Response not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Response deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting response:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
