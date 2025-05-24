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
# Clone repository
git clone https://github.com/TheMacroeconomicDao/decentralized-social-platform.git
cd decentralized-social-platform

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Docker Development

```bash
# Build and run
docker-compose up --build

# Or manually
docker build -t dsp:latest .
docker run -p 3000:3000 dsp:latest
```

### Stage Deployment

```bash
# Manual deployment to k3s (stage)
./deploy-stage.sh

# Or via GitHub Actions (automatic on push to stage branch)
git push origin stage
```

## 🏗 Project Architecture (FSD)

```
src/
├── app/                    # Next.js App Router pages
│   ├── aic/               # AI & Creativity page
│   ├── events/            # Events page
│   ├── experiment/        # Experiment page
│   ├── platform/          # Platform page
│   └── globals.css        # Global styles
├── entities/              # Business entities
│   ├── CardMember/        # Team member cards
│   ├── EventCard/         # Event components
│   ├── Roadmap/           # Roadmap entities
│   └── SocialRoadmapCard/ # Social roadmap components
├── shared/                # Shared components & utilities
│   ├── constants/         # App constants
│   ├── hooks/             # Reusable React hooks
│   ├── ui/                # UI components
│   │   ├── SvgIcons/      # Icon components (AiIcon, AgentIcon, etc.)
│   │   ├── Button/        # Button components
│   │   ├── MarkdownRenderer/ # Markdown rendering
│   │   └── ...
│   └── types/             # TypeScript types
└── widgets/               # Composite widgets
    ├── Chat/              # AI Chat system
    │   ├── api/           # Puter.js integration
    │   ├── model/         # Chat state management
    │   └── ui/            # Chat UI components
    ├── Header/            # Site header
    ├── Footer/            # Site footer
    ├── Navbar/            # Navigation
    └── ...
```

## ☸️ Deployment

### Stage Environment (k3s)
- **Domain**: stage.dsp.gyber.org
- **Auto-deploy**: On push to `stage` branch
- **Manual deploy**: `./deploy-stage.sh`

### Kubernetes Resources
```yaml
# Deployment: 2 replicas with health checks
# Service: ClusterIP on port 80
# Ingress: Traefik with TLS (Let's Encrypt)
```

### Required GitHub Secrets
```
K3S_HOST - k3s cluster IP
K3S_USERNAME - SSH username
K3S_SSH_KEY - SSH private key  
K3S_PORT - SSH port (22)
```

## 🔧 Recent Major Updates

### ✅ Chat System Implementation
- Complete AI chat integration with Claude 3.7 Sonnet
- Draggable/resizable popup with performance optimization
- Markdown rendering with GitHub Flavored Markdown
- Mobile-first responsive design

### ✅ Performance Optimizations
- RequestAnimationFrame for smooth animations (60fps)
- Batch state updates to prevent double re-renders
- Optimized useEffect dependencies and useCallback memoization
- Smart auto-scroll management

### ✅ Infrastructure Improvements
- k3s deployment configuration
- GitHub Actions CI/CD pipeline
- Stage environment setup
- Docker multi-stage builds


## 🛡 Performance & Security

### Performance Features
- **Lazy Loading**: Components load on demand
- **Code Splitting**: Optimized bundle sizes
- **Image Optimization**: Next.js Image component
- **Animation Performance**: 60fps smooth operations
- **Mobile Optimization**: Reduced icon count for performance

### Security Features
- **TLS Encryption**: Automatic SSL certificates
- **Container Security**: Non-root user in Docker
- **Environment Isolation**: Separate stage/production
- **Secret Management**: GitHub Actions secrets

## 🌐 About Gybernaty Community

Gybernaty is a progressive community of researchers and developers focused on:

- **Web3 Technologies**: Blockchain, DeFi, DAOs
- **Distributed Systems**: Decentralized architectures
- **Artificial Intelligence**: AI research and applications
- **Open Source**: Collaborative development

**Community Token**: GBR (0xa970cae9fa1d7cca913b7c19df45bf33d55384a9)

### Our Projects
- **DSP**: Decentralized Social Platform
- **LQD**: Liquidity solutions
- **SAPP**: Social Application Protocol
- **PowerSwapMeta**: Metadata exchange
- **Contact**: Communication tools

## 🤝 Contributing

We welcome contributions! Please see our [contribution guide](./docs/contribution/README.md).

### Development Process
1. Fork the repository
2. Create feature branch from `stage`
3. Follow FSD architecture patterns
4. Test on mobile and desktop
5. Submit Pull Request to `stage` branch

### Code Standards
- TypeScript strict mode
- SCSS modules for styling
- Feature-Sliced Design architecture
- Responsive design principles
- Performance-first approach

## 📖 Documentation

Comprehensive documentation available in [`docs/`](./docs/):

- [Architecture Overview](./docs/architecture/README.md)
- [Component Library](./docs/components/README.md)
- [Development Guide](./docs/development/README.md)
- [API Documentation](./docs/api/README.md)
- [Deployment Guide](./docs/deployment/README.md)
- [Contribution Guide](./docs/contribution/README.md)

## 📞 Community & Support

- **Telegram**: [HeadsHub](https://t.me/HeadsHub) - Main community
- **GitHub**: [TheMacroeconomicDao](https://github.com/TheMacroeconomicDao)
- **GitHub**: [GyberExperiment](https://github.com/GyberExperiment)
- **Documentation**: [Live Papers Wiki](https://github.com/GyberExperiment/live-papers/wiki)

## 📄 License

This project is open source. See [LICENSE](LICENSE) for details.

---

Built with ❤️ by Gybernaty Community 

