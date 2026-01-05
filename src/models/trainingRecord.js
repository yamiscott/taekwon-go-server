const mongoose = require('mongoose');

const trainingRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  activities: { type: [String], required: true },
  duration: { type: Number, required: true } // in minutes
}, { timestamps: true });

// Index for efficient querying by user and date
trainingRecordSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('TrainingRecord', trainingRecordSchema);
