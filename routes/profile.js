const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// PUT /api/profile
router.put('/', auth, async (req, res) => {
  try {
    const { cgpa, backlogs, passingYear, skills, education } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { cgpa, backlogs, passingYear, skills, education },
      { new: true }
    ).select('-password');;

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;