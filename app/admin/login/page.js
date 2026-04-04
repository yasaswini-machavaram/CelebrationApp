'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from '../../signup/page.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid credentials.');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.bgOrbs}>
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
      </div>
      <motion.div
        className={styles.authCard}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className={styles.title}>Admin Panel</h1>
        <p className={styles.subtitle}>Restricted access</p>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Username</label>
            <input className={styles.input} value={form.username}
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input type="password" className={styles.input} value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? '⏳' : 'Enter Admin Panel'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
