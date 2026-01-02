const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();
const secret = process.env.JWT_SECRET || 'dev-jwt-secret';

// POST /auth/login (app users, require password)
const bcrypt = require('bcryptjs');
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (!user.acceptedAt) return res.status(403).json({ error: 'Invite not accepted' });
    if (!user.passwordHash) return res.status(403).json({ error: 'No password set' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ sub: String(user._id), email, type: 'user' }, secret, { algorithm: 'HS256', expiresIn: '2h' });
    return res.json({ token });
  } catch (err) {
    next(err);
  }
});

// GET /auth/me
const auth = require('../middleware/auth');
const School = require('../models/school');
router.get('/me', auth, async (req, res, next) => {
  try {
    if (!req.user || !req.user.sub) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findById(req.user.sub).select('-__v');
    if (!user) return res.status(404).json({ error: 'Not found' });
    let schoolName = null;
    if (user.school) {
      const school = await School.findById(user.school).select('name');
      if (school) schoolName = school.name;
    }
    const userObj = user.toObject();
    userObj.school = user.school ? { _id: user.school, name: schoolName } : null;
    return res.json({ user: userObj });
  } catch (err) {
    next(err);
  }
});

// Accept invite and set password (token-based, for app users)
router.post('/accept', async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token and password required' });
    const user = await User.findOne({ inviteToken: token });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });
    if (user.acceptedAt) return res.status(400).json({ error: 'Already accepted' });
    user.acceptedAt = new Date();
    user.passwordHash = await require('bcryptjs').hash(password, 10);
    user.inviteToken = null;
    await user.save();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
