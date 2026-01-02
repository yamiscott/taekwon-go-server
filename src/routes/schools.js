const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const School = require('../models/school');
const Admin = require('../models/admin');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for school logo uploads
const uploadsDir = path.join(__dirname, '../../uploads');
// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'school-logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG and JPG images are allowed'));
    }
  }
});

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

// Upload school logo
router.patch('/:id/logo', auth, upload.single('logo'), async (req, res, next) => {
  try {
    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ error: 'Not found' });
    if (requester.role !== 'superadmin' && String(requester.school) !== String(school._id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    school.logoUrl = '/uploads/' + req.file.filename;
    await school.save();
    res.json(school);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
