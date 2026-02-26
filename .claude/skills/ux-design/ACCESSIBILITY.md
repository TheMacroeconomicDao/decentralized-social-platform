# Accessibility Standards — Gybernaty DSP

Accessibility enables creativity — it's a foundation, not a limitation.
DSP targets WCAG 2.1 AA minimum, AAA for text contrast on dark backgrounds.

## Core Principles (POUR)

- **Perceivable**: Alt text, contrast, captions, non-color indicators
- **Operable**: Keyboard/touch accessible, no timing traps
- **Understandable**: Clear, predictable behavior
- **Robust**: Works with assistive technologies

## Contrast Requirements (Dark Theme)

| Element | Min Ratio | DSP Notes |
|---------|-----------|-----------|
| Normal text on dark bg | 4.5:1 | `--c-text` (oklch 0.90) on `--c-bg-deep` (oklch 0.08) → ~15:1 |
| Large text (18pt+) | 3:1 | Gold accent on dark bg → verify each use |
| UI components/borders | 3:1 | Glass borders may need checking |
| Gold text on dark | 4.5:1 | oklch(0.72 0.15 75) on oklch(0.08 0.03 220) → ~8:1 OK |
| Cyan text on dark | 4.5:1 | oklch(0.75 0.14 220) on oklch(0.08 0.03 220) → ~9:1 OK |
| Muted text | 4.5:1 | `--c-text-muted` (oklch 0.70) needs verification |

## Keyboard Navigation

```tsx
// All interactive elements need visible focus
.interactive:focus-visible {
  outline: 2px solid var(--c-gold);
  outline-offset: 2px;
}

// Custom elements need tabindex + key handlers
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
>
```

**Essentials:**
- Tab through entire interface
- Enter/Space activates elements
- Escape closes modals/dropdowns
- Arrow keys navigate within components (tabs, menus)
- Visible focus indicators (gold ring) always present

## Essential ARIA

```tsx
// Buttons without text
<button aria-label="Close dialog"><X /></button>

// Expandable elements
<button aria-expanded={isOpen} aria-controls="menu">Menu</button>

// Live regions
<div role="status" aria-live="polite">{statusMessage}</div>
<div role="alert" aria-live="assertive">{errorMessage}</div>

// 3D decorative backgrounds
<div aria-hidden="true"><Canvas>...</Canvas></div>
```

## Semantic HTML

```tsx
<header><nav aria-label="Main navigation">...</nav></header>
<main id="main-content">
  <article><h1>Page Title</h1></article>
</main>
<footer>...</footer>

// Never skip heading levels: h1 → h2 → h3
```

## Motion Accessibility

```scss
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

```tsx
// In React components
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const transition = prefersReducedMotion ? { duration: 0 } : springs.smooth;
```

## Touch Targets

- Minimum **44x44px** for all interactive elements
- Adequate spacing between targets (at least 8px gap)
- `touch-manipulation` CSS for responsive touch

## Screen Reader Helpers

```tsx
// Hidden but announced
<span className="sr-only">Additional context for screen readers</span>

// Skip navigation link (must be first focusable element)
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

## Quick Checklist

- [ ] Keyboard: Can tab through all interactive elements
- [ ] Focus: Visible gold focus indicators
- [ ] Contrast: 4.5:1+ for all text on dark backgrounds
- [ ] Alt text: All meaningful images have alt text
- [ ] Headings: Logical h1→h6 hierarchy (no skipping)
- [ ] Forms: Labels properly associated with inputs
- [ ] Errors: Announced to screen readers via aria-live
- [ ] Touch: 44px minimum targets
- [ ] Motion: `prefers-reduced-motion` respected
- [ ] 3D: Decorative canvases have `aria-hidden="true"`
- [ ] Skip nav: Present and functional
