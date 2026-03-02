# Architecture

**Analysis Date:** 2026-03-02

## Pattern Overview

**Overall:** Feature Sliced Design (FSD)

This codebase uses Feature Sliced Design methodology - a frontend architecture approach that organizes code into horizontal layers (app, widgets, entities, features, shared) with strict unidirectional dependencies. This pattern is documented in `docs/architecture/feature-sliced-design.md`.

**Key Characteristics:**
- **Layer Isolation:** Each layer can only import from layers below it
- **Segment Organization:** Within each layer/slice, code is divided by technical aspect (ui, model, api, lib)
- **Composability:** Higher layers compose components from lower layers
- **Domain-Driven:** Entities and features represent business domain concepts

## Layers

### Layer `app`:
- Purpose: Root application layer containing Next.js App Router pages, global layout, and configuration
- Location: `src/app/`
- Contains: Pages, API routes (`api/*`), providers, global styles
- Depends on: widgets, entities, features, shared
- Used by: Next.js framework directly (entry point)

### Layer `widgets`:
- Purpose: Composed UI blocks representing complete page sections
- Location: `src/widgets/`
- Contains: Header, Footer, Navbar, Banner, Team, Slider, Chat, etc.
- Depends on: entities, features, shared
- Used by: `app` layer pages

### Layer `entities`:
- Purpose: Business domain objects - key data representations
- Location: `src/entities/`
- Contains: CardMember, EventCard, Roadmap, SocialRoadmapCard, TechnicalRoadmap, LaunchPad, ProjectCard, SocialMedia
- Depends on: shared only
- Used by: widgets, features, other entities

### Layer `features`:
- Purpose: Business features with associated user interactions
- Location: `src/features/`
- Contains: WalletAuth (wallet connection, profile creation), UnitProfile (profile view/edit)
- Depends on: shared, entities
- Used by: widgets, app

### Layer `shared`:
- Purpose: Reusable infrastructure not tied to business logic
- Location: `src/shared/`
- Contains:
  - `ui/` - Base components (Button, Container, Logo, Toast, etc.)
  - `hooks/` - Custom React hooks (useUnitProfile, useToast, useMediaQuery)
  - `lib/` - Utilities (classNames, logger, ecosystem-data)
  - `config/` - Configuration (web3.ts)
  - `types/` - TypeScript interfaces
  - `constants/` - Constants (breakpoints)
  - `routes/` - Route definitions
  - `data/` - Mock data
- Depends on: None (lowest layer)
- Used by: All other layers

## Data Flow

### Page Rendering Flow:

1. **Request** → Next.js App Router (`src/app/page.tsx`)
2. **Page Component** imports widgets from `src/widgets/*`
3. **Widgets** compose entities from `src/entities/*` and features from `src/features/*`
4. **Entities/Features** use shared components from `src/shared/ui/*`, hooks from `src/shared/hooks/*`, and utilities from `src/shared/lib/*`

### Web3 Authentication Flow:

1. Root layout (`src/app/layout.tsx`) wraps children in `Web3Provider`
2. `Web3Provider` (`src/app/providers/Web3Provider.tsx`) initializes:
   - Wagmi config (`src/shared/config/web3.ts`)
   - RainbowKit for wallet UI
   - TanStack Query for data fetching
3. Features like `WalletAuth` (`src/features/WalletAuth/*`) interact with wallet state

### API Flow:

1. Client components call Next.js API routes (`src/app/api/*`)
2. API routes use shared utilities (`src/shared/lib/logger.ts`)
3. Example: Chat API (`src/app/api/chat/route.ts`) proxies OpenAI requests with caching

## Key Abstractions

### Web3 Configuration:
- Purpose: Centralized Web3/wallet configuration
- Examples: `src/shared/config/web3.ts`
- Pattern: Singleton config with server/client distinction for SSR support

### Component Index Pattern:
- Purpose: Barrel exports for clean imports
- Examples:
  - `src/entities/CardMember/index.ts` → `export { CardMember } from "./ui/CardMember"`
  - `src/features/WalletAuth/index.ts` → Multiple component exports
- Pattern: Re-export from `ui/` subdirectory

### UI Component Variants:
- Purpose: Multiple implementations for same component
- Examples:
  - `src/shared/ui/Button/Button.tsx`, `Button-Evolution.tsx`, `Button-Enhanced.tsx`
  - `src/widgets/Navbar/ui/Navbar/Navbar.tsx`, `Navbar-Evolution.tsx`, `Navbar-Enhanced.tsx`
- Pattern: Version-stamped files for A/B testing or gradual rollout

## Entry Points

### Application Entry:
- Location: `src/app/layout.tsx`
- Triggers: Any page request
- Responsibilities: Global layout, providers (Web3), fonts, metadata, ErrorBoundary

### Page Entry Points:
- `src/app/page.tsx` - Home page
- `src/app/platform/page.tsx` - Platform page
- `src/app/ecosystem-status/page.tsx` - Ecosystem status
- `src/app/unit-profile/page.tsx` - Unit profile
- `src/app/events/page.tsx` - Events page

### API Entry Points:
- `src/app/api/chat/route.ts` - Chat AI endpoint
- `src/app/api/health/route.ts` - Health check

## Error Handling

**Strategy:** ErrorBoundary with fallback UI

**Patterns:**
- Global ErrorBoundary in `src/app/layout.tsx` wraps entire app
- Shared ErrorBoundary component in `src/shared/ui/ErrorBoundary/ErrorBoundary.tsx`
- API routes return structured error responses with proper HTTP status codes

## Cross-Cutting Concerns

**Logging:** 
- Centralized logger in `src/shared/lib/logger.ts`
- Used by API routes and server-side code

**Validation:**
- API routes validate request bodies with explicit type checks
- Component props use TypeScript interfaces from shared types

**Authentication:**
- Web3-based using RainbowKit + Wagmi
- WalletConnect project ID in environment variables
- Cookie-based session for SSR support

---

*Architecture analysis: 2026-03-02*
