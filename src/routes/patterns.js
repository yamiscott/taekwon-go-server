const express = require('express');
const Pattern = require('../models/pattern');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all patterns
router.get('/', auth, async (req, res, next) => {
  try {
    const patterns = await Pattern.find().sort({ order: 1 });
    res.json(patterns);
  } catch (err) {
    next(err);
  }
});

// Get patterns by belt
router.get('/belt/:belt', auth, async (req, res, next) => {
  try {
    const patterns = await Pattern.find({ belt: req.params.belt }).sort({ order: 1 });
    res.json(patterns);
  } catch (err) {
    next(err);
  }
});

// Get patterns by kup
router.get('/kup/:kup', auth, async (req, res, next) => {
  try {
    const patterns = await Pattern.find({ kup: req.params.kup }).sort({ order: 1 });
    res.json(patterns);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
