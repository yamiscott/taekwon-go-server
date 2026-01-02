const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  invitedAt: { type: Date, default: Date.now },
  acceptedAt: { type: Date, default: null },
  passwordHash: { type: String, default: null },
  inviteToken: { type: String, default: null },
  resetToken: { type: String, default: null },
  resetTokenExpires: { type: Date, default: null },
  belt: { type: mongoose.Schema.Types.ObjectId, ref: 'Belt', default: null },
  isMaster: { type: Boolean, default: false },
  isGrandmaster: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  fullName: { type: String, default: null },
  address: { type: String, default: null }
});

module.exports = mongoose.model('User', userSchema);
