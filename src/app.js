require('dotenv').config();
const express = require('express');
const cors = require('cors');
const items = require('./routes/items');
const authRoutes = require('./routes/auth');
const { connect } = require('./db');

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/items', items);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect to DB when app starts (skip during tests)
if (process.env.NODE_ENV !== 'test') {
  connect();
}

module.exports = app;
