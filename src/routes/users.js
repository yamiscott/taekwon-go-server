const express = require('express');
const User = require('../models/user');
const Admin = require('../models/admin');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const router = express.Router();

async function getRequester(req) {
  if (!req.user || !req.user.sub) return null;
  return Admin.findById(req.user.sub);
}

// List users
router.get('/', auth, async (req, res, next) => {
  try {
    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });
    if (requester.role === 'superadmin') {
      const users = await User.find();
      return res.json(users);
    }
    const users = await User.find({ school: requester.school });
    return res.json(users);
  } catch (err) {
    next(err);
  }
});

// Invite user (generates invite token)
router.post('/', auth, async (req, res, next) => {
  try {
    const { email, school } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });

    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });

    let finalSchool = school || null;
    if (requester.role !== 'superadmin') {
      if (!requester.school) return res.status(403).json({ error: 'No school assigned' });
      finalSchool = requester.school;
    }

    const existing = await User.findOne({ email, school: finalSchool });
    if (existing) return res.status(409).json({ error: 'User already invited' });

    const inviteToken = crypto.randomBytes(32).toString('hex');
    const created = await User.create({ email, school: finalSchool, inviteToken });
    // TODO: Send invite email with link containing inviteToken
    res.status(201).json({ ...created.toObject(), inviteToken });
  } catch (err) {
    next(err);
  }
});

// Accept invite and set password (token-based)
router.post('/accept', async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token and password required' });
    const user = await User.findOne({ inviteToken: token });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });
    if (user.acceptedAt) return res.status(400).json({ error: 'Already accepted' });
    user.acceptedAt = new Date();
    user.passwordHash = await bcrypt.hash(password, 10);
    user.inviteToken = null;
    await user.save();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Admin sets user password
router.post('/:id/set-password', auth, async (req, res, next) => {
  try {
    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password required' });
    user.passwordHash = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Request password reset
router.post('/request-reset', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Not found' });
    user.resetToken = crypto.randomBytes(32).toString('hex');
    user.resetTokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await user.save();
    // TODO: Send reset email with link containing resetToken
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Reset password with token
router.post('/reset', async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token and password required' });
    const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });
    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Delete user
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });

    // superadmin can delete any; school admins only their school
    if (requester.role !== 'superadmin') {
      if (!requester.school || String(user.school) !== String(requester.school)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    await User.deleteOne({ _id: user._id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// CMS: Admin sets user as accepted (sets acceptedAt timestamp)
router.post('/:id/accept', auth, async (req, res, next) => {
  try {
    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    if (user.acceptedAt) return res.status(400).json({ error: 'Already accepted' });
    user.acceptedAt = new Date();
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
