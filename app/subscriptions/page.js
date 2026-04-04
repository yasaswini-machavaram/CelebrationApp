'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { getTemplateById } from '@/lib/data/templates';
import styles from './page.module.css';

export default function SubscriptionsPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/subscriptions');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    fetchSubscriptions();
  }, [user]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/subscriptions');
      if (res.status === 401) {
        router.push('/login?redirect=/subscriptions');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setSubscriptions(data.subscriptions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async (sub) => {
    setBuyingId(sub._id);
    try {
      // Step 1: Create order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: sub.templateId, invitationId: sub._id }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert(orderData.error || 'Failed to create order.');
        return;
      }

      if (orderData.free) {
        // Free template — just reactivate
        await fetch('/api/invitations', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invitationId: sub._id, isPaid: true }),
        });
        await fetchSubscriptions();
        return;
      }

      // Step 2: Verify payment (mock or real)
      await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: orderData.order.id,
          razorpay_payment_id: `mock_pay_${Date.now()}`,
          razorpay_signature: 'mock_signature',
          invitationId: sub._id,
        }),
      });

      await fetchSubscriptions();
    } catch (err) {
      console.error(err);
      alert('Payment failed. Please try again.');
    } finally {
      setBuyingId(null);
    }
  };

  const copyLink = (slug) => {
    const url = `${window.location.origin}/invite/${slug}`;
    navigator.clipboard.writeText(url);
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const fmtAmount = (p) => p ? `₹${(p / 100).toFixed(0)}` : '—';

  const getStatus = (sub) => {
    if (sub.isPaid) return 'paid';
    if (!sub.isActive) return 'expired';
    return 'free';
  };

  if (authLoading) return null;

  return (
    <div className={styles.subsPage}>
      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.navLogo}>CelebrationApp</Link>
          <div className={styles.navLinks}>
            <Link href="/templates" className={styles.navLink}>Templates</Link>
            <button className={styles.logoutBtn} onClick={logout}>Logout</button>
          </div>
        </div>
      </nav>

      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.headerLabel}>My Account</span>
        <h1 className={styles.headerTitle}>
          Your <span className="gradient-text">Subscriptions</span>
        </h1>
        <p className={styles.headerDesc}>
          View and manage all your wedding invitations.
        </p>
      </motion.div>

      {loading ? (
        <div className={styles.loadingState}>Loading your invitations...</div>
      ) : subscriptions.length === 0 ? (
        <motion.div
          className={styles.emptyState}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className={styles.emptyIcon}>💌</div>
          <h2 className={styles.emptyTitle}>No invitations yet</h2>
          <p className={styles.emptyDesc}>Create your first beautiful wedding invitation.</p>
          <Link href="/templates" className="btn-primary">Browse Templates →</Link>
        </motion.div>
      ) : (
        <div className={styles.cardGrid}>
          <AnimatePresence>
            {subscriptions.map((sub, i) => {
              const status = getStatus(sub);
              const template = getTemplateById(sub.templateId);

              return (
                <motion.div
                  key={sub._id}
                  className={styles.card}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  {/* Header */}
                  <div className={styles.cardTop}>
                    <div className={styles.cardCouple}>
                      {sub.groomName} <span>&</span> {sub.brideName}
                    </div>
                    <span className={`${styles.cardBadge} ${
                      status === 'paid' ? styles.badgePaid :
                      status === 'expired' ? styles.badgeExpired :
                      styles.badgeFree
                    }`}>
                      {status === 'paid' ? '✓ Paid' : status === 'expired' ? 'Expired' : 'Free Preview'}
                    </span>
                  </div>

                  {/* Body */}
                  <div className={styles.cardBody}>
                    <div className={styles.cardField}>
                      <span className={styles.fieldLabel}>Template</span>
                      <span className={styles.fieldValue}>{template?.name || sub.templateId}</span>
                    </div>
                    <div className={styles.cardField}>
                      <span className={styles.fieldLabel}>Wedding Date</span>
                      <span className={styles.fieldValue}>{fmtDate(sub.weddingDate)}</span>
                    </div>
                    <div className={styles.cardField}>
                      <span className={styles.fieldLabel}>Created</span>
                      <span className={styles.fieldValue}>{fmtDate(sub.createdAt)}</span>
                    </div>
                    <div className={styles.cardField}>
                      <span className={styles.fieldLabel}>Invite URL</span>
                      <span className={styles.fieldMono}>/invite/{sub.slug}</span>
                    </div>
                    {sub.payment && (
                      <>
                        <div className={styles.cardField}>
                          <span className={styles.fieldLabel}>Payment ID</span>
                          <span className={styles.fieldMono}>{sub.payment.razorpayPaymentId || '—'}</span>
                        </div>
                        <div className={styles.cardField}>
                          <span className={styles.fieldLabel}>Amount</span>
                          <span className={styles.fieldValue}>{fmtAmount(sub.payment.amount)}</span>
                        </div>
                        <div className={styles.cardField}>
                          <span className={styles.fieldLabel}>Paid On</span>
                          <span className={styles.fieldValue}>{fmtDate(sub.payment.createdAt)}</span>
                        </div>
                      </>
                    )}
                    {sub.isPaid && (
                      <div className={styles.cardField}>
                        <span className={styles.fieldLabel}>Edit Status</span>
                        <span className={styles.fieldValue} style={{ color: (sub.editCount || 0) >= 1 ? '#ef4444' : '#22c55e' }}>
                          {(sub.editCount || 0) >= 1 ? '🔒 Edit Used' : '✏️ 1 Edit Available'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className={styles.cardActions}>
                    {sub.isActive && (
                      <Link href={`/invite/${sub.slug}`} target="_blank" className={styles.viewBtn}>
                        View Invitation →
                      </Link>
                    )}
                    {!sub.isPaid && (
                      <button
                        className={styles.buyBtn}
                        onClick={() => handleBuyNow(sub)}
                        disabled={buyingId === sub._id}
                      >
                        {buyingId === sub._id ? '⏳ Processing...' : '💳 Buy Now'}
                      </button>
                    )}
                    {sub.isPaid && (sub.editCount || 0) < 1 && (
                      <Link
                        href={`/dashboard/${sub.templateId}/edit/${sub._id}`}
                        className={styles.editBtn}
                      >
                        ✏️ Edit Invitation
                      </Link>
                    )}
                    {sub.isPaid && (sub.editCount || 0) >= 1 && (
                      <span className={styles.contactAdminBtn} title="Edit limit reached — contact admin for changes">
                        📞 Contact Admin
                      </span>
                    )}
                    <button
                      className={styles.copyBtn}
                      onClick={() => copyLink(sub.slug)}
                    >
                      📋 Copy Link
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
