# Responsive Design — Gybernaty DSP

Mobile-first with fluid scaling. No hard breakpoints — use `clamp()` and container queries.

## Breakpoints (when needed)

| Range | Pixels | Devices | Strategy |
|-------|--------|---------|----------|
| **XS** | 0-479px | Small phones | Single column, bottom nav, 44px targets |
| **SM** | 480-767px | Large phones | Single column, simplified UI |
| **MD** | 768-1023px | Tablets | 2 columns, sidebar possible |
| **LG** | 1024-1439px | Laptops | Multi-column, full nav |
| **XL** | 1440px+ | Desktop | Max-width 1280px container |

## Fluid Everything

### Typography (clamp)

```scss
--fs-base:  clamp(1rem, 0.91rem + 0.43vw, 1.25rem);
--fs-hero:  clamp(3rem, 2.4rem + 2.93vw, 5rem);
```

### Spacing (clamp)

```scss
--space-md: clamp(1rem, 0.75rem + 1.25vw, 1.5rem);
--space-lg: clamp(1.5rem, 1rem + 2.5vw, 3rem);
```

### Container Max-Width

```scss
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 3vw, 2rem);
}
```

## Container Queries (2026)

```scss
// Components scale by container, not viewport
.card-grid {
  container-type: inline-size;
  container-name: card-grid;
}

@container card-grid (min-width: 600px) {
  .card { grid-template-columns: 200px 1fr; }
}
@container card-grid (min-width: 900px) {
  .card { grid-template-columns: 250px 1fr auto; }
}
```

## Mobile Simplification

| Desktop | Mobile |
|---------|--------|
| Full navbar | Hamburger menu |
| Side-by-side | Stacked |
| Multi-column grid | Single column |
| 3D Canvas full detail | Reduced particles or static fallback |
| Glass liquid effects | Glass subtle (less blur = less GPU) |
| Cursor glow | Disabled (no mouse) |

## Slider/Hero Responsive

```scss
// DSP Slider: pure CSS responsive (no JS hooks to avoid hydration flicker)
.slider {
  height: clamp(300px, 50vh, 600px);
  max-width: 1280px;
}

// Image switching via CSS
.slider-mobile  { display: block; }
.slider-desktop { display: none; }

@media (min-width: 768px) {
  .slider-mobile  { display: none; }
  .slider-desktop { display: block; }
}
```

## 3D Responsive

```tsx
// Reduce particle count on mobile
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const particleCount = isMobile ? 200 : 800;
const dpr: [number, number] = isMobile ? [1, 1] : [1, 1.5];
```

## Testing Widths

- 375px (iPhone SE)
- 390px (iPhone 14/15)
- 768px (iPad)
- 1024px (iPad Pro)
- 1280px (Laptop)
- 1440px+ (Desktop)

## Performance on Mobile

- `content-visibility: auto` for below-fold sections
- Lazy-load 3D only when visible (Intersection Observer)
- Reduce glass blur levels (GPU-intensive on mobile)
- Image: AVIF → WebP → JPEG fallback
- Font: preload only Montserrat woff2
