// Scans upcoming events and sends reminders using nodemailer
const cron = require('node-cron');
const Event = require('../models/Event');
const User = require('../models/User');
const nodemailer = require('nodemailer');

let transporter = null;
if (process.env.EMAIL_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

const startReminderJob = () => {
  // runs every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const inFifteen = new Date(now.getTime() + 15 * 60 * 1000);

      // find events starting in the next 15 minutes or so
      const events = await Event.find({
        start: { $gte: now, $lte: inFifteen }
      }).populate('user');

      for (const ev of events) {
        const reminderTime = new Date(ev.start.getTime() - (ev.reminderMinutesBefore || 30) * 60000);
        const diff = Math.abs(reminderTime.getTime() - now.getTime());
        // If reminder time is within ±60s
        if (diff <= 60 * 1000) {
          if (transporter && ev.user && ev.user.email) {
            const mail = {
              from: process.env.EMAIL_FROM,
              to: ev.user.email,
              subject: `Reminder: ${ev.title} starts at ${ev.start.toLocaleString()}`,
              text: `Your event "${ev.title}" will start at ${ev.start.toLocaleString()}.\n\nDescription: ${ev.description || '—'}`
            };
            transporter.sendMail(mail, (err, info) => {
              if (err) console.error('Reminder email error', err);
              else console.log('Reminder email sent', info.response);
            });
          } else {
            console.log(`Reminder: ${ev.title} for ${ev.user?.email || ev.user} starts at ${ev.start}`);
          }
        }
      }
    } catch (err) {
      console.error('Reminder job error:', err);
    }
  });
};

module.exports = { startReminderJob };
