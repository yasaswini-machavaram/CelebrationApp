'use client';

import styles from './Watermark.module.css';

export default function Watermark() {
  return (
    <div className={styles.watermarkOverlay}>
      <div className={styles.watermarkGrid}>
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className={styles.watermarkText}>
            ✨ Upgrade with AI ✨
          </span>
        ))}
      </div>
    </div>
  );
}
