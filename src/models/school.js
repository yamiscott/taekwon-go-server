const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  contact: { type: String },
  logoUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('School', schoolSchema);
