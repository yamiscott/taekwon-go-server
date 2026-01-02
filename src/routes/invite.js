const express = require('express');
const User = require('../models/user');

const router = express.Router();

// GET /auth/validate-invite?token=...
router.get('/validate-invite', async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token required' });
    const user = await User.findOne({ inviteToken: token });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });
    if (user.acceptedAt) return res.status(400).json({ error: 'Already accepted' });
    return res.json({ email: user.email });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
