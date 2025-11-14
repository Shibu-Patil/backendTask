const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mailRoutes = require("./routes/mailRoutes");

dotenv.config();
const app = express();

console.log("Email:", process.env.EMAIL_USER);
console.log("Pass exists:", !!process.env.EMAIL_PASS);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

// Routes
app.use('/students', studentRoutes);
app.use('/admin', adminRoutes);
app.use("/api", mailRoutes);

// Health Check Route
app.get('/', (req, res) => {
  res.send('Student Management API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
