const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'dev-jwt-secret';

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: admin._id.toString(), email: admin.email }, secret, { algorithm: 'HS256', expiresIn: '2h' });
  res.json({ token });
});

// GET /auth/me
const auth = require('../middleware/auth');
router.get('/me', auth, async (req, res) => {
  const id = req.user && req.user.sub;
  if (!id) return res.status(401).json({ error: 'Unauthorized' });
  const admin = await Admin.findById(id).select('-passwordHash');
  if (!admin) return res.status(404).json({ error: 'Not found' });
  res.json({ admin });
});

module.exports = router;
