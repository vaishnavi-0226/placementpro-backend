const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  company: String,
  designation: String,
  passingYear: Number,
  jobReferrals: [{
    title: String,
    company: String,
    description: String,
    applyLink: String,
    postedAt: { type: Date, default: Date.now }
  }],
  mentorshipSlots: [{
    date: String,
    time: String,
    topic: String,
    isBooked: { type: Boolean, default: false },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Alumni', alumniSchema);