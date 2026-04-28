/**
 * controllers/contactController.js
 * ──────────────────────────────────
 * Handles the contact form POST request.
 *
 * Flow:
 *  1. Reads sanitized/validated body from express-validator
 *  2. Logs the submission (always)
 *  3. Optionally sends an email notification via Nodemailer
 *  4. Returns JSON success or error response
 */

const nodemailer = require('nodemailer');

/* ── In-memory submission log (lightweight, resets on restart) ── */
/* For persistence, swap this with MongoDB / JSON file / a DB      */
const submissions = [];

/**
 * POST /api/contact
 * Body: { name, email, subject, message }
 */
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Build submission record
    const submission = {
      id:        Date.now(),
      name:      name.trim(),
      email:     email.trim().toLowerCase(),
      subject:   subject.trim(),
      message:   message.trim(),
      ip:        req.ip,
      timestamp: new Date().toISOString(),
    };

    // ── 1. Store in memory log ──────────────────────────
    submissions.push(submission);
    console.log(`\n📬 New contact submission #${submissions.length}`);
    console.log(`   From: ${submission.name} <${submission.email}>`);
    console.log(`   Subject: ${submission.subject}`);
    console.log(`   At: ${submission.timestamp}\n`);

    // ── 2. Send email notification (optional) ──────────
    if (
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS &&
      process.env.EMAIL_TO
    ) {
      await sendEmailNotification(submission);
    } else {
      console.log('⚠️  Email not configured — submission logged only.');
      console.log('   Set EMAIL_USER, EMAIL_PASS, EMAIL_TO in .env to enable email.\n');
    }

    // ── 3. Return success ──────────────────────────────
    return res.status(200).json({
      success: true,
      message: 'Message received! I\'ll get back to you within 24 hours.',
    });

  } catch (error) {
    console.error('❌ Contact controller error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

/**
 * Send email notification to the portfolio owner
 * @param {Object} submission — the validated form data
 */
const sendEmailNotification = async (submission) => {
  // Configure transporter (Gmail by default — see .env.example)
  const transporter = nodemailer.createTransport({
    host:   process.env.EMAIL_HOST   || 'smtp.gmail.com',
    port:   parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email to portfolio owner
  const ownerMailOptions = {
    from:    `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to:      process.env.EMAIL_TO,
    subject: `📬 [Portfolio] New message: ${submission.subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; border-radius: 8px; overflow: hidden;">
        <div style="background: #0a0a0f; padding: 24px 32px;">
          <h2 style="color: #00d4ff; margin: 0; font-size: 1.2rem;">New Portfolio Contact</h2>
        </div>
        <div style="padding: 24px 32px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.92rem;">
            <tr>
              <td style="padding: 8px 0; color: #888; width: 90px;">Name</td>
              <td style="padding: 8px 0; font-weight: 600;">${submission.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${submission.email}">${submission.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888;">Subject</td>
              <td style="padding: 8px 0;">${submission.subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888; vertical-align: top;">Message</td>
              <td style="padding: 8px 0; line-height: 1.7; white-space: pre-wrap;">${submission.message}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888;">Sent At</td>
              <td style="padding: 8px 0;">${new Date(submission.timestamp).toLocaleString()}</td>
            </tr>
          </table>
          <div style="margin-top: 24px;">
            <a href="mailto:${submission.email}?subject=Re: ${submission.subject}"
               style="display: inline-block; background: #00d4ff; color: #0a0a0f; padding: 10px 24px;
                      border-radius: 6px; font-weight: 700; text-decoration: none; font-size: 0.88rem;">
              Reply to ${submission.name} →
            </a>
          </div>
        </div>
        <div style="padding: 16px 32px; background: #f0f0f0; font-size: 0.78rem; color: #888;">
          Sent from your Portfolio Contact Form · Submission #${submission.id}
        </div>
      </div>
    `,
  };

  // Auto-reply to the sender
  const autoReplyOptions = {
    from:    `"Alex Carter" <${process.env.EMAIL_USER}>`,  // CUSTOMIZE: name
    to:      submission.email,
    subject: `Got your message, ${submission.name.split(' ')[0]}! 👋`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: auto;">
        <div style="background: #0a0a0f; padding: 24px 32px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #00d4ff; margin: 0;">Hey ${submission.name.split(' ')[0]}! 👋</h2>
        </div>
        <div style="padding: 24px 32px; background: #f9f9f9; border-radius: 0 0 8px 8px;">
          <p>Thanks for reaching out! I've received your message and will get back to you <strong>within 24 hours</strong>.</p>
          <blockquote style="border-left: 3px solid #00d4ff; padding-left: 16px; color: #666; margin: 16px 0;">
            <em>"${submission.message.slice(0, 120)}${submission.message.length > 120 ? '…' : ''}"</em>
          </blockquote>
          <p style="color: #888; font-size: 0.88rem;">In the meantime, feel free to check out my work on
            <a href="https://github.com/alexcarter">GitHub</a> or connect on
            <a href="https://linkedin.com/in/alexcarter-dev">LinkedIn</a>.
          </p>
          <p>Talk soon,<br/><strong>Alex Carter</strong><br/>
            <span style="color: #888; font-size: 0.85rem;">MERN Stack Developer</span>
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(ownerMailOptions);
  await transporter.sendMail(autoReplyOptions);
  console.log('✅ Email notifications sent successfully.');
};

/**
 * GET /api/contact/submissions  (admin endpoint, dev only)
 * Returns all stored submissions for debugging
 */
const getSubmissions = (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  return res.json({ success: true, count: submissions.length, data: submissions });
};

module.exports = { submitContact, getSubmissions };
