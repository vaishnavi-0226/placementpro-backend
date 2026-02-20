const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Required at registration
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Profile fields (student fills these later)
  phone:          { type: String, default: '' },
  linkedin:       { type: String, default: '' },
  github:         { type: String, default: '' },
  cgpa:           { type: Number, default: 0 },
  skills:         [String],
  projects:       [{ title: String, description: String, techStack: String }],
  achievements:   [String],
  internships:    [{ company: String, role: String, duration: String }],
  workExperience: { type: Boolean, default: false },
  education:      { degree: String, branch: String, college: String, year: Number },
  address:        { type: String, default: '' },

  // Used for forgot password feature
  resetToken:       { type: String },
  resetTokenExpiry: { type: Date }

}, { timestamps: true }); // auto adds createdAt, updatedAt

module.exports = mongoose.model('User', UserSchema);