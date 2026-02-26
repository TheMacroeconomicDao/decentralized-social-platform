# Motion Specification — Gybernaty DSP

Motion is a core language of the DSP interface, not decoration. Spring physics is the standard.

## Spring Presets (Framer Motion)

| Preset | Stiffness | Damping | Mass | Use For |
|--------|-----------|---------|------|---------|
| **snappy** | 500 | 30 | 1 | Buttons, micro-interactions, toggles |
| **smooth** | 300 | 25 | 1 | Navigation, cards, panels |
| **gentle** | 150 | 20 | 1.5 | Hero sections, large elements |
| **bouncy** | 400 | 15 | 0.8 | Tooltips, notifications, badges |
| **layout** | 350 | 30 | 1 | `layoutId` transitions (navbar bow) |

```tsx
import { type Transition } from 'framer-motion';

export const springs = {
  snappy:  { type: 'spring', stiffness: 500, damping: 30, mass: 1 } satisfies Transition,
  smooth:  { type: 'spring', stiffness: 300, damping: 25, mass: 1 } satisfies Transition,
  gentle:  { type: 'spring', stiffness: 150, damping: 20, mass: 1.5 } satisfies Transition,
  bouncy:  { type: 'spring', stiffness: 400, damping: 15, mass: 0.8 } satisfies Transition,
  layout:  { type: 'spring', stiffness: 350, damping: 30, mass: 1 } satisfies Transition,
} as const;
```

## Spring Physics Cheat Sheet

```
stiffness ↑  = faster, stiffer
damping ↑    = less oscillation
mass ↑       = slower, more inertial

Critical damping = 2 * sqrt(stiffness * mass)
  damping < critical → bounces
  damping = critical → smooth stop
  damping > critical → slow stop
```

## CSS Fallback Easing (when Framer Motion unavailable)

| Easing | CSS | Use For |
|--------|-----|---------|
| **Ease-out** | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Entrances |
| **Ease-in** | `cubic-bezier(0.4, 0.0, 1, 1)` | Exits |
| **Ease-in-out** | `cubic-bezier(0.4, 0.0, 0.2, 1)` | State changes |
| **Spring-like** | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Playful |

## Duration by Interaction

| Interaction | Duration |
|-------------|----------|
| Button press | 100ms |
| Hover state | 150ms |
| Tooltip appear | 200ms |
| Tab switch | 250ms |
| Modal open | 300ms |
| Page transition | 400ms |
| Hero entrance | 500-800ms |

## DSP Signature Animations

### layoutId="bow" (navbar indicator)

```tsx
{isActive && (
  <motion.div
    layoutId="bow"
    transition={springs.layout}
    style={{
      position: 'absolute', top: -2, left: 0, right: 0,
      height: 3, background: 'var(--c-gold)',
      borderRadius: '0 0 4px 4px',
      boxShadow: '0 0 20px oklch(0.72 0.15 75 / 0.5)',
    }}
  />
)}
```

### Stagger Cascade

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

### Scroll-Driven Parallax

```tsx
const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
```

### Glass Shimmer

```scss
@keyframes glass-shimmer {
  0%, 100% { opacity: 0.5; transform: translateX(-5%); }
  50%      { opacity: 1; transform: translateX(5%); }
}
```

### Transaction States

```scss
@keyframes tx-pulse {
  0%, 100% { box-shadow: 0 0 0 0 oklch(0.75 0.18 85 / 0.4); }
  50%      { box-shadow: 0 0 0 12px oklch(0.75 0.18 85 / 0); }
}
```

## Performance Rules

- **ONLY** animate `transform` and `opacity` (GPU-accelerated)
- **NEVER** animate `width`, `height`, `margin`, `padding`, `border-width`
- Use `will-change: transform, opacity` sparingly — remove after animation
- Keep UI animations under 500ms
- `prefers-reduced-motion` MUST be respected:

```scss
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

## AnimatePresence (exit animations)

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={springs.smooth}
  >
    <TabContent />
  </motion.div>
</AnimatePresence>
```

## CSS Scroll-Driven (no JS needed)

```scss
.reveal-on-scroll {
  @supports (animation-timeline: view()) {
    animation: reveal linear;
    animation-timeline: view();
    animation-range: entry 0% entry 100%;
  }
}
@keyframes reveal {
  from { opacity: 0; transform: translateY(50px) scale(0.95); filter: blur(10px); }
  to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
```
