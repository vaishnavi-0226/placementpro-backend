const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Drive = require('../models/Drive');
const User = require('../models/User');


// =====================================================
// 1️⃣ CREATE DRIVE (Admin Only)
// =====================================================
router.post('/', auth, async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }

    const drive = new Drive({
      companyName: req.body.companyName,
      jobRole: req.body.jobRole,
      minCgpa: req.body.minCgpa,
      maxBacklogs: req.body.maxBacklogs,
      branchesAllowed: req.body.branchesAllowed,
      skillsRequired: req.body.skillsRequired,
      deadline: req.body.deadline,
      createdBy: req.user.id
    });

    await drive.save();

    res.status(201).json(drive);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// 2️⃣ GET ALL DRIVES (Admin View)
// =====================================================
router.get('/', auth, async (req, res) => {
  try {
    const drives = await Drive.find().sort({ createdAt: -1 });
    res.json(drives);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =====================================================
// 3️⃣ CRITERIA ENGINE — GET ELIGIBLE STUDENTS
// =====================================================
router.get('/:driveId/eligible', auth, async (req, res) => {
  try {

    const drive = await Drive.findById(req.params.driveId);

    if (!drive) {
      return res.status(404).json({ msg: 'Drive not found' });
    }

    const students = await User.find({
      role: 'student',
      cgpa: { $gte: drive.minCgpa },
      backlogs: { $lte: drive.maxBacklogs },
      "education.branch": { $in: drive.branchesAllowed },
      skills: { $in: drive.skillsRequired }
    }).select('name email cgpa backlogs education skills');

    res.json({
      drive: drive.companyName,
      eligibleCount: students.length,
      students
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// =====================================================
// 4️⃣ NOTIFY ELIGIBLE STUDENTS
// =====================================================
const nodemailer = require('nodemailer');

router.post('/:id/notify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }

    const drive = await Drive.findById(req.params.id);
    if (!drive) return res.status(404).json({ message: 'Drive not found' });

    const students = await User.find({
      role: 'student',
      cgpa: { $gte: drive.minCgpa },
      backlogs: { $lte: drive.maxBacklogs },
      'education.branch': { $in: drive.branchesAllowed },
      skills: { $in: drive.skillsRequired }
    });

    if (students.length === 0)
      return res.status(200).json({ message: 'No eligible students found' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const emailPromises = students.map(student =>
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: student.email,
        subject: `🎯 New Placement Drive: ${drive.companyName}`,
        html: `
          <h2>Hello ${student.name},</h2>
          <p>You are eligible for <strong>${drive.companyName}</strong>!</p>
          <ul>
            <li><strong>Role:</strong> ${drive.jobRole}</li>
            <li><strong>Min CGPA:</strong> ${drive.minCgpa}</li>
            <li><strong>Max Backlogs:</strong> ${drive.maxBacklogs}</li>
            <li><strong>Deadline:</strong> ${new Date(drive.deadline).toDateString()}</li>
          </ul>
          <p>Login to PlacementPro to apply now!</p>
        `
      })
    );

    await Promise.all(emailPromises);

    res.json({
      message: `✅ Notifications sent to ${students.length} eligible students`,
      notifiedCount: students.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


