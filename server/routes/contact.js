/**
 * routes/contact.js
 * ──────────────────
 * Defines routes for the contact form API.
 *
 * Routes:
 *  POST /api/contact           — Submit a contact form
 *  GET  /api/contact/submissions — View submissions (dev only)
 */

const express    = require('express');
const router     = express.Router();
const { body, validationResult } = require('express-validator');

const {
  submitContact,
  getSubmissions,
} = require('../controllers/contactController');

// ── Backend Validation Middleware ────────────────────────
const validateContact = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 2, max: 80 })
    .withMessage('Name must be between 2 and 80 characters.'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Enter a valid email address.')
    .normalizeEmail(),

  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required.')
    .isLength({ min: 3, max: 120 })
    .withMessage('Subject must be between 3 and 120 characters.'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required.')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Message must be between 20 and 2000 characters.'),
];

// ── Validation Error Handler Middleware ──────────────────
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed.',
      errors:  errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ── Route Definitions ────────────────────────────────────

/**
 * POST /api/contact
 * Submit the contact form
 */
router.post('/', validateContact, handleValidation, submitContact);

/**
 * GET /api/contact/submissions
 * Dev-only: list all in-memory submissions
 */
router.get('/submissions', getSubmissions);

module.exports = router;
