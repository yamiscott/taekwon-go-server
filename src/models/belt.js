const mongoose = require('mongoose');

const beltSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "White", "Yellow Stripe", "Black Grade 1"
  kup: { type: String, required: true }, // e.g., "10th Kup", "PUMA 1", "Il Dan"
  level: { type: String, enum: ['Junior', 'Adult', 'Both'], required: true },
  order: { type: Number, required: true }, // For ordering belts in sequence
  color: { type: String }, // Hex color for display
  isDan: { type: Boolean, default: false }, // True for black belt dans
  isPuma: { type: Boolean, default: false } // True for PUMA junior belts
}, { timestamps: true });

module.exports = mongoose.model('Belt', beltSchema);
