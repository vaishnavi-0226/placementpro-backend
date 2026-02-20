const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  jobRole: {
    type: String,
    required: true
  },
  minCgpa: {
    type: Number,
    required: true
  },
  maxBacklogs: {
    type: Number,
    default: 0
  },
  branchesAllowed: [{
    type: String
  }],
  skillsRequired: [{
    type: String
  }],
  deadline: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.models.Drive || mongoose.model('Drive', driveSchema);