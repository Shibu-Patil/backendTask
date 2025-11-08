const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

const Student = require('./models/Student');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Helper function to validate mobile number
const isValidMobile = (number) => /^[0-9]{10}$/.test(number);

// Routes

// GET all students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create student
app.post('/students', async (req, res) => {
    try {
        const { name, mobileNumber, batchCode } = req.body;

        if (!name || !mobileNumber || !batchCode) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (!isValidMobile(mobileNumber)) {
            return res.status(400).json({ error: "Invalid mobile number (10 digits)" });
        }

        const existingStudent = await Student.findOne({ mobileNumber });
        if (existingStudent) {
            return res.status(400).json({ error: "Mobile number already exists" });
        }

        const student = new Student({ name, mobileNumber, batchCode });
        await student.save();

        res.status(201).json({ message: "Student created", student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update scores & remarks by mobile number
app.put('/students/:mobileNumber/scores', async (req, res) => {
    try {
        const { mobileNumber } = req.params;
        const { technical, communication, remarks } = req.body;

        const allowedValues = ["*", 1, 2, 3, "remock"];

        if ((technical !== undefined && !allowedValues.includes(technical)) ||
            (communication !== undefined && !allowedValues.includes(communication))) {
            return res.status(400).json({ error: "Technical and Communication must be 1,2,3,'*' or 'remock'" });
        }

        const student = await Student.findOne({ mobileNumber });
        if (!student) return res.status(404).json({ error: "Student not found" });

        if (technical !== undefined) student.scores.technical = technical;
        if (communication !== undefined) student.scores.communication = communication;
        if (remarks !== undefined) student.scores.remarks = remarks;

        await student.save();

        res.json({ message: "Scores updated", student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
