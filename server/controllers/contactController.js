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
const Contact = require('../model/contactSchema');

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

    // ── 1. Store in database ──────────────────────────────
    const contactSubmission = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      ip: req.ip,
    });

    await contactSubmission.save();

    console.log(`\n📬 New contact submission saved to database`);
    console.log(`   From: ${contactSubmission.name} <${contactSubmission.email}>`);
    console.log(`   Subject: ${contactSubmission.subject}`);
    console.log(`   At: ${contactSubmission.timestamp}\n`);

    // ── 2. Send email notification (optional) ──────────
    if (
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS &&
      process.env.EMAIL_TO
    ) {
      await sendEmailNotification(contactSubmission);
    } else {
      console.log('⚠️  Email not configured — submission saved to database only.');
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
 * @param {Object} contactSubmission — the Mongoose contact document
 */
const sendEmailNotification = async (contactSubmission) => {
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
    subject: `📬 [Portfolio] New message: ${contactSubmission.subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; border-radius: 8px; overflow: hidden;">
        <div style="background: #0a0a0f; padding: 24px 32px;">
          <h2 style="color: #00d4ff; margin: 0; font-size: 1.2rem;">New Portfolio Contact</h2>
        </div>
        <div style="padding: 24px 32px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.92rem;">
            <tr>
              <td style="padding: 8px 0; color: #888; width: 90px;">Name</td>
              <td style="padding: 8px 0; font-weight: 600;">${contactSubmission.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${contactSubmission.email}">${contactSubmission.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888;">Subject</td>
              <td style="padding: 8px 0;">${contactSubmission.subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888; vertical-align: top;">Message</td>
              <td style="padding: 8px 0; line-height: 1.7; white-space: pre-wrap;">${contactSubmission.message}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888;">Sent At</td>
              <td style="padding: 8px 0;">${new Date(contactSubmission.timestamp).toLocaleString()}</td>
            </tr>
          </table>
          <div style="margin-top: 24px;">
            <a href="mailto:${contactSubmission.email}?subject=Re: ${contactSubmission.subject}"
               style="display: inline-block; background: #00d4ff; color: #0a0a0f; padding: 10px 24px;
                      border-radius: 6px; font-weight: 700; text-decoration: none; font-size: 0.88rem;">
              Reply to ${contactSubmission.name} →
            </a>
          </div>
        </div>
        <div style="padding: 16px 32px; background: #f0f0f0; font-size: 0.78rem; color: #888;">
          Sent from your Portfolio Contact Form · Submission #${contactSubmission._id}
        </div>
      </div>
    `,
  };

  // Auto-reply to the sender
  const autoReplyOptions = {
    from:    `"Muhammad Qaissum Shahaab" <${process.env.EMAIL_USER}>`,  // CUSTOMIZE: name
    to:      contactSubmission.email,
    subject: `Got your message, ${contactSubmission.name.split(' ')[0]}! 👋`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: auto;">
        <div style="background: #0a0a0f; padding: 24px 32px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #00d4ff; margin: 0;">Hey ${contactSubmission.name.split(' ')[0]}! 👋</h2>
        </div>
        <div style="padding: 24px 32px; background: #f9f9f9; border-radius: 0 0 8px 8px;">
          <p>Thanks for reaching out! I've received your message and will get back to you <strong>within 24 hours</strong>.</p>
          <blockquote style="border-left: 3px solid #00d4ff; padding-left: 16px; color: #666; margin: 16px 0;">
            <em>"${contactSubmission.message.slice(0, 120)}${contactSubmission.message.length > 120 ? '…' : ''}"</em>
          </blockquote>
          <p style="color: #888; font-size: 0.88rem;">In the meantime, feel free to check out my work on
            <a href="https://github.com/qaissumshahaab">GitHub</a> or connect on
            <a href="https://linkedin.com/in/qaissumshahaab">LinkedIn</a>.
          </p>
          <p>Talk soon,<br/><strong>Muhammad Qaissum Shahaab</strong><br/>
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
const getSubmissions = async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const submissions = await Contact.find().sort({ timestamp: -1 });
    return res.json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    console.error('❌ Error fetching submissions:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

module.exports = { submitContact, getSubmissions };
