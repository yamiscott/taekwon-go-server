const mongoose = require('mongoose');

const sparringSchema = new mongoose.Schema({
  name: { type: String, required: true },
  belt: { type: String, required: true },
  kup: { type: String, required: true },
  level: { type: String, enum: ['Junior', 'Adult', 'Both'], required: true },
  order: { type: Number, required: true },
  type: { type: String, enum: ['Three Step', 'Two Step', 'One Step', 'Free'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Sparring', sparringSchema);
