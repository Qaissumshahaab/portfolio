/**
 * SectionWrapper.jsx — Reusable Animation Wrapper
 * ─────────────────────────────────────────────────
 * Wraps any section and animates it into view using
 * the Intersection Observer API. No external deps needed.
 *
 * Usage:
 *   <SectionWrapper>
 *     <YourSection />
 *   </SectionWrapper>
 *
 * Props:
 *   children  — any React nodes
 *   delay     — ms delay before animation triggers (default: 0)
 *   className — extra classes to pass to wrapper div
 */

import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/portfolio.module.css';

const SectionWrapper = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // IntersectionObserver triggers animation when 15% of element is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Apply delay before adding the visible class
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(el); // Run once only
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${styles['section-wrapper']} ${isVisible ? styles.visible : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default SectionWrapper;
