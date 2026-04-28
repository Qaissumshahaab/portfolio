/**
 * Projects.jsx — Portfolio Projects Section
 * ──────────────────────────────────────────
 * Features:
 *  • Project cards with hover glow and top-border reveal
 *  • Tech stack tags (electric/hot color variants)
 *  • GitHub + Live Demo link buttons
 *  • Decorative project numbers
 *
 * 🎨 CUSTOMIZE: Replace projectsData with your actual projects
 */

import React from 'react';
import SectionWrapper from './SectionWrapper';
import styles from '../styles/portfolio.module.css';

// ── CUSTOMIZE: Your projects ───────────────────────────────
const projectsData = [
  {
    title:       'ShopMERN — E-Commerce Platform',
    description:
      'A full-featured e-commerce platform with product catalog, cart, Stripe payments, JWT auth, and an admin dashboard for inventory management.',
    techStack:   ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'JWT', 'Vercel'],
    github:      'https://github.com/alexcarter/shopmern',
    live:        'https://shopmern.vercel.app',
    featured:    true,
  }
  
];

/* ── A single project card ── */
const ProjectCard = ({ project, index }) => {
  // Alternate tag color variant for visual diversity
  const hotVariant = index % 2 !== 0;

  return (
    <div className={`col-md-6 col-xl-4 d-flex`}>
      <div className={styles['project-card']}>
        {/* Header */}
        <div className={styles['project-card-header']}>
          <span className={styles['project-number']}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className={styles['project-links']}>
            {/* GitHub Link */}
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles['project-link-btn']}
              title="View on GitHub"
            >
              {/* GitHub icon via unicode */}
              ⌥
            </a>
            {/* Live Demo Link */}
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className={styles['project-link-btn']}
              title="View Live Demo"
            >
              ↗
            </a>
          </div>
        </div>

        {/* Body */}
        <div className={styles['project-card-body']}>
          <h3 className={styles['project-title']}>{project.title}</h3>
          <p className={styles['project-desc']}>{project.description}</p>
        </div>

        {/* Tech Tags */}
        <div className={styles['project-card-footer']}>
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className={`${styles['project-tag']} ${hotVariant ? styles.hot : ''}`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Projects = () => (
  <section id="projects" className={styles['projects-section']}>
    <div className="container">

      {/* Header */}
      <SectionWrapper>
        <div className="mb-5">
          <span className={styles['section-label']}>What I've Built</span>
          <h2 className={styles['section-title']}>
            Selected <span>Project</span>
          </h2>
          <p className={`${styles['section-subtitle']} mt-2`}>
            A selection of production-grade application I've designed, built, and shipped.
          </p>
        </div>
      </SectionWrapper>

      {/* Project Grid */}
      <SectionWrapper delay={150}>
        <div className="row g-4">
          {projectsData.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </SectionWrapper>

      {/* View All CTA */}
      <SectionWrapper delay={200}>
        <div className="text-center mt-5">
          <a
            href="https://github.com/alexcarter" /* CUSTOMIZE: your GitHub profile */
            target="_blank"
            rel="noopener noreferrer"
            className={styles['btn-ghost']}
          >
            View on GitHub →
          </a>
        </div>
      </SectionWrapper>

    </div>
  </section>
);

export default Projects;
