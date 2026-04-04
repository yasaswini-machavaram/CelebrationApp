'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function FloatingParticles({ variant = 'petals' }) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const particlesLoaded = useCallback(async (container) => {}, []);

  const configs = {
    petals: {
      particles: {
        number: { value: 25, density: { enable: true, width: 1200, height: 800 } },
        color: { value: ['#D4AF37', '#F0D060', '#FFE4C4', '#FFC0CB', '#FFD700'] },
        shape: { type: 'circle' },
        opacity: {
          value: { min: 0.15, max: 0.4 },
          animation: { enable: true, speed: 0.5, startValue: 'random', sync: false },
        },
        size: {
          value: { min: 2, max: 6 },
          animation: { enable: true, speed: 1, startValue: 'random', sync: false },
        },
        move: {
          enable: true,
          speed: { min: 0.3, max: 1 },
          direction: 'bottom',
          random: true,
          straight: false,
          outModes: { default: 'out', top: 'out', bottom: 'out' },
          drift: { min: -1, max: 1 },
        },
        wobble: {
          enable: true,
          distance: 10,
          speed: { min: -3, max: 3 },
        },
        rotate: {
          value: { min: 0, max: 360 },
          direction: 'random',
          animation: { enable: true, speed: 3 },
        },
      },
      detectRetina: true,
      fpsLimit: 60,
    },
    sparkles: {
      particles: {
        number: { value: 40, density: { enable: true, width: 1200, height: 800 } },
        color: { value: ['#D4AF37', '#FFD700', '#FFFFFF'] },
        shape: { type: 'star' },
        opacity: {
          value: { min: 0, max: 0.6 },
          animation: { enable: true, speed: 1, startValue: 'random', sync: false },
        },
        size: {
          value: { min: 1, max: 3 },
          animation: { enable: true, speed: 0.5, startValue: 'random', sync: false },
        },
        move: {
          enable: true,
          speed: { min: 0.1, max: 0.4 },
          direction: 'none',
          random: true,
          straight: false,
          outModes: 'out',
        },
        twinkle: {
          particles: { enable: true, frequency: 0.05, color: '#FFD700' },
        },
      },
      detectRetina: true,
      fpsLimit: 60,
    },
  };

  const options = useMemo(() => ({
    fullScreen: { enable: true, zIndex: 0 },
    background: { color: { value: 'transparent' } },
    ...(configs[variant] || configs.petals),
  }), [variant]);

  if (!init) return null;

  return (
    <Particles
      id={`particles-${variant}`}
      particlesLoaded={particlesLoaded}
      options={options}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
