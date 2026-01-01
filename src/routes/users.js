const express = require('express');
const User = require('../models/user');
const Admin = require('../models/admin');
const auth = require('../middleware/auth');

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

// Invite user
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

    const created = await User.create({ email, school: finalSchool });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// Accept invite (mark acceptedAt)
router.post('/:id/accept', async (req, res, next) => {
  try {
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

module.exports = router;
