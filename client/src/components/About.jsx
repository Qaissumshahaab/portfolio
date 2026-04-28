/**
 * About.jsx — About Me Section
 * ─────────────────────────────
 * Features:
 *  • Two-column layout: bio text + info cards
 *  • Animated on scroll via SectionWrapper
 *
 * 🎨 CUSTOMIZE: Edit aboutData to personalize
 */

import React from 'react';
import SectionWrapper from './SectionWrapper';
import styles from '../styles/portfolio.module.css';

// ── CUSTOMIZE: Your about content ─────────────────────────
const aboutData = {
  bio: [
    "I'm Muhammad Qaissum Shahaab, a passionate Full Stack Developer having experience building modern web applications. My expertise lies in the MERN stack — MongoDB, Express, React, and Node.js — and I love turning complex product ideas into polished, production-ready software.",
    "When I'm not coding, I'm exploring new tech, contributing to open source, or writing dev articles. I believe great software is built at the intersection of clean architecture, thoughtful UX, and relentless performance optimization.",
  ],
  location:   'Multan, Pakistan',
  availability: 'Open to opportunities',
  experience:   '1 year in web development',
  cards: [
    {
      icon: '🚀',
      title: 'Fast Delivery',
      desc: 'Ship production-ready features on time, every time.',
    },
    {
      icon: '🎯',
      title: 'Detail-Oriented',
      desc: 'Pixel-perfect UIs and clean, maintainable code architecture.',
    },
    {
      icon: '🤝',
      title: 'Collaborative',
      desc: 'Strong communicator, thrives in cross-functional teams.',
    },
    {
      icon: '📈',
      title: 'Always Learning',
      desc: 'Constantly growing my stack and keeping up with the ecosystem.',
    },
  ],
};

const About = () => (
  <section id="about" className={styles['about-section']}>
    <div className="container">

      {/* Section Header */}
      <SectionWrapper>
        <div className="mb-5">
          <span className={styles['section-label']}>Who I Am</span>
          <h2 className={styles['section-title']}>
            About <span>Me</span>
          </h2>
        </div>
      </SectionWrapper>

      <div className="row g-5 align-items-start">

        {/* ── LEFT: Bio Text ── */}
        <div className="col-lg-6">
          <SectionWrapper delay={100}>
            {aboutData.bio.map((para, i) => (
              <p key={i} className={`${styles['about-text']} ${i > 0 ? 'mt-3' : ''}`}>
                {para}
              </p>
            ))}

            {/* Quick info tags */}
            <div className="d-flex flex-wrap gap-2 mt-4">
              {[
                { icon: '📍', text: aboutData.location },
                { icon: '💼', text: aboutData.availability },
                { icon: '⏱',  text: aboutData.experience },
              ].map((item, i) => (
                <span
                  key={i}
                  className={styles['tech-badge']}
                >
                  {item.icon} {item.text}
                </span>
              ))}
            </div>

            {/* Download CV button */}
            <div className="mt-4">
              <a
                href="/Muhammad-Qaissum-Shahaab-CV.pdf"  /* CUSTOMIZE: Link to your actual CV */
                download
                className={styles['btn-electric']}
              >
                Download CV ↓
              </a>
            </div>
          </SectionWrapper>
        </div>

        {/* ── RIGHT: Info Cards ── */}
        <div className="col-lg-6">
          <SectionWrapper delay={200}>
            <div className="row g-3">
              {aboutData.cards.map((card, i) => (
                <div key={i} className="col-sm-6">
                  <div className={styles['about-card']}>
                    <div className={styles['about-card-icon']}>{card.icon}</div>
                    <div className={styles['about-card-title']}>{card.title}</div>
                    <div className={styles['about-card-desc']}>{card.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionWrapper>
        </div>

      </div>
    </div>
  </section>
);

export default About;
