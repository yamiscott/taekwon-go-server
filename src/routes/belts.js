const express = require('express');
const Belt = require('../models/belt');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all belts
router.get('/', auth, async (req, res, next) => {
  try {
    const belts = await Belt.find().sort({ order: 1 });
    res.json(belts);
  } catch (err) {
    next(err);
  }
});

// Get belts by level (Junior/Adult/Both)
router.get('/level/:level', auth, async (req, res, next) => {
  try {
    const belts = await Belt.find({ 
      $or: [
        { level: req.params.level },
        { level: 'Both' }
      ]
    }).sort({ order: 1 });
    res.json(belts);
  } catch (err) {
    next(err);
  }
});

// Get a single belt
router.get('/:id', auth, async (req, res, next) => {
  try {
    const belt = await Belt.findById(req.params.id);
    if (!belt) return res.status(404).json({ error: 'Belt not found' });
    res.json(belt);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
