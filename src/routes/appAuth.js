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
router.get('/me', auth, async (req, res, next) => {
  try {
    if (!req.user || !req.user.sub) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findById(req.user.sub).select('-__v');
    if (!user) return res.status(404).json({ error: 'Not found' });
    return res.json({ user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
