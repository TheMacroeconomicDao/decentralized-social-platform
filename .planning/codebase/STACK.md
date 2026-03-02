# Technology Stack

**Analysis Date:** 2026-03-02

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code (components, hooks, utilities, API routes)
- JavaScript (ES2020) - Configuration and build scripts

**Secondary:**
- SCSS - Component styling via SASS preprocessor

## Runtime

**Environment:**
- Node.js (v18+) - Next.js runtime
- Next.js 16.1.6 - React framework with both client and server rendering

**Package Manager:**
- npm 10+ (package.json/npm)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.1.6 - Full-stack React framework with App Router
- React 19.2.4 - UI library

**Web3:**
- wagmi 2.15.6 - Ethereum interaction library
- viem 2.46.3 - Low-level Ethereum client
- @rainbow-me/rainbowkit 2.2.8 - Wallet connection UI

**3D/Visualization:**
- three 0.159.0 - 3D graphics library
- @react-three/fiber 9.5.0 - React renderer for Three.js
- @react-three/drei 10.7.7 - Useful helpers for React Three Fiber

**Animation:**
- framer-motion 12.34.3 - Animation library for React

**Data & State:**
- @tanstack/react-query 5.90.21 - Data fetching and caching

**IPFS/Decentralized Storage:**
- helia 5.4.2 - IPFS implementation in JavaScript
- @helia/http 2.1.2 - HTTP transport for Helia
- @helia/json 4.0.6 - JSON codec for IPFS
- @helia/unixfs 5.0.3 - UnixFS file system for IPFS
- ipfs-http-client 60.0.1 - Legacy IPFS client (deprecated, migration to Helia in progress)

**Cryptography:**
- @noble/hashes 1.8.0 - Cryptographic hash functions
- @noble/secp256k1 2.3.0 - Elliptic curve cryptography
- crypto-js 4.2.0 - JavaScript crypto library

**AI/Chat:**
- OpenAI API (GPT-4) - Server-side AI chat
- Puter AI (Claude 3.7 Sonnet) - Client-side fallback AI chat

**Content:**
- react-markdown 10.1.0 - Markdown rendering
- remark-gfm 4.0.1 - GitHub Flavored Markdown support
- rehype-highlight 7.0.2 - Syntax highlighting

**Utilities:**
- react-responsive 9.0.2 - Responsive design utilities
- sharp 0.34.5 - Image optimization

**Build/Dev:**
- sass 1.97.3 - SCSS preprocessor
- eslint 9.27.0 - Linting
- eslint-config-next 16.1.6 - Next.js ESLint config
- critters 0.0.24 - CSS inlining for performance

**Testing:**
- Playwright 1.58.2 - E2E testing framework
- pino-pretty 13.1.3 - Logging formatter for dev

## Key Dependencies

**Critical:**
- `next: ^16.1.6` - Core framework
- `react: ^19.2.4` - UI library
- `wagmi: ^2.15.6` + `viem: ^2.46.3` - Web3 connectivity
- `@rainbow-me/rainbowkit: ^2.2.8` - Wallet UI
- `helia: ^5.4.2` - IPFS for decentralized storage

**AI Integration:**
- OpenAI API - Primary chat backend (GPT-4)
- Puter AI - Fallback client-side chat (Claude 3.7 Sonnet)

**Visualization:**
- `three: ^0.159.0` + React Three Fiber - 3D ecosystem visualization

## Configuration

**TypeScript:**
- `tsconfig.json` - Strict mode enabled, ESNext modules, JSX React JSX
- Path alias: `@/*` maps to `./src/*`

**ESLint:**
- `.eslintrc.json` - Extends `next/core-web-vitals`

**Next.js:**
- `next.config.js` - Standalone output, image optimization, CSP headers, webpack config
- Turbopack support enabled (Next.js 16 default)

**Environment Variables:**
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - Required for wallet connections
- `OPENAI_API_KEY` - Required for server-side AI chat (server-side only, not NEXT_PUBLIC_)

**Optional:**
- `NEXT_PUBLIC_API_URL` - Custom API endpoint override
- `NODE_ENV` - Environment (development/production)

## Platform Requirements

**Development:**
- Node.js 18+
- npm 10+
- 2GB+ RAM recommended (Next.js build is memory-intensive)
- Git

**Production:**
- Docker containerization
- Kubernetes cluster (for stage/prod deployment)
- GitHub Container Registry (ghcr.io)
- GitLab CI/CD pipeline

---

*Stack analysis: 2026-03-02*
