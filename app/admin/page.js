'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';

const TABS = ['Users', 'Invitations', 'Payments', 'Pricing'];
const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Users');
  const [users, setUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [authError, setAuthError] = useState(false);
  const inactivityTimer = useRef(null);

  // ─── Upfront auth check ───────────────────────────────────────
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await fetch('/api/admin/verify');
        if (!res.ok) {
          router.replace('/admin/login');
          return;
        }
        setAuthChecking(false);
      } catch {
        router.replace('/admin/login');
      }
    };
    verifyAdmin();
  }, [router]);

  // ─── Inactivity auto-logout ───────────────────────────────────
  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch { /* ignore */ }
    router.replace('/admin/login');
  }, [router]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIMEOUT_MS);
  }, [handleLogout]);

  useEffect(() => {
    if (authChecking) return;

    // Activity events to track
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    const onActivity = () => resetInactivityTimer();

    events.forEach(e => window.addEventListener(e, onActivity, { passive: true }));
    resetInactivityTimer(); // start the timer

    return () => {
      events.forEach(e => window.removeEventListener(e, onActivity));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [authChecking, resetInactivityTimer]);

  // ─── Data fetching ────────────────────────────────────────────
  useEffect(() => {
    if (authChecking) return;
    fetchData();
  }, [activeTab, authChecking]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = '';
      if (activeTab === 'Users') url = '/api/admin/users';
      if (activeTab === 'Invitations') url = '/api/admin/invitations';
      if (activeTab === 'Payments') url = '/api/admin/payments';
      if (activeTab === 'Pricing') url = '/api/admin/pricing';

      const res = await fetch(url);
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }
      const data = await res.json();

      if (activeTab === 'Users') setUsers(data.users || []);
      if (activeTab === 'Invitations') setInvitations(data.invitations || []);
      if (activeTab === 'Payments') setPayments(data.payments || []);
      if (activeTab === 'Pricing') setPricing(data.pricing || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user and all their data?')) return;
    await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  const toggleInvitation = async (id, currentActive) => {
    await fetch('/api/admin/invitations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive: !currentActive }),
    });
    fetchData();
  };

  const deleteInvitation = async (id) => {
    if (!confirm('Delete this invitation?')) return;
    await fetch(`/api/admin/invitations?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  const updatePrice = async (templateId, priceRupees) => {
    const paise = Math.round(parseFloat(priceRupees) * 100);
    if (isNaN(paise) || paise < 0) return;
    await fetch('/api/admin/pricing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId, price: paise }),
    });
    fetchData();
  };

  // ─── Show nothing while checking auth (prevents flash) ────────
  if (authChecking) {
    return (
      <div className={styles.adminPage}>
        <div className={styles.loadingState}>Verifying admin access...</div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className={styles.adminPage}>
        <div className={styles.authErrorCard}>
          <h2>Access Denied</h2>
          <p>Please log in as admin.</p>
          <button onClick={() => router.push('/admin/login')} className={styles.primaryBtn}>Go to Admin Login</button>
        </div>
      </div>
    );
  }

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const fmtAmount = (p) => `₹${(p / 100).toFixed(2)}`;

  return (
    <div className={styles.adminPage}>
      <nav className={styles.adminNav}>
        <span className={styles.adminLogo}>⚙️ Admin Panel</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={styles.logoutBtn} onClick={() => router.push('/')}>← Back to Site</button>
          <button className={styles.logoutBtn} onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>Logout</button>
        </div>
      </nav>

      <div className={styles.tabBar}>
        {TABS.map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loadingState}>Loading...</div>
        ) : (
          <AnimatePresence mode="wait">
            {/* ═══ USERS TAB ═══ */}
            {activeTab === 'Users' && (
              <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className={styles.tableHeader}>
                  <h2>All Users ({users.length})</h2>
                </div>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr><th>Username</th><th>Email</th><th>Mobile</th><th>Joined</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id}>
                          <td className={styles.bold}>{u.username}</td>
                          <td>{u.email}</td>
                          <td>{u.mobile}</td>
                          <td>{fmtDate(u.createdAt)}</td>
                          <td>
                            <button className={styles.dangerBtn} onClick={() => deleteUser(u._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && <tr><td colSpan={5} className={styles.empty}>No users yet</td></tr>}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ═══ INVITATIONS TAB ═══ */}
            {activeTab === 'Invitations' && (
              <motion.div key="invitations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className={styles.tableHeader}>
                  <h2>All Invitations ({invitations.length})</h2>
                </div>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr><th>Slug</th><th>User</th><th>Template</th><th>Paid</th><th>Active</th><th>Created</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {invitations.map(inv => (
                        <tr key={inv._id}>
                          <td className={styles.bold}>{inv.slug}</td>
                          <td>{inv.userId?.username || '—'}</td>
                          <td>{inv.templateId}</td>
                          <td><span className={inv.isPaid ? styles.badgeGreen : styles.badgeRed}>{inv.isPaid ? 'Paid' : 'Free'}</span></td>
                          <td><span className={inv.isActive ? styles.badgeGreen : styles.badgeRed}>{inv.isActive ? 'Active' : 'Inactive'}</span></td>
                          <td>{fmtDate(inv.createdAt)}</td>
                          <td className={styles.actions}>
                            <button className={styles.toggleBtn} onClick={() => toggleInvitation(inv._id, inv.isActive)}>
                              {inv.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className={styles.dangerBtn} onClick={() => deleteInvitation(inv._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                      {invitations.length === 0 && <tr><td colSpan={7} className={styles.empty}>No invitations</td></tr>}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ═══ PAYMENTS TAB ═══ */}
            {activeTab === 'Payments' && (
              <motion.div key="payments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className={styles.tableHeader}>
                  <h2>Payments ({payments.length})</h2>
                </div>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr><th>User</th><th>Email</th><th>Template</th><th>Invitation</th><th>Amount</th><th>Status</th><th>Order ID</th><th>Payment ID</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {payments.map(p => (
                        <tr key={p._id}>
                          <td className={styles.bold}>{p.userId?.username || '—'}</td>
                          <td>{p.userId?.email || '—'}</td>
                          <td>{p.templateId || '—'}</td>
                          <td>{p.invitationId ? (
                            <span title={`${p.invitationId.groomName || ''} & ${p.invitationId.brideName || ''}`}>
                              {p.invitationId.slug || '—'}
                            </span>
                          ) : '—'}</td>
                          <td>{fmtAmount(p.amount)}</td>
                          <td><span className={p.status === 'paid' ? styles.badgeGreen : p.status === 'failed' ? styles.badgeRed : styles.badgeYellow}>{p.status}</span></td>
                          <td className={styles.mono}>{p.razorpayOrderId || '—'}</td>
                          <td className={styles.mono}>{p.razorpayPaymentId || '—'}</td>
                          <td>{fmtDate(p.createdAt)}</td>
                        </tr>
                      ))}
                      {payments.length === 0 && <tr><td colSpan={9} className={styles.empty}>No payments</td></tr>}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ═══ PRICING TAB ═══ */}
            {activeTab === 'Pricing' && (
              <motion.div key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className={styles.tableHeader}>
                  <h2>Template Pricing</h2>
                </div>
                <div className={styles.pricingGrid}>
                  {pricing.map(p => (
                    <PricingCard key={p.templateId} item={p} onSave={updatePrice} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function PricingCard({ item, onSave }) {
  const [price, setPrice] = useState((item.price / 100).toString());
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(item.templateId, price);
    setSaving(false);
  };

  return (
    <div className={styles.pricingCard}>
      <div className={styles.pricingName}>{item.name}</div>
      <div className={styles.pricingCategory}>{item.category}</div>
      <div className={styles.pricingInput}>
        <span className={styles.rupee}>₹</span>
        <input
          type="number"
          min="0"
          step="1"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className={styles.priceField}
        />
      </div>
      <button className={styles.primaryBtn} onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Update Price'}
      </button>
    </div>
  );
}
