# ULTRA MODERN DESIGN SYSTEM 2025-2026 + 3D WEB
## Gybernaty DSP - Экспертный документ глубинного дизайн-исследования

> **Версия:** 2.1 | **Обновлено:** Февраль 2026
> **Стек:** Next.js 15 + React 19 + Three.js + R3F + Framer Motion 12 + SCSS
> **Парадигма:** Cyber Evolution 2025-2026 | Dark-First | Glassmorphism 3.0 | Immersive 3D Web

---

## СОДЕРЖАНИЕ

1. [Философия дизайна и визуальная ДНК](#1-философия-дизайна-и-визуальная-днк)
2. [Цветовая система OKLCH](#2-цветовая-система-oklch)
3. [Glassmorphism 3.0 - Эволюция стекла](#3-glassmorphism-30---эволюция-стекла)
4. [3D Web - React Three Fiber + Three.js](#4-3d-web---react-three-fiber--threejs)
5. [Motion Design - Framer Motion 12](#5-motion-design---framer-motion-12)
6. [Типографика - Variable Fonts + Fluid Scaling](#6-типографика---variable-fonts--fluid-scaling)
7. [CSS 2026 - Новые возможности](#7-css-2026---новые-возможности)
8. [Иммерсивные эффекты и фоны](#8-иммерсивные-эффекты-и-фоны)
9. [Web3/Crypto UI паттерны](#9-web3crypto-ui-паттерны)
10. [Компонентная система Ultra Modern](#10-компонентная-система-ultra-modern)
11. [Производительность и оптимизация](#11-производительность-и-оптимизация)
12. [GAP-анализ: текущий проект vs спецификация](#12-gap-анализ-текущий-проект-vs-спецификация)
13. [Имплементация для DSP проекта](#13-имплементация-для-dsp-проекта)
14. [Browser Support и Fallbacks](#14-browser-support-и-fallbacks)
15. [Чеклист внедрения](#15-чеклист-внедрения)

---

## 1. ФИЛОСОФИЯ ДИЗАЙНА И ВИЗУАЛЬНАЯ ДНК

### 1.1 Концепция: Cyber Evolution 2025-2026

DSP — это **децентрализованная социальная платформа** с Web3-корнем. Визуальная идентичность строится на пересечении:

- **Космическая глубина** — тёмные фоны (#001019 → #072b40), звёздные поля, пространственные 3D-сцены
- **Живая энергия** — золотой (#d49d32), циановый (#42b8f3), неоновые акценты
- **Технологическая прозрачность** — glassmorphism, blur-слои, рентгеновская эстетика

### 1.2 Принципы Ultra Modern Design

| Принцип | Описание | Реализация в DSP |
|---------|----------|-----------------|
| **Dark-First** | Тёмный режим как стандарт, не опция | Основа палитры: #001019 - #072b40 |
| **Depth-Aware** | Интерфейс имеет ощущение глубины | Z-слои glass + 3D фоны + parallax |
| **Motion-Native** | Движение — часть языка, не декорация | Spring-анимации, layout transitions |
| **Responsive Fluid** | Нет точек перелома — есть плавный поток | clamp(), container queries, fluid grids |
| **3D-Integrated** | 3D — не промо-фишка, а часть UI | R3F Canvas в hero, фоны, визуализации |
| **Accessibility** | Доступность без компромиссов | prefers-reduced-motion, WCAG AAA контрасты |

### 1.3 Визуальная ДНК DSP

```
┌──────────────────────────────────────────────────────────┐
│  КОСМИЧЕСКИЙ ТЁМНЫЙ ФОН                                 │
│  ┌────────────────────────────────────────────────────┐  │
│  │  ★  ★        ★     ★           ★                  │  │
│  │       3D PARTICLE FIELD                            │  │
│  │  ★         ★              ★                        │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │ ░░░░░░ GLASSMORPHISM LAYER ░░░░░░░░░░░░░░  │   │  │
│  │  │ ░ ┌─────────────────────────────────────┐ ░ │   │  │
│  │  │ ░ │  КОНТЕНТ + TYPOGRAPHY + ANIMATIONS  │ ░ │   │  │
│  │  │ ░ │  ═══════ GOLDEN ACCENT LINE ══════  │ ░ │   │  │
│  │  │ ░ └─────────────────────────────────────┘ ░ │   │  │
│  │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 2. ЦВЕТОВАЯ СИСТЕМА OKLCH

### 2.1 Почему OKLCH в 2025-2026

OKLCH (Lightness, Chroma, Hue) — **стандарт цвета 2025-2026**. В отличие от HSL/RGB:
- **Перцептуально равномерный** — одинаковые числовые изменения = одинаковые визуальные изменения
- **Предсказуемые трансформации** — осветление/затемнение не меняет оттенок
- **Wide-gamut P3** — поддержка ярких дисплеев
- **Нативный CSS** — `oklch()` поддерживается всеми современными браузерами

### 2.2 Палитра DSP в OKLCH

```scss
// ============================================
// ЦВЕТОВАЯ СИСТЕМА DSP — OKLCH 2025-2026
// ============================================

:root {
  // ─── Базовые цвета ───
  --c-bg-deep:     oklch(0.08 0.03 220);       // #001019 — глубокий космос
  --c-bg-surface:  oklch(0.18 0.05 215);       // #072b40 — поверхность
  --c-bg-elevated: oklch(0.22 0.04 215);       // #0c3a55 — приподнятый слой

  // ─── Акцентные цвета ───
  --c-gold:        oklch(0.72 0.15 75);         // #d49d32 — золотой (primary)
  --c-gold-light:  oklch(0.82 0.12 75);         // осветлённый золотой
  --c-gold-dim:    oklch(0.52 0.10 75);         // приглушённый золотой

  --c-cyan:        oklch(0.75 0.14 220);        // #42b8f3 — циановый (secondary)
  --c-cyan-light:  oklch(0.85 0.10 220);        // осветлённый циановый
  --c-cyan-dim:    oklch(0.55 0.08 220);        // приглушённый циановый

  // ─── Неоновые акценты (Web3 aesthetic) ───
  --c-neon-green:  oklch(0.80 0.22 145);        // #00ff88 — неоновый зелёный
  --c-neon-purple: oklch(0.60 0.20 300);        // #b366ff — неоновый фиолетовый
  --c-neon-red:    oklch(0.65 0.22 25);         // #ff4444 — неоновый красный

  // ─── Нейтральные ───
  --c-text:        oklch(0.90 0.01 220);        // #e1e1e1 — основной текст
  --c-text-muted:  oklch(0.70 0.01 220);        // #b8b8b8 — вторичный текст
  --c-text-dim:    oklch(0.50 0.01 220);        // #808080 — приглушённый текст

  // ─── Динамические трансформации через relative color syntax ───
  --c-gold-hover:  oklch(from var(--c-gold) calc(l + 0.1) c h);
  --c-gold-glow:   oklch(from var(--c-gold) l calc(c * 1.3) h);
  --c-cyan-hover:  oklch(from var(--c-cyan) calc(l + 0.1) c h);
}
```

### 2.3 Функция `color-mix()` для UI-состояний

```scss
// Динамические состояния без дублирования цветов
:root {
  // Hover — смешиваем с белым
  --btn-hover: color-mix(in oklch, var(--c-gold), white 15%);

  // Disabled — смешиваем с фоном
  --btn-disabled: color-mix(in oklch, var(--c-gold), var(--c-bg-deep) 60%);

  // Glass overlay
  --glass-tint: color-mix(in oklch, var(--c-cyan), transparent 85%);
}
```

### 2.4 Семантические токены

```scss
:root {
  // ─── Семантика ───
  --color-primary:     var(--c-gold);
  --color-secondary:   var(--c-cyan);
  --color-success:     var(--c-neon-green);
  --color-danger:      var(--c-neon-red);
  --color-warning:     oklch(0.75 0.18 85);     // amber
  --color-info:        var(--c-cyan);

  // ─── Поверхности ───
  --surface-0:         var(--c-bg-deep);        // Самый глубокий
  --surface-1:         var(--c-bg-surface);     // Карточки
  --surface-2:         var(--c-bg-elevated);    // Модалки, дропдауны
  --surface-glass:     oklch(0.18 0.05 215 / 0.25); // Glass слой

  // ─── Бордюры ───
  --border-subtle:     oklch(1 0 0 / 0.06);
  --border-default:    oklch(1 0 0 / 0.12);
  --border-accent:     oklch(from var(--c-gold) l c h / 0.4);
}
```

---

## 3. GLASSMORPHISM 3.0 — ЭВОЛЮЦИЯ СТЕКЛА

### 3.1 Glassmorphism в 2026: что изменилось

| Версия | Характеристики |
|--------|---------------|
| **1.0 (2020)** | Белый полупрозрачный фон + blur |
| **2.0 (2023)** | Тёмный glass + saturate + border-glow |
| **3.0 (2025-2026)** | **Liquid glass** + noise texture + chromatic light + animated edges |

### 3.2 Уровни Glass-эффектов

```scss
// ============================================
// GLASSMORPHISM 3.0 — Слоистая система
// ============================================

// ─── Уровень 1: Subtle Glass (навбар, мелкие карточки) ───
.glass-subtle {
  background: oklch(0.18 0.05 215 / 0.15);
  backdrop-filter: blur(12px) saturate(1.2);
  border: 1px solid oklch(1 0 0 / 0.06);
  border-radius: 12px;
}

// ─── Уровень 2: Standard Glass (карточки, панели) ───
.glass-standard {
  background: oklch(0.18 0.05 215 / 0.25);
  backdrop-filter: blur(25px) saturate(1.4);
  border: 1px solid oklch(1 0 0 / 0.10);
  border-radius: 16px;
  box-shadow:
    0 8px 32px oklch(0 0 0 / 0.2),
    inset 0 1px 0 oklch(1 0 0 / 0.05);
}

// ─── Уровень 3: Premium Glass (hero секции, модалки) ───
.glass-premium {
  background: oklch(0.18 0.05 215 / 0.30);
  backdrop-filter: blur(40px) saturate(1.6);
  border: 1px solid oklch(1 0 0 / 0.12);
  border-radius: 24px;
  box-shadow:
    0 16px 64px oklch(0 0 0 / 0.3),
    0 0 0 1px oklch(1 0 0 / 0.04) inset,
    0 1px 0 oklch(1 0 0 / 0.06) inset;

  // Хроматическая линия сверху
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      oklch(0.72 0.15 75 / 0.6),     // gold
      oklch(0.75 0.14 220 / 0.6),     // cyan
      transparent
    );
  }
}

// ─── Уровень 4: Liquid Glass (спецэффекты, hero overlay) ───
.glass-liquid {
  background: oklch(0.18 0.05 215 / 0.20);
  backdrop-filter: blur(60px) saturate(1.8) brightness(1.1);
  border: 1px solid oklch(1 0 0 / 0.08);
  border-radius: 32px;

  // Анимированный шиммер
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      135deg,
      oklch(1 0 0 / 0.03) 0%,
      transparent 40%,
      oklch(1 0 0 / 0.02) 60%,
      transparent 100%
    );
    animation: glass-shimmer 8s ease-in-out infinite;
  }
}

@keyframes glass-shimmer {
  0%, 100% { opacity: 0.5; transform: translateX(-5%); }
  50% { opacity: 1; transform: translateX(5%); }
}
```

### 3.3 Noise Texture Overlay (2026 тренд)

```scss
// Добавляет микротекстуру к glass — убирает "пластиковость"
.glass-with-noise {
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: 0.03;
    mix-blend-mode: overlay;
    pointer-events: none;
  }
}

// Альтернатива через CSS filter
.noise-texture {
  filter: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='noise'><feTurbulence baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/></filter></svg>#noise");
  opacity: 0.015;
}
```

---

## 4. 3D WEB — REACT THREE FIBER + THREE.JS

### 4.1 Архитектура 3D в DSP

```
┌────────────────────────────────────────────┐
│ Next.js App Layer (SSR/SSG)                │
│ ┌────────────────────────────────────────┐ │
│ │ React Client Components               │ │
│ │ ┌──────────────────────────────────┐   │ │
│ │ │ R3F Canvas (lazy-loaded)         │   │ │
│ │ │ ├── Scene3D                      │   │ │
│ │ │ │   ├── Lighting                 │   │ │
│ │ │ │   ├── Particles                │   │ │
│ │ │ │   ├── PostProcessing           │   │ │
│ │ │ │   └── Geometry                 │   │ │
│ │ │ ├── Camera Controls              │   │ │
│ │ │ └── Environment                  │   │ │
│ │ └──────────────────────────────────┘   │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### 4.2 Базовый 3D Background для DSP

```tsx
// src/shared/ui/AnimatedBackground3D/AnimatedBackground3D.tsx
'use client';

import { Suspense, lazy, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

// ─── Particle Field с mouse-reactive поведением ───
function ParticleField({ count = 500 }) {
  const mesh = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#42b8f3"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Энергетические линии (connections) ───
function EnergyLines() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={ref}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Float key={i} speed={1 + i * 0.2} floatIntensity={0.5}>
          <mesh position={[
            Math.cos(i * Math.PI / 4) * 5,
            Math.sin(i * Math.PI / 4) * 5,
            -2
          ]}>
            <torusGeometry args={[0.3, 0.02, 16, 64]} />
            <meshStandardMaterial
              color="#d49d32"
              emissive="#d49d32"
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// ─── Главная 3D сцена ───
function Scene() {
  return (
    <>
      {/* Освещение */}
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} color="#42b8f3" intensity={0.5} />
      <pointLight position={[-10, -10, -5]} color="#d49d32" intensity={0.3} />

      {/* Объекты */}
      <Stars radius={100} depth={50} count={3000} factor={4} fade speed={0.5} />
      <ParticleField count={800} />
      <EnergyLines />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.8}
          luminanceSmoothing={0.9}
          intensity={0.8}
        />
        <ChromaticAberration offset={[0.0005, 0.0005]} />
      </EffectComposer>
    </>
  );
}

// ─── Экспорт с lazy loading ───
export function AnimatedBackground3D() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      pointerEvents: 'none',
    }}>
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          dpr={[1, 1.5]}
          frameloop="always"
          gl={{ antialias: false, alpha: true }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
```

### 4.3 Ecosystem 3D Visualization (улучшенная)

```tsx
// Улучшенная версия Ecosystem3D с shader-based particles
// и интерактивным взаимодействием

// Ключевые улучшения для 2026:
// 1. Custom shaders для частиц вместо pointsMaterial
// 2. FBO technique для GPU-based particle physics
// 3. Bloom на emissive материалах (toneMapped={false})
// 4. Scroll-driven camera animation
// 5. Mouse-reactive distortion field

// Пример vertex shader для частиц:
const particleVertexShader = `
  uniform float uTime;
  uniform float uMouse;
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;

  void main() {
    vColor = aColor;
    vec3 pos = position;
    pos.x += sin(uTime * 0.5 + position.y * 2.0) * 0.3;
    pos.y += cos(uTime * 0.3 + position.x * 1.5) * 0.2;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `
  varying vec3 vColor;

  void main() {
    // Круглая частица с мягким краем
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    gl_FragColor = vec4(vColor, alpha * 0.8);
  }
`;
```

### 4.4 Performance Guidelines для 3D

```
┌─────────────────────────────────────────────┐
│         3D PERFORMANCE CHECKLIST            │
├─────────────────────────────────────────────┤
│                                             │
│ ✅ DPR: cap at [1, 1.5] (не 2!)            │
│ ✅ frameloop="demand" для статичных сцен    │
│ ✅ Instancing для повторяющейся геометрии   │
│ ✅ Points вместо отдельных mesh для частиц  │
│ ✅ Lazy load через React.lazy + Suspense    │
│ ✅ Dispose geometries при unmount           │
│ ✅ KTX2/Basis compressed текстуры           │
│ ✅ LOD (Level of Detail) для далёких объектов│
│ ✅ Draco compression для GLTF (70-95%)      │
│ ✅ antialias: false для фоновых сцен        │
│                                             │
│ ❌ НЕ использовать realtime shadows в BG    │
│ ❌ НЕ более 1000-2000 draw calls            │
│ ❌ НЕ грузить 3D без intersection observer  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 5. MOTION DESIGN — FRAMER MOTION 12

### 5.1 Spring Physics как стандарт

```tsx
// ============================================
// СИСТЕМА АНИМАЦИЙ DSP 2025-2026
// ============================================

// ─── Пресеты spring-анимаций ───
export const springs = {
  // Быстрый отклик (кнопки, микроинтеракции)
  snappy: { type: 'spring', stiffness: 500, damping: 30, mass: 1 },

  // Стандартный (навигация, карточки)
  smooth: { type: 'spring', stiffness: 300, damping: 25, mass: 1 },

  // Медленный (hero секции, большие элементы)
  gentle: { type: 'spring', stiffness: 150, damping: 20, mass: 1.5 },

  // Упругий (тултипы, нотификации)
  bouncy: { type: 'spring', stiffness: 400, damping: 15, mass: 0.8 },

  // Layout transitions (переключение страниц)
  layout: { type: 'spring', stiffness: 350, damping: 30, mass: 1 },
} as const;
```

### 5.2 Layout Animations (layoutId)

```tsx
// ─── Navbar с layoutId="bow" (фирменная анимация DSP) ───

// layoutId обеспечивает плавный переход индикатора
// между пунктами меню при смене страницы

{pathName === item.link && (
  <motion.div
    layoutId="bow"
    className={cls.activeIndicator}
    transition={springs.layout}
    style={{
      position: 'absolute',
      top: -2,
      left: 0,
      right: 0,
      height: 3,
      background: 'var(--c-gold)',
      borderRadius: '0 0 4px 4px',
      boxShadow: '0 0 20px oklch(0.72 0.15 75 / 0.5)',
    }}
  />
)}
```

### 5.3 Stagger Animations (каскадные)

```tsx
// ─── Container + Item variants для каскадного появления ───
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: springs.smooth,
  }
};

// Использование:
<motion.nav variants={containerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.label}
    </motion.div>
  ))}
</motion.nav>
```

### 5.4 Scroll-Driven Animations

```tsx
import { useScroll, useTransform, motion } from 'framer-motion';

function HeroSection() {
  const { scrollYProgress } = useScroll();

  // Параллакс для 3D фона
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Blur при скролле
  const blur = useTransform(scrollYProgress, [0, 0.3], [0, 10]);

  return (
    <motion.div
      style={{ y, opacity, scale, filter: `blur(${blur}px)` }}
    >
      <AnimatedBackground3D />
      <HeroContent />
    </motion.div>
  );
}
```

### 5.5 Gesture Interactions

```tsx
// ─── Micro-interactions для карточек ───
<motion.div
  whileHover={{
    scale: 1.02,
    boxShadow: '0 20px 60px oklch(0 0 0 / 0.3)',
  }}
  whileTap={{ scale: 0.98 }}
  transition={springs.snappy}
  className="glass-standard"
>
  <CardContent />
</motion.div>

// ─── Drag-to-dismiss для мобильных ───
<motion.div
  drag="y"
  dragConstraints={{ top: 0, bottom: 0 }}
  dragElastic={0.2}
  onDragEnd={(_, info) => {
    if (info.offset.y > 100) onDismiss();
  }}
>
  <NotificationCard />
</motion.div>
```

### 5.6 AnimatePresence (exit-анимации)

```tsx
import { AnimatePresence, motion } from 'framer-motion';

// Плавное появление/исчезновение элементов
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

---

## 6. ТИПОГРАФИКА — VARIABLE FONTS + FLUID SCALING

### 6.1 Font Stack

```scss
// ============================================
// ТИПОГРАФИКА DSP 2025-2026
// ============================================

// Основной шрифт — Montserrat (уже используется)
// Декоративный — Grape_Nuts (для акцентов)
// Моноширинный — JetBrains Mono (код, данные)

:root {
  --font-primary: 'Montserrat', system-ui, -apple-system, sans-serif;
  --font-accent: 'Grape Nuts', cursive;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

### 6.2 Fluid Type Scale с clamp()

```scss
// Модульная шкала с ratio 1.25 (Major Third)
// min: mobile (320px), max: desktop (1440px)

:root {
  // ─── Fluid Typography ───
  --fs-xs:    clamp(0.694rem, 0.65rem + 0.22vw, 0.8rem);      // 11-13px
  --fs-sm:    clamp(0.833rem, 0.77rem + 0.32vw, 1rem);        // 13-16px
  --fs-base:  clamp(1rem, 0.91rem + 0.43vw, 1.25rem);         // 16-20px
  --fs-md:    clamp(1.2rem, 1.08rem + 0.58vw, 1.563rem);      // 19-25px
  --fs-lg:    clamp(1.44rem, 1.28rem + 0.78vw, 1.953rem);     // 23-31px
  --fs-xl:    clamp(1.728rem, 1.51rem + 1.07vw, 2.441rem);    // 28-39px
  --fs-2xl:   clamp(2.074rem, 1.78rem + 1.44vw, 3.052rem);    // 33-49px
  --fs-3xl:   clamp(2.488rem, 2.09rem + 1.96vw, 3.815rem);    // 40-61px
  --fs-hero:  clamp(3rem, 2.4rem + 2.93vw, 5rem);             // 48-80px

  // ─── Line Heights ───
  --lh-tight:    1.1;     // Заголовки
  --lh-snug:     1.25;    // Подзаголовки
  --lh-normal:   1.5;     // Основной текст
  --lh-relaxed:  1.75;    // Длинные тексты

  // ─── Letter Spacing ───
  --ls-tight:    -0.02em;  // Крупные заголовки
  --ls-normal:   0;        // Основной текст
  --ls-wide:     0.05em;   // Капс, лейблы
  --ls-wider:    0.1em;    // Кнопки, навигация
}
```

### 6.3 Типографические утилиты

```scss
// ─── Heading Styles ───
.heading-hero {
  font-size: var(--fs-hero);
  font-weight: 800;
  line-height: var(--lh-tight);
  letter-spacing: var(--ls-tight);
  background: linear-gradient(135deg, var(--c-gold), var(--c-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.heading-1 {
  font-size: var(--fs-3xl);
  font-weight: 700;
  line-height: var(--lh-tight);
  letter-spacing: var(--ls-tight);
}

.heading-2 {
  font-size: var(--fs-2xl);
  font-weight: 600;
  line-height: var(--lh-snug);
}

// ─── Text Glow (для активных элементов навигации) ───
.text-glow-gold {
  text-shadow:
    0 0 10px oklch(0.72 0.15 75 / 0.5),
    0 0 30px oklch(0.72 0.15 75 / 0.2);
}

.text-glow-cyan {
  text-shadow:
    0 0 10px oklch(0.75 0.14 220 / 0.5),
    0 0 30px oklch(0.75 0.14 220 / 0.2);
}
```

---

## 7. CSS 2026 — НОВЫЕ ВОЗМОЖНОСТИ

### 7.1 Container Queries

```scss
// Компоненты масштабируются по контейнеру, не по viewport

.card-grid {
  container-type: inline-size;
  container-name: card-grid;
}

@container card-grid (min-width: 600px) {
  .card {
    grid-template-columns: 200px 1fr;
    gap: var(--space-lg);
  }
}

@container card-grid (min-width: 900px) {
  .card {
    grid-template-columns: 250px 1fr auto;
  }
}
```

### 7.2 Scroll-Driven Animations (CSS-only)

```scss
// Появление элементов при скролле БЕЗ JavaScript

.reveal-on-scroll {
  animation: reveal linear;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
    filter: blur(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

// Прогресс-бар привязанный к скроллу
.scroll-progress {
  animation: progress-grow linear;
  animation-timeline: scroll(root);
}

@keyframes progress-grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

### 7.3 View Transitions API

```scss
// Плавные переходы между страницами (Next.js App Router)

::view-transition-old(root) {
  animation: slide-out 0.3s ease-in;
}

::view-transition-new(root) {
  animation: slide-in 0.3s ease-out;
}

// Навбар не анимируется при переходе (стабильный)
.navbar {
  view-transition-name: navbar;
}

::view-transition-old(navbar),
::view-transition-new(navbar) {
  animation: none;
}
```

### 7.4 CSS Nesting (нативный)

```scss
// Нативная вложенность — SCSS-подобный синтаксис в CSS

.card {
  background: var(--surface-glass);
  border-radius: 16px;

  & .title {
    font-size: var(--fs-lg);
    color: var(--c-text);
  }

  &:hover {
    box-shadow: 0 20px 60px oklch(0 0 0 / 0.3);

    & .title {
      color: var(--c-gold);
    }
  }

  @container (min-width: 500px) {
    & {
      padding: var(--space-xl);
    }
  }
}
```

### 7.5 @starting-style (enter-анимации)

```scss
// Анимация появления элементов (заменяет AnimatePresence для простых случаев)

.modal {
  opacity: 1;
  transform: scale(1);
  transition:
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  @starting-style {
    opacity: 0;
    transform: scale(0.95);
  }
}

// Для popover/dropdown
.dropdown {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.2s ease;

  @starting-style {
    opacity: 0;
    transform: translateY(-8px);
  }
}
```

---

## 8. ИММЕРСИВНЫЕ ЭФФЕКТЫ И ФОНЫ

### 8.1 Animated Background Stack

```
DSP использует многослойную систему фонов:

Layer 0: Solid deep color (#001019)
Layer 1: SVG background pattern (gyber_background.svg)
Layer 2: 3D Canvas (particles + stars + energy lines)
Layer 3: Gradient overlays (для затемнения под контентом)
Layer 4: Glass surfaces (navbar, cards, modals)
Layer 5: Content + Typography
```

### 8.2 Cursor-Reactive Glow

```tsx
// ─── Ambient glow, следующий за курсором ───
'use client';

import { useEffect, useRef } from 'react';

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return;
      glowRef.current.style.setProperty('--glow-x', `${e.clientX}px`);
      glowRef.current.style.setProperty('--glow-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={glowRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        background: `radial-gradient(
          600px circle at var(--glow-x, 50%) var(--glow-y, 50%),
          oklch(0.75 0.14 220 / 0.04),
          transparent 60%
        )`,
      }}
    />
  );
}
```

### 8.3 Aurora Gradient Background

```scss
// ─── Анимированный Aurora фон ───
.aurora-bg {
  position: fixed;
  inset: 0;
  z-index: -2;
  overflow: hidden;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 60vw;
    height: 60vw;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.15;
    animation: aurora-drift 20s ease-in-out infinite alternate;
  }

  &::before {
    top: -20%;
    left: -10%;
    background: oklch(0.72 0.15 75);  // gold
    animation-delay: -5s;
  }

  &::after {
    bottom: -20%;
    right: -10%;
    background: oklch(0.75 0.14 220); // cyan
    animation-delay: -10s;
  }
}

@keyframes aurora-drift {
  0%   { transform: translate(0, 0) rotate(0deg); }
  33%  { transform: translate(30px, -50px) rotate(5deg); }
  66%  { transform: translate(-20px, 20px) rotate(-3deg); }
  100% { transform: translate(10px, -30px) rotate(2deg); }
}
```

### 8.4 Parallax Depth System

```tsx
// ─── CSS-only parallax через scroll-timeline ───
// (для элементов, не требующих Three.js)

// Быстрый слой (дальний)
.parallax-far {
  animation: parallax-y linear;
  animation-timeline: scroll();
  --parallax-speed: -0.2;
}

// Медленный слой (ближний)
.parallax-near {
  animation: parallax-y linear;
  animation-timeline: scroll();
  --parallax-speed: 0.1;
}

@keyframes parallax-y {
  to { transform: translateY(calc(var(--parallax-speed) * 100vh)); }
}
```

---

## 9. WEB3/CRYPTO UI ПАТТЕРНЫ

### 9.1 Wallet Connection Flow

```
┌──────────────────────────────────────┐
│ ┌──────────────────────────────────┐ │
│ │    🔗 Connect Wallet             │ │
│ │    ──────────────────            │ │
│ │                                  │ │
│ │  ┌────────┐  ┌────────┐         │ │
│ │  │MetaMask│  │Rainbow │         │ │
│ │  └────────┘  └────────┘         │ │
│ │  ┌────────┐  ┌────────┐         │ │
│ │  │ WC v2  │  │Coinbase│         │ │
│ │  └────────┘  └────────┘         │ │
│ │                                  │ │
│ │  [Connection status animation]   │ │
│ │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░   │ │
│ └──────────────────────────────────┘ │
│    Glass Premium Modal               │
└──────────────────────────────────────┘
```

### 9.2 Кнопка DApp (Ultra Modern)

```tsx
// Кнопка DApp — всегда справа в Header, с wallet-статусом

<motion.button
  className="dapp-button glass-subtle"
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  transition={springs.snappy}
  style={{
    marginLeft: 'auto',  // Прижатие вправо
    padding: '10px 24px',
    background: 'linear-gradient(135deg, oklch(0.72 0.15 75 / 0.2), oklch(0.75 0.14 220 / 0.2))',
    border: '1px solid oklch(0.72 0.15 75 / 0.3)',
    borderRadius: 12,
    color: 'var(--c-gold)',
    fontWeight: 600,
    cursor: 'pointer',
  }}
>
  {isConnected ? `${address.slice(0,6)}...${address.slice(-4)}` : 'DApp'}
</motion.button>
```

### 9.3 Transaction States

```scss
// Визуальная индикация состояний транзакции

.tx-pending {
  animation: tx-pulse 2s ease-in-out infinite;
  border-color: oklch(0.75 0.18 85 / 0.5); // amber
}

.tx-success {
  animation: tx-glow 0.5s ease-out;
  border-color: oklch(0.80 0.22 145 / 0.5); // green
}

.tx-error {
  animation: tx-shake 0.5s ease-out;
  border-color: oklch(0.65 0.22 25 / 0.5); // red
}

@keyframes tx-pulse {
  0%, 100% { box-shadow: 0 0 0 0 oklch(0.75 0.18 85 / 0.4); }
  50% { box-shadow: 0 0 0 12px oklch(0.75 0.18 85 / 0); }
}
```

### 9.4 Bento Grid Dashboard

```scss
// ─── Bento Grid для метрик и данных ───
.bento-grid {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  grid-auto-rows: minmax(200px, auto);

  // Выделенные ячейки
  .bento-featured {
    grid-column: span 2;
    grid-row: span 2;
  }

  .bento-wide {
    grid-column: span 2;
  }

  .bento-tall {
    grid-row: span 2;
  }
}

// Карточка в bento-сетке
.bento-card {
  @extend .glass-standard;
  padding: var(--space-lg);
  overflow: hidden;
  position: relative;

  // Акцентная линия сверху
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--c-gold), var(--c-cyan));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
}
```

---

## 10. КОМПОНЕНТНАЯ СИСТЕМА ULTRA MODERN

### 10.1 NavbarEnhanced (финальная спецификация)

```
┌────────────────────────────────────────────────────────────────┐
│ ═══════════ GRADIENT LINE (gold → cyan → green) ══════════════ │
│                                                                │
│  Community    Experiment    Platform    AIC    Unit Profile     │
│                              ▄▄▄▄▄▄▄▄                         │
│                              GOLD BOW                          │
│                           (layoutId="bow")                     │
│                                                                │
│  Glass subtle background + stagger enter animation             │
│  Hover: text-glow-gold + scale(1.05)                          │
│  Active: color: var(--c-gold) + bow indicator                  │
└────────────────────────────────────────────────────────────────┘
```

### 10.2 Header (Ultra Modern)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  [LOGO]        [Navigation Links]              [DApp Button] │
│                                                              │
│  Glass subtle + gradient-line-top                            │
│  Sticky + scroll-aware (shrink on scroll)                    │
│  DApp button: margin-left: auto (прижатие вправо)            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 10.3 Hero Section (Immersive)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│           ★  3D PARTICLE BACKGROUND ★                        │
│         ★           ★          ★                             │
│    ★                                    ★                    │
│         ┌─────────────────────────┐                          │
│         │  GYBERNATY              │                          │
│         │  Community of           │                          │
│         │  Progressive            │ ← gradient text          │
│         │  Enthusiasts            │                          │
│         │                         │                          │
│         │  [Explore] [Connect]    │ ← glass buttons          │
│         └─────────────────────────┘                          │
│               glass-premium overlay                          │
│                                                              │
│  Scroll → parallax + fade + blur                             │
└──────────────────────────────────────────────────────────────┘
```

### 10.4 Card (Glass Modern)

```tsx
// Базовая карточка Ultra Modern

interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'subtle' | 'standard' | 'premium';
  accentColor?: 'gold' | 'cyan' | 'green';
  interactive?: boolean;
}

export function GlassCard({
  children,
  variant = 'standard',
  accentColor = 'gold',
  interactive = true
}: GlassCardProps) {
  const Component = interactive ? motion.div : 'div';

  return (
    <Component
      className={`glass-${variant}`}
      {...(interactive && {
        whileHover: { scale: 1.02, y: -4 },
        whileTap: { scale: 0.98 },
        transition: springs.snappy,
      })}
    >
      {children}
    </Component>
  );
}
```

### 10.5 Button System

```scss
// ─── Ultra Modern Button Variants ───

.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-size: var(--fs-sm);
  letter-spacing: var(--ls-wide);
  text-transform: uppercase;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  // Shimmer effect на hover
  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 30%,
      oklch(1 0 0 / 0.05) 50%,
      transparent 70%
    );
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover::after {
    transform: translateX(100%);
  }
}

// Primary — Gold
.btn-primary {
  background: linear-gradient(135deg, var(--c-gold), oklch(0.62 0.15 75));
  color: oklch(0.1 0 0);
  box-shadow: 0 4px 20px oklch(0.72 0.15 75 / 0.3);

  &:hover {
    box-shadow: 0 8px 30px oklch(0.72 0.15 75 / 0.5);
    transform: translateY(-2px);
  }
}

// Secondary — Glass
.btn-secondary {
  background: var(--surface-glass);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-default);
  color: var(--c-text);

  &:hover {
    border-color: var(--c-gold);
    box-shadow: 0 0 20px oklch(0.72 0.15 75 / 0.1);
  }
}

// Ghost — Minimal
.btn-ghost {
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--c-text-muted);

  &:hover {
    color: var(--c-text);
    border-color: var(--border-default);
    background: oklch(1 0 0 / 0.03);
  }
}

// Neon — Web3 accent
.btn-neon {
  background: transparent;
  border: 1px solid var(--c-neon-green);
  color: var(--c-neon-green);
  box-shadow:
    0 0 10px oklch(0.80 0.22 145 / 0.2),
    inset 0 0 10px oklch(0.80 0.22 145 / 0.1);

  &:hover {
    background: oklch(0.80 0.22 145 / 0.1);
    box-shadow:
      0 0 20px oklch(0.80 0.22 145 / 0.4),
      inset 0 0 20px oklch(0.80 0.22 145 / 0.2);
  }
}
```

---

## 11. ПРОИЗВОДИТЕЛЬНОСТЬ И ОПТИМИЗАЦИЯ

### 11.1 Loading Strategy

```
┌─────────────────────────────────────────────────────────┐
│                  LOADING PRIORITY                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ CRITICAL (blocking):                                    │
│   ├── Layout shell (HTML + CSS variables)               │
│   ├── Fonts (Montserrat woff2, preload)                 │
│   └── Above-the-fold CSS                                │
│                                                         │
│ HIGH (async, early):                                    │
│   ├── Navbar + Header components                        │
│   ├── Hero content                                      │
│   └── Global enhanced styles                            │
│                                                         │
│ MEDIUM (lazy, viewport-triggered):                      │
│   ├── 3D Canvas (React.lazy + Suspense)                 │
│   ├── Below-fold sections                               │
│   └── Ecosystem3D visualization                         │
│                                                         │
│ LOW (idle, deferred):                                   │
│   ├── Post-processing effects                           │
│   ├── Analytics                                         │
│   └── Service worker                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 11.2 CSS Performance

```scss
// ─── GPU-accelerated анимации ───
// Анимировать ТОЛЬКО transform и opacity
// Всё остальное — CPU и перерисовка

// ✅ Правильно
.animate-gpu {
  will-change: transform, opacity;
  transform: translate3d(0, 0, 0);  // GPU layer hint
}

// ❌ Неправильно — вызывает layout thrashing
.animate-bad {
  transition: width 0.3s, height 0.3s, padding 0.3s;
}

// ─── Content Visibility для off-screen секций ───
.section-below-fold {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;  // Estimated height
}
```

### 11.3 3D Performance Budget

```
┌──────────────────────────────────────────────┐
│         3D PERFORMANCE BUDGET                │
├──────────────────────────────────────────────┤
│                                              │
│ Target: 60fps на mid-range mobile            │
│                                              │
│ Draw calls:     < 100 для фона              │
│                 < 500 для визуализаций       │
│ Triangles:      < 50K для фона              │
│                 < 200K для визуализаций      │
│ Texture memory: < 32MB total                 │
│ Shader passes:  < 3 для post-processing     │
│ Canvas DPR:     [1, 1.5] (не devicePixelRatio)│
│                                              │
│ Measurement:                                 │
│   R3F: <Stats /> для FPS мониторинга        │
│   Chrome DevTools → Performance tab          │
│   Spector.js для WebGL debugging             │
│                                              │
└──────────────────────────────────────────────┘
```

### 11.4 Image Optimization

```tsx
// Использовать next/image с OptimizedImage wrapper
// Форматы: AVIF → WebP → JPEG (fallback chain)

<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority  // Только для above-the-fold
  sizes="100vw"
  quality={85}
/>
```

---

## 12. GAP-АНАЛИЗ: ТЕКУЩИЙ ПРОЕКТ VS СПЕЦИФИКАЦИЯ

### 12.1 Результаты аудита (Февраль 2026)

| Область | Текущее состояние | Целевое состояние | Приоритет |
|---------|-------------------|-------------------|-----------|
| **Цвета** | HEX/RGBA (`#d49d32`, `rgba(7,43,64,0.25)`) | OKLCH + fallback (`oklch(0.72 0.15 75)`) | HIGH |
| **Glass эффекты** | Glass 2.0 (blur+saturate) в `global-enhanced.scss` | Glass 3.0 (liquid+noise+chromatic) | MEDIUM |
| **Fluid Typography** | `clamp()` уже есть, но простая шкала | Модульная шкала 1.25 ratio с line-height/letter-spacing | MEDIUM |
| **Navbar indicator** | `layoutId="bow"` работает, но `top: -36px` (далеко от навбара) | Indicator сразу над текстом, `top: -2px` | HIGH |
| **Navbar hover** | Весь навбар `translateY(-8px)` при hover (нестабильно) | Hover только на item-ах, навбар стабилен | HIGH |
| **Header DApp** | `margin-left: auto` уже есть на `btnGroup` | Работает корректно | OK |
| **3D Background** | `GlobalAnimatedBackground` (2D gradient) | R3F Canvas с particles + Bloom | LOW |
| **CursorGlow** | Отсутствует | Ambient radial-gradient за курсором | LOW |
| **Container Queries** | Не используются | Для карточек и grid-компонентов | LOW |
| **Scroll-driven CSS** | Не используются | `animation-timeline: view()` для reveal | LOW |
| **Accessibility** | `prefers-reduced-motion` есть в global | Проверить во всех компонентах | MEDIUM |
| **`!important` abuse** | 20+ `!important` в Navbar SCSS | Убрать, исправить специфичность | HIGH |
| **`will-change` scope** | На `.indicator` (корректно) | Убирать после анимации (best practice) | LOW |

### 12.2 Критические проблемы в текущем коде

**1. `!important` overflow в `Navbar-Enhanced.module.scss`:**
```scss
// ПРОБЛЕМА: 20+ !important — признак сломанной каскадности
.gradientLine {
    position: absolute !important;
    background: ... !important;
    height: 2px !important;
    width: 100% !important;
    top: -3px !important;
    // ... ещё 5 !important
}
```
**Решение:** Убрать все `!important`, исправить специфичность через правильную вложенность селекторов.

**2. Навбар уезжает при hover:**
```scss
// ПРОБЛЕМА: весь навбар прыгает вверх
&:hover {
    transform: translateY(-8px); // Нестабильно, мешает навигации
}
```
**Решение:** Убрать `translateY` с контейнера, оставить только subtle эффекты на item-ах.

**3. Indicator далеко от текста:**
```scss
// ПРОБЛЕМА: indicator на -36px от текста — слишком далеко
.indicator {
    top: -36px !important;
}
```
**Решение:** Перенести indicator ближе к тексту (`top: -4px`), привязать к gradient line.

**4. Двойной box-shadow в hover:**
```scss
// ПРОБЛЕМА: box-shadow объявлен дважды в &:hover
&:hover {
    box-shadow: var(--shadow-medium);    // ← перезаписан ниже
    box-shadow:                           // ← это остаётся
        0 12px 40px rgba(0, 0, 0, 0.25),
        ...
}
```
**Решение:** Одно объявление `box-shadow`.

**5. Header layout нестабилен:**
```tsx
// ПРОБЛЕМА: motion.div с width/height 100% ломает flex layout
<motion.div style={{ width: '100%', height: '100%' }}>
```
**Решение:** Использовать `display: contents` или убрать wrapper `motion.div`.

### 12.3 Что уже соответствует спецификации

- `layoutId="bow"` — фирменная анимация сохранена
- Spring-анимации с правильными stiffness/damping значениями
- Stagger animations для navbar items
- `prefers-reduced-motion` в глобальных стилях
- Fluid spacing через `clamp()`
- Glassmorphism 2.0 базовые токены (blur, bg, border)
- Focus-visible accessibility стили
- High DPI оптимизации
- Print media queries

---

## 13. ИМПЛЕМЕНТАЦИЯ ДЛЯ DSP ПРОЕКТА

### 12.1 Файловая структура обновлений

```
src/
├── app/
│   ├── styles/
│   │   ├── global.scss                    # Базовые переменные (обновить на OKLCH)
│   │   ├── global-enhanced.scss           # ★ ОБНОВИТЬ: Glass 3.0, новые токены
│   │   ├── global-responsive.scss         # ★ ДОБАВИТЬ: container queries
│   │   ├── global-evolution.scss          # Можно объединить с enhanced
│   │   └── reset.scss                     # Без изменений
│   └── layout.tsx                         # ★ ДОБАВИТЬ: CursorGlow, обновить BG
│
├── shared/
│   └── ui/
│       ├── AnimatedBackground3D/          # ★ НОВЫЙ: 3D фон с particles
│       ├── CursorGlow/                    # ★ НОВЫЙ: Ambient cursor glow
│       ├── GlassCard/                     # ★ НОВЫЙ: Универсальная glass-карточка
│       ├── Ecosystem3D/                   # ★ ОБНОВИТЬ: Bloom, shaders
│       └── ParticleSystem/               # ★ ОБНОВИТЬ: GPU particles
│
├── widgets/
│   ├── Navbar/
│   │   └── ui/
│   │       ├── Navbar/
│   │       │   ├── Navbar-Enhanced.tsx     # ★ ОБНОВИТЬ: Glass 3.0, OKLCH
│   │       │   └── Navbar-Enhanced.module.scss # ★ ОБНОВИТЬ: Новые стили
│   │       ├── NavbarMobile/              # ★ ОБНОВИТЬ: Glass mobile
│   │       └── NavbarTablet/              # ★ ОБНОВИТЬ: Glass tablet
│   ├── Header/
│   │   ├── Header-Enhanced.tsx            # ★ ОБНОВИТЬ: Scroll-aware, DApp кнопка
│   │   └── Header-Enhanced.module.scss    # ★ ОБНОВИТЬ: Glass 3.0
│   └── Ecosystem3DVisualization/          # ★ ОБНОВИТЬ: PostProcessing
│
└── types/
    └── react-three-fiber.d.ts             # Без изменений (уже настроен)
```

### 12.2 Порядок внедрения

```
ФАЗА 1: Фундамент (1-2 дня)
├── Обновить global-enhanced.scss → OKLCH цвета + Glass 3.0 tokens
├── Обновить CSS custom properties
├── Добавить fluid typography scale
└── Проверить совместимость

ФАЗА 2: Компоненты (2-3 дня)
├── Обновить NavbarEnhanced → Glass 3.0 + улучшенные анимации
├── Обновить Header → scroll-aware + DApp кнопка вправо
├── Создать GlassCard компонент
├── Обновить Button система
└── Обновить Footer

ФАЗА 3: 3D и Immersive (2-3 дня)
├── Создать AnimatedBackground3D
├── Обновить Ecosystem3D → PostProcessing + Bloom
├── Добавить CursorGlow
├── Настроить scroll-driven 3D
└── Оптимизировать performance

ФАЗА 4: Polish и Accessibility (1-2 дня)
├── prefers-reduced-motion для всех анимаций
├── WCAG AAA contrast checks
├── Тестирование на всех breakpoints
├── Performance audit (Lighthouse 95+)
└── Cross-browser testing
```

### 12.3 Зависимости для обновления/добавления

```json
// Уже установлены:
// ✅ three: 0.159.0
// ✅ @react-three/fiber: 8.15.0
// ✅ @react-three/drei: 9.88.0
// ✅ framer-motion: 12.23.24
// ✅ sass: 1.63.6+

// Рекомендуется добавить:
{
  "@react-three/postprocessing": "^2.16.0",  // Bloom, ChromaticAberration
  "maath": "^0.10.0",                        // Math helpers для R3F
  "leva": "^0.9.0"                           // Dev: GUI для настройки 3D параметров
}
```

---

## 14. BROWSER SUPPORT И FALLBACKS

### 14.1 OKLCH Fallback Strategy

```scss
// OKLCH поддерживается в Chrome 111+, Safari 15.4+, Firefox 113+
// Для старых браузеров используем @supports с HEX fallback

:root {
  // Fallback (HEX)
  --c-gold: #d49d32;
  --c-cyan: #42b8f3;
  --c-bg-deep: #001019;
  --c-bg-surface: #072b40;
}

@supports (color: oklch(0 0 0)) {
  :root {
    --c-gold: oklch(0.72 0.15 75);
    --c-cyan: oklch(0.75 0.14 220);
    --c-bg-deep: oklch(0.08 0.03 220);
    --c-bg-surface: oklch(0.18 0.05 215);
  }
}
```

### 14.2 Relative Color Syntax Support

```scss
// oklch(from ...) поддерживается в Chrome 119+, Safari 18+
// Firefox: behind flag as of Feb 2026
// РЕШЕНИЕ: не использовать в production CSS, применять через JS/SCSS functions

// ❌ Не использовать в global CSS:
// --c-gold-hover: oklch(from var(--c-gold) calc(l + 0.1) c h);

// ✅ Использовать SCSS mixin:
@function oklch-lighten($color, $amount) {
  @return color-mix(in oklch, $color, white #{$amount});
}
```

### 14.3 Scroll-Driven Animations Support

```scss
// animation-timeline: Chrome 115+, Safari 26+ (mid 2025)
// Firefox: behind flag
// РЕШЕНИЕ: progressive enhancement

.reveal-on-scroll {
  // Fallback: элемент просто видим
  opacity: 1;
  transform: none;

  // Enhancement: scroll-driven если поддерживается
  @supports (animation-timeline: view()) {
    animation: reveal linear;
    animation-timeline: view();
    animation-range: entry 0% entry 100%;
  }
}
```

### 14.4 Container Queries Support

```scss
// container-type: Chrome 105+, Safari 16+, Firefox 110+
// Широкая поддержка — можно использовать без fallback

.card-container {
  container-type: inline-size;
}
```

### 14.5 Backdrop Filter Support

```scss
// backdrop-filter: Chrome 76+, Safari 9+ (с -webkit-), Firefox 103+
// Safari требует -webkit- префикс

.glass {
  -webkit-backdrop-filter: blur(25px) saturate(1.4);
  backdrop-filter: blur(25px) saturate(1.4);

  // Fallback для очень старых браузеров
  @supports not (backdrop-filter: blur(1px)) {
    background: rgba(7, 43, 64, 0.85); // Более плотный фон без blur
  }
}
```

---

## 15. ЧЕКЛИСТ ВНЕДРЕНИЯ

### Дизайн-система

- [ ] OKLCH цветовая палитра определена в CSS custom properties
- [ ] Семантические токены (primary, secondary, surface, border)
- [ ] `color-mix()` для динамических состояний
- [ ] Fluid typography шкала с `clamp()`
- [ ] Variable fonts подключены и оптимизированы

### Glassmorphism 3.0

- [ ] 4 уровня glass-эффектов (subtle → liquid)
- [ ] Noise texture overlay
- [ ] Chromatic line decoration
- [ ] Animated shimmer effect
- [ ] Правильные z-index слои

### 3D Web

- [ ] AnimatedBackground3D с particles + stars
- [ ] Ecosystem3D с PostProcessing (Bloom)
- [ ] Lazy loading для всех 3D компонентов
- [ ] DPR cap at [1, 1.5]
- [ ] Performance budget соблюдён (< 100 draw calls для фона)
- [ ] Dispose geometries при unmount

### Motion Design

- [ ] Spring-based анимации (5 пресетов)
- [ ] `layoutId="bow"` для navbar indicator
- [ ] Stagger animations для списков
- [ ] Scroll-driven parallax
- [ ] AnimatePresence для page transitions
- [ ] Gesture interactions (whileHover, whileTap)

### CSS 2026

- [ ] Container queries для карточек
- [ ] Scroll-driven animations (CSS-only reveal)
- [ ] `@starting-style` для enter-анимаций
- [ ] Нативный CSS nesting
- [ ] `view-transition-name` для навбара

### Web3 UI

- [ ] DApp кнопка прижата вправо (`margin-left: auto`)
- [ ] Wallet connection модалка в glass-premium
- [ ] Transaction state индикаторы (pending/success/error)
- [ ] Bento grid для dashboard метрик
- [ ] Animated number counters

### Accessibility

- [ ] `prefers-reduced-motion` для всех анимаций
- [ ] WCAG AAA контрасты для текста
- [ ] Keyboard navigation для всех интерактивных элементов
- [ ] ARIA labels для 3D визуализаций
- [ ] Focus ring стилизация
- [ ] Skip navigation link

### Performance

- [ ] Lighthouse Performance: 95+
- [ ] 3D canvas: 60fps на mid-range devices
- [ ] `content-visibility: auto` для below-fold секций
- [ ] GPU-only анимации (transform + opacity)
- [ ] Image optimization (AVIF/WebP)
- [ ] Font preload для critical fonts
- [ ] Code splitting для 3D компонентов

---

## ПРИЛОЖЕНИЕ А: Быстрый справочник OKLCH

```
OKLCH(L C H / A)

L = Lightness [0..1]     0 = чёрный, 1 = белый
C = Chroma [0..0.4]      0 = серый, 0.4 = максимальная насыщенность
H = Hue [0..360]         0/360 = красный, 120 = зелёный, 240 = синий
A = Alpha [0..1]         прозрачность

Примеры:
oklch(0.72 0.15 75)      = DSP Gold (#d49d32)
oklch(0.75 0.14 220)     = DSP Cyan (#42b8f3)
oklch(0.08 0.03 220)     = DSP Deep BG (#001019)
oklch(0.90 0.01 220)     = DSP Text (#e1e1e1)
```

## ПРИЛОЖЕНИЕ Б: Spring Physics Cheat Sheet

```
Spring = { stiffness, damping, mass }

stiffness ↑  = быстрее, жёстче
damping ↑    = меньше пружинения
mass ↑       = медленнее, инертнее

Критическое демпфирование = 2 × √(stiffness × mass)
  → damping < critical = пружинит
  → damping = critical = плавно останавливается
  → damping > critical = медленно останавливается

DSP Presets:
snappy:  { s: 500, d: 30, m: 1 }   → критический (быстро, без пружинения)
smooth:  { s: 300, d: 25, m: 1 }   → слегка пружинит
gentle:  { s: 150, d: 20, m: 1.5 } → медленный, инертный
bouncy:  { s: 400, d: 15, m: 0.8 } → заметное пружинение
layout:  { s: 350, d: 30, m: 1 }   → стабильный для layout transitions
```

## ПРИЛОЖЕНИЕ В: Источники исследования

### UI/UX Design Trends 2025-2026
- Digital Upward — 2026 Web Design Trends
- Figma Resource Library — Web Design Trends
- TheeDigital — 20 Top Web Design Trends 2026
- Medium/Design Bootcamp — Glassmorphism and Liquid Design 2026

### 3D Web / Three.js
- Maxime Heckel — Particles with R3F and Shaders
- Maxime Heckel — Study of Shaders with R3F
- Maxime Heckel — TSL and WebGPU Guide
- Codrops — 3D Product Grid with R3F

### CSS 2026
- Riad Kilani — 2026 CSS Features You Must Know
- WebKit — Interop 2026
- Nick Paolini — Modern CSS Toolkit 2026
- Smashing Magazine — CSS Scroll-Driven Animations

### Motion Design
- Maxime Heckel — Advanced Animation Patterns with Framer Motion
- Maxime Heckel — Physics Behind Spring Animations
- Motion.dev documentation
- Magic UI — Guide to Framer Motion

### Web3 Design
- Webstacks — 30 Best Web 3.0 Design Examples
- Merge Rocks — 10 Web3 Design Trends 2025
- KOL HQ — Crypto Design Agency 2025

### Color Systems
- Evil Martians — OKLCH in CSS
- Evil Martians — Dynamic Themes in Tailwind with OKLCH
- LogRocket — OKLCH Consistent Accessible Palettes

### Performance
- Lexo — CSS GPU Acceleration Guide
- PixelFreeStudio — WebGL Performance Optimization

### Immersive Experiences
- Codrops — Cinematic 3D Scroll Experiences with GSAP
- Frontend Masters — Virtual Scroll-Driven 3D Scenes

---

**Документ подготовлен на основе глубинного исследования трендов и технологий 2025-2026.**
**Специально для проекта Gybernaty DSP — Decentralized Social Platform.**
