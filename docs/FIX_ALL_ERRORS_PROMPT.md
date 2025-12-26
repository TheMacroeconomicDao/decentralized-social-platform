# ПРОМПТ ДЛЯ ИСПРАВЛЕНИЯ ВСЕХ ОШИБОК И ПРОВЕРКИ ВЕРСИЙ

## КОНТЕКСТ ПРОБЛЕМЫ

В проекте DSP (Next.js 15.5.7 + React 19.2.1 + TypeScript) обнаружены следующие проблемы:

### 1. КРИТИЧЕСКАЯ ОШИБКА: ErrorBoundary TypeError
```
Cannot read properties of undefined (reading 'call')
at RootLayout (src/app/layout.tsx:78:9)
```

**Причина:** Класс-компонент ErrorBoundary с директивой 'use client' может иметь проблемы совместимости с Next.js 15 при использовании в серверных компонентах.

**Текущее состояние:**
- ErrorBoundary находится в `src/shared/ui/ErrorBoundary/ErrorBoundary.tsx`
- Используется в `src/app/layout.tsx:78`
- Импортируется через `@/shared/ui`

### 2. ОШИБКИ ЛИНТЕРА: SCSS типы
```
Не удается найти объявления модуля или типа для импорта с побочным эффектом "./styles/*.scss"
```

**Причина:** Отсутствуют TypeScript типы для SCSS модулей.

**Решение:** Создан файл `src/types/scss.d.ts`, нужно убедиться что он включен в tsconfig.json.

### 3. УСТАРЕВШИЕ ЗАВИСИМОСТИ

**Критические обновления:**
- `next`: 15.5.7 → 15.5.9 (patch)
- `react`: 19.2.1 → 19.2.3 (patch)
- `react-dom`: 19.2.1 → 19.2.3 (patch)
- `eslint-config-next`: 15.1.8 → 15.5.9 (major update)
- `sass`: 1.63.6 → 1.97.1 (minor)
- `viem`: 2.31.7 → 2.43.3 (minor)
- `wagmi`: 2.15.6 → 2.19.5 (minor, latest 3.1.2 - breaking)

**НЕ обновлять (breaking changes):**
- `wagmi` → 3.1.2 (major breaking change)
- `next` → 16.1.1 (major breaking change)
- `eslint-config-next` → 16.1.1 (major breaking change)

## ЗАДАЧА

Исправить все ошибки и обновить зависимости до безопасных версий.

## ТРЕБОВАНИЯ К ИСПРАВЛЕНИЮ

### 1. ИСПРАВИТЬ ErrorBoundary

**Вариант 1 (Рекомендуемый):** Создать функцию-обертку для ErrorBoundary

```tsx
// src/shared/ui/ErrorBoundary/ErrorBoundaryWrapper.tsx
'use client';

import { ErrorBoundary } from './ErrorBoundary';

export function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
```

**Вариант 2:** Убедиться что ErrorBoundary правильно экспортируется и используется

**Что проверить:**
- ErrorBoundary должен быть правильно экспортирован из `src/shared/ui/index.ts`
- Импорт в layout.tsx должен быть корректным
- Класс-компонент должен быть правильно определен с 'use client'

**Вариант 3:** Использовать react-error-boundary библиотеку (если нужно)

### 2. ИСПРАВИТЬ SCSS ТИПЫ

**Текущее состояние:**
- Файл `src/types/scss.d.ts` создан
- Нужно проверить что он включен в `tsconfig.json`

**Проверить:**
```json
{
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "src/types/**/*.d.ts"  // ← должно быть
  ]
}
```

### 3. ОБНОВИТЬ ЗАВИСИМОСТИ

**Безопасные обновления (patch/minor):**
```bash
npm update next@15.5.9
npm update react@19.2.3
npm update react-dom@19.2.3
npm update sass@1.97.1
npm update viem@2.43.3
npm update wagmi@2.19.5
npm update eslint-config-next@15.5.9
```

**НЕ обновлять:**
- wagmi до 3.x (breaking changes)
- next до 16.x (breaking changes)
- eslint-config-next до 16.x (breaking changes)

## СТРУКТУРА ФАЙЛОВ

```
src/
├── app/
│   └── layout.tsx (использует ErrorBoundary)
├── shared/
│   └── ui/
│       ├── index.ts (экспортирует ErrorBoundary)
│       └── ErrorBoundary/
│           └── ErrorBoundary.tsx (класс-компонент)
└── types/
    └── scss.d.ts (типы для SCSS)
```

## ИНСТРУКЦИЯ ДЛЯ ИСПОЛНЕНИЯ

### Шаг 1: Проверить и исправить ErrorBoundary

1. Проверить что ErrorBoundary правильно экспортируется:
   ```typescript
   // src/shared/ui/index.ts
   export { ErrorBoundary } from './ErrorBoundary/ErrorBoundary';
   ```

2. Если проблема сохраняется, создать функцию-обертку:
   ```typescript
   // src/shared/ui/ErrorBoundary/ErrorBoundaryWrapper.tsx
   'use client';
   import { ErrorBoundary } from './ErrorBoundary';
   
   export function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
     return <ErrorBoundary>{children}</ErrorBoundary>;
   }
   ```

3. Обновить импорт в layout.tsx если используется обертка:
   ```typescript
   import { ErrorBoundaryWrapper as ErrorBoundary } from '@/shared/ui/ErrorBoundary/ErrorBoundaryWrapper';
   ```

### Шаг 2: Проверить SCSS типы

1. Убедиться что `src/types/scss.d.ts` существует
2. Проверить что `tsconfig.json` включает этот файл
3. Перезапустить TypeScript сервер

### Шаг 3: Обновить зависимости

1. Выполнить безопасные обновления:
   ```bash
   npm update next react react-dom sass viem wagmi eslint-config-next
   ```

2. Проверить что все работает:
   ```bash
   npm run type-check
   npm run lint
   ```

3. Если есть проблемы, откатить изменения:
   ```bash
   git checkout package.json package-lock.json
   ```

### Шаг 4: Проверить все ошибки

1. Запустить линтер:
   ```bash
   npm run lint
   ```

2. Запустить type-check:
   ```bash
   npm run type-check
   ```

3. Проверить что приложение запускается:
   ```bash
   npm run dev
   ```

## КРИТЕРИИ УСПЕХА

1. ✅ ErrorBoundary работает без ошибок
2. ✅ Нет ошибок линтера связанных с SCSS
3. ✅ Все зависимости обновлены до безопасных версий
4. ✅ TypeScript проверка проходит без ошибок
5. ✅ Приложение запускается без критических ошибок
6. ✅ Нет предупреждений о deprecated версиях

## ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ

### Версии зависимостей

**Текущие:**
- Next.js: 15.5.7
- React: 19.2.1
- TypeScript: 5.8.3
- wagmi: 2.15.6
- viem: 2.31.7

**Рекомендуемые (безопасные обновления):**
- Next.js: 15.5.9
- React: 19.2.3
- TypeScript: 5.8.3 (актуальная)
- wagmi: 2.19.5 (не обновлять до 3.x)
- viem: 2.43.3

### Известные проблемы

1. **ErrorBoundary в Next.js 15:** Класс-компоненты с 'use client' могут иметь проблемы при использовании в серверных компонентах. Решение - использовать функцию-обертку или убедиться что компонент правильно экспортируется.

2. **SCSS типы:** TypeScript требует явных типов для SCSS модулей. Решение - создать файл типов и включить его в tsconfig.json.

3. **MetaMask SDK:** Предупреждения о `@react-native-async-storage/async-storage` уже исправлены через webpack alias в next.config.js.

## ЧТО НЕ НУЖНО ДЕЛАТЬ

❌ **НЕ ОБНОВЛЯТЬ:**
- wagmi до 3.x (breaking changes, требует рефакторинга)
- next до 16.x (breaking changes)
- eslint-config-next до 16.x (breaking changes)
- React до 20.x (еще не существует)

✅ **НУЖНО:**
- Исправить ErrorBoundary
- Исправить SCSS типы
- Обновить patch/minor версии
- Проверить что все работает

---

**ВАЖНО:** После всех исправлений обязательно:
1. Очистить кеш: `rm -rf .next`
2. Переустановить зависимости: `npm install`
3. Проверить типы: `npm run type-check`
4. Проверить линтер: `npm run lint`
5. Запустить приложение: `npm run dev`

