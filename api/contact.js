/**
 * api/contact.js — Vercel Serverless Function
 * ─────────────────────────────────────────────
 * This file enables the contact form to work on Vercel's
 * serverless infrastructure (no Express server needed in prod).
 *
 * Vercel automatically maps /api/contact → this file.
 *
 * This mirrors the functionality in server/controllers/contactController.js
 * but adapted for the Vercel Functions API.
 */

const nodemailer = require('nodemailer');

/* ── Simple validation ──────────────────────────────────── */
const validateBody = ({ name, email, subject, message }) => {
  const errors = [];
  if (!name?.trim() || name.trim().length < 2)          errors.push('Invalid name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim())) errors.push('Invalid email.');
  if (!subject?.trim() || subject.trim().length < 3)    errors.push('Invalid subject.');
  if (!message?.trim() || message.trim().length < 20)   errors.push('Message too short (min 20 chars).');
  return errors;
};

/* ── Serverless Handler ─────────────────────────────────── */
module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { name, email, subject, message } = req.body || {};

  // Validate
  const errors = validateBody({ name, email, subject, message });
  if (errors.length > 0) {
    return res.status(422).json({ success: false, message: errors[0] });
  }

  // Log submission
  console.log(`[Contact Form] ${new Date().toISOString()} | ${name} <${email}> | ${subject}`);

  // Send email if configured
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_TO) {
    try {
      const transporter = nodemailer.createTransport({
        host:   process.env.EMAIL_HOST   || 'smtp.gmail.com',
        port:   parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth:   { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from:    `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to:      process.env.EMAIL_TO,
        subject: `[Portfolio] ${subject}`,
        text:    `From: ${name} <${email}>\n\n${message}`,
        html:    `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
                  <p><strong>Subject:</strong> ${subject}</p>
                  <hr/>
                  <p style="white-space:pre-wrap">${message}</p>`,
      });
    } catch (emailErr) {
      console.error('[Email Error]', emailErr.message);
      // Don't fail the request for email errors — message was received
    }
  }

  return res.status(200).json({
    success: true,
    message: "Message received! I'll respond within 24 hours.",
  });
};
