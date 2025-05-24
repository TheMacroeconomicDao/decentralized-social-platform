# Gybernaty DSP (Decentralized Social Platform)

🚀 **Next.js + k3s + GitHub Actions (Stage & Prod)**

## Environments
| Branch | URL | CI Job |
|--------|-----|--------|
| `stage` | https://stage.dsp.build.infra.gyber.org | Stage CD |
| `main`  | https://gyber.org | Prod CD (manual approval) |

## Local Quick-Start
# Gybernaty DSP - Decentralized Social Platform

Decentralized Social Platform of the Gybernaty community - a project to unite researchers and enthusiasts interested in Web3 technologies, blockchain, distributed computing, and artificial intelligence.

![Gybernaty Community](public/images/slides/main-slide.jpg)

## 🚀 Live Environments

- **Production**: [DSP Production](https://gyber.org) (from `main` branch)
- **Stage**: [stage.dsp.build.infra.gyber.org](https://stage.dsp.build.infra.gyber.org) (from `stage` branch)

## ✨ Key Features

### 🤖 AI Chat System
- **Gybernaty AI Assistant**: Integration with Claude 3.7 Sonnet via Puter.js
- **Draggable & Resizable**: Desktop chat window with 8 resize handles
- **Responsive Design**: Full-screen on mobile, windowed on desktop
- **Markdown Support**: Rich text rendering for AI responses
- **Custom Icons**: AiIcon for header, AgentIcon for chat messages
- **Auto-scroll & Performance**: Optimized state management with 60fps smooth operations

### 🎨 Visual & Animation System
- **Global Animated Icons**: 20+ cryptocurrency and technology icons floating across all pages
- **Responsive Animation**: Adaptive performance for different devices
- **Modern UI**: Substrate-style design with gradient borders and glassmorphism
- **Feature-Sliced Design**: Scalable architecture following FSD principles

### 🏗 Infrastructure & Deployment
- **Containerized**: Docker with multi-stage builds
- **Kubernetes Ready**: k3s deployment manifests with auto-scaling
- **CI/CD Pipeline**: GitHub Actions for stage and production deployments
- **TLS & Security**: Automatic SSL certificates via Let's Encrypt

## 🛠 Technology Stack

- **Frontend**: Next.js 15.3.2, React 18.2.0, TypeScript 5.1.6
- **AI Integration**: Puter.js + Claude 3.7 Sonnet
- **Animations**: Framer Motion 10.16.1
- **Styling**: SCSS/Sass with responsive design
- **Architecture**: Feature-Sliced Design (FSD)
- **Containerization**: Docker + Kubernetes (k3s)
- **CI/CD**: GitHub Actions
- **Markdown**: react-markdown with GitHub Flavored Markdown

## 📱 Responsive Design

Comprehensive mobile adaptation with unified breakpoint system:

- **Mobile**: ≤480px (full-screen chat, optimized animations)
- **Tablet**: 481-767px (hybrid mode with padding)
- **Desktop**: ≥768px (draggable/resizable chat, full features)
- **Large Desktop**: >1440px (maximum performance)

**Chat Adaptivity**:
- Mobile: Full-screen overlay
- Tablet: Centered with margins
- Desktop: Draggable window (350x400px to 800x900px)

**Animation Optimization**:
- Mobile: Maximum 3 icons for performance
- Desktop: Maximum 15+ icons for visual richness
- Smart icon generation every 3 seconds

## 🤖 AI Chat Features

### Core Functionality
- **System Prompt**: Custom Gybernaty AI personality with Web3/blockchain expertise
- **Multi-language**: Responds in user's language (Russian/English)
- **Project Knowledge**: Aware of DSP, LQD, SAPP, PowerSwapMeta projects
- **Community Token**: GBR token integration (0xa970cae9fa1d7cca913b7c19df45bf33d55384a9)

### Technical Implementation
- **State Management**: Optimized React hooks with batch updates
- **Performance**: RequestAnimationFrame for smooth resize/drag operations
- **Error Handling**: Comprehensive retry logic
- **Auto-scroll**: Smart message scroll management
- **Memory**: Chat history persistence

### Desktop Features
- **Drag & Drop**: Moveable chat window
- **8 Resize Handles**: Corner and edge resizing
- **Boundary Constraints**: Cannot resize/move outside viewport
- **Visual Feedback**: Hover effects and cursor changes

## 🎨 Icon System

### Animated Background Icons (20)
**Cryptocurrencies**: Bitcoin, Ethereum, Cardano, Solana, Polygon, Polkadot, Litecoin, BNB, NEAR, Ethereum Classic, Toncoin, Tron, Internet Computer

**Technologies**: React, Node.js, Next.js, Python, Flutter, Rust, Go

### Chat Icons
- **AiIcon**: Header avatar (from ai_icon.svg) - complex circuit-board design
- **AgentIcon**: Message avatars (from ai_agent.svg) - robot character design
- **SendIcon**: Custom send button replacing rocket emoji

## 📦 Quick Start

### Local Development

```bash
pnpm install          # или npm/yarn
pnpm dev              # http://localhost:3000
```

## Docker
```bash
docker build -t dsp:local .
docker run -p 3000:3000 dsp:local
```

## Infrastructure Sketch
```
k8s/
 ├─ cluster/          # Cluster-scope: ClusterIssuer, Istio TLS Cert
 ├─ addons/           # CronJobs: cleanup-old-rs, cert-monitor
 └─ overlays/
     ├─ stage/        # Traefik Ingress + Deployment/Service
     └─ prod/         # Istio Gateway / VirtualService + Canary + Deployment/Service
```

All manifests are applied via **Kustomize overlays**:
```bash
kubectl apply -k k8s/overlays/<stage|prod>
```

### Canary Releases (Prod)
Flagger gradually shifts traffic (10 % → 50 % → 100 %) and rolls back on < 99 % success-rate or >500 ms p99 latency.

## CI / CD
| Reusable WF | Purpose |
|-------------|---------|
| `_build-image.yml` | Build, cache, push image ➜ GHCR & verify tag with `skopeo` |
| `_deploy.yml`      | `kubectl apply -k …`, `kubectl set image`, `kubectl rollout status`, optional Flagger wait |

**Stage CD**
1. Trigger: push to `stage`.
2. Build image `dsp-stage:stage-<sha>` + `latest`.
3. Deploy overlay `k8s/overlays/stage`.
4. Telegram notify success / failure.

**Prod CD**
1. Trigger: push to `main` (requires GitHub *environment* approval).
2. Build image `dsp-prod:main-<sha>` + `latest`.
3. Deploy overlay `k8s/overlays/prod` (includes Canary & addons & cluster resources).
4. Wait Flagger promotion (<=30 min).
5. Telegram notify.

Secrets required in repo:
```
GHCR_USERNAME          # ghcr.io user/org
GHCR_TOKEN             # PAT (packages:write)
KUBE_CONFIG            # base64-encoded kubeconfig
TELEGRAM_BOT_TOKEN     # bot API token
TELEGRAM_CHAT_ID       # chat / group id
```

## Tech Stack
* Next.js · React · TypeScript
* Feature-Sliced Design
* Docker · GHCR
* k3s · Istio · Traefik · Flagger · cert-manager
* GitHub Actions

---
MIT License — Gybernaty Community

