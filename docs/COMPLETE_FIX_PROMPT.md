# ПОЛНЫЙ ПРОМПТ ДЛЯ ИСПРАВЛЕНИЯ ВСЕХ ОШИБОК В ПРОЕКТЕ DSP

## КОНТЕКСТ ПРОЕКТА

**Проект:** DSP (Next.js приложение)
**Версия Next.js:** 15.5.7
**Версия React:** 19.2.1
**Версия TypeScript:** 5.8.3
**Пакетный менеджер:** npm
**Рабочая директория:** `/Users/Gyber/GYBERNATY-ECOSYSTEM/DSP`

## КРИТИЧЕСКАЯ ОШИБКА #1: ErrorBoundary TypeError

### Ошибка:
```
Cannot read properties of undefined (reading 'call')
at RootLayout (src/app/layout.tsx:78:9)
```

### Код где происходит ошибка:
```tsx
// src/app/layout.tsx:78
<ErrorBoundary>
  <Web3Provider initialState={initialState}>
    <AppContent>{children}</AppContent>
  </Web3Provider>
</ErrorBoundary>
```

### Текущая реализация ErrorBoundary:
```tsx
// src/shared/ui/ErrorBoundary/ErrorBoundary.tsx
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createLogger } from '@/shared/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  private logger?: ReturnType<typeof createLogger>;

  public state: State = {
    hasError: false,
  };

  private getLogger() {
    if (!this.logger) {
      this.logger = createLogger('ErrorBoundary');
    }
    return this.logger;
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.getLogger().error('ErrorBoundary caught an error', error, { errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{...}}>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button onClick={() => this.setState({ hasError: false })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### Экспорт ErrorBoundary:
```typescript
// src/shared/ui/index.ts
export { ErrorBoundary } from './ErrorBoundary/ErrorBoundary';
```

### Импорт в layout.tsx:
```typescript
// src/app/layout.tsx:14
import { ErrorBoundary } from '@/shared/ui'
```

### ПРОБЛЕМА:
В Next.js 15 класс-компоненты с директивой 'use client' могут иметь проблемы при использовании в серверных компонентах (layout.tsx - это серверный компонент). React может не распознать компонент правильно во время SSR.

### РЕШЕНИЕ:
Создать функцию-обертку для ErrorBoundary, которая гарантирует правильную работу в Next.js 15:

```tsx
// src/shared/ui/ErrorBoundary/ErrorBoundaryWrapper.tsx
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

// Экспорт по умолчанию для удобства
export default ErrorBoundaryWrapper;
```

Затем обновить экспорт в `src/shared/ui/index.ts`:
```typescript
export { ErrorBoundaryWrapper as ErrorBoundary } from './ErrorBoundary/ErrorBoundaryWrapper';
```

ИЛИ использовать прямой импорт в layout.tsx:
```typescript
import { ErrorBoundaryWrapper as ErrorBoundary } from '@/shared/ui/ErrorBoundary/ErrorBoundaryWrapper';
```

## ОШИБКА #2: SCSS TypeScript типы

### Ошибки линтера:
```
src/app/layout.tsx:1:8: Не удается найти объявления модуля или типа для импорта с побочным эффектом "./styles/reset.scss"
src/app/layout.tsx:2:8: Не удается найти объявления модуля или типа для импорта с побочным эффектом "./styles/global.scss"
src/app/layout.tsx:3:8: Не удается найти объявления модуля или типа для импорта с побочным эффектом "./styles/global-enhanced.scss"
```

### Текущее состояние:
- Файл `src/types/scss.d.ts` создан со следующим содержимым:
```typescript
declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.module.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.module.css' {
  const content: { [className: string]: string };
  export default content;
}
```

### Проблема:
Файл типов может быть не включен в tsconfig.json или TypeScript сервер не перезагружен.

### РЕШЕНИЕ:
1. Проверить что `tsconfig.json` включает файл типов:
```json
{
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "src/types/**/*.d.ts"
  ]
}
```

2. Если файл не включен - добавить его в include
3. Перезапустить TypeScript сервер в IDE

## ПРОБЛЕМА #3: Устаревшие зависимости

### Текущие версии (package.json):
```json
{
  "dependencies": {
    "next": "^15.5.7",
    "react": "^19.2.1",
    "react-dom": "^19.2.1",
    "sass": "^1.63.6",
    "viem": "^2.31.7",
    "wagmi": "^2.15.6",
    "eslint-config-next": "^15.1.8"
  }
}
```

### Доступные обновления:
- `next`: 15.5.7 → 15.5.9 (patch - безопасно)
- `react`: 19.2.1 → 19.2.3 (patch - безопасно)
- `react-dom`: 19.2.1 → 19.2.3 (patch - безопасно)
- `sass`: 1.63.6 → 1.97.1 (minor - безопасно)
- `viem`: 2.31.7 → 2.43.3 (minor - безопасно)
- `wagmi`: 2.15.6 → 2.19.5 (minor - безопасно, НЕ обновлять до 3.x)
- `eslint-config-next`: 15.1.8 → 15.5.9 (patch - безопасно)

### НЕ ОБНОВЛЯТЬ (breaking changes):
- `wagmi` → 3.1.2 (major breaking change)
- `next` → 16.1.1 (major breaking change)
- `eslint-config-next` → 16.1.1 (major breaking change)

### РЕШЕНИЕ:
Выполнить безопасные обновления:
```bash
cd /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP
npm update next@15.5.9 react@19.2.3 react-dom@19.2.3 sass@1.97.1 viem@2.43.3 wagmi@2.19.5 eslint-config-next@15.5.9
```

## ПРОБЛЕМА #4: MetaMask SDK предупреждения (уже исправлено)

### Статус:
Уже исправлено в `next.config.js` через webpack alias:
```javascript
config.resolve.alias = {
  ...config.resolve.alias,
  '@react-native-async-storage/async-storage': false,
};
```

## ИНСТРУКЦИЯ ДЛЯ ИСПОЛНЕНИЯ

### Шаг 1: Исправить ErrorBoundary

1. Создать файл `src/shared/ui/ErrorBoundary/ErrorBoundaryWrapper.tsx`:
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
// Заменить строку:
export { ErrorBoundary } from './ErrorBoundary/ErrorBoundary';

// На:
export { ErrorBoundaryWrapper as ErrorBoundary } from './ErrorBoundary/ErrorBoundaryWrapper';
```

3. Проверить что layout.tsx использует правильный импорт (должен работать через `@/shared/ui`)

### Шаг 2: Проверить SCSS типы

1. Убедиться что файл `src/types/scss.d.ts` существует
2. Проверить что `tsconfig.json` включает `src/types/**/*.d.ts` в секции `include`
3. Если нужно - перезапустить TypeScript сервер

### Шаг 3: Обновить зависимости

1. Выполнить команду:
```bash
cd /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP
npm update next@15.5.9 react@19.2.3 react-dom@19.2.3 sass@1.97.1 viem@2.43.3 wagmi@2.19.5 eslint-config-next@15.5.9
```

2. Проверить что package.json обновился корректно
3. Запустить `npm install` для обновления lock файла

### Шаг 4: Очистить кеш и проверить

1. Очистить кеш Next.js:
```bash
rm -rf .next
```

2. Проверить типы:
```bash
npm run type-check
```

3. Проверить линтер:
```bash
npm run lint
```

4. Запустить приложение:
```bash
npm run dev
```

5. Проверить что ошибка ErrorBoundary исчезла в консоли браузера

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
│           ├── ErrorBoundary.tsx     # Класс-компонент (текущий)
│           └── ErrorBoundaryWrapper.tsx  # НУЖНО СОЗДАТЬ
└── types/
    └── scss.d.ts                     # Типы для SCSS (уже создан)
```

## КРИТЕРИИ УСПЕХА

После выполнения всех шагов должно быть:

1. ✅ **ErrorBoundary работает** - нет ошибки "Cannot read properties of undefined (reading 'call')"
2. ✅ **SCSS типы работают** - нет ошибок линтера про SCSS модули
3. ✅ **Зависимости обновлены** - все patch/minor версии обновлены до безопасных
4. ✅ **TypeScript проверка проходит** - `npm run type-check` без ошибок
5. ✅ **Линтер проходит** - `npm run lint` без ошибок
6. ✅ **Приложение запускается** - `npm run dev` работает без критических ошибок

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

### Если что-то не работает:

1. Проверить что все файлы созданы правильно
2. Проверить что импорты корректны
3. Очистить кеш: `rm -rf .next node_modules/.cache`
4. Переустановить зависимости: `rm -rf node_modules && npm install`
5. Перезапустить TypeScript сервер в IDE

---

## ФИНАЛЬНАЯ ПРОВЕРКА

После всех исправлений выполнить:

```bash
# 1. Очистить кеш
rm -rf .next

# 2. Проверить типы
npm run type-check

# 3. Проверить линтер
npm run lint

# 4. Запустить приложение
npm run dev
```

Если все команды выполняются без ошибок - задача выполнена успешно!

---

**ВАЖНО:** Этот промпт содержит всю необходимую информацию для исправления всех ошибок. Следуй инструкциям пошагово и проверяй результат после каждого шага.

