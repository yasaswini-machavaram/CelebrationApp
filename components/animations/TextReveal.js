'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

// Animate each word with stagger
export function TextRevealByWord({ text, className, delay = 0 }) {
  const words = text.split(' ');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <span ref={ref} className={className} style={{ display: 'inline' }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: 'inline-block', marginRight: '0.3em' }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// Animate each character
export function TextRevealByChar({ text, className, delay = 0, stagger = 0.03 }) {
  const chars = text.split('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <span ref={ref} className={className} style={{ display: 'inline-block' }}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, rotateX: -90 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: delay + i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

// Fade in from direction with optional blur
export function FadeIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  blur = false,
  className,
  style,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{
        opacity: 0,
        ...directions[direction],
        filter: blur ? 'blur(8px)' : 'none',
      }}
      animate={isInView ? {
        opacity: 1,
        x: 0,
        y: 0,
        filter: 'blur(0px)',
      } : {}}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Scale in with optional rotation
export function ScaleIn({ children, delay = 0, className, style }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Horizontal line that draws itself
export function DrawLine({ width = '80px', delay = 0, color = 'rgba(212, 175, 55, 0.5)' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ width: 0, opacity: 0 }}
      animate={isInView ? { width, opacity: 1 } : {}}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        height: '1px',
        background: `linear-gradient(to right, transparent, ${color}, transparent)`,
      }}
    />
  );
}
