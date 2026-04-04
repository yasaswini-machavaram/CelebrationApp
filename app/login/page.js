'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import styles from '../signup/page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);

  // Forgot password state
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1=username, 2=mobile, 3=new password
  const [forgotData, setForgotData] = useState({ username: '', mobile: '', newPassword: '', confirmPassword: '' });
  const [maskedMobile, setMaskedMobile] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setRegistered(true);
      setTimeout(() => setRegistered(false), 5000);
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.password) {
      setError('Username and password are required.');
      return;
    }
    setLoading(true);
    const result = await login(form.username, form.password);
    setLoading(false);
    if (result.success) {
      // Redirect to the page they were trying to access, or /templates
      const redirectTo = searchParams.get('redirect') || '/templates';
      router.push(redirectTo);
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  const handleForgotStep1 = async () => {
    setForgotError('');
    if (!forgotData.username) {
      setForgotError('Enter your username.');
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: forgotData.username }),
      });
      const data = await res.json();
      if (data.success) {
        setMaskedMobile(data.maskedMobile);
        setForgotStep(2);
      } else {
        setForgotError(data.error);
      }
    } catch {
      setForgotError('Something went wrong.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotStep2 = async () => {
    setForgotError('');
    if (!forgotData.mobile) {
      setForgotError('Enter your mobile number.');
      return;
    }
    setForgotStep(3);
  };

  const handleForgotStep3 = async () => {
    setForgotError('');
    if (!forgotData.newPassword || forgotData.newPassword.length < 4) {
      setForgotError('Password must be at least 4 characters.');
      return;
    }
    if (forgotData.newPassword !== forgotData.confirmPassword) {
      setForgotError('Passwords do not match.');
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: forgotData.username,
          mobile: forgotData.mobile,
          newPassword: forgotData.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setForgotSuccess('Password reset! You can now login.');
        setForgotMode(false);
        setForgotStep(1);
        setForgotData({ username: '', mobile: '', newPassword: '', confirmPassword: '' });
      } else {
        setForgotError(data.error);
      }
    } catch {
      setForgotError('Something went wrong.');
    } finally {
      setForgotLoading(false);
    }
  };

  const cancelForgot = () => {
    setForgotMode(false);
    setForgotStep(1);
    setForgotData({ username: '', mobile: '', newPassword: '', confirmPassword: '' });
    setForgotError('');
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
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Log in to manage your invitations</p>

        {registered && (
          <motion.div className={styles.successBox} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            🎉 Account created! Please log in.
          </motion.div>
        )}
        {forgotSuccess && (
          <motion.div className={styles.successBox} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            ✓ {forgotSuccess}
          </motion.div>
        )}
        {error && (
          <motion.div className={styles.errorBox} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            {error}
          </motion.div>
        )}

        {!forgotMode ? (
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Username</label>
              <input
                className={styles.input}
                placeholder="Enter your username"
                value={form.username}
                onChange={e => { setForm(p => ({ ...p, username: e.target.value })); setError(''); }}
                autoComplete="username"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError(''); }}
                autoComplete="current-password"
              />
            </div>
            <div className={styles.forgotLink}>
              <button type="button" className={styles.forgotBtn} onClick={() => setForgotMode(true)}>
                Forgot Password?
              </button>
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? '⏳' : 'Log In'}
            </button>
          </form>
        ) : (
          <div className={styles.forgotCard}>
            <div className={styles.forgotTitle}>Reset Password</div>

            {forgotError && (
              <motion.div className={styles.errorBox} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {forgotError}
              </motion.div>
            )}

            {forgotStep === 1 && (
              <>
                <p className={styles.forgotStep}>Step 1: Enter your username</p>
                <input
                  className={styles.input}
                  placeholder="Your username"
                  value={forgotData.username}
                  onChange={e => setForgotData(p => ({ ...p, username: e.target.value }))}
                />
                <div className={styles.forgotActions}>
                  <button className={styles.forgotSubmitBtn} onClick={handleForgotStep1} disabled={forgotLoading}>
                    {forgotLoading ? '⏳' : 'Next'}
                  </button>
                  <button className={styles.forgotCancelBtn} onClick={cancelForgot}>Cancel</button>
                </div>
              </>
            )}

            {forgotStep === 2 && (
              <>
                <p className={styles.forgotStep}>Step 2: Enter the mobile number linked to <strong>{forgotData.username}</strong></p>
                <p className={styles.forgotStep}>Hint: {maskedMobile}</p>
                <input
                  type="tel"
                  className={styles.input}
                  placeholder="Your 10-digit mobile"
                  value={forgotData.mobile}
                  onChange={e => setForgotData(p => ({ ...p, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                />
                <div className={styles.forgotActions}>
                  <button className={styles.forgotSubmitBtn} onClick={handleForgotStep2}>Next</button>
                  <button className={styles.forgotCancelBtn} onClick={cancelForgot}>Cancel</button>
                </div>
              </>
            )}

            {forgotStep === 3 && (
              <>
                <p className={styles.forgotStep}>Step 3: Set your new password</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="New password (min 4 chars)"
                    value={forgotData.newPassword}
                    onChange={e => setForgotData(p => ({ ...p, newPassword: e.target.value }))}
                  />
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="Confirm new password"
                    value={forgotData.confirmPassword}
                    onChange={e => setForgotData(p => ({ ...p, confirmPassword: e.target.value }))}
                  />
                </div>
                <div className={styles.forgotActions}>
                  <button className={styles.forgotSubmitBtn} onClick={handleForgotStep3} disabled={forgotLoading}>
                    {forgotLoading ? '⏳' : 'Reset Password'}
                  </button>
                  <button className={styles.forgotCancelBtn} onClick={cancelForgot}>Cancel</button>
                </div>
              </>
            )}
          </div>
        )}

        <p className={styles.footerText}>
          Don&apos;t have an account? <Link href="/signup" className={styles.link}>Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
