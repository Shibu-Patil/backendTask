const Student = require('../models/Student');

// =============================================================
// Helper: validate 10-digit mobile number
const isValidMobile = (number) => /^[0-9]{10}$/.test(number);

// =============================================================
// ✅ GET all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =============================================================
// ✅ CREATE student
exports.createStudent = async (req, res) => {
  try {
    const { name, email, mobileNumber, batchCode } = req.body;

    // Check required fields
    if (!name || !email || !mobileNumber || !batchCode)
      return res.status(400).json({ error: "All fields are required" });

    // Validate mobile format
    if (!isValidMobile(mobileNumber))
      return res.status(400).json({ error: "Invalid mobile number (10 digits)" });

    // Check for duplicates
    const existingStudent = await Student.findOne({
      $or: [{ email }, { mobileNumber }]
    });

    if (existingStudent)
      return res.status(400).json({
        error:
          existingStudent.email === email
            ? "Email already exists"
            : "Mobile number already exists"
      });

    // Create new student
    const student = new Student({ name, email, mobileNumber, batchCode });
    await student.save();

    res.status(201).json({ message: "Student created successfully", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =============================================================
// ✅ UPDATE student scores (Admin only)
exports.updateScores = async (req, res) => {
  try {
    const { email, mobileNumber, technical, communication, remarks } = req.body;

    // Must provide exactly one identifier
    if ((!email && !mobileNumber) || (email && mobileNumber)) {
      return res.status(400).json({
        error: "Provide either email or mobileNumber, not both"
      });
    }

    const allowedValues = ["*", "1", "2", "3", "remock"];

    // Validate allowed values for scores
    if (
      (technical && !allowedValues.includes(technical)) ||
      (communication && !allowedValues.includes(communication))
    ) {
      return res.status(400).json({
        error:
          "Technical & Communication must be one of 1, 2, 3, '*', or 'remock'"
      });
    }

    // Find student by either email or mobile
    const student = await Student.findOne({
      $or: [{ email }, { mobileNumber }]
    });

    if (!student) return res.status(404).json({ error: "Student not found" });

    // Update only provided fields
    if (technical) student.scores.technical = technical;
    if (communication) student.scores.communication = communication;
    if (remarks !== undefined) student.scores.remarks = remarks;

    await student.save();

    res.json({ message: "Scores updated successfully", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
