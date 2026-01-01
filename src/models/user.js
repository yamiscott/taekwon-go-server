const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  invitedAt: { type: Date, default: Date.now },
  acceptedAt: { type: Date, default: null }
});

module.exports = mongoose.model('User', userSchema);
