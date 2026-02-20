const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Drive = require('../models/Drive');
const Application = require('../models/Application');

// GET /api/admin/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }

    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalDrives = await Drive.countDocuments();
    const totalApplications = await Application.countDocuments();
    const selectedStudents = await Application.countDocuments({ status: 'Selected' });
    const rejectedStudents = await Application.countDocuments({ status: 'Rejected' });

    res.json({
      totalStudents,
      totalDrives,
      totalApplications,
      selectedStudents,
      rejectedStudents
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;