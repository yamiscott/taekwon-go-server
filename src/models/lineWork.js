const mongoose = require('mongoose');

const lineWorkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  belt: { type: String, required: true },
  kup: { type: String, required: true },
  level: { type: String, enum: ['Junior', 'Adult', 'Both'], required: true },
  reps: { type: Number, required: true },
  sets: { type: Number, required: true },
  cadence: { type: Number, required: true },
  order: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('LineWork', lineWorkSchema);
