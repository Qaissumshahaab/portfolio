/**
 * Navbar.jsx — Fixed Navigation with Scroll Detection
 * ─────────────────────────────────────────────────────
 * Features:
 *  • Transparent → frosted-glass transition on scroll
 *  • Mobile-responsive hamburger menu
 *  • Smooth scroll to sections via anchor links
 *  • Active section highlighting ready
 *
 * 🎨 CUSTOMIZE: Change navLinks array to your actual sections
 */

import React, { useState, useEffect } from 'react';
import styles from '../styles/portfolio.module.css';

// ── CUSTOMIZE: Your navigation items ──────────────────────
const navLinks = [
  { label: 'About',    href: '#about'    },
  { label: 'Skills',   href: '#skills'   },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact'  },
];

const Navbar = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  // Toggle glass effect on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu when a link is clicked
  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">

          {/* ── Brand Logo ── */}
          <a
            href="#hero"
            className={styles['nav-brand']}
            onClick={(e) => handleNavClick(e, '#hero')}
          >
            {/* CUSTOMIZE: Change initials / brand name */}
            .<span>devColab</span>
          </a>

          {/* ── Desktop Links ── */}
          <div className="d-none d-lg-flex align-items-center gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={styles['nav-link-custom']}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}

            {/* Hire Me CTA */}
            <a
              href="#contact"
              className={styles['nav-cta']}
              onClick={(e) => handleNavClick(e, '#contact')}
            >
              Hire Me
            </a>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className={`${styles.hamburger} d-lg-none`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* ── Mobile Menu Dropdown ── */}
        {menuOpen && (
          <div
            className="d-lg-none mt-3 pb-2"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`${styles['nav-link-custom']} d-block mb-2`}
                style={{ padding: '0.5rem 0' }}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className={`${styles['nav-cta']} d-inline-block mt-1`}
              onClick={(e) => handleNavClick(e, '#contact')}
            >
              Hire Me
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
