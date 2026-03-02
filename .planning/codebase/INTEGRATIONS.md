# External Integrations

**Analysis Date:** 2026-03-02

## APIs & External Services

**AI Chat - Primary:**
- OpenAI API - Server-side AI chat
  - Endpoint: `https://api.openai.com/v1/chat/completions`
  - Model: GPT-4
  - Auth: `OPENAI_API_KEY` environment variable (server-side only)
  - Implementation: `src/app/api/chat/route.ts`
  - Features: Streaming support, in-memory response caching (5 min TTL)

**AI Chat - Fallback:**
- Puter AI - Client-side fallback AI chat
  - Endpoint: `https://js.puter.com/v2/` (loaded via script)
  - Model: Claude 3.7 Sonnet
  - Auth: Built into Puter SDK (free tier)
  - Implementation: `src/widgets/Chat/api/providers/PuterProvider.ts`
  - Features: Streaming support, browser-based execution

**Web3 - RPC Providers:**
- Ankr (primary RPC)
  - Networks: Ethereum, Polygon, Optimism, Arbitrum, Base, Sepolia
  - Endpoints: `https://rpc.ankr.com/{chain}`
  - Auth: Public (no API key required)
  - Implementation: `src/shared/config/web3.ts`
  - Note: Selected to avoid ad-blocker issues with other RPCs

**Web3 - Wallet Connection:**
- WalletConnect
  - Project ID: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (env var)
  - Fallback ID: `21fef48091f12692cad574a6f7753643` (hardcoded default)
  - Implementation: RainbowKit integration in `src/shared/config/web3.ts`

**Supported Blockchains:**
- Ethereum (mainnet)
- Polygon
- Optimism
- Arbitrum
- Base
- Sepolia (testnet)

## Data Storage

**Decentralized Storage (IPFS):**
- Helia (primary IPFS implementation)
  - Packages: `helia`, `@helia/http`, `@helia/json`, `@helia/unixfs`
  - Implementation: Client-side IPFS operations
  - Legacy: `ipfs-http-client` (deprecated, migration in progress)

**Local Storage:**
- Browser localStorage/cookieStorage via wagmi for wallet state persistence
- IndexedDB (client-side, for wagmi)

**Server-Side Caching:**
- In-memory Map for chat response caching
- Location: `src/app/api/chat/route.ts`
- TTL: 5 minutes

**No Traditional Database:**
- No PostgreSQL, MySQL, MongoDB detected
- All data stored on-chain or IPFS

## Authentication & Identity

**Wallet-Based Authentication:**
- RainbowKit + wagmi for Web3 wallet connections
- Supported wallets: MetaMask, WalletConnect, Coinbase Wallet, Rainbow
- Implementation: `src/features/WalletAuth/`
- Signature-based authentication for Unit Profiles

**No Traditional Auth:**
- No email/password authentication
- No OAuth providers (Google, GitHub, etc.)
- No session-based auth

## Monitoring & Observability

**Error Tracking:**
- Not detected (no Sentry, Bugsnag, or similar)

**Logs:**
- pino-pretty (dev dependency) - Development logging
- Implementation: `src/shared/lib/logger.ts`
- Custom logger created via pino

**Health Checks:**
- Endpoint: `/api/health`
- Implementation: `src/app/api/health/route.ts`

## CI/CD & Deployment

**Container Registry:**
- GitHub Container Registry (ghcr.io)
  - Image: `ghcr.io/themacroeconomicdao/decentralized-social-platform`
  - Tags: `dsp-stage`, `dsp-prod`, `latest`

**CI Pipeline:**
- GitLab CI
  - File: `.gitlab-ci.yml`
  - Stages: build, deploy
  - Build: Docker multi-stage
  - Registry: GitHub Container Registry

**Deployment:**
- Kubernetes (K8s)
  - Configuration: `k8s/overlays/stage/` and `k8s/overlays/prod/`
  - Stage: Auto-deploy on `stage` branch
  - Prod: Manual deploy on `main` branch

**Hosting:**
- Self-hosted Kubernetes cluster
- Not detected: Vercel, Netlify, AWS, GCP, Azure

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - WalletConnect project ID (client)
- `OPENAI_API_KEY` - OpenAI API key for server-side chat (server)

**Optional env vars:**
- `NEXT_PUBLIC_API_URL` - Custom API endpoint
- `NODE_ENV` - Environment (development/production)

**Secrets location:**
- `.env.local` (not committed to git)
- GitLab CI/CD variables for deployment secrets:
  - `$GHCR_USERNAME` - Container registry username
  - `$GHCR_TOKEN` - Container registry token
  - `$KUBE_CONTEXT` - Kubernetes context

## Webhooks & Callbacks

**Incoming:**
- None detected (no incoming webhooks)

**Outgoing:**
- AI Chat API responses to client requests
- Kubernetes deployment triggers via GitLab CI

---

*Integration audit: 2026-03-02*
