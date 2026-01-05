const express = require('express');
const TrainingRecord = require('../models/trainingRecord');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new training record
router.post('/', auth, async (req, res, next) => {
  try {
    const { date, activities, duration } = req.body;
    
    // Validate required fields
    if (!date || !activities || !Array.isArray(activities) || !duration) {
      return res.status(400).json({ 
        error: 'Missing required fields: date, activities (array), and duration are required' 
      });
    }

    if (activities.length === 0) {
      return res.status(400).json({ error: 'Activities array cannot be empty' });
    }

    if (typeof duration !== 'number' || duration <= 0) {
      return res.status(400).json({ error: 'Duration must be a positive number' });
    }

    const trainingRecord = new TrainingRecord({
      user: req.user.id,
      date: new Date(date),
      activities,
      duration
    });

    await trainingRecord.save();
    res.status(201).json(trainingRecord);
  } catch (err) {
    next(err);
  }
});

// Get all training records for the authenticated user
router.get('/', auth, async (req, res, next) => {
  try {
    const { startDate, endDate, limit = 50, skip = 0 } = req.query;
    
    const query = { user: req.user.id };
    
    // Optional date range filtering
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const trainingRecords = await TrainingRecord.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await TrainingRecord.countDocuments(query);
    
    res.json({ 
      records: trainingRecords,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (err) {
    next(err);
  }
});

// Get a specific training record by ID
router.get('/:id', auth, async (req, res, next) => {
  try {
    const trainingRecord = await TrainingRecord.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!trainingRecord) {
      return res.status(404).json({ error: 'Training record not found' });
    }

    res.json(trainingRecord);
  } catch (err) {
    next(err);
  }
});

// Update a training record
router.put('/:id', auth, async (req, res, next) => {
  try {
    const { date, activities, duration } = req.body;
    
    const trainingRecord = await TrainingRecord.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!trainingRecord) {
      return res.status(404).json({ error: 'Training record not found' });
    }

    // Validate updates
    if (activities !== undefined) {
      if (!Array.isArray(activities) || activities.length === 0) {
        return res.status(400).json({ error: 'Activities must be a non-empty array' });
      }
      trainingRecord.activities = activities;
    }

    if (duration !== undefined) {
      if (typeof duration !== 'number' || duration <= 0) {
        return res.status(400).json({ error: 'Duration must be a positive number' });
      }
      trainingRecord.duration = duration;
    }

    if (date !== undefined) {
      trainingRecord.date = new Date(date);
    }

    await trainingRecord.save();
    res.json(trainingRecord);
  } catch (err) {
    next(err);
  }
});

// Delete a training record
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const trainingRecord = await TrainingRecord.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!trainingRecord) {
      return res.status(404).json({ error: 'Training record not found' });
    }

    res.json({ message: 'Training record deleted successfully', deletedRecord: trainingRecord });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
