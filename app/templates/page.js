'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { templates, categories } from '@/lib/data/templates';
import { useAuth } from '@/components/providers/AuthProvider';

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { user, logout } = useAuth();
  const filtered = activeCategory === 'All'
    ? templates
    : templates.filter(t => t.category === activeCategory);

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '4rem' }}>
      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '1rem 0', background: 'rgba(253,248,246,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(210,138,140,0.12)', boxShadow: '0 2px 20px rgba(210,138,140,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: "'Great Vibes', cursive", fontSize: '1.8rem', color: '#D28A8C' }}>
            CelebrationApp
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/templates" style={{ fontSize: '0.9rem', color: '#6B5E62' }}>
              All Templates
            </Link>
            {user ? (
              <>
                <Link href="/subscriptions" style={{ fontSize: '0.9rem', color: '#D28A8C', fontWeight: 600, cursor: 'pointer' }} title="My Subscriptions">
                  👤 {user.username}
                </Link>
                <button
                  onClick={logout}
                  style={{ padding: '0.35rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" style={{ fontSize: '0.9rem', color: '#6B5E62' }}>
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '3rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#D28A8C', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Choose Your Design
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, margin: '0.5rem 0', color: '#2D2A2E' }}>
            Wedding <span className="gradient-text">Templates</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#6B5E62', maxWidth: 550, margin: '0 auto' }}>
            Select a template to start creating your personalized wedding invitation.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: activeCategory === cat ? 600 : 500,
                color: activeCategory === cat ? '#FFFFFF' : '#6B5E62',
                background: activeCategory === cat ? 'linear-gradient(135deg, #D28A8C, #FDBA90)' : 'transparent',
                border: activeCategory === cat ? 'none' : '1px solid rgba(210,138,140,0.15)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: activeCategory === cat ? '0 2px 10px rgba(210,138,140,0.25)' : 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <motion.div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((template) => (
              <motion.div
                key={template.id}
                layout
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#FFFFFF',
                  border: '1px solid rgba(210,138,140,0.12)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(210,138,140,0.06)',
                }}
                whileHover={{ y: -8, boxShadow: '0 8px 30px rgba(210,138,140,0.15)' }}
              >
                <Link href={template.comingSoon ? '#' : `/dashboard/${template.id}`} style={{ display: 'block' }}>
                  <div
                    style={{
                      width: '100%',
                      height: 380,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Great Vibes', cursive",
                      fontSize: '2.5rem',
                      color: 'rgba(255,255,255,0.15)',
                      background: `linear-gradient(135deg, ${template.colors.primary}22, ${template.colors.secondary}22, ${template.colors.accent}22)`,
                      position: 'relative',
                    }}
                  >
                    {template.name}
                    {template.comingSoon && (
                      <span style={{
                        position: 'absolute', top: 16, right: 16, padding: '4px 16px',
                        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(210,138,140,0.15)', borderRadius: '9999px',
                        fontSize: '0.75rem', color: '#D28A8C', fontWeight: 500, fontFamily: "'Inter', sans-serif"
                      }}>
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D28A8C', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                      {template.category}
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 600, marginBottom: 8, color: '#2D2A2E' }}>
                      {template.name}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#6B5E62', lineHeight: 1.5, marginBottom: 16 }}>
                      {template.description}
                    </p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {template.features.slice(0, 3).map((f) => (
                        <span key={f} style={{
                          padding: '2px 10px', background: 'rgba(210,138,140,0.06)',
                          border: '1px solid rgba(210,138,140,0.12)', borderRadius: '9999px',
                          fontSize: '0.7rem', color: '#6B5E62',
                        }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
                {/* Action Buttons */}
                {!template.comingSoon && (
                  <div style={{ display: 'flex', gap: '0.5rem', padding: '0 1.5rem 1.5rem' }}>
                    {template.sampleSlug && (
                      <a
                        href={`/invite/${template.sampleSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          padding: '0.65rem 1rem',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: '#D28A8C',
                          background: 'rgba(210,138,140,0.08)',
                          border: '1px solid rgba(210,138,140,0.2)',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease',
                          fontFamily: "'Inter', sans-serif",
                          whiteSpace: 'nowrap',
                        }}
                      >
                        👁 View Sample
                      </a>
                    )}
                    <Link
                      href={`/dashboard/${template.id}`}
                      style={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.3rem',
                        padding: '0.65rem 1rem',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#FFFFFF',
                        background: 'linear-gradient(135deg, #D28A8C, #FDBA90)',
                        border: 'none',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        fontFamily: "'Inter', sans-serif",
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 10px rgba(210,138,140,0.2)',
                      }}
                    >
                      Use This Template →
                    </Link>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
