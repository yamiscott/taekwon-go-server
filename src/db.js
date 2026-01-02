const mongoose = require('mongoose');

const connect = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydb';
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Ensure an admin exists for initial login
    try {
      const Admin = require('./models/admin');
      const email = 'yaminoscott@gmail.com';
      const existing = await Admin.findOne({ email });
      if (!existing) {
        const crypto = require('crypto');
        const bcrypt = require('bcryptjs');
        const pw = crypto.randomBytes(9).toString('base64').replace(/[^a-zA-Z0-9]/g, 'A').slice(0, 12);
        const hash = await bcrypt.hash(pw, 10);
        // Make the initial seeded admin a superadmin so they can manage the system
        await Admin.create({ email, passwordHash: hash, role: 'superadmin' });
        console.log(`Created admin ${email} (role=superadmin) with password: ${pw}`);
      } else if (existing.role !== 'superadmin') {
        // Promote any existing seeded admin to superadmin (helpful during development)
        existing.role = 'superadmin';
        await existing.save();
        console.log(`Promoted existing admin ${email} to role=superadmin`);
      }
    } catch (err) {
      console.error('Admin seeding error:', err);
    }

    // Seed patterns, belts, and sparring
    try {
      const seedPatterns = require('./utils/seedPatterns');
      const seedBelts = require('./utils/seedBelts');
      const seedSparring = require('./utils/seedSparring');
      await seedBelts();
      await seedPatterns();
      await seedSparring();
    } catch (err) {
      console.error('Data seeding error:', err);
    }

    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // During tests we don't want to retry connecting — it keeps Jest running.
    if (process.env.NODE_ENV === 'test') return;
    setTimeout(connect, 5000);
  }
};

const disconnect = async () => {
  try {
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error disconnecting MongoDB:', err);
  }
};

module.exports = { connect, disconnect };
