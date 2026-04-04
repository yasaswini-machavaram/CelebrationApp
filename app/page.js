'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { templates, categories } from '@/lib/data/templates';
import { useAuth } from '@/components/providers/AuthProvider';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => null,
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredTemplates, setFilteredTemplates] = useState(templates);
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredTemplates(templates);
    } else {
      setFilteredTemplates(templates.filter(t => t.category === activeCategory));
    }
  }, [activeCategory]);

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  const stats = [
    { number: '500+', label: 'Invites Created' },
    { number: '5', label: 'Template Styles' },
    { number: '10min', label: 'Setup Time' },
    { number: '∞', label: 'Shareable Links' },
  ];

  const steps = [
    {
      number: '1',
      title: 'Choose a Template',
      desc: 'Browse our curated collection of wedding templates designed for every culture and style.',
    },
    {
      number: '2',
      title: 'Customize Details',
      desc: 'Add your names, dates, venues, photos, and love story through our easy form.',
    },
    {
      number: '3',
      title: 'Share Your Invite',
      desc: 'Get a unique link to your beautiful animated wedding invitation and share it with everyone.',
    },
  ];

  const features = [
    {
      icon: '✨',
      title: 'Stunning Animations',
      desc: 'Scroll-triggered animations, parallax effects, and smooth transitions that wow your guests.',
    },
    {
      icon: '📱',
      title: 'Mobile-First Design',
      desc: 'Perfectly crafted for mobile sharing via WhatsApp, Instagram, and all social platforms.',
    },
    {
      icon: '⚡',
      title: 'Instant Updates',
      desc: 'Change anything — names, dates, venue — even after sharing. Updates reflect instantly.',
    },
    {
      icon: '🎨',
      title: 'Cultural Templates',
      desc: 'Templates for Hindu, Christian, Muslim, Sikh, and South-Indian weddings with cultural motifs.',
    },
    {
      icon: '🔗',
      title: 'Shareable Link',
      desc: 'Get a unique URL for your invitation. No app downloads needed — just click and view.',
    },
    {
      icon: '📸',
      title: 'Photo Gallery',
      desc: 'Showcase your pre-wedding shoot and special moments with a beautiful built-in gallery.',
    },
  ];

  return (
    <div className={styles.landing}>
      {/* Navbar */}
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            CelebrationApp
          </Link>
          <ul className={styles.navLinks}>
            <li><a href="#templates" className={styles.navLink}>Templates</a></li>
            <li><a href="#how-it-works" className={styles.navLink}>How it Works</a></li>
            <li><a href="#features" className={styles.navLink}>Features</a></li>
            {!authLoading && (
              <>
                {user ? (
                  <>
                    <li><Link href="/subscriptions" className={styles.navUser} title="My Subscriptions">👤 {user.username}</Link></li>
                    <li>
                      <button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li><Link href="/login" className={styles.navLink}>Login</Link></li>
                    <li>
                      <Link href="/signup" className={`btn-primary ${styles.navCta}`}>
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroGradient} />
          <HeroScene />
          <div className={`${styles.floatingOrb} ${styles.orb1}`} />
          <div className={`${styles.floatingOrb} ${styles.orb2}`} />
          <div className={`${styles.floatingOrb} ${styles.orb3}`} />
        </div>

        <motion.div
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div className={styles.heroTag} variants={fadeUp}>
            <span className={styles.heroTagDot} />
            Wedding Invitations, Reinvented
          </motion.div>

          <motion.h1 className={styles.heroTitle} variants={fadeUp} custom={1}>
            Create <span className="gradient-text">Stunning</span> Wedding
            <br />Invitation Websites
          </motion.h1>

          <motion.p className={styles.heroSubtitle} variants={fadeUp} custom={2}>
            Choose a beautiful template, add your love story, and share a unique
            link with your guests — all in under 10 minutes.
          </motion.p>

          <motion.div className={styles.heroCtas} variants={fadeUp} custom={3}>
            <Link href="/templates" className="btn-primary">
              Explore Templates
              <span className={styles.heroArrow}>→</span>
            </Link>
            <a href="#how-it-works" className="btn-secondary">
              See How it Works
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <motion.section
        className={styles.statsBar}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <motion.div key={i} className={styles.statItem} variants={fadeUp} custom={i}>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Templates Preview */}
      <section className={styles.templatesPreview} id="templates">
        <motion.div
          className={styles.sectionHeader}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
        >
          <motion.span className={styles.sectionTag} variants={fadeUp}>Templates</motion.span>
          <motion.h2 className={styles.sectionTitle} variants={fadeUp} custom={1}>
            Designed for Your <span className="gradient-text">Big Day</span>
          </motion.h2>
          <motion.p className={styles.sectionSubtitle} variants={fadeUp} custom={2}>
            Pick a style that matches your celebration. Customize everything with your details.
          </motion.p>
        </motion.div>

        <div className={styles.categoryTabs}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.categoryTab} ${activeCategory === cat ? styles.categoryTabActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div
          className={styles.templatesGrid}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                layout
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                className={styles.templateCard}
              >
                <Link href={template.comingSoon ? '#' : `/dashboard/${template.id}`} className={styles.templateCardLink}>
                  <div
                    className={styles.templateThumb}
                    style={{
                      background: `linear-gradient(135deg, ${template.colors.primary}22, ${template.colors.secondary}22, ${template.colors.accent}22)`,
                    }}
                  >
                    <div className={styles.templateThumbPlaceholder}>
                      {template.name}
                    </div>
                    {template.comingSoon && (
                      <span className={styles.comingSoonBadge}>Coming Soon</span>
                    )}
                  </div>
                  <div className={styles.templateInfo}>
                    <div className={styles.templateCategory}>{template.category}</div>
                    <h3 className={styles.templateName}>{template.name}</h3>
                    <p className={styles.templateDesc}>{template.description}</p>
                    <div className={styles.templateFeatures}>
                      {template.features.slice(0, 3).map((f) => (
                        <span key={f} className={styles.featureTag}>{f}</span>
                      ))}
                    </div>
                  </div>
                </Link>
                {!template.comingSoon && (
                  <div className={styles.templateCardActions}>
                    {template.sampleSlug ? (
                      <a
                        href={`/invite/${template.sampleSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.sampleBtn}
                      >
                        👁 View Sample
                      </a>
                    ) : null}
                    <Link
                      href={`/dashboard/${template.id}`}
                      className={styles.useTemplateBtn}
                    >
                      Use Template →
                    </Link>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks} id="how-it-works">
        <motion.div
          className={styles.sectionHeader}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
        >
          <motion.span className={styles.sectionTag} variants={fadeUp}>How It Works</motion.span>
          <motion.h2 className={styles.sectionTitle} variants={fadeUp} custom={1}>
            Three Simple <span className="gradient-text">Steps</span>
          </motion.h2>
          <motion.p className={styles.sectionSubtitle} variants={fadeUp} custom={2}>
            From template to shareable invite in under 10 minutes.
          </motion.p>
        </motion.div>

        <motion.div
          className={styles.stepsGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
        >
          {steps.map((step, i) => (
            <motion.div key={i} className={styles.stepCard} variants={fadeUp} custom={i}>
              <div className={styles.stepNumber}>{step.number}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className={styles.features} id="features">
        <motion.div
          className={styles.sectionHeader}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
        >
          <motion.span className={styles.sectionTag} variants={fadeUp}>Features</motion.span>
          <motion.h2 className={styles.sectionTitle} variants={fadeUp} custom={1}>
            Everything You <span className="gradient-text">Need</span>
          </motion.h2>
          <motion.p className={styles.sectionSubtitle} variants={fadeUp} custom={2}>
            More than just a digital invite — it&apos;s a wedding experience.
          </motion.p>
        </motion.div>

        <motion.div
          className={styles.featuresGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
        >
          {features.map((feature, i) => (
            <motion.div key={i} className={styles.featureCard} variants={fadeUp} custom={i}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} />
        <motion.div
          className={styles.ctaContent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2 className={styles.ctaTitle} variants={fadeUp}>
            Ready to Create Your <span className="gradient-text">Invite</span>?
          </motion.h2>
          <motion.p className={styles.ctaSubtitle} variants={fadeUp} custom={1}>
            Start with a beautiful template and make it yours in minutes.
          </motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <Link href="/templates" className="btn-primary">
              Get Started — It&apos;s Free
              <span className={styles.heroArrow}>→</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © {new Date().getFullYear()} CelebrationApp — Made with{' '}
          <span className={styles.footerHeart}>♥</span> for your celebrations
        </p>
      </footer>
    </div>
  );
}
