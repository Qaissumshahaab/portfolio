/**
 * Skills.jsx — Skills & Technologies Section
 * ────────────────────────────────────────────
 * Features:
 *  • Animated progress bars triggered by IntersectionObserver
 *  • Two categories: Frontend and Backend/DevOps
 *  • Tech badge grid for tools/libraries
 *
 * 🎨 CUSTOMIZE: Edit skillsData arrays with your actual skills
 */

import React, { useEffect, useRef, useState } from 'react';
import SectionWrapper from './SectionWrapper';
import styles from '../styles/portfolio.module.css';

// ── CUSTOMIZE: Your skills ─────────────────────────────────
const frontendSkills = [
  { name: 'React.js',        icon: '⚛️',  pct: 85, hot: false },
  { name: 'JavaScript (ES6+)', icon: '🟨', pct: 90, hot: false },
  { name: 'Bootstrap',      icon: '🔷',  pct: 75, hot: false },
  { name: 'CSS',  icon: '🎨',  pct: 85, hot: false },
  { name: 'Next.js',         icon: '▲',   pct: 60, hot: false },
];

const backendSkills = [
  { name: 'Node.js',         icon: '🟢',  pct: 80, hot: true },
  { name: 'Express.js',      icon: '🚂',  pct: 90, hot: true },
  { name: 'MongoDB',         icon: '🍃',  pct: 85, hot: true },
  { name: 'MySQL',      icon: '🐬',  pct: 85, hot: true },
  { name: 'REST APIs',       icon: '🔗',  pct: 90, hot: true },
  { name: 'Payment Processing / Stripe',      icon: '🐘',  pct: 75, hot: true },
  ,
];

const techBadges = [
  'Git & GitHub', 'Vercel', 'JWT Auth', 'Mongoose', 'Stripe',
  'VS Code','mysql', 'mongodb Atlas', 'nodeMailer'
];

/* ── Animated Skill Bar ── */
const SkillBar = ({ skill, animate }) => (
  <div className={styles['skill-item']}>
    <div className={styles['skill-meta']}>
      <span className={styles['skill-name']}>
        <span className={styles['skill-icon']}>{skill.icon}</span>
        {skill.name}
      </span>
      <span className={styles['skill-pct']}>{skill.pct}%</span>
    </div>
    <div className={styles['skill-track']}>
      <div
        className={`${styles['skill-fill']} ${skill.hot ? styles.hot : ''}`}
        style={{ width: animate ? `${skill.pct}%` : '0%' }}
      />
    </div>
  </div>
);

const Skills = () => {
  const [animate, setAnimate] = useState(false);
  const ref = useRef(null);

  // Trigger bar animation when section enters viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" className={styles['skills-section']} ref={ref}>
      <div className="container">

        {/* Header */}
        <SectionWrapper>
          <div className="mb-5">
            <span className={styles['section-label']}>What I Work With</span>
            <h2 className={styles['section-title']}>
              My <span>Skills</span>
            </h2>
            <p className={`${styles['section-subtitle']} mt-2`}>
              A curated set of technologies I use to build fast, reliable, and scalable products.
            </p>
          </div>
        </SectionWrapper>

        {/* Progress Bar Grids */}
        <div className="row g-5 mb-5">
          <div className="col-lg-6">
            <SectionWrapper delay={100}>
              <p className={styles['skill-category-title']}>Frontend Development</p>
              {frontendSkills.map((s) => (
                <SkillBar key={s.name} skill={s} animate={animate} />
              ))}
            </SectionWrapper>
          </div>

          <div className="col-lg-6">
            <SectionWrapper delay={200}>
              <p className={styles['skill-category-title']}>Backend & Database</p>
              {backendSkills.map((s) => (
                <SkillBar key={s.name} skill={s} animate={animate} />
              ))}
            </SectionWrapper>
          </div>
        </div>

        {/* Tech Badges Grid */}
        <SectionWrapper delay={300}>
          <p className={styles['skill-category-title']}>Tools & Ecosystem</p>
          <div className="d-flex flex-wrap gap-2">
            {techBadges.map((badge) => (
              <span key={badge} className={styles['tech-badge']}>
                {badge}
              </span>
            ))}
          </div>
        </SectionWrapper>

      </div>
    </section>
  );
};

export default Skills;
