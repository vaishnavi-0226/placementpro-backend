const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  lpa: {
    type: Number,
    required: true
  },
  minCgpa: {
    type: Number,
    required: true
  },
  skills: [{
    type: String
  }],
  isApproved: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);