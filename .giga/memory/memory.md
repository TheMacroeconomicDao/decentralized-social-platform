# Gybernaty DSP - Project Memory

## Project Overview
Decentralized Social Platform (DSP) for progressive technology enthusiasts and developers. Focus on Web3, blockchain, distributed computing, and AI research.

## Tech Stack
- Next.js 15.3.2 (recently updated from 13.4.10)
- TypeScript 5.1.6
- React 18.2.0
- Framer Motion 10.16.1
- SCSS/Sass
- Feature-Sliced Design (FSD) architecture

## Architecture
- FSD structure: app, entities, features, shared, widgets
- Client-side components with "use client" directive
- Responsive design with react-responsive
- Docker support

## Key Components
- **AnimatedIconsBackground**: floating crypto/tech icons
  - ✅ РЕШЕНА hydration mismatch проблема с Math.random()
  - ✅ РЕШЕНА проблема с постоянным перезапуском useEffect
  - ✅ ОБНОВЛЕНЫ ВСЕ ИКОНКИ НА ВЫСОКОКАЧЕСТВЕННЫЕ SVG
  - ✅ СОЗДАНА ОТДЕЛЬНАЯ ПАПКА: все летающие иконки перемещены в `public/images/icons/flying/`
  - **НАЙДЕНА И ИСПРАВЛЕНА ТОЧНАЯ ПРИЧИНА**: дефолтный массив иконок создавался каждый рендер в параметрах функции, что приводило к пересозданию useCallback и перезапуску useEffect
  - **РЕШЕНИЕ**: вынесен DEFAULT_ICONS в константу вне компонента
  - Использует suppressHydrationWarning на контейнере
  - Uses vw/vh units for proper full-screen positioning
  - Continuous icon generation every 3 seconds
  - 20 icons: bitcoin, ethereum, cardano, solana, polygon, polkadot, litecoin, react, nodejs, nextjs, python, flutter, rust, golang, bnb, near, ethereum-classic, toncoin, tron, internet
  - **КАЧЕСТВЕННЫЕ ИКОНКИ ЗАМЕНЕНЫ**: 
    - ✅ Cardano: официальный синий #0033AD
    - ✅ Solana: градиент #9945FF → #14F195
    - ✅ Polygon: фиолетовый #8247E5
    - ✅ Polkadot: розовый #E6007A
    - ✅ Litecoin: серебристый #A6A6A6
    - ✅ Next.js: черный #000000
    - ✅ Rust: официальный #CE422B
    - ✅ Golang: официальный #00ADD8
  - **ОСТАВЛЕНЫ КАЧЕСТВЕННЫЕ**: Bitcoin, Ethereum, Flutter, React, Node.js, Python (уже были хорошего качества)
  - **СТРУКТУРА ПАПОК**: 
    - Криптовалютные иконки: `public/images/icons/flying/crypto/`
    - Технологические иконки: `public/images/icons/flying/tech/`
    - Социальные иконки: `public/images/icons/` (telegram, twitter, discord, github)
  - Icons float from bottom to top with horizontal drift
  - Duration: 15-30 seconds per icon
- CountdownTimer: with progress timer and timer components
- Join buttons: link to Telegram communities
- Roadmap components: social and technical roadmaps
- Navigation: responsive navbar with mobile/tablet variants
- Chat widget: Integration with Puter.js for Claude 3.7 Sonnet AI (с автоматическим принятием согласия)
  - **ДОБАВЛЕН: Системный промпт Gybernaty AI**
    - AI представляется как Gybernaty AI (не Claude)
    - Знает все проекты и философию Gybernaty Community
    - Отвечает на русском языке
    - Ссылается на документацию: https://github.com/GyberExperiment/live-papers/wiki
    - Включает информацию о проектах: DSP, LQD, SAPP, PowerSwapMeta, Contact
    - Community Token (GBR): 0xa970cae9fa1d7cca913b7c19df45bf33d55384a9

## Recent Changes
- Updated all npm dependencies, fixed security vulnerabilities
- Fixed useMediaQuery hook conditional call in AnimatedIconsBackground
- Updated Join button links from `https://t.me/+ahBl6aq1PGtmMTFi` to `https://t.me/HeadsHub`
- Created comprehensive documentation system
- **ПОЛНОСТЬЮ РЕШЕНА: Hydration mismatch проблема в AnimatedIconsBackground**
- **НОВОЕ ИСПРАВЛЕНИЕ: useEffect постоянный перезапуск из-за дефолтного массива параметров**
  - Проблема: `icons = [массив]` в параметрах функции создавался каждый рендер
  - Следствие: useCallback пересоздавался → useEffect перезапускался → анимация не запускалась
  - Решение: DEFAULT_ICONS константа вне компонента
- **ЗАМЕНА ИКОНОК НА КАЧЕСТВЕННЫЕ**: заменены 9 из 15 иконок на высококачественные SVG с официальными цветами брендов
- **ИСПРАВЛЕНА: Hydration mismatch ошибка в layout.tsx** 
  - Проблема: браузерные расширения добавляли атрибуты к html элементу
  - Решение: добавлен suppressHydrationWarning={true} к html элементу в layout.tsx
- **ПОЛНОСТЬЮ РЕШЕНА: Проблема с модальными окнами Puter.js**
  - Обнаружено: Модальное окно появляется только для разработчика при первой регистрации
  - Для обычных пользователей: Puter.js работает автоматически без модалок
  - Решение: Удалены все ненужные обходы и отладочная система
  - Код упрощен до базовой загрузки Puter.js и отправки сообщений
  - Результат: Чистый код, чат работает для всех пользователей

## Telegram Links
- Main Join buttons: `https://t.me/HeadsHub`
- Test page: `https://t.me/GybernatyCommunity`

## Development Notes
- Use "use client" for interactive components
- Follow FSD architecture patterns
- Maintain responsive design
- Performance optimization for animations
- **ВАЖНО: Для избежания hydration mismatch использовать:**
  - suppressHydrationWarning для анимационных контейнеров
  - Math.random() только в useEffect
- **ВАЖНО: Для стабильных useEffect зависимостей:**
  - Выносить дефолтные массивы/объекты в константы вне компонента
  - Не создавать новые объекты/массивы в параметрах функций 

## Critical Notes
- ⚠️ НЕ УДАЛЯТЬ файлы из src/shared/ui/AnimatedIcons/* - они критичны для анимации
- ⚠️ suppressHydrationWarning={true} в layout.tsx - ОБЯЗАТЕЛЬНО для работы с расширениями браузера 