const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET PROFILE
// GET /api/profile
// Returns the logged-in student's data
router.get('/', auth, async (req, res) => {
  try {
    // req.user.id comes from auth middleware
    // .select('-password') means don't send password in response
    const user = await User.findById(req.user.id)
      .select('-password -resetToken -resetTokenExpiry');

    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);

  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// UPDATE PROFILE
// PUT /api/profile
// Student sends fields they want to update
router.put('/', auth, async (req, res) => {
  const updates = req.body;
  delete updates.password; // never allow password change here

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates }, // only update fields that were sent
      { new: true }      // return the updated document
    ).select('-password -resetToken -resetTokenExpiry');

    res.json(user);

  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;