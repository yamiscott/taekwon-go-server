const express = require('express');
const School = require('../models/school');
const Admin = require('../models/admin');
const auth = require('../middleware/auth');

const router = express.Router();

async function getRequester(req) {
  if (!req.user || !req.user.sub) return null;
  return Admin.findById(req.user.sub);
}

// List schools
router.get('/', auth, async (req, res, next) => {
  try {
    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });
    if (requester.role === 'superadmin') {
      const schools = await School.find();
      return res.json(schools);
    }
    // school admin: only their school
    if (!requester.school) return res.json([]);
    const school = await School.findById(requester.school);
    return res.json(school ? [school] : []);
  } catch (err) {
    next(err);
  }
});

// Get single
router.get('/:id', auth, async (req, res, next) => {
  try {
    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ error: 'Not found' });
    if (requester.role !== 'superadmin' && String(requester.school) !== String(school._id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(school);
  } catch (err) {
    next(err);
  }
});

// Create
router.post('/', auth, async (req, res, next) => {
  try {
    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });
    if (requester.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
    const { name, address = '', contact = '' } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const created = await School.create({ name, address, contact });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// Update
router.put('/:id', auth, async (req, res, next) => {
  try {
    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });
    if (requester.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ error: 'Not found' });
    if (req.body.name) school.name = req.body.name;
    if (Object.prototype.hasOwnProperty.call(req.body, 'address')) school.address = req.body.address;
    if (Object.prototype.hasOwnProperty.call(req.body, 'contact')) school.contact = req.body.contact;
    await school.save();
    res.json(school);
  } catch (err) {
    next(err);
  }
});

// Delete
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });
    if (requester.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ error: 'Not found' });
    await School.deleteOne({ _id: school._id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
