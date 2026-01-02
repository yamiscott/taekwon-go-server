const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper: load requesting admin
async function getRequester(req) {
  if (!req.user || !req.user.sub) return null;
  return Admin.findById(req.user.sub);
}

// List admins
router.get('/', auth, async (req, res, next) => {
  try {
    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });
    if (requester.role === 'superadmin') {
      const admins = await Admin.find().select('-passwordHash').populate('school', 'name');
      return res.json(admins);
    }
    // school admin: only admins in same school
    const admins = await Admin.find({ school: requester.school }).select('-passwordHash').populate('school', 'name');
    return res.json(admins);
  } catch (err) {
    next(err);
  }
});

// Get single admin
router.get('/:id', auth, async (req, res, next) => {
  try {
    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });
    const target = await Admin.findById(req.params.id).select('-passwordHash');
    if (!target) return res.status(404).json({ error: 'Not found' });
    if (requester.role !== 'superadmin' && String(target.school) !== String(requester.school)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return res.json(target);
  } catch (err) {
    next(err);
  }
});

// Create admin
router.post('/', auth, async (req, res, next) => {
  try {
    const { email, password, role = 'school', school = null } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });

    // Only superadmin can create superadmin or assign another school; school admins can only create school admins for their own school
    if (requester.role !== 'superadmin') {
      if (role === 'superadmin') return res.status(403).json({ error: 'Forbidden' });
      // enforce school to be requester's school
      if (!requester.school) return res.status(403).json({ error: 'No school assigned' });
      req.body.school = requester.school;
    }

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Admin already exists' });

    const hash = await bcrypt.hash(password, 10);
    const created = await Admin.create({ email, passwordHash: hash, role, school: req.body.school || null });
    const out = created.toObject();
    delete out.passwordHash;
    return res.status(201).json(out);
  } catch (err) {
    next(err);
  }
});

// Update admin
router.put('/:id', auth, async (req, res, next) => {
  try {
    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });
    const target = await Admin.findById(req.params.id);
    if (!target) return res.status(404).json({ error: 'Not found' });

    // Only superadmin may change role to superadmin or change school
    if (req.body.role === 'superadmin' && requester.role !== 'superadmin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (requester.role !== 'superadmin' && String(target.school) !== String(requester.school)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.body.password) {
      target.passwordHash = await bcrypt.hash(req.body.password, 10);
    }
    if (req.body.email) target.email = req.body.email;
    if (req.body.role && requester.role === 'superadmin') target.role = req.body.role;
    if (Object.prototype.hasOwnProperty.call(req.body, 'school') && requester.role === 'superadmin') target.school = req.body.school;

    await target.save();
    const out = target.toObject();
    delete out.passwordHash;
    res.json(out);
  } catch (err) {
    next(err);
  }
});

// Delete admin
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });
    const target = await Admin.findById(req.params.id);
    if (!target) return res.status(404).json({ error: 'Not found' });

    if (requester.role !== 'superadmin' && String(target.school) !== String(requester.school)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await Admin.deleteOne({ _id: target._id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
