const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');

// 1️⃣ Get eligible jobs (CGPA + Skills based)
router.get('/feed', auth, async (req, res) => {
  try {
    const student = await User.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const jobs = await Job.find({
      minCgpa: { $lte: student.cgpa },
      isApproved: true,
      skills: { $in: student.skills }  // 🔥 Skill matching
    });

    res.json(jobs);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2️⃣ Apply to job
router.post('/apply/:jobId', auth, async (req, res) => {
  try {
    const existing = await Application.findOne({
      student: req.user.id,
      job: req.params.jobId
    });

    if (existing) {
      return res.status(400).json({ error: 'Already applied' });
    }

    const application = new Application({
      student: req.user.id,
      job: req.params.jobId
    });

    await application.save();

    res.json({ message: 'Applied successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3️⃣ My applications
router.get('/my-applications', auth, async (req, res) => {
  try {
    const apps = await Application.find({
      student: req.user.id
    }).populate('job');

    res.json(apps);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4️⃣ Filter jobs
router.get('/filter', auth, async (req, res) => {
  try {
    const { lpa, designation } = req.query;

    const query = { isApproved: true };

    if (lpa) query.lpa = { $gte: Number(lpa) };
    if (designation) query.designation = new RegExp(designation, 'i');

    const jobs = await Job.find(query);

    res.json(jobs);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 5️⃣ Admin update application status
router.put('/applications/:id/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }

    const { status } = req.body;

    const validStatuses = ['Applied', 'Aptitude', 'Technical', 'HR', 'Selected', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    res.json({ message: '✅ Status updated', application });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;