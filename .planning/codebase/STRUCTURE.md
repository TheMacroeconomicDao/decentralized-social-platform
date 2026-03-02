# Codebase Structure

**Analysis Date:** 2026-03-02

## Directory Layout

```
decentralized-social-platform/
├── src/
│   ├── app/                    # Next.js App Router (pages, API, providers)
│   ├── widgets/                # Composed UI blocks (page sections)
│   ├── entities/               # Business domain objects
│   ├── features/               # Business features with interactions
│   ├── shared/                 # Reusable infrastructure
│   └── types/                  # Global TypeScript declarations
├── docs/                       # Documentation
├── public/                     # Static assets
├── package.json                # Dependencies
├── next.config.js             # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── .eslintrc.json              # ESLint configuration
```

## Directory Purposes

### `src/app/`:
- Purpose: Root application layer with Next.js App Router
- Contains:
  - Pages (home, platform, ecosystem-status, unit-profile, events, etc.)
  - API routes (`api/chat/route.ts`, `api/health/route.ts`)
  - Providers (`providers/Web3Provider.tsx`)
  - Global styles (`styles/global.scss`, etc.)
- Key files:
  - `layout.tsx` - Root layout with providers
  - `page.tsx` - Home page entry
  - `not-found.tsx` - 404 page

### `src/widgets/`:
- Purpose: Composed UI blocks - complete page sections
- Contains: Header, Footer, Navbar, Banner, Team, Slider, Chat, PartnerSection, etc.
- Key files:
  - `Navbar/index.ts` - Navigation bar with mobile/tablet/desktop variants
  - `Chat/index.ts` - AI Chat widget with provider abstraction
  - `Team/ui/Team.tsx` - Team display section

### `src/entities/`:
- Purpose: Business domain objects - data representations
- Contains: CardMember, EventCard, Roadmap, SocialRoadmapCard, TechnicalRoadmap, LaunchPad, ProjectCard, SocialMedia
- Structure: Each entity has `ui/` subfolder with components
- Key files:
  - `CardMember/ui/CardMember.tsx` - Team member cards
  - `Roadmap/ui/Roadmap.tsx` - Roadmap visualization
  - `TechnicalRoadmap/ui/technicalRoadmap/TechnicalRoadmap.tsx` - Tech roadmap

### `src/features/`:
- Purpose: Business features with user interactions
- Contains: WalletAuth, UnitProfile
- Structure: Each feature has `ui/` subfolder with components
- Key files:
  - `WalletAuth/ui/WalletConnectButton/WalletConnectButton.tsx` - Wallet connection
  - `WalletAuth/ui/WalletAuthModal/WalletAuthModal.tsx` - Auth modal
  - `UnitProfile/ui/UnitProfileView/UnitProfileView.tsx` - Profile display
  - `UnitProfile/ui/UnitProfileEditor/UnitProfileEditor.tsx` - Profile editor

### `src/shared/`:
- Purpose: Reusable infrastructure layer
- Subdirectories:
  - `ui/` - Base UI components (Button, Container, Logo, Toast, etc.)
  - `hooks/` - Custom React hooks
  - `lib/` - Utilities and helpers
  - `config/` - Configuration (web3.ts)
  - `types/` - TypeScript interfaces
  - `constants/` - Constants
  - `routes/` - Route definitions
  - `data/` - Mock data

### `src/types/`:
- Purpose: Global TypeScript declarations
- Contains: `scss.d.ts`, `react-three-fiber.d.ts`

## Key File Locations

### Entry Points:
- `src/app/layout.tsx` - Root layout, providers, fonts
- `src/app/page.tsx` - Home page
- `src/app/providers/Web3Provider.tsx` - Web3 context provider

### Configuration:
- `src/shared/config/web3.ts` - Wagmi/RainbowKit configuration
- `next.config.js` - Next.js build configuration
- `tsconfig.json` - TypeScript paths (`@/*` → `./src/*`)
- `.eslintrc.json` - ESLint rules

### Core Logic:
- `src/shared/lib/logger.ts` - Centralized logging
- `src/shared/lib/classNames/classNames.ts` - CSS class utility
- `src/shared/hooks/useUnitProfile.ts` - Profile data hook

### Testing:
- No dedicated test directory found - tests likely co-located or absent

## Naming Conventions

### Files:
- Components: PascalCase (`Navbar.tsx`, `Button.tsx`)
- Hooks: camelCase with `use` prefix (`useUnitProfile.ts`, `useToast.ts`)
- Utilities: PascalCase for classes, camelCase for functions
- Styles: Match component name (`.module.scss`)
- Index: Always `index.ts` for barrel exports

### Directories:
- PascalCase for components/directories (`CardMember/`, `WalletAuth/`)
- camelCase for utilities/hooks (`lib/`, `hooks/`)

### Components within directories:
- Main component: Same as parent (`src/widgets/Navbar/ui/Navbar/Navbar.tsx`)
- Variants: Suffix (`Button-Evolution.tsx`, `Button-Enhanced.tsx`)
- Sub-components: In `ui/` subfolder (`ui/CardMember.tsx`)

## Where to Add New Code

### New Page:
- Location: `src/app/[page-name]/page.tsx`
- Layout: Uses root layout from `src/app/layout.tsx`
- Example: `src/app/events/page.tsx`

### New Widget (Page Section):
- Location: `src/widgets/[WidgetName]/`
- Structure:
  ```
  src/widgets/NewWidget/
  ├── index.ts           # Barrel export
  ├── ui/
  │   └── NewWidget.tsx  # Main component
  └── NewWidget.module.scss
  ```
- Import in page: `import { NewWidget } from '@/widgets/NewWidget'`

### New Entity (Domain Object):
- Location: `src/entities/[EntityName]/`
- Structure:
  ```
  src/entities/NewEntity/
  ├── index.ts           # Barrel export
  ├── ui/
  │   └── NewEntity.tsx  # Component
  └── data/
      └── NewEntityData.ts  # Static data if needed
  ```

### New Feature (Business Feature):
- Location: `src/features/[FeatureName]/`
- Structure:
  ```
  src/features/WalletAuth/
  ├── index.ts           # Barrel export
  └── ui/
      ├── Component1/
      └── Component2/
  ```

### New Shared Component:
- Location: `src/shared/ui/[ComponentName]/`
- Structure:
  ```
  src/shared/ui/Button/
  ├── index.ts
  ├── Button.tsx
  └── Button.module.scss
  ```

### New Hook:
- Location: `src/shared/hooks/[hookName].ts`
- Naming: Prefix with `use` (`useAuth.ts`, `useData.ts`)

### New Utility:
- Location: `src/shared/lib/[utilityName].ts`
- Or create subdirectory: `src/shared/lib/[utilityName]/`

### New API Route:
- Location: `src/app/api/[endpoint]/route.ts`
- Method handlers: `GET`, `POST`, `PUT`, `DELETE` export functions

### New Type Definition:
- Location: `src/shared/types/[typeName].ts`
- Or extend existing: `src/shared/types/types.ts`

## Special Directories

### `src/app/api/`:
- Purpose: Next.js API routes
- Generated: No (code routes)
- Committed: Yes

### `public/`:
- Purpose: Static assets (images, fonts)
- Generated: No
- Committed: Yes
- Note: Images referenced in code (`/images/slides/`, `/images/teams/`)

### `docs/`:
- Purpose: Project documentation
- Contains: Architecture guides, deployment instructions, component catalog
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-03-02*
