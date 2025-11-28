const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  createStudent,
  updateScores,
  studentLogin
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

// Public
router.post('/', createStudent);
router.post('/login', studentLogin);

// Protected (only admin can update scores)
router.get('/',protect, getAllStudents);
router.put('/scores', protect, updateScores);

module.exports = router;
