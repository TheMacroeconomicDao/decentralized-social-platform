# Gybernaty DSP — Decentralized Social Platform

> **Версия платформы:** 0.1.0
> **Стек:** Next.js 16 · React 19 · TypeScript 5 · Three.js · Framer Motion 12
> **Архитектура:** Feature-Sliced Design
> **Инфраструктура:** Docker · k3s · Istio · GitHub Actions
> **Production:** [gyber.org](https://gyber.org) · **Stage:** [stage.dsp.build.infra.gyber.org](https://stage.dsp.build.infra.gyber.org)

---

## Содержание

1. [Концепция и миссия](#1-концепция-и-миссия)
2. [Архитектура фронтенда](#2-архитектура-фронтенда)
3. [Дизайн-система и UI](#3-дизайн-система-и-ui)
4. [Web3-интеграция и AI](#4-web3-интеграция-и-ai)
5. [Инфраструктура и CI/CD](#5-инфраструктура-и-cicd)

---

## 1. Концепция и миссия

### 1.1 Что такое Gybernaty DSP

**Gybernaty DSP (Decentralized Social Platform)** — это децентрализованная социальная платформа для объединения исследователей, разработчиков и энтузиастов в сфере Web3, блокчейна, распределённых вычислений и искусственного интеллекта.

Проект выступает цифровым домом **Gybernaty Community** — сообщества, строящего инфраструктуру децентрализованной экономики знаний. Платформа не является очередной социальной сетью: это инструмент координации, публикации исследований и взаимодействия внутри экосистемы децентрализованных проектов.

### 1.2 Основные принципы

| Принцип | Описание |
|---------|----------|
| **Децентрализация** | Данные хранятся через IPFS/Helia, без единой точки отказа |
| **Open Source** | Весь код открыт, MIT-лицензия |
| **Web3-нативность** | Авторизация через криптокошелёк, GBR-токен как базовый актив |
| **Privacy-first** | Минимальный сбор данных, никакой рекламной модели |
| **AI-augmented** | Встроенный AI-ассистент с доменными знаниями о сообществе |

### 1.3 Экосистема проектов

DSP является частью более широкой экосистемы **Gybernaty**:

- **DSP** — социальная платформа (данный репозиторий)
- **LQD** — проект ликвидности
- **SAPP** — децентрализованное приложение
- **PowerSwapMeta** — DEX / своп-инфраструктура
- **GBR Token** — нативный токен экосистемы (`0xa970cae9fa1d7cca913b7c19df45bf33d55384a9`)

Все проекты связаны единым токеном и общей идентичностью бренда «Gybernaty», выраженной в дизайн-системе **Cyber Evolution 2025–2026**.

### 1.4 Страницы и разделы платформы

Текущая структура публичных страниц (`src/app/`):

```
/                  — главная, hero + экосистема + AI-chat
/aic               — AI Community / интеллектуальный центр
/ecosystem-status  — статус компонентов экосистемы в реальном времени
/events            — события, митапы, хакатоны
/experiment        — экспериментальные фичи и R&D
/offering          — предложения и возможности для участников
/platform          — обзор технической платформы
/unit-dashboard    — дашборд участника
/unit-profile      — профиль участника (Unit)
/ultra-demo        — демо дизайн-системы Ultra Modern
```

---

## 2. Архитектура фронтенда

### 2.1 Feature-Sliced Design

Проект строится строго по методологии **Feature-Sliced Design (FSD)** — архитектурному паттерну для масштабируемых фронтенд-приложений. Слои изолированы и имеют направленные зависимости: нижние слои не знают о верхних.

```
src/
├── app/          # Next.js App Router: страницы, лэйауты, провайдеры
├── widgets/      # Крупные самодостаточные UI-блоки (Navbar, Footer, Chat…)
├── features/     # Бизнес-фичи с собственной логикой (WalletAuth, UnitProfile…)
├── entities/     # Бизнес-сущности (ProjectCard, EventCard, UserProfile…)
├── shared/       # Переиспользуемое: ui/, hooks/, lib/, config/, constants/
└── types/        # Глобальные TypeScript-типы
```

#### Слой `widgets/`

| Виджет | Описание |
|--------|----------|
| `Navbar` | Топ-навигация с glassmorphism-эффектом и Web3-авторизацией |
| `Chat` | AI-ассистент: draggable на десктопе, full-screen на мобайле |
| `Header` | Hero-секция с 3D-фоном и анимированными иконками |
| `Ecosystem3DVisualization` | Three.js визуализация связей экосистемы |
| `EcosystemStatusHero` | Статус компонентов в реальном времени |
| `MetricsDashboard` | Метрики платформы |
| `SocialPlatformRoadmap` | Дорожная карта развития |
| `TechnicalRoadmapSection` | Технический роадмап |
| `Team` | Команда и участники |
| `Slider` | Медиа-слайдер с transitions |
| `Footer` | Подвал со ссылками на экосистему |

#### Слой `features/`

- **`WalletAuth`** — авторизация через RainbowKit + wagmi (EVM-кошельки)
- **`UnitProfile`** — управление профилем участника (Unit)

### 2.2 Технологический стек

```
Ядро:
  Next.js 16           — App Router, SSR/SSG/ISR, server components
  React 19             — concurrent features, transitions
  TypeScript 5.9       — strict mode

3D и анимации:
  Three.js 0.159       — 3D-рендеринг
  @react-three/fiber   — React-биндинги для Three.js
  @react-three/drei    — helpers: OrbitControls, Stars, Sphere…
  Framer Motion 12     — spring-анимации, layout transitions, gestures

Web3:
  wagmi 2              — React-хуки для Ethereum
  viem 2               — низкоуровневый Ethereum-клиент
  RainbowKit 2         — UI для подключения кошельков
  Helia / IPFS         — децентрализованное хранилище данных
  @noble/secp256k1     — криптография (подписи, ключи)

Стилизация:
  SCSS/Sass            — BEM + CSS-переменные + OKLCH-палитра
  CSS Custom Properties — дизайн-токены

Прочее:
  react-markdown + remark-gfm — рендеринг Markdown в чате
  rehype-highlight             — подсветка кода
  react-responsive             — хуки для брейкпоинтов
  @tanstack/react-query        — серверное состояние и кеширование
```

### 2.3 Responsive-система

Единая система брейкпоинтов без «магических» чисел:

| Зона | Диапазон | Особенности |
|------|----------|-------------|
| Mobile | ≤ 480px | Full-screen chat, ≤3 анимированных иконки, упрощённый 3D |
| Tablet | 481–767px | Гибридный режим, padding-адаптация |
| Desktop | 768–1440px | Draggable chat (350×400 → 800×900px), 15+ иконок |
| Large | > 1440px | Максимальная производительность, расширенные эффекты |

---

## 3. Дизайн-система и UI

### 3.1 Cyber Evolution 2025–2026

Визуальная идентичность DSP строится на концепции **Cyber Evolution** — пересечении космической глубины, технологической прозрачности и живой энергии.

**Три визуальных слоя:**

```
┌──────────────────────────────────────────────┐
│  КОСМИЧЕСКИЙ ТЁМНЫЙ ФОН  (#001019 → #072b40) │
│  ┌──────────────────────────────────────────┐ │
│  │  3D PARTICLE FIELD / Three.js Canvas     │ │
│  │  ┌────────────────────────────────────┐  │ │
│  │  │ GLASSMORPHISM CARD                 │  │ │
│  │  │ blur(24px) · rgba(255,255,255,0.04)│  │ │
│  │  │  ══ GOLDEN ACCENT LINE ══          │  │ │
│  │  │  Контент · Типографика · Actions   │  │ │
│  │  └────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

### 3.2 Цветовая система OKLCH

Проект использует **OKLCH** — перцептуально равномерное цветовое пространство, стандарт 2025–2026. В отличие от HSL, одинаковые числовые изменения дают одинаковые визуальные изменения яркости.

```css
/* Базовые цвета */
--color-bg-deep:      oklch(8% 0.02 220);     /* #001019 — космос */
--color-bg-mid:       oklch(15% 0.04 220);    /* #072b40 — глубина */
--color-accent-gold:  oklch(72% 0.12 75);     /* #d49d32 — золото */
--color-accent-cyan:  oklch(74% 0.14 210);    /* #42b8f3 — энергия */
--color-accent-neo:   oklch(65% 0.28 155);    /* #00ff88 — неон */
--color-text-primary: oklch(92% 0.01 220);    /* #e8f4f8 — текст */
```

### 3.3 Glassmorphism 3.0

Стеклянные компоненты реализованы через три уровня интенсивности:

| Уровень | backdrop-filter | background | border |
|---------|----------------|------------|--------|
| Subtle | blur(8px) | rgba(255,255,255,0.02) | rgba(255,255,255,0.06) |
| Medium | blur(16px) | rgba(255,255,255,0.04) | rgba(255,255,255,0.10) |
| Strong | blur(32px) | rgba(255,255,255,0.08) | rgba(255,255,255,0.16) |

### 3.4 Система анимированных иконок

20+ иконок криптовалют и технологий плавают по всем страницам в качестве фоновых элементов.

**Криптовалюты:** Bitcoin, Ethereum, Cardano, Solana, Polygon, Polkadot, Litecoin, BNB, NEAR, Ethereum Classic, Toncoin, Tron, Internet Computer

**Технологии:** React, Node.js, Next.js, Python, Flutter, Rust, Go

Производительность адаптирована: на мобайле максимум 3 иконки, на десктопе 15+. Новые иконки генерируются каждые 3 секунды через `requestAnimationFrame`.

### 3.5 AI Chat — визуальный компонент

Чат является самостоятельным UI-продуктом внутри платформы:

- **Desktop:** Draggable и resizable окно с 8 хэндлами, ограниченное вьюпортом
- **Mobile:** Full-screen overlay с нативным UX
- **AiIcon:** SVG-аватар в header (circuit-board дизайн)
- **AgentIcon:** SVG-аватар сообщений ассистента (robot дизайн)
- **Markdown-рендеринг:** Поддержка GFM + подсветка кода в ответах

---

## 4. Web3-интеграция и AI

### 4.1 Авторизация через кошелёк

Авторизация реализована через стек **wagmi v2 + viem v2 + RainbowKit v2** — стандарт для EVM dApps в 2025–2026.

```
RainbowKit UI → wagmi hooks → viem → Ethereum RPC
     │
     └── Поддерживаемые кошельки:
         MetaMask · Coinbase Wallet · WalletConnect · Rainbow
         Injected (любой EVM-совместимый)
```

После подключения кошелька пользователь получает статус **Unit** — участника экосистемы. Адрес кошелька является его идентификатором без необходимости email/пароля.

### 4.2 IPFS / Helia — децентрализованное хранилище

Данные платформы хранятся в **IPFS** через библиотеку **Helia** (новое поколение js-ipfs):

```
@helia/http     — HTTP-транспорт для Helia-ноды
@helia/json     — хранение JSON-объектов в IPFS
@helia/unixfs   — файловая система поверх IPFS
```

Это позволяет публиковать исследования и артефакты в децентрализованной сети с неизменяемыми CID-адресами.

### 4.3 GBR Token

Нативный токен экосистемы:
- **Адрес:** `0xa970cae9fa1d7cca913b7c19df45bf33d55384a9`
- **Сеть:** EVM-compatible (Ethereum / L2)
- **Роль:** Governance, доступ к закрытым разделам, стейкинг

### 4.4 AI Assistant — Gybernaty AI

Встроенный AI-ассистент работает через **Puter.js** с моделью **Claude Sonnet**.

**Характеристики:**
- Отвечает на языке пользователя (русский / английский)
- Знает проекты экосистемы: DSP, LQD, SAPP, PowerSwapMeta, GBR
- Системный промпт формирует личность с экспертизой в Web3/blockchain
- История чата сохраняется в сессии
- Auto-scroll к последнему сообщению
- Retry-логика при ошибках сети

**Техническая реализация:**

```typescript
// Оптимизированное управление состоянием
// - batch updates для React 19
// - requestAnimationFrame для drag/resize операций
// - 60fps smooth scroll
// - boundary constraints: нельзя вытащить за пределы вьюпорта
```

### 4.5 Криптографические примитивы

Встроенные low-level криптопримитивы через `@noble`:

- **`@noble/secp256k1`** — ECDSA подписи (Ethereum-совместимые)
- **`@noble/hashes`** — keccak256, SHA-256 и другие хэш-функции
- **`crypto-js`** — симметричное шифрование для хранения данных

---

## 5. Инфраструктура и CI/CD

### 5.1 Контейнеризация

Приложение упаковано в **multi-stage Docker образ** для минимального размера production-контейнера:

```dockerfile
# Stage 1: deps     — установка зависимостей
# Stage 2: builder  — сборка Next.js (NODE_OPTIONS=--max-old-space-size=3072)
# Stage 3: runner   — минимальный production-образ (node:20-alpine)
```

Образы публикуются в **GitHub Container Registry (GHCR)**:
- Stage: `ghcr.io/[org]/dsp-stage:stage-<sha>`
- Prod: `ghcr.io/[org]/dsp-prod:main-<sha>`

### 5.2 Kubernetes — k3s кластер

Деплой на **k3s** (lightweight Kubernetes) с kustomize-оверлеями:

```
k8s/
├── cluster/          # ClusterIssuer (cert-manager), Istio TLS Cert
├── addons/           # CronJobs: cleanup-old-rs, cert-monitor
└── overlays/
    ├── stage/        # Traefik Ingress + Deployment/Service
    └── prod/         # Istio Gateway + VirtualService + Canary + Deployment
```

**Применение:**
```bash
kubectl apply -k k8s/overlays/stage   # stage-окружение
kubectl apply -k k8s/overlays/prod    # production
```

### 5.3 Сетевой слой

| Окружение | Ingress | TLS |
|-----------|---------|-----|
| Stage | Traefik | cert-manager / Let's Encrypt |
| Production | Istio Gateway + VirtualService | cert-manager / Let's Encrypt |

**Canary-релизы в production** управляются **Flagger**:
- Постепенный сдвиг трафика: 10% → 50% → 100%
- Автоматический rollback при: success rate < 99% или p99 latency > 500ms
- Максимальное время промоции: 30 минут

### 5.4 CI/CD — GitHub Actions

Два основных pipeline, реализованных через reusable workflows:

#### `_build-image.yml` — сборка образа
1. Checkout кода
2. Docker build с layer-кешированием (GitHub Actions Cache)
3. Push в GHCR с тегами `<sha>` и `latest`
4. Верификация тега через `skopeo`

#### `_deploy.yml` — деплой
1. `kubectl apply -k k8s/overlays/<env>`
2. `kubectl set image deployment/dsp app=<new-image>`
3. `kubectl rollout status` — ожидание готовности
4. (prod only) Ожидание Flagger-промоции
5. Telegram-уведомление о результате

#### Stage CD (автоматический)
```
push → stage branch
  → build dsp-stage:<sha>
  → deploy k8s/overlays/stage
  → Telegram notify
```

#### Prod CD (с ручным апрувом)
```
push → main branch
  → GitHub Environment Approval ← требует подтверждения
  → build dsp-prod:<sha>
  → deploy k8s/overlays/prod
  → Flagger canary promotion
  → Telegram notify
```

### 5.5 Secrets

```
GHCR_USERNAME          # ghcr.io пользователь/орг
GHCR_TOKEN             # PAT (packages:write)
KUBE_CONFIG            # base64 kubeconfig
TELEGRAM_BOT_TOKEN     # Telegram bot API token
TELEGRAM_CHAT_ID       # ID чата для уведомлений
```

### 5.6 GitLab CI (альтернативный пайплайн)

Дополнительно в репозитории присутствует `.gitlab-ci.yml` для деплоя через GitLab CI/CD — параллельная инфраструктура для сред, где используется GitLab.

### 5.7 Скрипты

```
scripts/
├── cleanup-build.sh          # Очистка .next/, node_modules/.cache
├── push-and-deploy-image.sh  # Ручная сборка + push + деплой образа
└── quick-deploy.sh           # Быстрый деплой без полной пересборки
```

### 5.8 Мониторинг и наблюдаемость

- **Telegram-уведомления** на каждый CI/CD event (success / failure)
- **Flagger metrics** — автоматический rollback по SLO
- **cert-monitor CronJob** — слежение за сроком действия TLS-сертификатов
- **cleanup-old-rs CronJob** — автоматическая очистка старых ReplicaSet

---

## Итоговая схема системы

```
┌─────────────────────────────────────────────────────────────┐
│                     DEVELOPER                               │
│  git push → main/stage                                      │
└──────────────────────┬──────────────────────────────────────┘
                       │ GitHub Actions
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  CI/CD PIPELINE                                             │
│  ┌──────────────┐    ┌──────────────────────────────────┐   │
│  │ _build-image │ →  │ _deploy                          │   │
│  │ Docker Build │    │ kubectl apply + rollout status   │   │
│  │ Push → GHCR  │    │ (prod: + Flagger canary)         │   │
│  └──────────────┘    └──────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  k3s CLUSTER                                                │
│                                                             │
│  stage:  Traefik → dsp-stage pod (Next.js)                 │
│  prod:   Istio GW → VirtualService → Flagger Canary        │
│           ├── dsp-primary (стабильная версия)              │
│           └── dsp-canary  (новая версия, +10%→50%→100%)    │
│                                                             │
│  cert-manager → Let's Encrypt TLS                          │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  BROWSER / CLIENT                                           │
│                                                             │
│  Next.js App (React 19 + TypeScript)                        │
│  ├── 3D визуализация (Three.js + R3F)                       │
│  ├── Web3 (wagmi + viem + RainbowKit)                       │
│  ├── IPFS (Helia)                                           │
│  ├── AI Chat (Puter.js → Claude Sonnet)                     │
│  └── Animations (Framer Motion 12)                          │
└─────────────────────────────────────────────────────────────┘
```

---

*Лицензия: MIT — Gybernaty Community*
