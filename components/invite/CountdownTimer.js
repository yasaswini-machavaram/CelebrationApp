'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CountdownTimer({ targetDate, className }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) return null;

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className={className} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      flexWrap: 'wrap',
    }}>
      {units.map((unit, i) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '72px',
          }}
        >
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '12px',
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#D4AF37',
            marginBottom: '0.5rem',
          }}>
            <motion.span
              key={unit.value}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {String(unit.value).padStart(2, '0')}
            </motion.span>
          </div>
          <span style={{
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'rgba(255, 248, 240, 0.5)',
          }}>
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
