# 📖 CelebrationApp — Developer Diary

> **Last updated**: 2026-05-16
> **Purpose**: Complete architecture reference for rapid onboarding. Update this file when the app structure changes.

---

## 🏗️ Project Overview

**CelebrationApp** is a wedding invitation platform built with **Next.js 14** (App Router). Users choose a template, fill in their wedding details, and get a shareable animated invitation URL.

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14.2 (App Router) |
| UI | React 18 + CSS Modules |
| Animations | Framer Motion, GSAP |
| 3D | Three.js + React Three Fiber/Drei |
| Particles | tsparticles |
| Database | MongoDB Atlas (Mongoose 8) |
| Auth | JWT (httpOnly cookies, bcryptjs) |
| Payments | Razorpay (mock mode for dev) |
| File Upload | Cloudinary |
| Font Stack | Google Fonts: Playfair Display, Inter, Great Vibes, Cormorant Garamond |
| Deployment | Vercel-ready (Next.js) |

---

## 📁 File-by-File Architecture

### Root Files
```
package.json          — Dependencies & scripts (dev, build, start, nuke)
next.config.js        — Image domains config
jsconfig.json         — Path aliases (@ → root)
.env                  — MongoDB URI, JWT secret, Razorpay keys, Cloudinary keys, Figma token
.gitignore            — Standard Next.js ignores
```

### `/app` — Pages & API Routes (Next.js App Router)

```
app/
├── layout.js              — Root layout: global CSS, AuthProvider, viewport meta
├── globals.css            — Design system: CSS variables, reset, utility classes, buttons
├── page.js                — Landing page (hero, stats, templates grid, how-it-works, features, CTA)
├── page.module.css        — Landing page styles + hamburger mobile menu
│
├── demo/
│   └── page.js            — ★ HARDCODED DEMO PAGE — renders EinviteTemplate1 with JSON data, no auth/DB
│
├── templates/
│   └── page.js            — Browse all templates page with category filters
│
├── dashboard/
│   └── [templateId]/
│       ├── page.js        — 4-step invitation creation wizard (couple → events → photos → review)
│       ├── page.module.css
│       └── edit/          — Edit invitation page (1 edit allowed after payment)
│
├── invite/
│   └── [slug]/
│       ├── page.js        — Public invitation viewer (loads from DB, renders correct template)
│       └── page.module.css — Styles for default "Royal Temple" template
│
├── login/                 — Login page
├── signup/                — Signup page (10-digit mobile validation)
├── subscriptions/         — User's active invitations/subscriptions portal
│
├── admin/
│   ├── login/             — Admin login (separate auth cookie, 10-min session)
│   └── page.js + page.module.css — Admin dashboard (manage invitations, users, payments, pricing)
│
└── api/
    ├── auth/
    │   ├── login/route.js      — POST: authenticate user, set JWT cookie
    │   ├── signup/route.js     — POST: create user (bcrypt hash)
    │   ├── logout/route.js     — POST: clear auth cookie
    │   ├── me/route.js         — GET: return current user from cookie
    │   ├── check-username/     — GET: check username availability
    │   ├── forgot-password/    — POST: password reset flow
    │   └── reset-password/     — POST: password reset flow
    │
    ├── invitations/
    │   ├── route.js            — POST: create, GET: fetch by slug (handles free 60s preview + paid 20-day expiry), PATCH: reactivate
    │   └── [id]/route.js       — GET/PUT/DELETE single invitation
    │
    ├── templates/
    │   └── route.js            — GET: all templates with dynamic pricing from DB
    │
    ├── payment/
    │   ├── create-order/route.js — POST: create Razorpay order (or mock)
    │   └── verify/route.js      — POST: verify payment signature
    │
    ├── upload/                   — POST: upload images to Cloudinary
    │
    ├── user/                     — User-specific API routes
    │
    └── admin/
        ├── invitations/          — Admin CRUD for invitations
        ├── users/                — Admin user management
        ├── payments/             — Admin payment records
        ├── pricing/              — Admin template pricing management
        ├── login/                — Admin authentication
        ├── logout/               — Admin logout
        └── verify/               — Admin session verification
```

### `/components` — Reusable React Components

```
components/
├── templates/
│   ├── EinviteTemplate1.js          — ★ MAIN TEMPLATE: 7-page scrolling Indian wedding invitation
│   └── EinviteTemplate1.module.css  — 950+ lines of CSS with full mobile responsive overrides
│
├── invite/
│   ├── CountdownTimer.js      — Wedding date countdown (days/hours/minutes/seconds)
│   ├── FloatingParticles.js   — Decorative particle effects
│   ├── MusicPlayer.js         — Background music player
│   ├── SaveToCalendar.js      — Add events to Google/Apple Calendar
│   ├── Watermark.js           — "Free Preview" watermark for unpaid invitations
│   └── Watermark.module.css
│
├── animations/
│   └── TextReveal.js          — TextRevealByChar, FadeIn, ScaleIn, DrawLine animation components
│
├── providers/
│   └── AuthProvider.js        — React Context for auth state (user, login, logout, refresh)
│
├── payment/
│   └── RazorpayCheckout.js    — Razorpay payment modal integration
│
└── three/
    └── HeroScene.js           — 3D scene for landing page hero (React Three Fiber)
```

### `/lib` — Server-side Utilities & Data

```
lib/
├── auth.js                — JWT sign/verify, cookie helpers, auth middleware
├── mongodb.js             — Mongoose connection with global caching
│
├── models/
│   ├── User.js            — username, password(bcrypt), email, mobile, role(user|admin)
│   ├── Invitation.js      — Full invitation schema (couple, events, media, payment/expiry tracking)
│   ├── Payment.js         — Razorpay payment records
│   └── TemplatePricing.js — Dynamic pricing per template
│
└── data/
    ├── templates.js                — Static template definitions (6 templates, 1 active, 5 coming soon)
    └── hardcoded-invitation.json   — ★ JSON data for demo page (no DB dependency)
```

### `/public/assets` — Static Assets

```
public/assets/
├── einvite-template1/
│   ├── fresh/             — Main high-res Figma-sourced assets (page backgrounds, temple, carpet, borders, frames)
│   ├── page1/             — Page 1 additional assets
│   ├── page2/             — Ganesha image
│   ├── page3/             — Flower assets
│   └── page5/             — Border rectangles
│
├── hindu-royal/           — SVG layers for default "Royal Temple" template
│   ├── page1/             — background, temple, corners, peacocks
│   └── page2/             — temple-background, elephant
│
└── templates/             — Template thumbnail images
```

### `/scripts`
```
scripts/
└── seed-sample.js         — Seeds a sample invitation into MongoDB for template preview
```

---

## 🔄 Data Flow

### Invitation Lifecycle
```
1. User visits /templates → Browses templates
2. Clicks "Use" → Redirected to /dashboard/[templateId]
3. If not logged in → Login gate (redirect to /login then back)
4. 4-step wizard: Couple Details → Events → Photos → Review & Submit
5. On submit:
   a. FREE path: Creates invitation with isPaid=false → 60-second preview link
   b. PAID path: Razorpay checkout → Creates invitation with isPaid=true → 20-day link
6. Invitation accessible at /invite/[slug]
7. Expiry:
   - Free: 60s after first view → deactivated
   - Paid: 20 days after payment → deactivated
   - Sample: Never expires
   - DB auto-delete: 24 days after payment (TTL index)
```

### Auth Flow
```
1. Signup: POST /api/auth/signup → bcrypt hash → save User → set JWT cookie (7 days)
2. Login: POST /api/auth/login → verify password → set JWT cookie
3. Session: GET /api/auth/me → read cookie → verify JWT → return user
4. Logout: POST /api/auth/logout → clear cookie
5. Admin: Separate cookie (admin_token), 10-minute session
```

### Payment Flow (Razorpay)
```
1. POST /api/payment/create-order → creates Razorpay order
2. Client opens Razorpay checkout modal
3. On success: POST /api/payment/verify → verify signature → mark invitation as paid
4. Mock mode: If RAZORPAY_KEY_ID starts with "your_", uses instant mock payment
```

---

## 🎨 Template System

### EinviteTemplate1 (The Only Active Template)
- **7 pages** stacked vertically in a CSS container-query canvas
- **Desktop**: 1440px wide, each page ~760px tall
- **Mobile**: 393px reference width, each page ~852px tall (portrait Figma frames)
- Uses `container-type: inline-size` + `cqw` units for perfect proportional scaling
- Scroll-driven animations via Framer Motion `useScroll` + `useTransform`
- Pages:
  1. **Sky & Names** — Hero with couple names, peacocks background
  2. **Temple Courtyard** — Temple image with parallax rise animation
  3. **Red Carpet** — Carpet unroll animation, Ganesha, wedding date
  4. **Family & Names** — Parents, "WEDS" text, pulsating lamp garlands
  5. **Gallery** — Polaroid intro + photo grid (conditional: only if photos exist)
  6. **Save the Date** — Event cards with dates/times/venues, shared venue detection
  7. **Thank You** — Round frame photo, countdown timer, closing message

### Adding a New Template
1. Create `components/templates/NewTemplate.js` + `.module.css`
2. Add to `lib/data/templates.js` with unique `id`
3. Add conditional render in `app/invite/[slug]/page.js` matching `templateId`

---

## 📱 Mobile Responsiveness

### Landing Page (`page.module.css`)
- Hamburger menu replaces hidden nav links on `≤768px`
- Slide-in drawer from right with backdrop blur
- 3-line → X animation on toggle
- All grids collapse to single column
- Hero text scales with `clamp()`
- Additional breakpoint at `≤400px` for very small screens

### EinviteTemplate1 (`EinviteTemplate1.module.css`)
- Full `@media (max-width: 768px)` override block (lines 621–952)
- Switches from 1440px canvas math to 393px portrait math
- JS `isMobile` state controls page heights and animation thresholds
- Template font sizes recalculated: `calc(X / 393 * 100cqw)`
- Page 7: round frame + thank you stacked vertically (side-by-side on desktop)
- Photo grid: switches to 2-column on mobile

---

## 🌐 Hosting & Deployment

### Vercel (Recommended)
```bash
# Connect GitHub repo to Vercel
# Set environment variables in Vercel dashboard:
# MONGODB_URI, JWT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET,
# NEXT_PUBLIC_RAZORPAY_KEY_ID, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
```

### Demo Page
- Route: `/demo`
- **No database, no auth, no payment** — purely static rendering
- Data sourced from `lib/data/hardcoded-invitation.json`
- Edit the JSON to change names, dates, events
- Works even without MongoDB connection

---

## ⚠️ Known Issues & TODOs

### Known Issues
- [ ] Only 1 template (`einvite-1`) is fully functional; 5 are "Coming Soon"
- [ ] Default "Royal Temple" (`hindu-royal`) template in invite page uses SVG layers that may not scale perfectly on all mobiles
- [ ] Gallery images require Cloudinary — no fallback for local dev without Cloudinary credentials
- [ ] Password reset flow exists in routes but may not be fully connected to UI

### TODOs
- [ ] Add more templates (Church, Regal Arch, Golden Grandeur, Classic Mandapam)
- [ ] Add RSVP functionality
- [ ] Add WhatsApp sharing button on invite page
- [ ] Add Google Maps embed for venue
- [ ] Add more gallery layout options
- [ ] Consider PWA support for offline invite viewing
- [ ] Add analytics tracking for invitation views
- [ ] Implement proper Razorpay integration (currently mock mode)

---

## 🗂️ CSS Design System (globals.css)

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#FDF8F6` | Page background |
| `--color-accent` | `#D28A8C` | Primary brand (Peach Rose) |
| `--color-accent-light` | `#EEBEC6` | Hover states, highlights |
| `--color-blue` | `#00A6E0` | Accent blue |
| `--color-peach-mid` | `#FDBA90` | Gradient endpoint |

### Typography
| Token | Font |
|-------|------|
| `--font-display` | Playfair Display |
| `--font-body` | Inter |
| `--font-script` | Great Vibes |

### Button Classes
- `.btn-primary` — Gradient background with shimmer hover
- `.btn-secondary` — Transparent with border
- `.glass-card` — Frosted glass effect
- `.gradient-text` — Multi-color gradient text

---

## 🔑 Environment Variables

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `RAZORPAY_KEY_ID` | Razorpay API key (use `your_*` prefix for mock mode) |
| `RAZORPAY_KEY_SECRET` | Razorpay secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client-side Razorpay key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `FIGMA_TOKEN` | Figma API token (for design sync) |

---

## 📝 Quick Commands

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run start        # Start production server
npm run nuke         # Kill port 3000 + clear .next + restart dev
npm run lint         # ESLint check
```

---

> **⚡ Update this diary whenever you add a new page, template, API route, or change the data model.**
