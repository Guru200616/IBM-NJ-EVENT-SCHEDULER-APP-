require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const { startReminderJob } = require('./jobs/reminders');

const app = express();

app.use(cors());
app.use(express.json());

// Connect DB
connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/event_scheduler_db');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Serve client static files (if client placed at ../client)
app.use(express.static(path.join(__dirname, '..', 'client')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// Start reminder job
startReminderJob();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
