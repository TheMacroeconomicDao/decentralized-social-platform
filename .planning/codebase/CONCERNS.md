# Codebase Concerns

**Analysis Date:** 2026-03-02

## Tech Debt

### Memory Management Issues (Previously Documented)
- **Issue:** Service Worker had memory leaks - setInterval never cleared and event listeners accumulated
- **Files:** `src/shared/lib/serviceWorker.ts`
- **Impact:** Application memory usage would grow continuously during long sessions
- **Fix approach:** Memory leak was fixed by adding proper cleanup - global interval variable, cleanup in unregisterServiceWorker(), and protection against multiple registrations

### Console Logging in Production
- **Issue:** 42 instances of console.log, console.error, and console.warn scattered throughout production code
- **Files:** Multiple files including:
  - `src/widgets/Chat/api/providers/ChatProviderManager.ts`
  - `src/widgets/Chat/api/chatApi.ts`
  - `src/shared/lib/logger.ts`
  - `src/features/UnitProfile/ui/UnitProfileView/UnitProfileView.tsx`
- **Impact:** Debug output visible in production, potential information leakage
- **Fix approach:** Replace with conditional logging: `if (process.env.NODE_ENV === 'development')` or use proper logging library (pino is already in devDependencies)

### Duplicate Component Versions
- **Issue:** Multiple versions of same components exist, creating maintenance burden
- **Files:**
  - `src/widgets/Navbar/ui/Navbar/Navbar.tsx`, `Navbar-Evolution.tsx`, `Navbar-Enhanced.tsx`
  - `src/widgets/Header/Header.tsx`, `HeaderEvolution.tsx`, `Header-Enhanced.tsx`, `ClientHeader.tsx`
  - `src/app/layout.tsx`, `layout-ultra-enhanced.tsx`
- **Impact:** Unclear which version is canonical, potential bugs from inconsistent updates
- **Fix approach:** Consolidate to single versions or establish clear naming convention

### ErrorBoundary TypeScript Compatibility
- **Issue:** Class-based ErrorBoundary with 'use client' directive has known compatibility issues with Next.js 15 in server components
- **Files:** `src/shared/ui/ErrorBoundary/ErrorBoundary.tsx`, `src/app/layout.tsx`
- **Impact:** Possible runtime TypeError: "Cannot read properties of undefined (reading 'call')"
- **Fix approach:** Create function wrapper component or use react-error-boundary library

## Known Bugs

### SCSS Module TypeScript Errors
- **Issue:** TypeScript cannot find declarations for SCSS module imports
- **Files:** Multiple component files importing `.module.scss`
- **Trigger:** Running `tsc --noEmit` or in IDE
- **Workaround:** File `src/types/scss.d.ts` exists but needs verification in tsconfig.json include array

### Enhanced Layout Not Active
- **Issue:** `layout-ultra-enhanced.tsx` with enhanced components exists but is not used
- **Files:** `src/app/layout.tsx`, `src/app/layout-ultra-enhanced.tsx`
- **Trigger:** Enhanced 3D effects and animations in ultra version are not visible
- **Workaround:** Rename or swap layout-ultra-enhanced.tsx to layout.tsx if enhanced version is desired

## Security Considerations

### Content Security Policy Permissiveness
- **Issue:** CSP headers contain 'unsafe-eval' and 'unsafe-inline' directives
- **Files:** `next.config.js` (line 42)
- **Current mitigation:** CSP headers configured, but allows eval which is dangerous
- **Recommendations:** 
  - Remove 'unsafe-eval' if possible (may break some dynamic code)
  - Move inline styles to CSS modules or styled-components
  - Use nonce-based approach for required inline scripts

### SVG Security
- **Issue:** `dangerouslyAllowSVG: true` enabled in Next.js image configuration
- **Files:** `next.config.js` (line 21)
- **Risk:** SVG files can contain malicious scripts (XSS)
- **Recommendations:** Only allow from trusted domains, consider disabling and using specific remotePatterns

### Hardcoded URLs
- **Issue:** Some URLs hardcoded without validation
- **Files:** Multiple component files
- **Risk:** URL injection if data comes from untrusted sources
- **Recommendations:** Implement URL validation, use allowed list for external resources

## Performance Bottlenecks

### Large Memory Allocation for Build
- **Issue:** Build requires 3GB+ memory allocation (NODE_OPTIONS='--max-old-space-size=3072')
- **Files:** `package.json` (line 8)
- **Cause:** Large bundle size from 3D libraries (three, @react-three/fiber, @react-three/drei), Web3 libraries (wagmi, viem, rainbowkit), and multiple UI libraries
- **Improvement path:** 
  - Implement code splitting for 3D components
  - Lazy load Web3 providers
  - Use dynamic imports for heavy dependencies

### Webpack Cache Disabled in Production
- **Issue:** `config.cache = false` in production webpack config
- **Files:** `next.config.js` (lines 95-97)
- **Cause:** Previously disabled due to disk space issues
- **Impact:** Slower subsequent builds
- **Improvement path:** Re-enable filesystem cache with proper cleanup schedule

### No Test Coverage Requirements
- **Issue:** No test files detected in codebase
- **Files:** None found (.test.ts, .spec.ts, __tests__ directories)
- **Risk:** Bugs can be introduced without detection
- **Priority:** High - Critical functionality (wallet auth, chat, profile) has no tests

## Fragile Areas

### Chat Provider Fallback System
- **Files:** `src/widgets/Chat/api/providers/ChatProviderManager.ts`
- **Why fragile:** Complex fallback logic with retry attempts, streaming error handling is intricate
- **Safe modification:** Test any provider changes in isolation
- **Test coverage:** No tests exist

### Service Worker Registration
- **Files:** `src/shared/lib/ServiceWorkerScript.ts`, `public/sw-advanced.js`
- **Why fragile:** Browser compatibility issues, registration timing is critical
- **Safe modification:** Test in multiple browsers, verify caching behavior
- **Test coverage:** No tests exist

### Web3 Provider Initialization
- **Files:** `src/app/providers/Web3Provider.tsx`
- **Why fragile:** Complex state initialization from cookies, hydration issues common
- **Safe modification:** Test wallet connection/disconnection flows
- **Test coverage:** No tests exist

## Scaling Limits

### Bundle Size
- **Current capacity:** Large initial bundle (~1MB+ JS)
- **Limit:** Mobile devices on slow connections will have poor UX
- **Scaling path:** Implement route-based code splitting, lazy load heavy components

### Image Assets
- **Current capacity:** Many high-resolution images referenced
- **Limit:** No image optimization pipeline detected
- **Scaling path:** Implement Next.js Image component consistently, add image optimization pipeline

## Dependencies at Risk

### wagmi
- **Risk:** At version 2.15.6, next major version (3.x) has breaking changes
- **Impact:** Cannot update without significant refactoring
- **Migration plan:** Wait for ecosystem to stabilize, or plan dedicated migration phase

### Next.js
- **Risk:** At version 16.1.6, major version updates have breaking changes
- **Impact:** May need to skip some minor versions to avoid breaking changes
- **Migration plan:** Test thoroughly before major version upgrades

### RainbowKit/Wagmi Stack
- **Risk:** Complex peer dependencies between @rainbow-me/rainbowkit, wagmi, viem
- **Impact:** Version mismatches can cause runtime errors
- **Migration plan:** Keep aligned versions, update together as a stack

## Missing Critical Features

### Automated Testing
- **Problem:** No test framework configured despite Playwright in devDependencies
- **Blocks:** Safe refactoring, regression detection, CI/CD quality gates

### Error Monitoring
- **Problem:** No error tracking service (Sentry, etc.) integrated
- **Blocks:** Production issue detection and debugging

### Performance Monitoring
- **Problem:** No Core Web Vitals or runtime performance monitoring
- **Blocks:** Proactive performance optimization

## Test Coverage Gaps

### Unit Profile Feature
- **What's not tested:** Profile creation, editing, wallet connection flow
- **Files:** `src/features/UnitProfile/**`, `src/features/WalletAuth/**`
- **Risk:** Wallet authentication bugs could lose user data
- **Priority:** High

### Chat System
- **What's not tested:** Message sending, provider fallback, streaming
- **Files:** `src/widgets/Chat/**`
- **Risk:** User messages could fail silently
- **Priority:** High

### Navbar Navigation
- **What's not tested:** Mobile/tablet/desktop responsive behavior, navigation flows
- **Files:** `src/widgets/Navbar/**`
- **Risk:** Users may get stuck on pages
- **Priority:** Medium

---

*Concerns audit: 2026-03-02*
