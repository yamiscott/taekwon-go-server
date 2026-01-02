// Utility to send emails using SendGrid
const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const CMS_BASE_URL = process.env.CMS_BASE_URL || 'http://localhost:8080';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

async function sendInviteEmail({ to, token, schoolName }) {
  if (!SENDGRID_API_KEY) throw new Error('SendGrid API key not set');
  const link = `${CMS_BASE_URL}/accept?token=${token}`;
  let schoolLine = '';
  if (schoolName) {
    schoolLine = `<p><strong>School:</strong> ${schoolName}</p>`;
  }
  const msg = {
    to,
    from: process.env.SENDGRID_FROM || 'noreply@yourdomain.com',
    subject: 'You are invited to Pocket TKD',
    html: `<p>You have been invited to join Pocket TKD.</p>
           ${schoolLine}
           <p><a href="${link}">Click here to accept your invite and set your password</a></p>
           <p>If you did not expect this, you can ignore this email.</p>`
  };
  await sgMail.send(msg);
}

module.exports = { sendInviteEmail };
