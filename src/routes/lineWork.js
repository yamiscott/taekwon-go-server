const express = require('express');
const LineWork = require('../models/lineWork');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all line work
router.get('/', auth, async (req, res, next) => {
  try {
    const lineWork = await LineWork.find().sort({ order: 1 });
    res.json(lineWork);
  } catch (err) {
    next(err);
  }
});

// Get line work by belt
router.get('/belt/:belt', auth, async (req, res, next) => {
  try {
    const lineWork = await LineWork.find({ belt: req.params.belt }).sort({ order: 1 });
    res.json(lineWork);
  } catch (err) {
    next(err);
  }
});

// Get line work by kup
router.get('/kup/:kup', auth, async (req, res, next) => {
  try {
    const lineWork = await LineWork.find({ kup: req.params.kup }).sort({ order: 1 });
    res.json(lineWork);
  } catch (err) {
    next(err);
  }
});

// Get line work by level (Junior/Adult/Both)
router.get('/level/:level', auth, async (req, res, next) => {
  try {
    const lineWork = await LineWork.find({ level: req.params.level }).sort({ order: 1 });
    res.json(lineWork);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
