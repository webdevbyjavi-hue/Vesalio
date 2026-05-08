# Vesalio – Website Design Reference

## Brand Identity

- No formal brand manual or Brandbook exists; assets will be provided by Amargo Studio
- **Pending assets**: hex/RGB color codes, logo files, and typography files
- Logo typography is being considered for a weight increase — current version is too thin for branding use
- Use placeholder assets until finals are delivered

## Visual Content

- Use placeholder images (`placeholders`) in the layout during development
- Amargo Studio will review the design with placeholders before final images are added
- High-resolution photos will be sent by Amargo Studio when ready

## Website Structure

The site is a static landing page with the following sections:

1. **Hero / Home** — main entry point, primary CTA directing users to WhatsApp to book appointments
2. **History / About** — storytelling section narrating the origin of Vesalio and the story behind Íñigo and Irina
3. **Services** — list of specific services offered (e.g., dry needling / punción seca, rehabilitation); content to be confirmed with Íñigo
4. **Instagram Feed** — embedded or linked Instagram feed (replaces a blog section; supports SEO indirectly)
5. **Contact / CTA** — links to WhatsApp and social media profiles; replaces the current Instagram Link Tree

## Target Audience

- ~70% athletes, age range 20–35
- Secondary: rehabilitation patients
- Socioeconomic level: medium-high to high
- Design tone should reflect professionalism and personal closeness — avoid overly clinical or overly automated aesthetics

## Responsive Design

- All layouts must be reviewed and approved on both **desktop and mobile**
- Development iterations use *Lorem Ipsum* text so Amargo Studio can evaluate layout and element interaction before copy is finalized

## Design Principles

- The brand value is personal closeness and human connection — the design should feel warm and trustworthy, not cold or overly automated
- Formal enough to establish credibility with new patients
- Clean structure that guides the visitor toward booking (WhatsApp CTA)

## Technical Notes

- Domain not yet acquired; target `.com` or `.mx`
- Analytics integration is planned to track web traffic and WhatsApp conversion
- No blog — replaced by Instagram feed embed


# CLAUDE.md — UI/UX & Front-End Design Reference

This file is the definitive design authority for every website built in this codebase. Every design decision — color, animation, layout, component structure — must be justified against one or more principles documented here. If a choice cannot be explained by color psychology, visual hierarchy, engagement, branding, or performance, reconsider it.

**The goal is not visual novelty. The goal is: the user feels something, understands the message, and takes action.**

---

## 1. PSYCHOLOGY OF COLOR & BRANDING

First impressions form in under 50ms. Up to 90% of snap judgments about a product are based on color alone. Color is not decoration — it is communication.

Color increases brand recognition by up to 80%. Signature colors must be consistent across all components, backgrounds, CTAs, and hover states — never arbitrary.

### Emotional Color Map

| Color | Signal | Use Cases |
|-------|--------|-----------|
| Blue | Trust, reliability, calm | SaaS, finance, health |
| Red / Orange | Urgency, energy, action | CTAs, flash sales |
| Purple | Innovation, luxury, creativity | Tech, premium brands |
| Green | Balance, growth, sustainability | Wellness, eco, finance |
| Black / Dark | Sophistication, authority, luxury | Premium, editorial |

- Gradient logos signal innovation — "boundless" perception boosts buying intent in tech/creative sectors.
- Low saturation / muted palettes → premium or heritage positioning.
- Vibrant saturation → energy and youth.
- **CTA rule**: High contrast always beats pretty palettes. The button must visually "pop" from its background. This is non-negotiable.
- Always test for WCAG contrast ratios. Color-blind-safe palettes are mandatory.

### Color System — Required for Every Project

Define exactly these roles at the `:root` level. No hex values outside of this token system:

```css
:root {
  --color-primary: ;
  --color-secondary: ;
  --color-accent: ;
  --color-neutral: ;
  --color-success: ;
  --color-warning: ;
  --color-error: ;
  --color-bg: ;
  --color-text: ;
}
```

Never use more than 3 dominant hues per page.

---

## 2. TYPOGRAPHY AS VISUAL STORYTELLING

Typography is the #1 brand signal. Choose fonts with intention. Never default to Arial, Roboto, or Inter without a strong explicit reason.

In 2025–2026, expressive typography dominates: oversized headlines, kinetic text, variable fonts that respond to scroll or viewport.

### Rules

- **Display font**: sets personality and emotional tone (H1, hero sections).
- **Body font**: prioritizes legibility above all else.
- **Two fonts maximum per site.** Pair a display serif or expressive sans with a neutral body typeface.
- Use `clamp()` for fluid type scales so text scales seamlessly between 375px and 1440px.
- Implement kinetic/animated typography for hero sections: text that fades in, splits, or reveals on scroll adds cinematic quality without extra graphics.
- Variable fonts allow responsive weight — use them when available.
- **Text-on-image**: always ensure contrast via overlays, text-shadow, or `backdrop-filter: blur()`.

### Typographic Hierarchy

```
H1 → large, bold, expressive — sets emotional tone
H2 → organizes sections — clear but subordinate
H3 → sub-grouping within sections
Body → legible, comfortable line-height (1.6–1.75), max-width ~65ch
Caption / Label → utility text, smaller, muted color
```

---

## 3. DYNAMIC HTML ELEMENTS & SCROLL INTERACTIONS

These interaction patterns are default tools, not optional add-ons. Every page uses them unless there is a documented reason not to.

### Scroll-Triggered Animations

- **Fade-in on scroll**: elements transition from `opacity: 0` to `opacity: 1` as they enter the viewport. Use `IntersectionObserver` API or GSAP ScrollTrigger.
- **Slide-in animations**: elements enter from left, right, or bottom using `translateX` / `translateY` + `opacity`.
- **Staggered reveals**: lists and card grids animate in sequence with `animation-delay` increments (e.g., 100ms per item).

**Accessibility requirement — always include:**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Parallax & Depth

- Background and foreground elements scroll at different speeds to create depth.
- Use CSS `background-attachment: fixed` for lightweight parallax. Use GSAP only when multi-layer depth is required.
- **Disable or simplify parallax on mobile** (touch devices) — it degrades performance and causes scroll jank.

### Micro-Interactions

Every interactive element must respond to user input:

- Buttons: `transform: scale(1.03)` on hover, `transform: scale(0.97)` on click — brief scale-down then back (haptic-style feedback).
- Links: underline animates in on hover (not a static underline).
- Icons: rotate or shift on hover.
- Form inputs: animated `border-color` transition on focus. Never leave default browser focus rings unstyled.
- Loading states: skeleton screens or shimmer effects — never blank space during async loads.

### Sticky & Pinned Sections

- Sticky nav: transitions from `transparent` to `solid background` with `backdrop-filter: blur()` as user scrolls past the hero.
- Hero sections can use scroll-pinning (GSAP ScrollTrigger `pin: true`) for a cinematic pause while content animates.

### Scrollytelling

For landing pages and case studies:
- Use scroll position to drive a narrative — sections reveal sequentially.
- Text and visuals sync with scroll progress. Treat the page as a storyboard with chapters.
- Each "chapter" is triggered by scroll progress, not time.

### Flying Logo (Signature Animation — Required on Every Project)

Every website built in this codebase must include the Flying Logo animation. It is a brand signature, not optional.

**What it does:** A large logo in the hero section physically flies up and shrinks into the navbar logo slot as the user scrolls down. Scrolling back reverses it. A GPU-composited proxy element drives all motion — the real logos only appear at the endpoints (progress = 0 or progress = 1).

**Why it works:** It creates a direct spatial relationship between the hero brand moment and the persistent nav, reinforcing brand recall at the exact instant the user transitions from discovery to navigation. It also signals premium craft — no off-the-shelf template does this.

**Required HTML structure:**

```html
<!-- Navbar -->
<img src="assets/logo.jpg" id="navLogoImg" class="nav-brand-logo" alt="" aria-hidden="true" />

<!-- Hero -->
<img src="assets/logo.jpg" id="heroLogoImg" class="hero-logo" alt="[Brand] logo" />
```

**Required CSS rules (do not add transitions to either logo — the script owns their opacity):**

```css
.nav-brand-logo {
  width: 36px;
  height: 36px;
  opacity: 0;          /* script manages visibility */
  flex-shrink: 0;
  border-radius: 50%;
}
```

**Canonical JS implementation (paste into main script, runs after DOM is ready):**

```js
// ── Flying Logo — Webika Studio signature ────────────────────────────────────
(function () {
  const heroImg = document.getElementById('heroLogoImg');
  const navImg  = document.getElementById('navLogoImg');
  if (!heroImg || !navImg) return;

  const NAV_SIZE = 36; // must match .nav-brand-logo width/height in CSS

  const proxy = document.createElement('img');
  proxy.src = heroImg.src;
  proxy.alt = '';
  proxy.setAttribute('aria-hidden', 'true');
  Object.assign(proxy.style, {
    position: 'fixed', borderRadius: '50%', objectFit: 'cover',
    pointerEvents: 'none', zIndex: '1001', display: 'block', opacity: '0',
    left: '0', top: '0', willChange: 'transform, opacity',
    border: '3px solid rgba(255,255,255,0.45)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
  });
  document.body.appendChild(proxy);

  let heroRect = null;
  let heroSize = 0;

  function measureHero() {
    heroRect = heroImg.getBoundingClientRect();
    heroSize = heroRect.width;
    proxy.style.width  = heroSize + 'px';
    proxy.style.height = heroSize + 'px';
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp01(v)    { return Math.max(0, Math.min(1, v)); }
  function ease(t)       { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

  let ticking = false;
  function update() {
    ticking = false;
    const scrollY = window.scrollY;

    if (scrollY < 2) measureHero();
    if (!heroRect) return;

    const heroSection = document.getElementById('hero'); // update id per project
    const heroH    = heroSection ? heroSection.offsetHeight : window.innerHeight;
    const progress = clamp01(scrollY / (heroH * 0.45));
    const eased    = ease(progress);

    if (progress === 0) {
      heroImg.style.opacity = '1'; navImg.style.opacity = '0'; proxy.style.opacity = '0';
      return;
    }
    if (progress >= 1) {
      heroImg.style.opacity = '0'; navImg.style.opacity = '1'; proxy.style.opacity = '0';
      return;
    }

    heroImg.style.opacity = '0';
    navImg.style.opacity  = '0';

    const navRect = navImg.getBoundingClientRect();
    const size = lerp(heroSize, NAV_SIZE, eased);
    const cx   = lerp(heroRect.left + heroSize / 2, navRect.left + NAV_SIZE / 2, eased);
    const cy   = lerp(heroRect.top  + heroSize / 2, navRect.top  + NAV_SIZE / 2, eased);
    const s    = heroSize > 0 ? size / heroSize : 1;

    proxy.style.transform = `translate(${cx - heroSize / 2}px, ${cy - heroSize / 2}px) scale(${s})`;
    proxy.style.opacity   = '1';
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  window.addEventListener('resize', () => { if (window.scrollY < 2) measureHero(); update(); });

  if (document.readyState === 'complete') { measureHero(); update(); }
  else window.addEventListener('load', () => { measureHero(); update(); }, { once: true });
}());
```

**Checklist before shipping:**
- [ ] `id="heroLogoImg"` on the hero logo `<img>`
- [ ] `id="navLogoImg"` on the navbar logo `<img>`
- [ ] `id="hero"` (or project-specific id) on the hero section — update the `getElementById` call in the JS
- [ ] `NAV_SIZE` in JS matches `.nav-brand-logo` width/height in CSS
- [ ] Both logos use the same `src`
- [ ] No CSS `transition` or `transform` on either logo — the script owns all motion
- [ ] `z-index: 1001` on proxy keeps it above the fixed navbar (typically `z-index: 1000`)

### Cursor & Hover Effects

- Custom cursor (magnetic effect, color-changing dot) on **desktop only** — signals premium quality.
- Hover cards: lift with `box-shadow`, subtle `scale`, reveal hidden CTA text.
- Background color shifts on section entry (via scroll-triggered class changes) to guide emotional journey through the page.

### Page Transitions

- Between pages: smooth fade or slide transitions using CSS or Framer Motion (React). Never abrupt white flashes.
- Section transitions: background morphs (color or gradient shift) signal narrative progression without disorienting the user.

---

## 4. INFORMATION ARCHITECTURE & MESSAGE DELIVERY

### Above-the-Fold Rule

The first screenful must instantly answer three questions:
1. **Who are you?**
2. **What do you do?**
3. **Why should I care?**

### Scan Pattern Design

Users scan — they do not read. Design for F-pattern and Z-pattern eye movement. Place key messages at scan endpoints (top-left, right diagonal, bottom-left).

### Progressive Disclosure

Reveal complexity in layers:
1. Emotional hook first
2. Rational proof second (stats, testimonials, features)
3. Detailed information last (accessible but not front-loaded)

### Visual Hierarchy Formula (per section)

```
1. Large visual / headline → emotional anchor
2. Supporting sub-headline → clarify and qualify
3. Body text → rational support
4. CTA → single, clear, high-contrast action
```

Never invert this order.

### Whitespace

Whitespace is a design element — not empty space. It creates emphasis, reduces cognitive load, and signals quality. Generous whitespace = premium. Cramped layouts = low trust.

### CTA Standards

Every CTA must be:
- **Visible**: high contrast, never blends into background
- **Singular**: one primary action per section
- **Action-oriented**: verb-first copy ("Start Your Project", "See Our Work", "Get a Quote")
- **High-contrast**: passes WCAG AA at minimum

### Social Proof Placement

Place immediately after the value proposition — never buried at the bottom. Testimonials give human connection; stats give credibility. Use both when possible.

---

## 5. COMPONENT STANDARDS

Every component is built with these qualities as the non-negotiable baseline.

### Quality Checklist for Every Component

- **Reusability**: accepts props/variants, never relies on hardcoded content
- **Motion**: defined enter animation and hover state — no static components
- **Dark mode**: supports light and dark themes via CSS custom properties — never hardcoded hex values
- **Responsiveness**: mobile-first (design at 375px, then expand) — CSS Grid + Flexbox — no fixed widths
- **Performance**: images use WebP/AVIF + lazy loading — animations use `will-change: transform` and run on the GPU — never animate `width`, `height`, or `margin`
- **Accessibility**: ARIA labels on all interactive elements, focus-visible styles, keyboard-navigable, screen-reader-friendly markup order

### Required Component Library (Every Project)

| # | Component | Key Behaviors |
|---|-----------|---------------|
| 1 | Hero section | Animated headline + scroll indicator |
| 2 | Sticky nav | Transparent → solid + blur on scroll |
| 3 | Card grid | Staggered reveal + hover lift |
| 4 | Feature section | Alternating image/text + slide-in animation |
| 5 | Testimonial carousel | Smooth slide or fade transitions |
| 6 | Stats counter | Count-up animation on scroll entry |
| 7 | CTA section | High-contrast button + background gradient |
| 8 | Footer | Gradient top-border accent |
| 9 | Mobile menu | Smooth slide/fade animation |
| 10 | Form | Animated focus states + validation feedback |

---

## 6. PERFORMANCE IS A DESIGN DECISION

Performance is not an engineering afterthought — it is a design requirement.

### Core Web Vitals Targets (Non-Negotiable)

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| INP (Interaction to Next Paint) | < 200ms |

### Animation Performance Rules

- Animate only `transform` and `opacity` — these are GPU-composited and never cause reflow.
- Use `will-change: transform` on elements that animate.
- Never animate `width`, `height`, `top`, `left`, `margin`, or `padding` — they trigger layout recalculation.
- Use `requestAnimationFrame` for JS-driven animation. Never `setInterval`.

### Asset Performance Rules

- Lazy load all images below the fold. Preload hero images (`<link rel="preload">`).
- Serve WebP or AVIF. Target < 200KB per hero image.
- Code-split heavy libraries (GSAP, Three.js) — load only when the section is needed.
- Avoid render-blocking scripts. Defer or async all non-critical JS.

---

## 7. BRAND CONSISTENCY RULES

Every page is a brand touchpoint. Consistency is not optional.

### Design Token System

Define at `:root` and use everywhere. No magic numbers in the codebase:

```css
:root {
  /* Spacing — 4px / 8px grid */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 48px;
  --space-7: 64px;
  --space-8: 96px;

  /* Border radius system */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Shadow system */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.10);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.14);
  --shadow-xl: 0 16px 64px rgba(0,0,0,0.18);

  /* Motion */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --duration-fast: 150ms;
  --duration-base: 300ms;
  --duration-slow: 600ms;
  --duration-cinematic: 1000ms;
}
```

### Motion Personality

Pick one motion personality per brand and apply it consistently:

| Personality | Characteristics | Use For |
|-------------|----------------|---------|
| Smooth / slow | Long durations, ease-out curves | Luxury, premium, editorial |
| Snappy / bouncy | Short durations, spring easing | Playful, consumer, youth |
| Precise / sharp | Fast, linear-ish, minimal | Tech, SaaS, B2B |

### Logo Sizing

Logo must appear in the same proportional size relative to viewport across all pages. Define as a CSS custom property and never override it per-page.

---

## HOW TO USE THIS FILE

Reference this CLAUDE.md in every prompt when building or modifying UI components. Every design decision must be justified against one or more sections above:

- **Color choice** → Section 1
- **Font selection or sizing** → Section 2
- **Animation or interaction pattern** → Section 3
- **Layout, CTA placement, content order** → Section 4
- **Component structure or behavior** → Section 5
- **Performance concern** → Section 6
- **Token, spacing, or motion consistency** → Section 7

If a design choice cannot be explained by color psychology, hierarchy, engagement, branding, or performance — reconsider it.

---

## 8. DEVELOPER SIGNATURE (Required on Every Project)

Every website built in this codebase must include the following credit link in the footer. It is a Webika Studio signature — not optional.

**Required HTML (place inside `.footer-bottom`):**

```html
<a href="https://www.webikastudio.com" class="footer-bottom-credit" target="_blank" rel="noopener noreferrer">Diseñado con <span>WebikaStudio</span> en México</a>
```

**Recommended base styles:**

```css
.footer-bottom-credit {
  font-size: 0.8rem;
  color: var(--color-neutral);
  text-decoration: none;
  opacity: 0.7;
  transition: opacity var(--duration-fast);
}
.footer-bottom-credit:hover {
  opacity: 1;
}
.footer-bottom-credit span {
  color: var(--color-accent);
  font-weight: 600;
}
```

Adapt colors to each project's token system — never hardcode hex values.
