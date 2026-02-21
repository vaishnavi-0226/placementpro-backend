const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Alumni = require('../models/Alumni');

// CREATE ALUMNI PROFILE
router.post('/profile', auth, async (req, res) => {
  try {
    const { company, designation, passingYear } = req.body;
    let alumni = await Alumni.findOne({ user: req.user.id });
    if (alumni) {
      alumni.company = company;
      alumni.designation = designation;
      alumni.passingYear = passingYear;
      await alumni.save();
    } else {
      alumni = new Alumni({ user: req.user.id, company, designation, passingYear });
      await alumni.save();
    }
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST JOB REFERRAL
router.post('/referral', auth, async (req, res) => {
  try {
    const { title, company, description, applyLink } = req.body;
    let alumni = await Alumni.findOne({ user: req.user.id });
    if (!alumni) return res.status(404).json({ msg: 'Alumni profile not found' });

    alumni.jobReferrals.push({ title, company, description, applyLink });
    await alumni.save();
    res.json({ message: '✅ Referral posted!', alumni });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL JOB REFERRALS
router.get('/referrals', auth, async (req, res) => {
  try {
    const alumni = await Alumni.find().populate('user', 'name email');
    const referrals = [];
    alumni.forEach(a => {
      a.jobReferrals.forEach(r => {
        referrals.push({
          ...r.toObject(),
          postedBy: a.user?.name,
          alumniCompany: a.company,
          alumniDesignation: a.designation
        });
      });
    });
    res.json(referrals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD MENTORSHIP SLOT
router.post('/mentorship', auth, async (req, res) => {
  try {
    const { date, time, topic } = req.body;
    let alumni = await Alumni.findOne({ user: req.user.id });
    if (!alumni) return res.status(404).json({ msg: 'Alumni profile not found' });

    alumni.mentorshipSlots.push({ date, time, topic });
    await alumni.save();
    res.json({ message: '✅ Mentorship slot added!', alumni });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL MENTORSHIP SLOTS
router.get('/mentorship', auth, async (req, res) => {
  try {
    const alumni = await Alumni.find().populate('user', 'name email');
    const slots = [];
    alumni.forEach(a => {
      a.mentorshipSlots.forEach(s => {
        slots.push({
          ...s.toObject(),
          alumniName: a.user?.name,
          alumniCompany: a.company,
          alumniDesignation: a.designation,
          alumniId: a._id
        });
      });
    });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BOOK MENTORSHIP SLOT
router.put('/mentorship/:alumniId/:slotId/book', auth, async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.alumniId);
    if (!alumni) return res.status(404).json({ msg: 'Alumni not found' });

    const slot = alumni.mentorshipSlots.id(req.params.slotId);
    if (!slot) return res.status(404).json({ msg: 'Slot not found' });
    if (slot.isBooked) return res.status(400).json({ msg: 'Slot already booked' });

    slot.isBooked = true;
    slot.bookedBy = req.user.id;
    await alumni.save();

    res.json({ message: ' Slot booked successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
