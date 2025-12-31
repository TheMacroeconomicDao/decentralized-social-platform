# ПОЛНЫЙ ПРОМПТ ДЛЯ ИСПРАВЛЕНИЯ ВСЕХ ОШИБОК В ПРОЕКТЕ DSP

## КОНТЕКСТ ПРОЕКТА

**Проект:** DSP (Next.js приложение)
**Версия Next.js:** 15.5.7 → 15.5.9 (обновить)
**Версия React:** 19.2.1 → 19.2.3 (обновить)
**Версия TypeScript:** 5.8.3
**Пакетный менеджер:** npm
**Рабочая директория:** `/Users/Gyber/GYBERNATY-ECOSYSTEM/DSP`

---

## КРИТИЧЕСКАЯ ОШИБКА #1: ErrorBoundary TypeError

### Ошибка:
```
Cannot read properties of undefined (reading 'call')
at RootLayout (src/app/layout.tsx:78:9)
```

### Причина:
Класс-компонент `ErrorBoundary` с директивой `'use client'` используется в серверном компоненте `layout.tsx`. В Next.js 15 это вызывает проблемы при SSR, так как React не может правильно распознать класс-компонент во время серверного рендеринга.

### РЕШЕНИЕ:

**Шаг 1:** Создать обертку для ErrorBoundary

Создать файл `src/shared/ui/ErrorBoundary/ErrorBoundaryWrapper.tsx`:

```tsx
'use client';

import React, { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface ErrorBoundaryWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ErrorBoundaryWrapper({ children, fallback }: ErrorBoundaryWrapperProps) {
  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}

export default ErrorBoundaryWrapper;
```

**Шаг 2:** Обновить экспорт в `src/shared/ui/index.ts`:

```typescript
// Заменить:
export { ErrorBoundary } from './ErrorBoundary/ErrorBoundary';

// На:
export { ErrorBoundaryWrapper as ErrorBoundary } from './ErrorBoundary/ErrorBoundaryWrapper';
```

**Шаг 3:** Исправить ошибку типизации в ErrorBoundary

В файле `src/shared/ui/ErrorBoundary/ErrorBoundary.tsx` на строке 35 исправить:

```tsx
// БЫЛО:
this.getLogger().error('ErrorBoundary caught an error', error, { errorInfo });

// ДОЛЖНО БЫТЬ:
this.getLogger().error('ErrorBoundary caught an error', error, errorInfo);
```

---

## ОШИБКА #2: TypeScript - logger не определен

### Ошибки:
```
src/features/UnitProfile/ui/UnitProfileEditor/UnitProfileEditor.tsx(144,7): error TS2304: Cannot find name 'logger'.
src/features/UnitProfile/ui/UnitProfileView/UnitProfileView.tsx(66,7): error TS2304: Cannot find name 'logger'.
src/shared/hooks/useUnitProfile.ts(106,9): error TS2304: Cannot find name 'logger'.
src/shared/hooks/useUnitProfile.ts(208,7): error TS2304: Cannot find name 'logger'.
```

### РЕШЕНИЕ:

В каждом из этих файлов нужно добавить импорт logger:

```typescript
import { createLogger } from '@/shared/lib/logger';

const logger = createLogger('ComponentName'); // или 'HookName'
```

**Файлы для исправления:**
1. `src/features/UnitProfile/ui/UnitProfileEditor/UnitProfileEditor.tsx` - добавить импорт и создать logger
2. `src/features/UnitProfile/ui/UnitProfileView/UnitProfileView.tsx` - добавить импорт и создать logger
3. `src/shared/hooks/useUnitProfile.ts` - добавить импорт и создать logger

---

## ОШИБКА #3: Framer Motion типы - ease должен быть Easing

### Ошибки:
```
src/shared/ui/Button/Button-Enhanced.tsx(53,9): error TS2322: Type 'string' is not assignable to type 'Easing | Easing[] | undefined'.
src/shared/ui/InteractiveCard/InteractiveCard.tsx(226,9): error TS2322: Type 'string' is not assignable to type 'Easing | Easing[] | undefined'.
src/widgets/Header/Header-Enhanced.tsx(105,21): error TS2322: Type 'string' is not assignable to type 'Easing | Easing[] | undefined'.
src/widgets/Header/Header-Enhanced.tsx(111,33): error TS2322: Type 'string' is not assignable to type 'Easing | Easing[] | undefined'.
```

### РЕШЕНИЕ:

В Framer Motion 12+ свойство `ease` должно быть типа `Easing`, а не `string`. Нужно использовать предопределенные значения из `framer-motion`.

**Импорт:**
```typescript
import { easeInOut, easeOut, easeIn } from 'framer-motion';
```

**Исправления:**

1. **src/shared/ui/Button/Button-Enhanced.tsx** (строка 53):
```tsx
// БЫЛО:
transition: { type: 'spring', stiffness: 300, damping: 20 }

// ИЛИ если есть ease: 'easeInOut'
// ДОЛЖНО БЫТЬ:
transition: { type: 'spring', stiffness: 300, damping: 20 }
// или для ease:
transition: { ease: easeInOut, duration: 0.3 }
```

2. **src/shared/ui/InteractiveCard/InteractiveCard.tsx** (строка 226):
```tsx
// БЫЛО:
transition: { duration: 0.3, ease: 'easeOut' }

// ДОЛЖНО БЫТЬ:
transition: { duration: 0.3, ease: easeOut }
```

3. **src/widgets/Header/Header-Enhanced.tsx** (строки 105, 111):
```tsx
// БЫЛО:
transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.1 }

// ДОЛЖНО БЫТЬ:
transition: { duration: 0.5, ease: easeOut, staggerChildren: 0.1 }
```

---

## ПРОБЛЕМА #4: Устаревшие зависимости

### Текущие версии (package.json):
```json
{
  "next": "^15.5.7",           // → 15.5.9 (wanted)
  "react": "^19.2.1",          // → 19.2.3 (wanted)
  "react-dom": "^19.2.1",      // → 19.2.3 (wanted)
  "sass": "^1.63.6",           // → 1.97.1 (wanted)
  "viem": "^2.31.7",           // → 2.43.3 (wanted)
  "wagmi": "^2.15.6",          // → 2.19.5 (уже установлено)
  "eslint-config-next": "^15.1.8", // → 15.5.9 (wanted)
  "@rainbow-me/rainbowkit": "^2.2.8", // → 2.2.10 (wanted)
  "@types/node": "^22.15.21",  // → 22.19.3 (wanted)
  "eslint": "^9.27.0"          // → 9.39.2 (wanted)
}
```

### Безопасные обновления (patch/minor):
- ✅ `next`: 15.5.7 → 15.5.9 (patch)
- ✅ `react`: 19.2.1 → 19.2.3 (patch)
- ✅ `react-dom`: 19.2.1 → 19.2.3 (patch)
- ✅ `sass`: 1.63.6 → 1.97.1 (minor)
- ✅ `viem`: 2.31.7 → 2.43.3 (minor)
- ✅ `wagmi`: 2.15.6 → 2.19.5 (minor) - уже установлено
- ✅ `eslint-config-next`: 15.1.8 → 15.5.9 (patch)
- ✅ `@rainbow-me/rainbowkit`: 2.2.8 → 2.2.10 (patch)
- ✅ `@types/node`: 22.15.21 → 22.19.3 (patch)
- ✅ `eslint`: 9.27.0 → 9.39.2 (patch)

### НЕ ОБНОВЛЯТЬ (breaking changes):
- ❌ `wagmi` → 3.1.2 (major breaking change)
- ❌ `next` → 16.1.1 (major breaking change)
- ❌ `eslint-config-next` → 16.1.1 (major breaking change)

### РЕШЕНИЕ:

```bash
cd /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP
npm install next@15.5.9 react@19.2.3 react-dom@19.2.3 sass@1.97.1 viem@2.43.3 eslint-config-next@15.5.9 @rainbow-me/rainbowkit@2.2.10 @types/node@22.19.3 eslint@9.39.2
```

---

## ПРОБЛЕМА #5: SCSS TypeScript типы

### Статус:
✅ Файл `src/types/scss.d.ts` существует и правильно настроен
✅ Файл включен в `tsconfig.json` в секции `include`

### Если все еще есть ошибки:
1. Перезапустить TypeScript сервер в IDE
2. Очистить кеш: `rm -rf .next node_modules/.cache`
3. Перезапустить IDE

---

## ПОШАГОВАЯ ИНСТРУКЦИЯ ДЛЯ ИСПРАВЛЕНИЯ

### Шаг 1: Исправить ErrorBoundary

1. Создать `src/shared/ui/ErrorBoundary/ErrorBoundaryWrapper.tsx`:
```tsx
'use client';

import React, { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface ErrorBoundaryWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ErrorBoundaryWrapper({ children, fallback }: ErrorBoundaryWrapperProps) {
  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}

export default ErrorBoundaryWrapper;
```

2. Обновить `src/shared/ui/index.ts`:
```typescript
export { ErrorBoundaryWrapper as ErrorBoundary } from './ErrorBoundary/ErrorBoundaryWrapper';
```

3. Исправить `src/shared/ui/ErrorBoundary/ErrorBoundary.tsx` (строка 35):
```tsx
// Заменить:
this.getLogger().error('ErrorBoundary caught an error', error, { errorInfo });

// На:
this.getLogger().error('ErrorBoundary caught an error', error, errorInfo);
```

### Шаг 2: Исправить logger ошибки

Для каждого файла добавить импорт и создать logger:

**src/features/UnitProfile/ui/UnitProfileEditor/UnitProfileEditor.tsx:**
```typescript
import { createLogger } from '@/shared/lib/logger';

const logger = createLogger('UnitProfileEditor');
```

**src/features/UnitProfile/ui/UnitProfileView/UnitProfileView.tsx:**
```typescript
import { createLogger } from '@/shared/lib/logger';

const logger = createLogger('UnitProfileView');
```

**src/shared/hooks/useUnitProfile.ts:**
```typescript
import { createLogger } from '@/shared/lib/logger';

const logger = createLogger('useUnitProfile');
```

### Шаг 3: Исправить Framer Motion типы

**src/shared/ui/Button/Button-Enhanced.tsx:**
```typescript
import { easeInOut } from 'framer-motion';

// В variants заменить строковые ease на:
transition: { ease: easeInOut, duration: 0.3 }
```

**src/shared/ui/InteractiveCard/InteractiveCard.tsx:**
```typescript
import { easeOut } from 'framer-motion';

// В variants заменить:
transition: { duration: 0.3, ease: easeOut }
```

**src/widgets/Header/Header-Enhanced.tsx:**
```typescript
import { easeOut } from 'framer-motion';

// В variants заменить:
transition: { duration: 0.5, ease: easeOut, staggerChildren: 0.1 }
```

### Шаг 4: Обновить зависимости

```bash
cd /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP
npm install next@15.5.9 react@19.2.3 react-dom@19.2.3 sass@1.97.1 viem@2.43.3 eslint-config-next@15.5.9 @rainbow-me/rainbowkit@2.2.10 @types/node@22.19.3 eslint@9.39.2
```

### Шаг 5: Очистить кеш и проверить

```bash
# Очистить кеш
rm -rf .next node_modules/.cache

# Проверить типы
npm run type-check

# Проверить линтер
npm run lint

# Запустить приложение
npm run dev
```

---

## КРИТЕРИИ УСПЕХА

После выполнения всех шагов должно быть:

1. ✅ **ErrorBoundary работает** - нет ошибки "Cannot read properties of undefined (reading 'call')"
2. ✅ **TypeScript проверка проходит** - `npm run type-check` без ошибок
3. ✅ **Линтер проходит** - `npm run lint` без ошибок
4. ✅ **Зависимости обновлены** - все patch/minor версии обновлены до безопасных
5. ✅ **Приложение запускается** - `npm run dev` работает без критических ошибок
6. ✅ **Нет предупреждений о депрекейтед версиях** - все пакеты актуальны

---

## СТРУКТУРА ФАЙЛОВ ДЛЯ СПРАВКИ

```
src/
├── app/
│   └── layout.tsx                    # Использует ErrorBoundary на строке 78
├── shared/
│   ├── lib/
│   │   └── logger.ts                 # createLogger функция
│   └── ui/
│       ├── index.ts                  # Экспортирует ErrorBoundary
│       └── ErrorBoundary/
│           ├── ErrorBoundary.tsx     # Класс-компонент (исправить строку 35)
│           └── ErrorBoundaryWrapper.tsx  # НУЖНО СОЗДАТЬ
├── features/
│   └── UnitProfile/
│       └── ui/
│           ├── UnitProfileEditor/
│           │   └── UnitProfileEditor.tsx  # Добавить logger
│           └── UnitProfileView/
│               └── UnitProfileView.tsx    # Добавить logger
├── shared/
│   └── hooks/
│       └── useUnitProfile.ts         # Добавить logger
└── types/
    └── scss.d.ts                     # Типы для SCSS (уже создан)
```

---

## ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ

### Важные файлы для проверки:

1. **package.json** - проверить версии после обновления
2. **tsconfig.json** - проверить что включает типы SCSS
3. **next.config.js** - уже содержит исправление для MetaMask SDK
4. **src/app/layout.tsx** - место где происходит ошибка ErrorBoundary

### Известные ограничения:

- **НЕ обновлять wagmi до 3.x** - это major breaking change, требует рефакторинга всего кода работы с Web3
- **НЕ обновлять next до 16.x** - это major breaking change
- **React 19.2.3** - последняя стабильная версия React 19
- **Framer Motion 12+** - требует использования типизированных Easing вместо строк

### Если что-то не работает:

1. Проверить что все файлы созданы правильно
2. Проверить что импорты корректны
3. Очистить кеш: `rm -rf .next node_modules/.cache`
4. Переустановить зависимости: `rm -rf node_modules && npm install`
5. Перезапустить TypeScript сервер в IDE
6. Перезапустить dev сервер

---

## ФИНАЛЬНАЯ ПРОВЕРКА

После всех исправлений выполнить:

```bash
# 1. Очистить кеш
rm -rf .next node_modules/.cache

# 2. Проверить типы
npm run type-check

# 3. Проверить линтер
npm run lint

# 4. Запустить приложение
npm run dev
```

Если все команды выполняются без ошибок - задача выполнена успешно!

---

**ВАЖНО:** Этот промпт содержит всю необходимую информацию для исправления всех найденных ошибок. Следуй инструкциям пошагово и проверяй результат после каждого шага.

**ПРИОРИТЕТ ИСПРАВЛЕНИЙ:**
1. 🔴 Критично: ErrorBoundary TypeError (блокирует запуск)
2. 🟡 Важно: TypeScript ошибки (logger, framer-motion)
3. 🟢 Рекомендуется: Обновление зависимостей (безопасность и стабильность)


