const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String,  
    unique: true, 
    trim: true, 
    lowercase: true, 
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] 
  },
  mobileNumber: { type: String, required: true, unique: true },
  batchCode: { type: String, required: true, trim: true },
  scores: {
    technical: { type: String, enum: ["*", "1", "2", "3", "remock"], default: "1" },
    communication: { type: String, enum: ["*", "1", "2", "3", "remock"], default: "1" },
    remarks: { type: String, default: "" }
  },
  isSubmitted: { type: Boolean, default: false } // <-- new field
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
