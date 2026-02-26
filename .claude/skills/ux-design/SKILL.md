---
name: ux-design
description: >
  Expert UX/UI design skill for Gybernaty DSP — Cyber Evolution 2025-2026 design system.
  Use when building/modifying UI components, pages, or visual elements.
  Implements Dark-First, Glassmorphism 3.0, 3D Web, OKLCH colors, spring animations.
  Generates production-grade code following the Ultra Modern Design specification.
metadata:
  version: 1.0.0
  based_on: bencium-innovative-ux-designer v2.0.0
  project: Gybernaty DSP (Decentralized Social Platform)
---

# Gybernaty DSP — Ultra Modern UX Designer

Expert UI/UX design skill for the Gybernaty DSP project. Creates distinctive, production-grade
frontend interfaces following the **Cyber Evolution 2025-2026** design paradigm.

## Project Context

**Stack:** Next.js 15 + React 19 + Three.js + R3F + Framer Motion 12 + CSS Modules (SCSS)
**Paradigm:** Dark-First | Glassmorphism 3.0 | Immersive 3D Web | Web3 Aesthetic
**Deploy:** gyber.org via GitHub Actions → Docker → k3s

**Key files:**
- `src/widgets/Header/Header-Enhanced.tsx` — main header
- `src/widgets/Navbar/ui/Navbar/Navbar-Enhanced.tsx` — navigation
- `src/app/styles/global-enhanced.scss` — design tokens & glass effects
- `next.config.js` — build config

---

## Core Philosophy

### Design Thinking Protocol

Before coding, **understand context**, then **commit boldly** to the DSP aesthetic:

1. **Purpose**: What problem does this interface solve? Who uses it?
2. **Tone**: How does it fit the Cyber Evolution aesthetic? (see DSP Visual DNA below)
3. **Constraints**: Performance budget, SSR compatibility, mobile support?
4. **Differentiation**: What makes this UNFORGETTABLE in the Web3 space?

### DSP Visual DNA

The visual identity is built on three pillars:

- **Cosmic Depth** — dark backgrounds (oklch(0.08 0.03 220) → oklch(0.18 0.05 215)), star fields, 3D particle scenes
- **Living Energy** — gold (oklch(0.72 0.15 75)), cyan (oklch(0.75 0.14 220)), neon accents
- **Technological Transparency** — glassmorphism layers, blur surfaces, x-ray aesthetics

### Design Principles

| Principle | Implementation |
|-----------|---------------|
| **Dark-First** | Dark mode is the default, not an option. Base: oklch(0.08 0.03 220) |
| **Depth-Aware** | Z-layers of glass + 3D backgrounds + parallax |
| **Motion-Native** | Spring physics animations, layout transitions, stagger reveals |
| **Responsive Fluid** | `clamp()`, container queries, fluid grids — no hard breakpoints |
| **3D-Integrated** | R3F Canvas for hero sections, backgrounds, data visualizations |
| **Accessible** | `prefers-reduced-motion`, WCAG AAA contrasts, keyboard nav |

---

## NEVER / ALWAYS

**NEVER use:**
- Generic SaaS blue (#3B82F6), purple gradients on white
- Inter, Roboto, Arial, Space Grotesk as primary fonts
- Cookie-cutter layouts, Apple design mimicry
- `!important` in SCSS (fix specificity properly)
- Animating `width`, `height`, `margin`, `padding` (CPU-bound)
- HEX/RGBA for new colors (use OKLCH with HEX fallback)

**ALWAYS:**
- Use OKLCH color system with `@supports` fallback
- Use spring-based animations (Framer Motion springs)
- Apply glassmorphism from the 4-tier system (subtle → liquid)
- Include `prefers-reduced-motion` for all animations
- Lazy-load 3D components with `React.lazy + Suspense`
- Use CSS Modules (`.module.scss`) — NOT Tailwind (project uses SCSS)
- Cap 3D canvas DPR at `[1, 1.5]`

---

## Color System — OKLCH 2025-2026

OKLCH is the standard. Perceptually uniform, wide-gamut P3, native CSS.

### Core Palette

```scss
:root {
  // Backgrounds
  --c-bg-deep:     oklch(0.08 0.03 220);    // #001019 — deep cosmos
  --c-bg-surface:  oklch(0.18 0.05 215);    // #072b40 — surface
  --c-bg-elevated: oklch(0.22 0.04 215);    // #0c3a55 — elevated layer

  // Primary accents
  --c-gold:        oklch(0.72 0.15 75);      // #d49d32 — gold (primary)
  --c-cyan:        oklch(0.75 0.14 220);     // #42b8f3 — cyan (secondary)

  // Neon accents (Web3)
  --c-neon-green:  oklch(0.80 0.22 145);     // #00ff88
  --c-neon-purple: oklch(0.60 0.20 300);     // #b366ff
  --c-neon-red:    oklch(0.65 0.22 25);      // #ff4444

  // Text
  --c-text:        oklch(0.90 0.01 220);     // #e1e1e1
  --c-text-muted:  oklch(0.70 0.01 220);     // #b8b8b8
  --c-text-dim:    oklch(0.50 0.01 220);     // #808080

  // Semantic
  --color-primary:   var(--c-gold);
  --color-secondary: var(--c-cyan);
  --color-success:   var(--c-neon-green);
  --color-danger:    var(--c-neon-red);

  // Surfaces
  --surface-glass:   oklch(0.18 0.05 215 / 0.25);

  // Borders
  --border-subtle:   oklch(1 0 0 / 0.06);
  --border-default:  oklch(1 0 0 / 0.12);
  --border-accent:   oklch(from var(--c-gold) l c h / 0.4);
}
```

### Fallback Strategy

```scss
// Always provide HEX fallback for older browsers
:root {
  --c-gold: #d49d32;
  --c-cyan: #42b8f3;
}
@supports (color: oklch(0 0 0)) {
  :root {
    --c-gold: oklch(0.72 0.15 75);
    --c-cyan: oklch(0.75 0.14 220);
  }
}
```

### Dynamic States with `color-mix()`

```scss
--btn-hover:    color-mix(in oklch, var(--c-gold), white 15%);
--btn-disabled: color-mix(in oklch, var(--c-gold), var(--c-bg-deep) 60%);
--glass-tint:   color-mix(in oklch, var(--c-cyan), transparent 85%);
```

---

## Glassmorphism 3.0

Four-tier glass system. Each level adds visual complexity.

### Level 1: Subtle (navbar, small cards)
```scss
.glass-subtle {
  background: oklch(0.18 0.05 215 / 0.15);
  backdrop-filter: blur(12px) saturate(1.2);
  -webkit-backdrop-filter: blur(12px) saturate(1.2);
  border: 1px solid oklch(1 0 0 / 0.06);
  border-radius: 12px;
}
```

### Level 2: Standard (cards, panels)
```scss
.glass-standard {
  background: oklch(0.18 0.05 215 / 0.25);
  backdrop-filter: blur(25px) saturate(1.4);
  border: 1px solid oklch(1 0 0 / 0.10);
  border-radius: 16px;
  box-shadow: 0 8px 32px oklch(0 0 0 / 0.2),
              inset 0 1px 0 oklch(1 0 0 / 0.05);
}
```

### Level 3: Premium (hero sections, modals)
```scss
.glass-premium {
  background: oklch(0.18 0.05 215 / 0.30);
  backdrop-filter: blur(40px) saturate(1.6);
  border: 1px solid oklch(1 0 0 / 0.12);
  border-radius: 24px;
  box-shadow: 0 16px 64px oklch(0 0 0 / 0.3),
              inset 0 1px 0 oklch(1 0 0 / 0.06);

  // Chromatic line on top
  &::before {
    content: "";
    position: absolute;
    top: 0; left: 10%; right: 10%; height: 1px;
    background: linear-gradient(90deg, transparent, oklch(0.72 0.15 75 / 0.6), oklch(0.75 0.14 220 / 0.6), transparent);
  }
}
```

### Level 4: Liquid (special effects)
```scss
.glass-liquid {
  background: oklch(0.18 0.05 215 / 0.20);
  backdrop-filter: blur(60px) saturate(1.8) brightness(1.1);
  border-radius: 32px;

  // Animated shimmer
  &::after {
    content: "";
    position: absolute; inset: 0;
    border-radius: inherit;
    background: linear-gradient(135deg, oklch(1 0 0 / 0.03), transparent 40%, oklch(1 0 0 / 0.02), transparent);
    animation: glass-shimmer 8s ease-in-out infinite;
  }
}
```

### Noise Texture (2026 trend — removes "plastic" feel)
```scss
.glass-with-noise::before {
  content: "";
  position: absolute; inset: 0;
  border-radius: inherit;
  background-image: url("data:image/svg+xml,...feTurbulence...");
  opacity: 0.03;
  mix-blend-mode: overlay;
  pointer-events: none;
}
```

---

## Motion Design — Framer Motion 12

### Spring Presets (use these, not CSS easing)

```tsx
export const springs = {
  snappy:  { type: 'spring', stiffness: 500, damping: 30, mass: 1 },     // buttons, micro
  smooth:  { type: 'spring', stiffness: 300, damping: 25, mass: 1 },     // navigation, cards
  gentle:  { type: 'spring', stiffness: 150, damping: 20, mass: 1.5 },   // hero, large elements
  bouncy:  { type: 'spring', stiffness: 400, damping: 15, mass: 0.8 },   // tooltips, notifications
  layout:  { type: 'spring', stiffness: 350, damping: 30, mass: 1 },     // layoutId transitions
} as const;
```

### Signature Animation: layoutId="bow"

The golden indicator that flows between navbar items:

```tsx
{isActive && (
  <motion.div
    layoutId="bow"
    className={cls.activeIndicator}
    transition={springs.layout}
    style={{
      position: 'absolute', top: -2, left: 0, right: 0,
      height: 3,
      background: 'var(--c-gold)',
      borderRadius: '0 0 4px 4px',
      boxShadow: '0 0 20px oklch(0.72 0.15 75 / 0.5)',
    }}
  />
)}
```

### Stagger Pattern (cascading reveals)

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden:  { opacity: 0, y: 20, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: springs.smooth }
};
```

### Gesture Interactions

```tsx
<motion.div
  whileHover={{ scale: 1.02, boxShadow: '0 20px 60px oklch(0 0 0 / 0.3)' }}
  whileTap={{ scale: 0.98 }}
  transition={springs.snappy}
/>
```

### Scroll-Driven (parallax, fade, blur)

```tsx
const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
```

---

## Typography — Fluid Scale

### Font Stack
```scss
--font-primary: 'Montserrat', system-ui, sans-serif;
--font-accent:  'Grape Nuts', cursive;
--font-mono:    'JetBrains Mono', monospace;
```

### Fluid Type Scale (Major Third 1.25x)

```scss
--fs-xs:    clamp(0.694rem, 0.65rem + 0.22vw, 0.8rem);
--fs-sm:    clamp(0.833rem, 0.77rem + 0.32vw, 1rem);
--fs-base:  clamp(1rem, 0.91rem + 0.43vw, 1.25rem);
--fs-md:    clamp(1.2rem, 1.08rem + 0.58vw, 1.563rem);
--fs-lg:    clamp(1.44rem, 1.28rem + 0.78vw, 1.953rem);
--fs-xl:    clamp(1.728rem, 1.51rem + 1.07vw, 2.441rem);
--fs-2xl:   clamp(2.074rem, 1.78rem + 1.44vw, 3.052rem);
--fs-3xl:   clamp(2.488rem, 2.09rem + 1.96vw, 3.815rem);
--fs-hero:  clamp(3rem, 2.4rem + 2.93vw, 5rem);
```

### Text Glow Effects

```scss
.text-glow-gold {
  text-shadow: 0 0 10px oklch(0.72 0.15 75 / 0.5), 0 0 30px oklch(0.72 0.15 75 / 0.2);
}
.text-glow-cyan {
  text-shadow: 0 0 10px oklch(0.75 0.14 220 / 0.5), 0 0 30px oklch(0.75 0.14 220 / 0.2);
}
```

### Gradient Text (hero headings)

```scss
.heading-hero {
  font-size: var(--fs-hero);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--c-gold), var(--c-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 3D Web — React Three Fiber

### Architecture

```
Layer 0: Fixed Canvas (z-index: -1, pointerEvents: none)
  ├── Stars (count: 3000, radius: 100)
  ├── ParticleField (count: 500-800, pointsMaterial)
  ├── EnergyLines (torus geometry, emissive gold)
  └── PostProcessing (Bloom + ChromaticAberration)
```

### Performance Budget

- DPR: cap at `[1, 1.5]` (NEVER devicePixelRatio)
- Draw calls: < 100 for backgrounds, < 500 for visualizations
- Triangles: < 50K for backgrounds
- `frameloop="demand"` for static scenes
- `antialias: false` for background canvases
- ALWAYS lazy-load with `React.lazy + Suspense`
- ALWAYS dispose geometries on unmount
- NEVER use realtime shadows in backgrounds
- NEVER load 3D without intersection observer

### Key Dependencies

```json
{
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.88.0",
  "@react-three/postprocessing": "^2.16.0",
  "three": "^0.159.0"
}
```

---

## CSS 2026 Features

### Container Queries

```scss
.card-grid {
  container-type: inline-size;
}
@container (min-width: 600px) {
  .card { grid-template-columns: 200px 1fr; }
}
```

### Scroll-Driven Animations (CSS-only reveal)

```scss
.reveal-on-scroll {
  opacity: 1; transform: none; // fallback
  @supports (animation-timeline: view()) {
    animation: reveal linear;
    animation-timeline: view();
    animation-range: entry 0% entry 100%;
  }
}
```

### @starting-style (enter animations)

```scss
.modal {
  opacity: 1; transform: scale(1);
  transition: opacity 0.3s, transform 0.3s;
  @starting-style { opacity: 0; transform: scale(0.95); }
}
```

---

## Web3 UI Patterns

### DApp Button (always right-aligned in header)

```tsx
<motion.button
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  transition={springs.snappy}
  style={{
    marginLeft: 'auto',
    background: 'linear-gradient(135deg, oklch(0.72 0.15 75 / 0.2), oklch(0.75 0.14 220 / 0.2))',
    border: '1px solid oklch(0.72 0.15 75 / 0.3)',
    borderRadius: 12,
    color: 'var(--c-gold)',
  }}
>
  {isConnected ? `${address.slice(0,6)}...${address.slice(-4)}` : 'DApp'}
</motion.button>
```

### Transaction States

```scss
.tx-pending { animation: tx-pulse 2s infinite; border-color: oklch(0.75 0.18 85 / 0.5); }
.tx-success { border-color: oklch(0.80 0.22 145 / 0.5); }
.tx-error   { animation: tx-shake 0.5s; border-color: oklch(0.65 0.22 25 / 0.5); }
```

### Bento Grid Dashboard

```scss
.bento-grid {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  grid-auto-rows: minmax(200px, auto);
}
```

---

## Button System

Five variants matching DSP aesthetic:

| Variant | Use Case | Style |
|---------|----------|-------|
| **Primary** | Main CTA | Gold gradient, dark text, glow shadow |
| **Secondary** | Alternative | Glass background, border, light text |
| **Ghost** | Minimal | Transparent, subtle border |
| **Neon** | Web3 accent | Green border, neon glow |
| **Danger** | Destructive | Red neon variant |

All buttons include:
- Shimmer hover effect (`::after` pseudo-element)
- `translateY(-2px)` lift on hover
- Uppercase, letter-spacing: 0.05em
- Border-radius: 12px
- Min touch target: 44x44px

---

## Component Architecture

### Header Layout
```
[LOGO]  ────  [Navigation Links]  ────  [DApp Button]
Glass subtle + gradient-line-top + sticky + scroll-shrink
```

### Navbar Indicator
- `layoutId="bow"` — gold line flows between items
- Position: `top: -2px` (close to text, NOT -36px)
- Hover: only on items, navbar stays stable (NO translateY on container)

### Card System
Use `GlassCard` component with variant prop:
```tsx
<GlassCard variant="standard" accentColor="gold" interactive>
  <CardContent />
</GlassCard>
```

### Background Stack
```
Layer 0: Solid (#001019)
Layer 1: SVG pattern (gyber_background.svg)
Layer 2: 3D Canvas (particles + stars + energy)
Layer 3: Gradient overlays
Layer 4: Glass surfaces
Layer 5: Content + Typography
```

---

## Immersive Effects

### Cursor Glow (ambient radial gradient following cursor)

```tsx
<div style={{
  position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
  background: `radial-gradient(600px at var(--glow-x) var(--glow-y),
    oklch(0.75 0.14 220 / 0.04), transparent 60%)`
}} />
```

### Aurora Gradient

```scss
.aurora-bg::before, .aurora-bg::after {
  content: ""; position: absolute;
  width: 60vw; height: 60vw; border-radius: 50%;
  filter: blur(80px); opacity: 0.15;
  animation: aurora-drift 20s ease-in-out infinite alternate;
}
.aurora-bg::before { background: oklch(0.72 0.15 75); }  // gold
.aurora-bg::after  { background: oklch(0.75 0.14 220); } // cyan
```

---

## Performance Checklist

- [ ] GPU-only animations (`transform` + `opacity`)
- [ ] `will-change` only during animation, remove after
- [ ] `content-visibility: auto` for below-fold sections
- [ ] Image optimization: AVIF → WebP → JPEG fallback chain
- [ ] Font preload for Montserrat (critical)
- [ ] Code splitting for 3D components
- [ ] Lighthouse Performance: target 95+
- [ ] 3D: 60fps on mid-range mobile

---

## Accessibility Standards

- WCAG 2.1 AA minimum (target AAA for text contrast)
- `prefers-reduced-motion` for ALL animations
- Keyboard navigation for all interactive elements
- ARIA labels for 3D visualizations (`aria-hidden="true"` for decorative)
- Focus ring styling (visible, gold accent)
- Skip navigation link
- Touch targets: minimum 44x44px
- Semantic HTML (`<header>`, `<nav>`, `<main>`, `<article>`)

---

## Known Issues to Avoid

These were identified in the GAP analysis — do NOT reintroduce them:

1. **`!important` abuse** — Fix specificity with proper SCSS nesting, never use `!important`
2. **Navbar jump** — Do NOT add `translateY` to the navbar container on hover
3. **Indicator position** — Keep `layoutId="bow"` indicator at `top: -2px` to `-4px`, NOT `-36px`
4. **Duplicate properties** — Never declare the same CSS property twice in one rule
5. **Cache headers** — Only `/_next/static/*` should be immutable; HTML pages must NOT be cached

---

## Design Decision Checklist

Before presenting any design:

1. Does every element serve a clear function?
2. Is visual hierarchy aligned with content importance?
3. Does it follow the DSP color system (OKLCH)?
4. Are glass effects from the correct tier (subtle/standard/premium/liquid)?
5. Are animations spring-based with correct presets?
6. Does it meet accessibility standards?
7. Does it work on mobile with fluid scaling?
8. Does it feel like **Cyber Evolution** — not generic SaaS?

---

## Progressive Disclosure Files

For detailed specifications, see companion files:
- **MOTION-SPEC.md** — Spring physics, easing, duration tables, Framer Motion patterns
- **ACCESSIBILITY.md** — WCAG AA/AAA, ARIA, keyboard nav, screen readers
- **RESPONSIVE-DESIGN.md** — Fluid breakpoints, container queries, mobile patterns
- **DESIGN-SYSTEM-TEMPLATE.md** — Fixed vs project-specific vs adaptable elements
- **3D-WEB-SPEC.md** — R3F architecture, shaders, performance budgets, PostProcessing

## References

- [Anthropic Frontend Aesthetics Cookbook](https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb)
- [DSP Ultra Modern Design Spec](docs/ULTRA_MODERN_DESIGN_2025_2026.md)
- [OKLCH Color Guide](https://oklch.com)
- [Framer Motion Docs](https://motion.dev)
- [React Three Fiber](https://r3f.docs.pmnd.rs)

## Version History

- v1.0.0 (2026-02-26): Initial release — merged bencium-innovative-ux-designer v2.0.0 with Gybernaty DSP Ultra Modern Design 2025-2026 specification
