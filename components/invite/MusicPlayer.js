'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MusicPlayer({ src }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Auto-prompt on first scroll
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        // Try to autoplay
        if (audioRef.current) {
          audioRef.current.volume = 0.3;
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {
            // Autoplay blocked, user needs to click
          });
        }
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [hasInteracted]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = 0.3;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!src) return null;

  return (
    <>
      <audio ref={audioRef} loop preload="auto">
        <source src={src} type="audio/mpeg" />
      </audio>
      <motion.button
        onClick={togglePlay}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(212, 175, 55, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#D4AF37',
          fontSize: '1.2rem',
          transition: 'all 0.3s ease',
        }}
        whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' }}
        whileTap={{ scale: 0.95 }}
        title={isPlaying ? 'Pause music' : 'Play music'}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.span
              key="playing"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                {/* Animated bars */}
                <motion.rect
                  x="3" y="2" width="3" height="14" rx="1" fill="#D4AF37"
                  animate={{ scaleY: [1, 0.5, 0.8, 1], }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ originY: '50%' }}
                />
                <motion.rect
                  x="8" y="2" width="3" height="14" rx="1" fill="#D4AF37"
                  animate={{ scaleY: [0.7, 1, 0.5, 0.7], }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                  style={{ originY: '50%' }}
                />
                <motion.rect
                  x="13" y="2" width="3" height="14" rx="1" fill="#D4AF37"
                  animate={{ scaleY: [0.5, 0.8, 1, 0.5], }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  style={{ originY: '50%' }}
                />
              </svg>
            </motion.span>
          ) : (
            <motion.span
              key="paused"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              🎵
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
