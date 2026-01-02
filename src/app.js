require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const items = require('./routes/items');
const authRoutes = require('./routes/auth');
const adminsRoutes = require('./routes/admins');
const usersRoutes = require('./routes/users');
const schoolsRoutes = require('./routes/schools');
const dashboardRoutes = require('./routes/dashboard');
const { connect } = require('./db');

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors({ origin: true }));
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// CMS (admin-side) endpoints (under /cms/*)
app.use('/cms/auth', authRoutes);
app.use('/cms/admins', adminsRoutes);
app.use('/cms/schools', schoolsRoutes);
app.use('/cms/dashboard', dashboardRoutes);

// App (client-side) endpoints
const appAuth = require('./routes/appAuth');
const inviteRoutes = require('./routes/invite');
app.use('/auth', appAuth); // app user auth
app.use('/auth', inviteRoutes); // invite validation
app.use('/cms/users', usersRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect to DB when app starts (skip during tests)
if (process.env.NODE_ENV !== 'test') {
  connect();
}


// Serve frontend static files
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// Serve index.html for all non-API routes (SPA fallback)
app.get(/^\/(?!cms\/|auth\/|api\/).*/, (req, res, next) => {
  // Only handle GET requests that are not API or CMS endpoints
  if (req.method !== 'GET') return next();
  res.sendFile(path.join(frontendDist, 'index.html'));
});

module.exports = app;
