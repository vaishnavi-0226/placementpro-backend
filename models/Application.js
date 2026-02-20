const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Aptitude', 'Technical', 'HR', 'Selected', 'Rejected'],
    default: 'Applied'
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);