/**
 * api/contact.js — Vercel Serverless Contact Form Handler
 * ═══════════════════════════════════════════════════════════
 * All-in-one handler combining:
 *  • Mongoose schema definition
 *  • MongoDB connection with serverless pooling
 *  • Input validation
 *  • Email notifications (owner + auto-reply)
 *  • Error handling
 *  • CORS configuration
 */

import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

/* ═════════════════════════════════════════════════════════
   MONGODB CONNECTION & SCHEMA
   ═════════════════════════════════════════════════════════ */

let dbConnected = false;

// Define Contact Schema inline
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  ip: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Create indexes for better query performance
contactSchema.index({ email: 1 });
contactSchema.index({ timestamp: -1 });

// Get or create Contact model (important for serverless)
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

/**
 * Connect to MongoDB with serverless-optimized settings
 */
const connectDB = async () => {
  if (dbConnected) {
    return true;
  }

  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.warn('⚠️  MONGODB_URI not set');
      return false;
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
    });

    dbConnected = true;
    console.log('✅ MongoDB connected');
    return true;
  } catch (error) {
    console.error('❌ MongoDB error:', error.message);
    return false;
  }
};

/* ═════════════════════════════════════════════════════════
   VALIDATION
   ═════════════════════════════════════════════════════════ */

const validateContactData = ({ name, email, subject, message }) => {
  const errors = [];

  if (!name?.trim() || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name is required (min 2 characters)' });
  } else if (name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Name cannot exceed 100 characters' });
  }

  if (!email?.trim() || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email?.trim())) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }

  if (!subject?.trim() || subject.trim().length < 3) {
    errors.push({ field: 'subject', message: 'Subject is required (min 3 characters)' });
  } else if (subject.trim().length > 200) {
    errors.push({ field: 'subject', message: 'Subject cannot exceed 200 characters' });
  }

  if (!message?.trim() || message.trim().length < 20) {
    errors.push({ field: 'message', message: 'Message is required (min 20 characters)' });
  } else if (message.trim().length > 2000) {
    errors.push({ field: 'message', message: 'Message cannot exceed 2000 characters' });
  }

  return errors;
};

/* ═════════════════════════════════════════════════════════
   EMAIL NOTIFICATIONS
   ═════════════════════════════════════════════════════════ */

const sendEmailNotifications = async (contactData) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_TO) {
      console.log('⚠️  Email not configured - skipping email notifications');
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const firstName = contactData.name.split(' ')[0];

    // Email to portfolio owner
    const ownerEmail = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `📬 [Portfolio] New message: ${contactData.subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; border-radius: 8px; overflow: hidden;">
          <div style="background: #0a0a0f; padding: 24px 32px;">
            <h2 style="color: #00d4ff; margin: 0; font-size: 1.2rem;">New Portfolio Contact</h2>
          </div>
          <div style="padding: 24px 32px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.92rem;">
              <tr>
                <td style="padding: 8px 0; color: #888; width: 90px;">Name</td>
                <td style="padding: 8px 0; font-weight: 600;">${contactData.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888;">Email</td>
                <td style="padding: 8px 0;"><a href="mailto:${contactData.email}">${contactData.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888;">Subject</td>
                <td style="padding: 8px 0;">${contactData.subject}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888; vertical-align: top;">Message</td>
                <td style="padding: 8px 0; line-height: 1.7; white-space: pre-wrap;">${contactData.message}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888;">Sent At</td>
                <td style="padding: 8px 0;">${new Date(contactData.timestamp).toLocaleString()}</td>
              </tr>
            </table>
            <div style="margin-top: 24px;">
              <a href="mailto:${contactData.email}?subject=Re: ${contactData.subject}"
                 style="display: inline-block; background: #00d4ff; color: #0a0a0f; padding: 10px 24px;
                        border-radius: 6px; font-weight: 700; text-decoration: none; font-size: 0.88rem;">
                Reply to ${contactData.name} →
              </a>
            </div>
          </div>
          <div style="padding: 16px 32px; background: #f0f0f0; font-size: 0.78rem; color: #888;">
            Sent from your Portfolio Contact Form
          </div>
        </div>
      `,
    };

    // Auto-reply to sender
    const autoReply = {
      from: `"Muhammad Qaissum Shahaab" <${process.env.EMAIL_USER}>`,
      to: contactData.email,
      subject: `Got your message, ${firstName}! 👋`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: auto;">
          <div style="background: #0a0a0f; padding: 24px 32px; border-radius: 8px 8px 0 0;">
            <h2 style="color: #00d4ff; margin: 0;">Hey ${firstName}! 👋</h2>
          </div>
          <div style="padding: 24px 32px; background: #f9f9f9; border-radius: 0 0 8px 8px;">
            <p>Thanks for reaching out! I've received your message and will get back to you <strong>within 24 hours</strong>.</p>
            <blockquote style="border-left: 3px solid #00d4ff; padding-left: 16px; color: #666; margin: 16px 0;">
              <em>"${contactData.message.slice(0, 120)}${contactData.message.length > 120 ? '…' : ''}"</em>
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

    await transporter.sendMail(ownerEmail);
    await transporter.sendMail(autoReply);
    console.log('✅ Email notifications sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};

/* ═════════════════════════════════════════════════════════
   MAIN HANDLER
   ═════════════════════════════════════════════════════════ */

export default async function handler(req, res) {
  // Set CORS headers with specific origin
  const allowedOrigin = process.env.CLIENT_URL || 'https://portfolio-five-flax-71.vercel.app';
  const origin = req.headers.origin;
  
  // Allow only the specific frontend URL
  const normalizedAllowed = allowedOrigin.replace(/\/$/, '');
  if (origin === normalizedAllowed || !origin) {
    res.setHeader('Access-Control-Allow-Origin', normalizedAllowed);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET — retrieve submissions (dev only)
  if (req.method === 'GET') {
    try {
      if (process.env.NODE_ENV !== 'development') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const dbConnectedStatus = await connectDB();
      if (!dbConnectedStatus) {
        return res.status(503).json({ success: false, message: 'Database unavailable' });
      }

      const submissions = await Contact.find().sort({ timestamp: -1 }).limit(100);
      return res.status(200).json({
        success: true,
        count: submissions.length,
        data: submissions,
      });
    } catch (error) {
      console.error('❌ Error fetching submissions:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Server error. Please try again later.',
      });
    }
  }

  // Handle POST — submit contact form
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { name, email, subject, message } = body || {};

      // Validate input
      const validationErrors = validateContactData({ name, email, subject, message });
      if (validationErrors.length > 0) {
        return res.status(422).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        });
      }

      const timestamp = new Date().toISOString();
      const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                       req.socket?.remoteAddress || 
                       'unknown';

      console.log(`\n📬 New contact submission`);
      console.log(`   From: ${name.trim()} <${email.trim().toLowerCase()}>`);
      console.log(`   Subject: ${subject.trim()}`);
      console.log(`   At: ${timestamp}\n`);

      // Connect to database and save submission
      const dbConnectedStatus = await connectDB();
      if (dbConnectedStatus) {
        try {
          const submission = new Contact({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim(),
            ip: clientIp,
          });

          await submission.save();
          console.log(`✅ Saved to database: ${submission._id}`);
        } catch (dbError) {
          console.error('⚠️  Database save error:', dbError.message);
          // Continue - email will still be sent
        }
      } else {
        console.log('⚠️  Database not available - email will be sent anyway');
      }

      // Send email notifications
      await sendEmailNotifications({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        timestamp,
      });

      return res.status(200).json({
        success: true,
        message: 'Message received! I\'ll get back to you within 24 hours.',
      });
    } catch (error) {
      console.error('❌ Handler error:', error.message);
      
      // Error handling (from middleware/errorHandler.js)
      const statusCode = error.statusCode || error.status || 500;
      
      return res.status(statusCode).json({
        success: false,
        message: statusCode === 500 
          ? 'Internal server error. Please try again later.' 
          : error.message,
        ...(process.env.NODE_ENV === 'development' && { error: error.message }),
      });
    }
  }

  // Method not allowed
  res.setHeader('Allow', 'POST, GET, OPTIONS');
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

/* Vercel serverless configuration */
export const config = {
  runtime: 'nodejs',
  maxDuration: 30,
};