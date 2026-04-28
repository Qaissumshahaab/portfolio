/**
 * Footer.jsx — Site Footer with Social Links
 * ───────────────────────────────────────────
 * Features:
 *  • Brand + tagline
 *  • Social media icon links
 *  • Copyright line
 *
 * 🎨 CUSTOMIZE: socialLinks, copyright name, tagline
 */

import React from 'react';
import styles from '../styles/portfolio.module.css';

// ── CUSTOMIZE: Your social profiles ──────────────────────
const socialLinks = [
  { label: 'GitHub',   href: 'https://github.com/alexcarter',          icon: '⌥' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/alexcarter-dev', icon: 'in' },
  { label: 'Twitter',  href: 'https://twitter.com/alexcarter_dev',     icon: '𝕏'  },
  { label: 'Dev.to',   href: 'https://dev.to/alexcarter',              icon: '📝' },
];

const navSections = [
  { label: 'About',    href: '#about'    },
  { label: 'Skills',   href: '#skills'   },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact'  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className="row g-4 align-items-start">

          {/* ── Brand Block ── */}
          <div className="col-lg-5">
            <a href="#hero" className={styles['footer-logo']} onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}>
              Muhammad <span>Qaissum</span>
            </a>
            <p className={styles['footer-tagline']}>
              Building the web, one component at a time. <br />
              MERN Stack Developer · Available for hire.
            </p>

            {/* Social Icons */}
            <div className="d-flex gap-2 mt-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['social-link']}
                  title={s.label}
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="col-lg-3 offset-lg-1">
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--electric)',
                marginBottom: '1rem',
              }}
            >
              Quick Links
            </p>
            <div className="d-flex flex-column gap-2">
              {navSections.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(s.href); }}
                  className={styles['nav-link-custom']}
                  style={{ fontSize: '0.88rem' }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Hire Me Card ── */}
          <div className="col-lg-3">
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-bright)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'var(--white)',
                  marginBottom: '0.5rem',
                }}
              >
                Ready to collaborate?
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1rem', fontWeight: 300 }}>
                I'm open to freelance projects and full-time roles.
              </p>
              <a
                href="mailto:qaissumshahaab@gmail.com"  /* CUSTOMIZE: your email */
                className={styles['btn-electric']}
                style={{ fontSize: '0.8rem', padding: '0.6rem 1.25rem' }}
              >
                Email Me →
              </a>
            </div>
          </div>

        </div>

        {/* ── Bottom Bar ── */}
        <div className={styles['footer-bottom']}>
          <span className={styles['footer-copy']}>
            © {year} Muhammad Qaissum Shahaab. All rights reserved.  {/* CUSTOMIZE: name */}
          </span>
          <span className={styles['footer-copy']}>
            Built with ⚛️ React + 🟢 Node.js · Deployed on Vercel
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
