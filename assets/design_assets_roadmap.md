# Design & Art Roadmap – Matching MissingPiece Quality

## What They're Doing (Analysis of city-2 demo)

From the screenshots and page content, here's a breakdown:

### Art Style
- **NOT vector/flat design** — it's a blend of **vintage botanical watercolor** art + **traditional Indian damask textures**
- Ganesha illustration = hand-drawn intricate SVG (cream/gold on teal background)
- Floral elements = **watercolor jasmine/mogra flowers** (painted look, cream/gold tones)
- Background = **seamless damask/brocade pattern** (traditional Indian fabric texture, teal-green)
- Event cards = **arch-shaped frames** with soft gradient fills (cream → teal) and gold border lines

### Color Palette
| Color | Where Used | Hex Approx |
|---|---|---|
| Teal/sage green | Background, text headings | `#5E8B7E` |
| Cream/ivory | Card fills, text, Ganesha | `#F5F0E1` |
| Gold | Borders, accents, lines | `#C5A55A` |
| Soft green gradient | Cards inner fill | `#D4DFC7 → #F0EDE0` |

### Sections on Their Page
1. **Hero** — Logo + buy button
2. **Ganesha Section** — ॐ श्री गणेशाय नम + Ganesha SVG
3. **Family Blessings** — Parents names with dividers
4. **Couple Names** — Large "Abhishek & Kanika" with decorative ampersand
5. **Events Grid** — 6 events (Mehendi, Haldi, Cocktail, Engagement, Shaadi, Reception) in arch-shaped cards
6. **Map Section** — "See the route" link to Google Maps
7. **Meet the Couple** — Story/bio text
8. **RSVP** — WhatsApp click-to-message
9. **Things to Know** — Hashtag, weather, parking, staff info cards
10. **Instagram Follow** — CTA to follow their page
11. **Audio Player** — Background music toggle

---

## 🎨 Raw Materials YOU Need to Collect/Create

### Priority 1: Background Textures (Needed First)

| Asset | Description | How to Get |
|---|---|---|
| **Seamless damask pattern** | Traditional Indian brocade/silk pattern, tileable | Create in Illustrator, or download from Freepik/Creative Market — search "Indian damask seamless pattern SVG" |
| **Paper/parchment texture** | Aged cream/ivory paper look for card backgrounds | Free on textures.com or unsplash — search "parchment texture" |
| **Fabric texture overlay** | Subtle silk/satin feel | Photoshop/Canva or free stock textures |

> [!TIP]
> One good seamless damask SVG pattern can be recolored for ALL templates — teal for Hindu, ivory for Christian, emerald for Muslim, etc.

### Priority 2: Floral Art (The Showstopper)

| Asset | Description | Style Reference |
|---|---|---|
| **Jasmine/mogra cluster** (top-left) | 3-5 flowers with leaves, painted watercolor look | Used on EVERY event card corner |
| **Rose cluster** | For Christian templates | Same watercolor style, pink/white |
| **Marigold garland** | For South Indian templates | Orange/yellow watercolor |
| **Lotus** | For Hindu templates | Pink/gold watercolor |
| **Floral corner ornament** | L-shaped flower arrangement for card corners | Common across templates |
| **Floral divider** | Horizontal line with small flower in center | Section separators |

> [!IMPORTANT]
> These should be **PNG with transparent backgrounds** (or SVG). Watercolor style, not flat vector. Size: ~500-800px each. Your friend can create these in Procreate, Photoshop, or source from Creative Market / Envato.

### Priority 3: Cultural Motifs (SVGs)

| Asset | Template | Description |
|---|---|---|
| **Ganesha** (intricate, decorative) | Hindu | Like the one in their demo — ornamental, filigree style |
| **Cross / Church window** | Christian | Gothic or floral cross |
| **Bismillah calligraphy** | Muslim | Arabic calligraphy art |
| **Ek Onkar / Khanda** | Sikh | Traditional Sikh symbols |
| **Temple/Kalash** | South Indian | Traditional South Indian temple gopuram or brass kalash |
| **Mandala** | General | Circular, can be SVG with CSS animation |
| **Om symbol** | Hindu | Decorative calligraphic style |

### Priority 4: Frame & Border Art

| Asset | Description |
|---|---|
| **Arch-shaped card frame** | SVG path — like a doorway/arch shape with gold border (this is how MissingPiece shows event cards) |
| **Rectangular ornate frame** | For photos, family details |
| **Corner flourishes** | Decorative swirls for card corners — gold/cream SVG |
| **Horizontal divider** | Ornate line with diamond/flower in center |

### Priority 5: Typography

| Font | Usage | Where to Get |
|---|---|---|
| Serif display font | Couple names, headings | Google Fonts: Playfair Display, Cormorant Garamond |
| Script/calligraphy font | "&", taglines | Google Fonts: Great Vibes, Dancing Script |
| Hindi/Devanagari font | ॐ श्री गणेशाय नम | Google Fonts: Tiro Devanagari Hindi, Noto Sans Devanagari |
| Clean sans-serif | Body text, event details | Google Fonts: Inter, Jost |

### Priority 6: Audio Files

| Asset | Template | Source |
|---|---|---|
| **Shehnai music** | Hindu | Free royalty-free on Pixabay — search "shehnai" |
| **Church bells/organ** | Christian | Pixabay — "wedding church bells" |
| **Qawwali/Naat** | Muslim | Royalty-free Islamic nasheed |
| **Dhol/Gurbani** | Sikh | Pixabay — "punjabi wedding" |
| **Nadaswaram** | South Indian | Pixabay — "nadaswaram" |

---

## 🏗️ What I (Developer) Will Build with These Assets

Once you supply the assets, here's what I'll implement:

### Template Architecture
```
Each template = unique combination of:
├── Background texture (seamless, tiled via CSS)
├── Color palette (CSS variables, easily swappable)
├── Cultural motif SVG (hero decoration)
├── Floral art PNGs (card corners, dividers)
├── Frame shapes (arch, rectangle, circle — SVG paths)
├── Font pairing (display + script + body)
└── Audio file (auto-play with toggle)
```

### New Features I'll Add
1. **Arch-shaped event cards** — SVG clip-path for that rounded arch look
2. **"Meet the Couple"** section with photo + story
3. **RSVP via WhatsApp** — one-click send pre-formatted message
4. **"Things to Know"** section — info cards (hashtag, weather, dress code, parking)
5. **Instagram follow CTA** — link to couple's Instagram
6. **Google Maps embed** — "See the route" for each venue
7. **Multi-event layout** — grid of 6+ events (Mehendi, Haldi, Cocktail, Engagement, Shaadi, Reception)

---

## 📋 Quick Action Checklist

### For You (Designer/Asset Collector)
- [ ] 1 seamless damask/brocade pattern (SVG or high-res PNG, tileable)
- [ ] 3-4 watercolor floral clusters (PNG, transparent bg, ~600px)
- [ ] 1 Ganesha illustration (SVG, intricate/ornamental style)
- [ ] 1 set of corner flourishes (SVG, gold/cream)
- [ ] 1 arch-shaped frame border (SVG)
- [ ] 1 horizontal ornate divider (SVG)
- [ ] 1 background music MP3 (shehnai or equivalent)
- [ ] Color palette confirmation (teal+cream+gold, or your preference)

### For Me (Developer)
- [ ] Build arch-shaped event card component
- [ ] Implement tiled texture backgrounds via CSS
- [ ] Add WhatsApp RSVP integration
- [ ] Add "Things to Know" section
- [ ] Add Google Maps link per event
- [ ] Add Instagram follow CTA
- [ ] Rework color system to be per-template
- [ ] Add Devanagari font support

---

## 🔍 Where to Source Assets (Free & Paid)

| Source | Type | Cost |
|---|---|---|
| [Freepik](https://freepik.com) | Watercolor florals, patterns, vectors | Free (with attribution) / Premium |
| [Creative Market](https://creativemarket.com) | Premium wedding art bundles | $15-50 per bundle |
| [Envato Elements](https://elements.envato.com) | Unlimited downloads | $16/month |
| [Canva](https://canva.com) | Quick designs, patterns | Free / Pro |
| [Pixabay](https://pixabay.com) | Audio, stock photos | Free |
| [Google Fonts](https://fonts.google.com) | Typography | Free |
| Procreate / Photoshop | Custom watercolor art | DIY |
| AI Image Generation | Floral art, patterns, textures | I can generate some with my tools |

> [!CAUTION]
> If sourcing from free sites, ensure the license allows commercial use (since this is a SaaS product). Creative Market and Envato Elements are safest for commercial projects.
