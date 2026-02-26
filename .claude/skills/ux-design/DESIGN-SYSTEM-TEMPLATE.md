# Design System Template — Gybernaty DSP

What's fixed, what's project-specific, what's adaptable.

---

## FIXED (universal, never changes)

### Spacing Scale
```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px
```

### Grid
- 12-column grid for layouts
- Gutters: 16px (mobile), 24px (tablet), 32px (desktop)
- Max container: 1280px

### Accessibility
- WCAG 2.1 AA minimum
- 4.5:1 contrast for text, 3:1 for large text/UI
- 44x44px touch targets
- Keyboard navigation for all interactives

### Typography Hierarchy Logic
- Mathematical scale: Major Third (1.25x)
- Line height: 1.5x body, 1.1-1.25x headlines
- Line length: 45-75 characters

### Component Architecture
- Button states: Default, Hover, Active, Focus, Disabled
- Form: Label above input, error below
- Modal: Overlay + centered + close (X, ESC, outside click)
- Card: Container → Header → Body → Footer

### Animation Physics
- Lightweight: 150ms (icons, badges)
- Standard: 300ms (cards, panels)
- Weighty: 500ms (modals, pages)
- Ease-out for entrances, ease-in for exits

---

## DSP PROJECT-SPECIFIC (filled in)

### Brand Colors

```
BACKGROUNDS (Dark-First):
- Deep cosmos:  oklch(0.08 0.03 220)  →  #001019
- Surface:      oklch(0.18 0.05 215)  →  #072b40
- Elevated:     oklch(0.22 0.04 215)  →  #0c3a55

ACCENTS:
- Primary (Gold):    oklch(0.72 0.15 75)   →  #d49d32
- Secondary (Cyan):  oklch(0.75 0.14 220)  →  #42b8f3

NEON (Web3):
- Success/Green:  oklch(0.80 0.22 145)  →  #00ff88
- Purple:         oklch(0.60 0.20 300)  →  #b366ff
- Danger/Red:     oklch(0.65 0.22 25)   →  #ff4444

STATUS:
- Success: neon-green
- Warning: oklch(0.75 0.18 85) (amber)
- Error:   neon-red
- Info:    cyan
```

### Typography Pairing

```
HEADLINE: Montserrat (Sans-serif, Bold 700-800)
- Use: H1-H3, hero, display text
- Personality: Geometric, modern, strong

BODY: Montserrat (Regular 400, Medium 500)
- Use: Paragraphs, UI text, navigation
- Personality: Clean, legible

ACCENT: Grape Nuts (Cursive, Regular)
- Use: Special callouts, decorative labels
- Personality: Handwritten, organic contrast

MONO: JetBrains Mono
- Use: Code, data values, addresses
```

### Tone of Voice

```
BRAND PERSONALITY:
- Formal ↔ Casual:            4 (tech-casual, not corporate)
- Professional ↔ Friendly:    6 (friendly but competent)
- Serious ↔ Playful:          3 (serious Web3, not a toy)
- Authoritative ↔ Conversational: 5 (informed, approachable)

ANIMATION PERSONALITY:
- Speed: Moderate (springs, not instant)
- Feel: Smooth with subtle bounce (snappy for micro, gentle for large)
```

### Animation Preferences

```
UI interactions: 100-200ms (spring: snappy)
State changes:   200-300ms (spring: smooth)
Page transitions: 300-500ms (spring: layout/gentle)
Hero entrance:   500-800ms (spring: gentle + stagger)
```

---

## ADAPTABLE (context-dependent)

### Glass Tier Selection

| Context | Glass Level |
|---------|------------|
| Navbar, small chips | Subtle |
| Cards, panels, sidebars | Standard |
| Hero overlay, modals, featured | Premium |
| Special effects, landing hero | Liquid |

### Responsive Behavior

| Context | Strategy |
|---------|----------|
| Landing page | Full 3D + parallax + all effects |
| Dashboard | Bento grid, reduced 3D, data-first |
| Mobile | Simplified glass, no cursor glow, reduced particles |

### Button Variants by Context

| Context | Variant |
|---------|---------|
| Main CTA | Primary (gold gradient) |
| Alternative action | Secondary (glass) |
| Navigation, toolbar | Ghost |
| Web3/connect | Neon (green) |
| Destructive | Danger (red neon) |

### Error Handling

| Type | Strategy |
|------|----------|
| Form validation | Inline below field, red accent, clear on fix |
| Network error | Toast notification + retry |
| 404 | Full page with navigation options |
| Wallet error | Modal with retry + help link |

---

## VALIDATION CHECKLIST

### Fixed
- [ ] Spacing from 4px scale
- [ ] 12-column grid or fluid equivalent
- [ ] WCAG AA contrast verified
- [ ] 44px touch targets
- [ ] Mathematical type scale
- [ ] Standard component architecture

### Project-Specific
- [ ] OKLCH colors (with HEX fallback)
- [ ] Montserrat + Grape Nuts fonts
- [ ] Dark-first theme applied
- [ ] Spring animations used (not CSS easing)
- [ ] Glass effects from correct tier

### Adaptable
- [ ] Glass variant matches component importance
- [ ] Responsive simplification applied
- [ ] Button variant fits context
- [ ] Error handling fits error type
