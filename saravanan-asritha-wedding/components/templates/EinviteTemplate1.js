'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './EinviteTemplate1.module.css';

/**
 * EinviteTemplate1 — Full layout (Page 2 removed on mobile only)
 *
 * Page 1: Sky, peacocks, names, tagline          (y: 0 – 760)
 * Page 2: Temple courtyard (desktop only)        (y: 760 – 1521)
 * Page 3: Red carpet, Ganesha, wedding date       (y: 1521|760 – 2281|1520)
 * Page 4: Family intro, names, weds              (y: 2281|1520 – 3039|2278)
 * Page 5: Introducing polaroid + gallery         (y: 3039|2278 – 3804|3043, only if photos)
 * Page 6: Save the Date, events, shared venue    (y: 3804|3043|3039|2278 – 4564|3803|3799|3038)
 * Page 7: Round frame, Thank You, countdown      (y: 4564|3803|3799|3038 – 5324|4563|4559|3798)
 */

// ─── Countdown hook ─────────────────────────────────────────────────────────
function useCountdown(targetDate) {
  const calc = () => {
    if (!targetDate) return null;
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { done: true };
    return {
      done: false,
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!targetDate) return;
    setTimeLeft(calc());
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

// ─── Countdown UI ────────────────────────────────────────────────────────────
function CountdownTimer({ weddingDate }) {
  const timeLeft = useCountdown(weddingDate);
  if (!timeLeft) return null;

  if (timeLeft.done) {
    return (
      <div className={styles.countdownWrapper}>
        <div className={styles.countdownDone}>The Big Day Has Arrived! 🎊</div>
      </div>
    );
  }

  const pad = (n) => String(n).padStart(2, '0');
  const units = [
    { label: 'Days', value: pad(timeLeft.days) },
    { label: 'Hours', value: pad(timeLeft.hours) },
    { label: 'Minutes', value: pad(timeLeft.minutes) },
    { label: 'Seconds', value: pad(timeLeft.seconds) },
  ];

  return (
    <div className={styles.countdownWrapper}>
      <div className={styles.countdownHeading}>Counting down to</div>
      <div className={styles.countdownRow}>
        {units.map((unit, i) => (
          <React.Fragment key={unit.label}>
            {i > 0 && <span className={styles.countdownSeparator}>:</span>}
            <div className={styles.countdownBox}>
              <div className={styles.countdownNumber}>{unit.value}</div>
              <div className={styles.countdownLabel}>{unit.label}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── Background Music + Splash Overlay ───────────────────────────────────────
function MusicPlayer({ groomName, brideName }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const openInvitation = () => {
    setShowSplash(false);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5;
      audio.play().then(() => setIsPlaying(true)).catch(() => { });
    }
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => { });
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/love.mp3" loop preload="auto" />

      {/* Splash overlay — guarantees user interaction for autoplay */}
      {showSplash && (
        <div className={styles.splashOverlay}>
          <div className={styles.splashContent}>
            <div className={styles.splashOrnament}>✦</div>
            <div className={styles.splashSubtitle}>You Are Invited To The Wedding Of</div>
            <div className={styles.splashNames}>{groomName} & {brideName}</div>
            <button className={styles.splashButton} onClick={openInvitation}>
              Open Invitation
            </button>
            <div className={styles.splashOrnament}>✦</div>
          </div>
        </div>
      )}

      {/* Floating toggle (visible after splash dismissed) */}
      {!showSplash && (
        <button
          className={`${styles.musicToggle} ${isPlaying ? styles.musicPlaying : ''}`}
          onClick={toggle}
          aria-label={isPlaying ? 'Mute music' : 'Play music'}
          title={isPlaying ? 'Mute music' : 'Play music'}
        >
          {isPlaying ? '♫' : '♪'}
        </button>
      )}
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function EinviteTemplate1({ invitation = {} }) {
  const {
    groomName = 'Saravanan',
    brideName = 'Meenakshi',
    groomParents = 'Mr. & Mrs. Jayakumar',
    brideParents = 'Mr. & Mrs. Kumar',
    galleryImages = [],
    events = [],
    weddingDate = '',
    tagline = '',
  } = invitation;

  const hasPhotos = galleryImages && galleryImages.length > 0;

  // Mobile detection for responsive layout
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Auto-detect if all events share the same venue
  const allVenues = events.filter(e => e.venue).map(e => e.venue.trim().toLowerCase());
  const sameVenue = allVenues.length > 1 && allVenues.every(v => v === allVenues[0]);
  const sharedVenue = sameVenue ? events.find(e => e.venue)?.venue : null;
  const sharedVenueAddress = sameVenue ? events.find(e => e.venueAddress)?.venueAddress : null;

  // Formatted wedding date for Page 3
  const formattedWeddingDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const canvasRef = useRef(null);

  // Reference dimensions: mobile uses portrait Figma frames (393×852)
  const PW = isMobile ? 393 : 1440;   // canvas reference width
  const PH = isMobile ? 852 : 760;     // per-page reference height

  // Page 6 height adapts to event count: taller on mobile for stacked cards with venue addresses
  const page6Height = isMobile
    ? (events.length <= 2 ? 852 : 1050)
    : (events.length <= 2 ? 760 : 960);
  const page6Top = hasPhotos
    ? (isMobile ? 4 * PH : 3804)
    : (isMobile ? 3 * PH : 3039);
  const page7Top = page6Top + page6Height;

  // Canvas total height adjusts with dynamic page 6
  const totalHeight = page7Top + PH;

  const { scrollYProgress } = useScroll({
    target: canvasRef,
    offset: ['start start', 'end start'],
  });

  // Temple rises as the user scrolls
  const templeStartPx = isMobile ? 310 : 400;
  const templeEndPx = isMobile ? 440 : 630;
  const templeStartPct = `${(templeStartPx / totalHeight) * 100}%`;
  const templeEndPct = `${(templeEndPx / totalHeight) * 100}%`;
  const templeScrollEnd = isMobile ? PH * 0.7 : 1490;
  const templeTop = useTransform(
    scrollYProgress,
    [0, templeScrollEnd / totalHeight],
    [templeStartPct, templeEndPct]
  );

  // Carpet unrolls as Page 3 enters the viewport
  const carpetStart = isMobile ? PH * 0.2 : 1064;
  const carpetEnd = isMobile ? PH * 1.2 : 1703;
  const carpetClipPath = useTransform(
    scrollYProgress,
    [carpetStart / totalHeight, carpetEnd / totalHeight],
    ['inset(0 0 100% 0)', 'inset(0 0 0% 0)']
  );

  // Page 3 text fades in WHILE the carpet is unrolling
  const carpetTextStart = isMobile ? PH * 0.5 : 1200;
  const carpetTextOpacity = useTransform(
    scrollYProgress,
    [carpetTextStart / totalHeight, carpetEnd / totalHeight],
    [0, 1]
  );
  const carpetTextY = useTransform(
    scrollYProgress,
    [carpetTextStart / totalHeight, carpetEnd / totalHeight],
    [30, 0]
  );

  return (
    <div className={styles.wrapper}>
      <MusicPlayer groomName={groomName} brideName={brideName} />
      <div
        className={styles.canvas}
        ref={canvasRef}
        style={{ aspectRatio: `${PW} / ${totalHeight}` }}
      >

        {/* ========== PAGE 1: SKY & NAMES ========== */}
        <div className={`${styles.sectionBlock} ${styles.page1}`}>
          <div className={`${styles.fillBlock} ${styles.skyGradient}`} />
          <div className={styles.page1Bg}>
            <img src="/assets/einvite-template1/fresh/page1-bg.png" alt="Sky bg" className={styles.imgCover} />
          </div>
          <div className={styles.garlandTop} />
          <motion.div
            className={styles.heroNames}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          >
            <h1 className={styles.groomName}>{groomName}</h1>
            <span className={styles.ampersand}>&</span>
            <h1 className={styles.brideName}>{brideName}</h1>
            {tagline && (
              <motion.div
                className={styles.taglineText}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
              >
                ✦ {tagline} ✦
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* ========== PAGE 2: TEMPLE COURTYARD (Desktop Only) ========== */}
        {!isMobile && (
          <div className={`${styles.sectionBlock} ${styles.page2}`}>
            <div className={styles.page2Bg}>
              <img src="/assets/einvite-template1/fresh/page2-bg.png" alt="Temple courtyard" className={styles.imgCover} />
            </div>
          </div>
        )}

        {/* ========== ANIMATED TEMPLE ========== */}
        <motion.div className={styles.templeContainer} style={{ top: templeTop }}>
          <img src="/assets/einvite-template1/fresh/temple.png" alt="Temple" />
        </motion.div>

        {/* ========== PAGE 3: RED CARPET ========== */}
        <div className={`${styles.sectionBlock} ${styles.page3}`}>
          <div className={`${styles.fillBlock} ${styles.page3Gradient}`} />
          <div className={`${styles.fillBlock} ${styles.page3Pattern}`}>
            <img src="/assets/einvite-template1/fresh/page3-pattern.png" alt="Pattern overlay" className={styles.imgCover} />
          </div>
          <motion.div className={styles.carpetContainer} style={{ clipPath: carpetClipPath }}>
            <img src="/assets/einvite-template1/fresh/carpet.png" alt="Red carpet" className={styles.imgCover} />
          </motion.div>
          <div className={styles.elephantLeft}>
            <img src="/assets/einvite-template1/fresh/elephant.png" alt="Elephant Left" className={styles.imgContain} />
          </div>
          <div className={styles.elephantRight}>
            <img src="/assets/einvite-template1/fresh/elephant.png" alt="Elephant Right" className={styles.imgContain} />
          </div>
          {/* Text reveals only after carpet is fully scrolled into view */}
          <motion.div className={styles.page3Content} style={{ opacity: carpetTextOpacity, y: carpetTextY }}>
            <div className={`${styles.headingMaiandra} ${styles.textLine1}`}>Om Shree Ganeshay Namah</div>
            <img src="/assets/einvite-template1/page2/Object.png" alt="Ganesha" className={styles.textImgCenter} />
            <div className={`${styles.headingMaiandra} ${styles.textLine2}`}>Together With Their Families</div>
            <div className={`${styles.smallMaiandra} ${styles.textLine4}`}>
              Cordially Invite You To Join The Occasion<br />
              Of Their Joyous Commitment On
            </div>
            {formattedWeddingDate && (
              <div className={styles.weddingDateDisplay}>{formattedWeddingDate}</div>
            )}
          </motion.div>
        </div>

        {/* ========== PAGE 4: FAMILY & NAMES ========== */}
        <div className={`${styles.sectionBlock} ${styles.page4}`}>
          <div className={`${styles.fillBlock} ${styles.page4Gradient}`} />
          <div className={`${styles.fillBlock} ${styles.page4Pattern}`}>
            <img src="/assets/einvite-template1/fresh/page4-pattern.png" alt="Orange pattern" className={styles.imgCover} />
          </div>

          <div className={styles.page4Border}>
            <img src="/assets/einvite-template1/fresh/page4-border-clean.png" alt="Golden Border" />
          </div>

          {/* Lamps */}
          <div className={styles.lampLeft}>
            <div className={`${styles.garlandStr} ${styles.garlandStr1}`} />
            <div className={`${styles.garlandStr} ${styles.garlandStr2}`} />
            <div className={`${styles.garlandStr} ${styles.garlandStr3}`} />
            <div className={`${styles.garlandStr} ${styles.garlandStr4}`} />
            <div className={`${styles.garlandStr} ${styles.garlandStr5}`} />
            <div className={`${styles.garlandStr} ${styles.garlandStr6}`} />
          </div>
          <div className={styles.lampRight}>
            <div className={`${styles.garlandStr} ${styles.garlandStr1}`} />
            <div className={`${styles.garlandStr} ${styles.garlandStr2}`} />
            <div className={`${styles.garlandStr} ${styles.garlandStr3}`} />
            <div className={`${styles.garlandStr} ${styles.garlandStr4}`} />
            <div className={`${styles.garlandStr} ${styles.garlandStr5}`} />
            <div className={`${styles.garlandStr} ${styles.garlandStr6}`} />
          </div>

          {/* Text Overlay — staggered fade-up on scroll */}
          <div className={styles.page4Content}>
            {[
              { cls: styles.page4SubText, content: 'Son Of', delay: 0 },
              { cls: styles.page4Parents, content: groomParents || 'Mr. & Mrs. Jayakumar', delay: 0.1 },
              { cls: styles.page4Name, content: groomName, delay: 0.2 },
              { cls: styles.page4Weds, content: 'WEDS', delay: 0.35 },
              { cls: styles.page4Name, content: brideName, delay: 0.5 },
              { cls: styles.page4SubText, content: 'Daughter Of', delay: 0.65 },
              { cls: styles.page4Parents, content: brideParents || 'Mr. & Mrs. Kumar', delay: 0.75 },
            ].map(({ cls, content, delay }, i) => (
              <motion.div
                key={i}
                className={cls}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
              >
                {content}
              </motion.div>
            ))}
          </div>
        </div>

        {/* ========== PAGE 5: INTRODUCING POLAROID (only if photos) ========== */}
        {hasPhotos && (
          <div className={`${styles.sectionBlock} ${styles.page5}`}>
            <div className={`${styles.fillBlock} ${styles.page5Gradient}`} />
            <div className={`${styles.fillBlock} ${styles.page5Pattern}`}>
              <img src="/assets/einvite-template1/fresh/page5-pattern.png" alt="Page 5 Pattern" className={styles.imgCover} />
            </div>

            <div className={styles.polaroidBg}>
              <img src="/assets/einvite-template1/fresh/page5-polaroid-clean.png" alt="Paper" className={styles.imgContain} />
            </div>

            {/* Text fade up */}
            <motion.div
              className={styles.introText}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.introTextLine1}>Introducing The</div>
              <div className={styles.introTextLine2}>Groom And Bride</div>
            </motion.div>

            {/* Rose falls after 15% of section is visible */}
            <motion.div
              className={styles.carnations}
              initial={{ y: -300, opacity: 0, rotate: -5 }}
              whileInView={{ y: 0, opacity: 1, rotate: 0 }}
              viewport={{ once: true, margin: '0px 0px -85% 0px' }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src="/assets/einvite-template1/page3/4th-page-flower.png" alt="Rose Carnations" className={styles.imgContain} />
            </motion.div>

            {/* Photo Gallery */}
            <div className={styles.photoGallery}>
              <motion.div
                className={styles.photoGalleryHeader}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >WHERE OUR STORY BEGINS!</motion.div>
              <div className={`${styles.photoGrid} ${styles[`photoCount${Math.min(galleryImages.length, 5)}`]}`}>
                {galleryImages.slice(0, 5).map((src, i) => (
                  <motion.div
                    key={i}
                    className={styles.photoBox}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 * i, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <img src={src} alt={`Gallery ${i + 1}`} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========== PAGE 6: SAVE THE DATE ========== */}
        <div
          className={`${styles.sectionBlock} ${styles.page6}`}
          style={{ top: `calc(${page6Top} / ${PW} * 100cqw)`, height: `calc(${page6Height} / ${PW} * 100cqw)` }}
        >
          <div className={`${styles.fillBlock} ${styles.page6Gradient}`} />
          <div className={`${styles.fillBlock} ${styles.page6Pattern}`}>
            <img src="/assets/einvite-template1/fresh/page6-pattern.png" alt="Page 6 Pattern" className={styles.imgCover} />
          </div>

          <div className={styles.ambientLightPage6} />

          <div className={styles.lotusLeft}>
            <img src="/assets/einvite-template1/fresh/page4-flowers-left.svg" alt="Left Lotus Leaves" className={styles.imgContain} />
          </div>
          <div className={styles.lotusRight}>
            <img src="/assets/einvite-template1/fresh/page4-flowers-right.svg" alt="Right Lotus Leaves" className={styles.imgContain} />
          </div>

          {/* Groom & Bride center image — mobile only */}
          <div className={styles.page6CenterImage}>
            <img src="/assets/einvite-template1/fresh/groom and bride 1.png" alt="Groom and Bride" className={styles.imgContain} />
          </div>

          {/* Save The Date Content */}
          <div className={styles.page6Content}>
            <motion.div
              className={styles.saveTheDateTitle}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >Save the Date</motion.div>

            {events.length > 0 && (
              <div className={styles.eventsRow}>
                {events.map((event, i) => (
                  <motion.div
                    key={i}
                    className={styles.eventCard6}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className={styles.eventName6}>{event.name}</div>
                    {event.date && (
                      <div className={styles.eventDetail6}>
                        {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    )}
                    {event.time && <div className={styles.eventDetail6}>{event.time}</div>}
                    {event.muhurtham && <div className={styles.eventMuhurtham6}>{event.muhurtham}</div>}
                    {!sameVenue && event.venue && (
                      <>
                        <div className={styles.eventVenue6}>{event.venue}</div>
                        {event.venueAddress && <div className={styles.eventVenueAddr6}>{event.venueAddress}</div>}
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {sameVenue && (
              <motion.div
                className={styles.sharedVenue}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.8, delay: events.length * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={styles.sharedVenueLabel}>Venue</div>
                <div className={styles.sharedVenueName}>{sharedVenue}</div>
                {sharedVenueAddress && <div className={styles.sharedVenueAddr}>{sharedVenueAddress}</div>}
              </motion.div>
            )}

            {/* Google Maps Embed */}
            <motion.div
              className={styles.mapContainer}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <a
                href="https://maps.app.goo.gl/HRidhZvbv4LGWS8D8?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapLink}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.5!2d78.87!3d12.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bad6dc5d18747db%3A0x98dadc813a9b4ba1!2sGOPALAYA%20THIRUMANA%20MANDABAM!5e0!3m2!1sen!2sin!4v1"
                  className={styles.mapIframe}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Venue Location"
                />
              </a>
              <a
                href="https://maps.app.goo.gl/HRidhZvbv4LGWS8D8?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapDirectionsBtn}
              >
                📍 Get Directions
              </a>
            </motion.div>
          </div>
        </div>

        {/* ========== PAGE 7: ROUND FRAME, THANK YOU & COUNTDOWN ========== */}
        <div
          className={`${styles.sectionBlock} ${styles.page7}`}
          style={{ top: `calc(${page7Top} / ${PW} * 100cqw)` }}
        >
          <div className={`${styles.fillBlock} ${styles.page7Gradient}`} />
          <div className={`${styles.fillBlock} ${styles.page7Pattern}`}>
            <img src="/assets/einvite-template1/fresh/page7-pattern.png" alt="Page 7 Pattern" className={styles.imgCover} />
          </div>

          <div className={styles.page7Border}>
            <img src="/assets/einvite-template1/fresh/page7-border-clean.png" alt="Golden Border" />
          </div>

          {/* Circular photo frame with couple image */}
          <div className={styles.roundFrameContainer}>
            <img src="/assets/einvite-template1/fresh/Bride-groom.png" alt="Bride and Groom" className={styles.roundFrameInnerImage} />
            <img src="/assets/einvite-template1/fresh/page7-round-frame.png" alt="Photo frame" className={styles.roundFrameOverlay} />
          </div>

          {/* Right panel: Thank You + Countdown */}
          <motion.div
            className={styles.page7RightPanel}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.thanksTitle}>Thank You</div>
            <div className={styles.thanksText}>
              For being a part of our joyous union.<br />
              Your presence and blessings mean the world to us.<br /><br />
              With love,<br />
              <span style={{ fontWeight: 700, fontSize: isMobile ? '5.5cqw' : '2.8cqw' }}>{groomName} & {brideName}</span>
            </div>
            {weddingDate && <CountdownTimer weddingDate={weddingDate} />}
          </motion.div>

          <div className={styles.page7BottomBorder}>
            <img src="/assets/einvite-template1/page5/Rectangle.png" alt="Bottom Border" />
          </div>
        </div>

      </div>
    </div>
  );
}
