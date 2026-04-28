/**
 * App.jsx — Main Application Entry Point
 * ────────────────────────────────────────
 * Composes all sections in order and manages:
 *  • Global scroll-to-top button visibility
 *  • Page-level layout
 */

import React, { useState, useEffect } from 'react';
import Navbar   from './components/Navbar';
import Hero     from './components/Hero';
import About    from './components/About';
import Skills   from './components/Skills';
import Projects from './components/Projects';
import Contact  from './components/Contact';
import Footer   from './components/Footer';
import styles   from './styles/portfolio.module.css';
import './styles/global.css'; // global body overrides

const App = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show/hide scroll-to-top button
  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* ── Fixed Navigation ── */}
      <Navbar />

      {/* ── Main Content ── */}
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Scroll to Top Button ── */}
      <button
        className={`${styles['scroll-top']} ${showScrollTop ? styles.visible : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Back to top"
      >
        ↑
      </button>
    </>
  );
};

export default App;
