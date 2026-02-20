const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Required at registration
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // ✅ ADD THIS ROLE FIELD
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },

  // Profile fields
  phone:     { type: String, default: '' },
  linkedin:  { type: String, default: '' },
  github:    { type: String, default: '' },
  address:   { type: String, default: '' },

  // Academic Details
  cgpa:      { type: Number, default: 0 },
  backlogs:  { type: Number, default: 0 },
  passingYear: { type: Number },

  education: {
    degree:  String,
    branch:  String,
    college: String,
    year:    Number
  },

  // Skills & Experience
  skills:         [String],
  projects:       [{ title: String, description: String, techStack: String }],
  achievements:   [String],
  internships:    [{ company: String, role: String, duration: String }],
  workExperience: { type: Boolean, default: false },

  // Forgot password
  resetToken:       { type: String },
  resetTokenExpiry: { type: Date }

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);