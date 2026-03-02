# Testing Patterns

**Analysis Date:** 2026-03-02

## Test Framework

**Status:** Not configured

The codebase currently has **no test infrastructure** set up. This is a significant gap in the codebase quality.

**Missing:**
- No Jest, Vitest, or other test runner configured
- No test files (*.test.*, *.spec.*) found in the codebase
- No test configuration files (jest.config.*, vitest.config.*)
- No assertion library explicitly installed
- No test utilities or testing libraries

**Package.json scripts:**
```json
{
  "dev": "NODE_OPTIONS='--max-old-space-size=2048' next dev --webpack",
  "build": "NODE_OPTIONS='--max-old-space-size=3072' next build --webpack",
  "lint": "next lint",
  "type-check": "tsc --noEmit"
}
```

Note: Playwright is installed (`"playwright": "^1.58.2"`), likely for browser automation/E2E testing, but no test files were found.

## Test File Organization

**Location:** Not applicable (no tests exist)

**Naming:** Not applicable

**Recommended Structure:**
```
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.module.scss
│       └── Button.test.tsx    # Unit tests (co-located)
├── __tests__/
│   └── api/
│       └── chat.test.ts       # Integration tests (separate)
```

## Test Structure

**Suite Organization:** Not applicable

**Patterns to implement:**
- AAA Pattern: Arrange, Act, Assert
- Use React Testing Library for component testing
- Use Jest/Vitest for test runner

## Mocking

**Framework:** Not configured

**Patterns to implement:**
```typescript
// Mock external dependencies
jest.mock('@/shared/lib/logger', () => ({
  createLogger: jest.fn(() => ({
    error: jest.fn(),
    log: jest.fn(),
  })),
}));

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock third-party libraries
jest.mock('@rainbow-me/rainbowkit', () => ({
  WagmiConfig: ({ children }: { children: React.ReactNode }) => children,
}));
```

**What to Mock:**
- External APIs and services
- Next.js navigation and routing
- Web3/wallet connections
- Third-party UI libraries

**What NOT to Mock:**
- Core business logic (test these directly)
- Internal utility functions (test behavior, not implementation)

## Fixtures and Factories

**Test Data:**
- Create fixture files in `src/__fixtures__/` or `tests/fixtures/`
- Example: `src/__fixtures__/chatMessages.ts`

**Location:**
- `tests/fixtures/` - shared test data
- `src/__fixtures__/` - co-located fixtures
- `tests/mocks/` - mock implementations

## Coverage

**Requirements:** None enforced

**Recommendation:**
- Target 70% line coverage minimum
- Focus on business logic, utilities, and API routes
- Components can have lower coverage but should have critical path tests

**View Coverage:**
```bash
# With Jest
npm test -- --coverage

# With Vitest
npx vitest run --coverage
```

## Test Types

**Unit Tests:**
- Utility functions: `classNames()`, `generateCacheKey()`, caching logic
- Custom hooks (if any)
- Individual components in isolation

**Integration Tests:**
- API routes: `src/app/api/chat/route.ts`
- Error boundary behavior
- Provider composition (Web3Provider, etc.)

**E2E Tests:**
- Playwright is installed but not utilized
- Could test: login flow, wallet connection, chat interactions

## Recommended Testing Setup

Based on the codebase (Next.js 16, React 19, TypeScript):

1. **Install Vitest** (modern, fast, Next.js compatible):
```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

2. **Create `vitest.config.ts`:**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

3. **Add scripts to `package.json`:**
```json
{
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage"
}
```

4. **Create test setup file (`tests/setup.ts`):**
```typescript
import '@testing-library/jest-dom';
```

## Common Patterns

**Async Testing:**
```typescript
// With Vitest
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('API Route', () => {
  it('should return cached response', async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'test' }),
    });
    expect(response.ok).toBe(true);
  });
});
```

**Error Testing:**
```typescript
it('should return 400 for empty message', async () => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message: '' }),
  });
  expect(response.status).toBe(400);
});
```

---

*Testing analysis: 2026-03-02*
