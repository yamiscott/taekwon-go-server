const express = require('express');
const Sparring = require('../models/sparring');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all sparring
router.get('/', auth, async (req, res, next) => {
  try {
    const sparring = await Sparring.find().sort({ order: 1 });
    res.json(sparring);
  } catch (err) {
    next(err);
  }
});

// Get sparring by belt
router.get('/belt/:belt', auth, async (req, res, next) => {
  try {
    const sparring = await Sparring.find({ belt: req.params.belt }).sort({ order: 1 });
    res.json(sparring);
  } catch (err) {
    next(err);
  }
});

// Get sparring by kup
router.get('/kup/:kup', auth, async (req, res, next) => {
  try {
    const sparring = await Sparring.find({ kup: req.params.kup }).sort({ order: 1 });
    res.json(sparring);
  } catch (err) {
    next(err);
  }
});

// Get sparring by type
router.get('/type/:type', auth, async (req, res, next) => {
  try {
    const sparring = await Sparring.find({ type: req.params.type }).sort({ order: 1 });
    res.json(sparring);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
