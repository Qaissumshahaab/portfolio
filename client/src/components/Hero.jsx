/**
 * Hero.jsx — Full-viewport Landing Section
 * ─────────────────────────────────────────
 * Features:
 *  • Animated grid background with radial glow overlay
 *  • Rotating gradient avatar ring (replace text with <img>)
 *  • Staggered entrance animations via CSS
 *  • Stats counter row
 *  • Floating tech tags
 *
 * 🎨 CUSTOMIZE: Name, title, stats, avatar text
 */

import React from 'react';
import styles from '../styles/portfolio.module.css';
import avatar from "../images/avatar.jpeg";

// ── CUSTOMIZE: Your personal hero content ─────────────────
const heroData = {
  badge:    'Available for Freelance & Full-time',
  firstName: 'Muhammad',
  lastName:  'Qaissum',
  role:      'Full Stack MERN Developer',
  roleHighlight: 'MERN',
  description:
    'I architect and ship performant, scalable web applications — from sleek React frontends to robust Node.js APIs. Turning complex problems into clean, elegant code is my craft.',
  avatar: <img src={avatar} alt="Muhammad Qaissum" />,   // Replace with <img src="..."> for a real photo
  stats: [
    { number: '1', suffix: '', label: 'Year of Experience' },
    { number: '1', suffix: '', label: 'Project Shipped' },
    
  ],
  floatingTags: [
   
  ],
};

const Hero = () => {
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className={styles.hero}>
      {/* Background decorations */}
      <div className={styles['hero-grid-bg']} />
      <div className={styles['hero-glow-1']} />
      <div className={styles['hero-glow-2']} />

      <div className="container">
        <div className="row align-items-center g-5">

          {/* ── LEFT: Text Content ── */}
          <div className="col-lg-7">

            {/* Available badge */}
            <div className={styles['hero-badge']}>
              {heroData.badge}
            </div>

            {/* Name */}
            <h1 className={styles['hero-title']}>
              <span className="d-block">{heroData.firstName}</span>
              <span className={`d-block ${styles['name-gradient']}`}>
                {heroData.lastName}
              </span>
            </h1>

            {/* Role */}
            <p className={styles['hero-role']}>
              {heroData.role.replace(heroData.roleHighlight, '').trim()}{' '}
              <span className={styles['role-highlight']}>{heroData.roleHighlight}</span>{' '}
              {heroData.role.split(heroData.roleHighlight)[1]}
            </p>

            {/* Description */}
            <p className={styles['hero-desc']}>{heroData.description}</p>

            {/* CTA Buttons */}
            <div className={styles['hero-actions']}>
              <button
                className={styles['btn-electric']}
                onClick={() => scrollTo('#projects')}
              >
                View My Work →
              </button>
              <button
                className={styles['btn-ghost']}
                onClick={() => scrollTo('#contact')}
              >
                Let's Talk
              </button>
            </div>

            {/* Stats Row */}
            <div className={styles['hero-stats']}>
              {heroData.stats.map((s, i) => (
                <div key={i} className={styles['stat-item']}>
                  <span className={styles['stat-number']}>
                    {s.number}<span>{s.suffix}</span>
                  </span>
                  <span className={styles['stat-label']}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Avatar ── */}
          <div className="col-lg-5">
            <div className={styles['hero-avatar-wrap']}>
              {/* Floating tags */}
              {heroData.floatingTags.map((tag, i) => (
                <div
                  key={i}
                  className={`${styles['hero-floating-tag']} ${styles[tag.className]}`}
                >
                  <span>{tag.icon}</span>
                  {tag.text}
                </div>
              ))}

              {/* Avatar square container */}
              <div className={styles['hero-avatar-square']}>
                {heroData.avatar}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
