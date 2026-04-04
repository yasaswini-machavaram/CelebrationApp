'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './page.module.css';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const [form, setForm] = useState({ username: '', email: '', mobile: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameStatus, setUsernameStatus] = useState(''); // '', 'checking', 'available', 'taken'
  const [debounceTimer, setDebounceTimer] = useState(null);

  const checkUsername = useCallback((username) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (!username || username.length < 3) {
      setUsernameStatus('');
      return;
    }
    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
        const data = await res.json();
        setUsernameStatus(data.available ? 'available' : 'taken');
      } catch {
        setUsernameStatus('');
      }
    }, 600);
    setDebounceTimer(timer);
  }, [debounceTimer]);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
    if (field === 'username') checkUsername(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.username || !form.email || !form.mobile || !form.password) {
      setError('All fields are required.');
      return;
    }
    if (form.username.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (form.password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          mobile: form.mobile,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const loginUrl = redirectTo
          ? `/login?registered=true&redirect=${encodeURIComponent(redirectTo)}`
          : '/login?registered=true';
        router.push(loginUrl);
      } else {
        setError(data.error || 'Signup failed.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.bgOrbs}>
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
      </div>

      <motion.div
        className={styles.authCard}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link href="/" className={styles.logo}>CelebrationApp</Link>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join us and create stunning wedding invitations</p>

        {error && (
          <motion.div className={styles.errorBox} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Username</label>
            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                placeholder="Choose a unique username"
                value={form.username}
                onChange={e => updateField('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                autoComplete="username"
              />
              {usernameStatus === 'checking' && <span className={styles.inputStatus}>⏳</span>}
              {usernameStatus === 'available' && <span className={`${styles.inputStatus} ${styles.available}`}>✓</span>}
              {usernameStatus === 'taken' && <span className={`${styles.inputStatus} ${styles.taken}`}>✗</span>}
            </div>
            {usernameStatus === 'taken' && <span className={styles.fieldError}>Username already taken</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="your@email.com"
              value={form.email}
              onChange={e => updateField('email', e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Mobile Number</label>
            <input
              type="tel"
              className={styles.input}
              placeholder="10-digit mobile number"
              value={form.mobile}
              onChange={e => updateField('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
              autoComplete="tel"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="Min 4 characters"
                value={form.password}
                onChange={e => updateField('password', e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Confirm Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={e => updateField('confirmPassword', e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading || usernameStatus === 'taken'}>
            {loading ? (
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⏳</motion.span>
            ) : 'Create Account'}
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account? <Link href={redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login'} className={styles.link}>Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
