const mongoose = require('mongoose');

const connect = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydb';
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
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
