# Coding Conventions

**Analysis Date:** 2026-03-02

## Naming Patterns

**Files:**
- PascalCase for components: `Header.tsx`, `Button.tsx`, `ErrorBoundary.tsx`
- camelCase for utilities and hooks: `classNames.ts`, `logger.ts`, `serviceWorker.ts`
- SCSS module files use same name as component: `Header.module.scss`
- Index files for barrel exports: `index.ts`

**Functions:**
- camelCase: `classNames()`, `generateCacheKey()`, `createLogger()`
- React components: PascalCase: `Header`, `Button`, `ErrorBoundary`

**Variables:**
- camelCase: `isShow`, `isShowChat`, `cacheKey`
- Boolean prefixes: `is*`, `has*`, `can*`: `isShow`, `hasError`, `canRender`
- Constants: UPPER_SNAKE_CASE for configuration values in code (rare)

**Types:**
- PascalCase interfaces: `ButtonProps`, `HeaderProps`, `ChatRequest`, `ChatResponse`
- Enum values: UPPER_SNAKE_CASE: `ThemeButton.CLEAR`, `ThemeButton.ORANGE`
- Type aliases: PascalCase: `LogLevel`, `Modes`

## Code Style

**Formatting:**
- Tool: Not explicitly configured (no Prettier)
- Uses Next.js ESLint default configuration (`next/core-web-vitals`)
- 2-space indentation in TypeScript files
- Single quotes for strings in TSX/TS files

**Linting:**
- Tool: ESLint 9.27.0 with `eslint-config-next` 16.1.6
- Config: `.eslintrc.json` extends `"next/core-web-vitals"`
- Type checking: TypeScript strict mode enabled (`"strict": true`)

## Import Organization

**Order:**
1. External libraries (React, Next.js)
2. Path aliases (`@/widgets`, `@/shared`, `@/features`)
3. Relative imports (local components)
4. Styles (`.scss` modules)

**Path Aliases:**
- `@/*` maps to `./src/*`
- Common aliases: `@/widgets/*`, `@/shared/*`, `@/features/*`, `@/entities/*`

**Examples:**
```typescript
// External
import React, { useState, Suspense, lazy } from "react";
import Link from "next/link";
import type { Metadata } from 'next'

// Path aliases
import { Button, ThemeButton } from "@/shared/ui/Button/Button";
import { Logo } from "@/shared/ui/Logo/Logo";
import { Slider } from '@/widgets/Slider/Slider'

// Local
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./Header.module.scss";
```

## Error Handling

**Client-Side:**
- React ErrorBoundary component pattern: `src/shared/ui/ErrorBoundary/ErrorBoundary.tsx`
- Uses class component with `getDerivedStateFromError()` and `componentDidCatch()`
- Auto-recover after 100ms for transient errors
- Fallback UI with error message display and retry button

**Server-Side (API Routes):**
- Try-catch blocks around async operations
- Returns NextResponse.json with error objects
- Uses custom Logger for structured error logging: `src/shared/lib/logger.ts`
- Always returns user-friendly error messages in response body
- Different HTTP status codes: 400 (bad request), 500 (server error)

**Logging:**
- Custom Logger class in `src/shared/lib/logger.ts`
- Context-aware logging with `createLogger(context)`
- Environment-aware: development logs all, production logs errors only
- Methods: `log()`, `info()`, `warn()`, `error()`, `debug()`
- Uses `eslint-disable-next-line no-console` for intentional console statements

## Comments

**When to Comment:**
- Complex business logic: API prompts, caching strategies
- TODO/FIXME for known issues (searched but not found in codebase)
- Explain non-obvious workarounds in code

**JSDoc/TSDoc:**
- Used in Logger for method documentation
- No widespread TSDoc usage in components

## Function Design

**Size:**
- Generally small, focused functions
- Complex logic extracted to separate utility functions

**Parameters:**
- Destructured in component props
- Default values for optional props: `className = ""`, `disabled = false`

**Return Values:**
- Explicit return types for utilities: `function classNames(...): string`
- Components return JSX directly

## Module Design

**Exports:**
- Named exports preferred: `export const Button`, `export function classNames`
- Barrel files (index.ts) for convenient imports: `src/shared/ui/Button/index.ts`

**Barrel Files:**
- Used in UI component directories: `src/shared/ui/Button/index.ts`
- Re-export components and types

## CSS/SCSS Conventions

**Module Pattern:**
- CSS Modules with `.module.scss` suffix
- Import as default object: `import cls from "./Header.module.scss"`
- Class access: `cls.className`

**Styling Patterns:**
- BEM-like naming in SCSS: `.Header`, `.btnGroup`, `.disabled`
- SCSS variables for theming
- CSS custom properties for global theming in `global.scss`

---

*Convention analysis: 2026-03-02*
