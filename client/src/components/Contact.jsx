/**
 * Contact.jsx — Contact Form with Validation + API Integration
 * ─────────────────────────────────────────────────────────────
 * Features:
 *  • Full frontend validation (required, email, length)
 *  • POST to /api/contact (Express backend)
 *  • Loading spinner while submitting
 *  • Success / Error feedback messages
 *  • Resets form after successful submission
 *
 * 🎨 CUSTOMIZE: Contact info section (email, location, etc.)
 */

import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper';
import styles from '../styles/portfolio.module.css';

// ── CUSTOMIZE: Your contact info ──────────────────────────
const contactInfo = [
  {
    icon:  '✉️',
    label: 'Email',
    value: 'qaissumshahaab@gmail.com',
    href:  'mailto:qaissumshahaab@gmail.com',
  },
  {
    icon:  '📍',
    label: 'Location',
    value: 'Multan, Pakistan',
    href:  null,
  },
  {
    icon:  '🕐',
    label: 'Response Time',
    value: 'Within 24 hours',
    href:  null,
  },
];

// ── Initial form state ────────────────────────────────────
const initialForm = { name: '', email: '', subject: '', message: '' };

// ── Validation rules ──────────────────────────────────────
const validate = (data) => {
  const errors = {};
  if (!data.name.trim())                         errors.name    = 'Name is required.';
  else if (data.name.trim().length < 2)          errors.name    = 'Name must be at least 2 characters.';

  if (!data.email.trim())                        errors.email   = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
                                                 errors.email   = 'Enter a valid email address.';

  if (!data.subject.trim())                      errors.subject = 'Subject is required.';

  if (!data.message.trim())                      errors.message = 'Message is required.';
  else if (data.message.trim().length < 20)      errors.message = 'Message must be at least 20 characters.';

  return errors;
};

const Contact = () => {
  const [form,    setForm]    = useState(initialForm);
  const [errors,  setErrors]  = useState({});
  const [status,  setStatus]  = useState(null); // null | 'loading' | 'success' | 'error'
  const [errMsg,  setErrMsg]  = useState('');

  /* Handle input change + clear field error */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  /* Submit handler */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // 2. POST to backend
    setStatus('loading');
    setErrMsg('');

    try {                      
      const res = await fetch('https://portfoliobackend-two-mocha.vercel.app/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setForm(initialForm); // Reset form
      } else {
        throw new Error(data.message || 'Server error. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrMsg(err.message || 'Something went wrong. Please try again later.');
    }
  };

  return (
    <section id="contact" className={styles['contact-section']}>
      {/* Ambient glow */}
      <div className={styles['contact-glow']} />

      <div className="container">

        {/* Header */}
        <SectionWrapper>
          <div className="mb-5">
            <span className={styles['section-label']}>Get In Touch</span>
            <h2 className={styles['section-title']}>
              Let's <span>Work Together</span>
            </h2>
            <p className={`${styles['section-subtitle']} mt-2`}>
              Have a project in mind? I'd love to hear about it. Send me a message and I'll get back to you within 24 hours.
            </p>
          </div>
        </SectionWrapper>

        <div className="row g-5">

          {/* ── LEFT: Contact Info ── */}
          <div className="col-lg-4">
            <SectionWrapper delay={100}>
              <div className="mb-4">
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: 'var(--white)',
                    marginBottom: '1.5rem',
                  }}
                >
                  Contact Information
                </h3>

                {contactInfo.map((item) => (
                  <div key={item.label} className={styles['contact-info-item']}>
                    <div className={styles['contact-info-icon']}>{item.icon}</div>
                    <div>
                      <div className={styles['contact-info-label']}>{item.label}</div>
                      {item.href ? (
                        <a
                          href={item.href}
                          className={styles['contact-info-value']}
                          style={{ textDecoration: 'none' }}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div className={styles['contact-info-value']}>{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Availability note */}
              <div
                style={{
                  background: 'var(--electric-dim)',
                  border: '1px solid var(--border-bright)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span
                    style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: 'var(--lime)', display: 'inline-block',
                      animation: 'pulse 2s infinite',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700, fontSize: '0.85rem', color: 'var(--lime)',
                    }}
                  >
                    Available for Work
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0, fontWeight: 300 }}>
                  Currently accepting freelance projects and full-time opportunities.
                </p>
              </div>
            </SectionWrapper>
          </div>

          {/* ── RIGHT: Contact Form ── */}
          <div className="col-lg-8">
            <SectionWrapper delay={200}>
              <div className={styles['contact-form-wrap']}>

                {/* Status: Success */}
                {status === 'success' && (
                  <div className={`${styles['alert-success']} mb-4`}>
                    <span>✅</span>
                    <span>
                      <strong>Message sent!</strong> Thanks for reaching out — I'll be in touch within 24 hours.
                    </span>
                  </div>
                )}

                {/* Status: Error */}
                {status === 'error' && (
                  <div className={`${styles['alert-error']} mb-4`}>
                    <span>⚠️</span>
                    <span>{errMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">

                    {/* Name */}
                    <div className="col-sm-6">
                      <div className={styles['form-group-custom']}>
                        <label className={styles['form-label-custom']}>Your Name</label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Ahmad ali"
                          className={`${styles['form-input-custom']} ${errors.name ? styles.error : ''}`}
                        />
                        {errors.name && (
                          <span className={styles['form-error']}>{errors.name}</span>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-sm-6">
                      <div className={styles['form-group-custom']}>
                        <label className={styles['form-label-custom']}>Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="ahmad@example.com"
                          className={`${styles['form-input-custom']} ${errors.email ? styles.error : ''}`}
                        />
                        {errors.email && (
                          <span className={styles['form-error']}>{errors.email}</span>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="col-12">
                      <div className={styles['form-group-custom']}>
                        <label className={styles['form-label-custom']}>Subject</label>
                        <input
                          type="text"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          placeholder="Project Inquiry / Collaboration / Hire"
                          className={`${styles['form-input-custom']} ${errors.subject ? styles.error : ''}`}
                        />
                        {errors.subject && (
                          <span className={styles['form-error']}>{errors.subject}</span>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="col-12">
                      <div className={styles['form-group-custom']}>
                        <label className={styles['form-label-custom']}>Message</label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Tell me about your project, timeline, and budget..."
                          className={`${styles['form-input-custom']} ${errors.message ? styles.error : ''}`}
                        />
                        {errors.message && (
                          <span className={styles['form-error']}>{errors.message}</span>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-12">
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className={styles['btn-electric']}
                        style={{ opacity: status === 'loading' ? 0.7 : 1 }}
                      >
                        {status === 'loading' ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              style={{ width: 14, height: 14, borderWidth: 2 }}
                            />
                            Sending...
                          </>
                        ) : (
                          'Send Message →'
                        )}
                      </button>
                    </div>

                  </div>
                </form>
              </div>
            </SectionWrapper>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
