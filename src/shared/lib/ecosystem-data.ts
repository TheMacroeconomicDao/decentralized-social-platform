/**
 * Данные экосистемы Gybernaty
 * Основано на реальной структуре GYBERNATY-ECOSYSTEM + Investment Deck 2026
 */

import { EcosystemMetrics, EcosystemProject, ProjectCategory } from "@/shared/types/ecosystem";

export const ecosystemProjects: EcosystemProject[] = [
  // ═══════════════════════════════════════════════════
  // Cluster: CSC (Core Social Components)
  // Directory: CSC/
  // ═══════════════════════════════════════════════════
  {
    id: "dsp",
    name: "DSP",
    shortName: "DSP",
    category: "web3-apps",
    cluster: "csc",
    status: "production",
    isCore: true,
    description: "Децентрализованная социальная платформа сообщества Gybernaty с AI-ассистентом",
    keyFeatures: [
      "Gybernaty AI Assistant (Claude Sonnet)",
      "3D Ecosystem Visualization",
      "Unit Profile с DUNA-CLA",
      "Feature-Sliced Design архитектура",
      "Docker + Kubernetes deployment",
    ],
    technologies: [
      "Next.js 15",
      "React 18",
      "Three.js / R3F",
      "Framer Motion",
      "SCSS/Sass",
    ],
    connections: ["gprod", "unit-manager-dao", "g-wallet", "ddp"],
  },
  {
    id: "unit-manager-dao",
    name: "Unit Manager DAO",
    shortName: "Unit Manager",
    category: "blockchain-infra",
    cluster: "csc",
    status: "development",
    progress: 50,
    description: "Upgradeable система смарт-контрактов для управления участниками DAO",
    keyFeatures: [
      "Иерархическая система ролей",
      "Автоматизированное голосование",
      "Система наград",
      "EIP-712 подписи",
      "Деградация статуса при неактивности",
    ],
    technologies: ["Solidity 0.8.20+", "OpenZeppelin (UUPS, Governor)", "Hardhat"],
    connections: ["dsp", "the-macroeconomic-dao"],
  },

  // ═══════════════════════════════════════════════════
  // Cluster: MarketProjects
  // Directory: MarketProjects/
  // ═══════════════════════════════════════════════════
  {
    id: "maximus",
    name: "MAXIMUS",
    shortName: "MAXIMUS",
    category: "ai-content",
    cluster: "market",
    status: "production",
    description: "Мультиагентная система для автоматизации маркетинга с 5 AI-агентами",
    keyFeatures: [
      "Генерация контента за <30 секунд",
      "Advanced Video Prompting",
      "Высокая точность предсказания вирусности",
      "Мультиплатформенность (Telegram, Instagram, YouTube, TikTok)",
      "Автоматизация от стратегии до публикации",
    ],
    technologies: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "Prisma + PostgreSQL",
      "Puter.js (GPT-5, Claude Sonnet 4, Grok-4)",
    ],
    connections: ["cag-chains", "multi-swarm"],
  },
  {
    id: "lqd",
    name: "LQD",
    shortName: "LQD",
    category: "crypto-wallets",
    cluster: "market",
    status: "production",
    description: "Микросервисная система для безопасного управления криптокошельками",
    keyFeatures: [
      "Микросервисная архитектура (Go + TypeScript)",
      "AES-256-GCM шифрование",
      "Multi-chain (Ethereum, Sepolia, Optimism, Arbitrum)",
      "75+ тестов (оценка 8.5/10)",
      "gRPC для быстрой коммуникации",
    ],
    technologies: ["Go 1.23+", "TypeScript", "Node.js 18+", "gRPC", "Docker + Kubernetes"],
    connections: ["g-wallet", "cantonfi"],
  },
  {
    id: "cantonfi",
    name: "CantonFi (LQD-BANKS)",
    shortName: "CantonFi",
    category: "defi-finance",
    cluster: "market",
    status: "development",
    progress: 65,
    description: "Платформа для институционального DeFi-кредитования с B2B и P2P возможностями",
    keyFeatures: [
      "B2B кредитование для малого и среднего бизнеса",
      "P2P yield opportunities",
      "Многоуровневая система страхования",
      "Real-time аналитика и мониторинг",
      "Полная прозрачность через блокчейн",
    ],
    technologies: [
      "NestJS",
      "TypeScript",
      "Solidity",
      "BSC (Binance Smart Chain)",
      "OpenZeppelin Governor",
    ],
    connections: ["lqd", "canton-otc"],
  },
  {
    id: "g-wallet",
    name: "G-Wallet",
    shortName: "G-Wallet",
    category: "crypto-wallets",
    cluster: "market",
    status: "development",
    progress: 70,
    description: "Криптокошелек с Graph RAG системой и AI-ассистентом",
    keyFeatures: [
      "Graph RAG система (3 режима работы)",
      "AI Chat с 10+ моделями",
      "Multi-chain поддержка (Ethereum, Solana, BSC, Polygon, Arbitrum)",
      "Bank-level security (AES-256, biometric auth)",
      "Real-time market intelligence",
    ],
    technologies: ["Flutter 3.19+", "Dart 3.3+", "OpenAI API + Puter.js", "ObjectBox", "Firebase"],
    connections: ["lqd", "dsp"],
  },
  {
    id: "pswmeta",
    name: "PowerSwapMeta",
    shortName: "PSWMeta",
    category: "defi-finance",
    cluster: "market",
    status: "development",
    progress: 55,
    description: "DEX инфраструктура и мета-агрегатор для обмена криптовалют",
    keyFeatures: [
      "Мета-агрегация DEX",
      "Cross-chain свопы",
      "MEV-protection",
      "Лимитные ордера",
      "Multi-chain routing",
    ],
    technologies: ["TypeScript", "Solidity", "Uniswap V3", "1inch API"],
    connections: ["lqd", "cantonfi"],
  },
  {
    id: "trader-agent",
    name: "TRADER-AGENT",
    shortName: "TRADER-AGENT",
    category: "trading-analytics",
    cluster: "market",
    status: "production",
    description: "AI трейдинг-ассистент через MCP Server в Cursor IDE",
    keyFeatures: [
      "Real-time анализ крипторынка",
      "Поиск точек входа (>70% вероятность)",
      "Детальное объяснение каждого решения",
      "24/7 мониторинг позиций",
      "31 инструмент (12 analysis + 19 trading)",
    ],
    technologies: [
      "Python (MCP Server)",
      "Node.js",
      "Bybit API integration",
    ],
    connections: ["maximus"],
  },
  {
    id: "multi-swarm",
    name: "Multi-Swarm System",
    shortName: "Multi-Swarm",
    category: "enterprise-infra",
    cluster: "market",
    status: "development",
    progress: 65,
    description: "Enterprise-grade distributed AI agent platform",
    keyFeatures: [
      "AutoAgent Generation",
      "Internet of Agents (P2P координация)",
      "Graph Neural Coordination",
      "Self-Healing Architecture",
      "Enterprise Observability",
    ],
    technologies: [
      "TypeScript + Python",
      "Rust",
      "Apache Kafka",
      "CockroachDB + Redis",
      "Prometheus + Grafana",
    ],
    connections: ["cag-chains", "gprod", "maximus"],
  },
  {
    id: "multiagent-ide",
    name: "Multiagent IDE",
    shortName: "MA-IDE",
    category: "ai-content",
    cluster: "market",
    status: "development",
    progress: 40,
    description: "Мультиагентная IDE для разработки с координацией AI-агентов",
    keyFeatures: [
      "Мультиагентная координация",
      "Интеграция с LLM",
      "Real-time collaboration",
      "Code generation pipeline",
    ],
    technologies: ["TypeScript", "VS Code Extension API", "LangChain"],
    connections: ["multi-swarm", "cag-chains"],
  },

  // ═══════════════════════════════════════════════════
  // Cluster: NESX (Enterprise)
  // Directory: NESX/
  // ═══════════════════════════════════════════════════
  {
    id: "gprod",
    name: "GPROD",
    shortName: "GPROD",
    category: "enterprise-infra",
    cluster: "nesx",
    status: "production",
    isCore: true,
    description: "Enterprise-grade monorepo для масштабируемой микросервисной архитектуры",
    keyFeatures: [
      "Monorepo архитектура",
      "Microservices ready (NestJS backend)",
      "Modern frontend (React + FSD)",
      "Enterprise security (JWT, SSL, RBAC)",
      "Docker + Kubernetes native",
    ],
    technologies: [
      "NestJS",
      "TypeScript",
      "React",
      "Vite",
      "PostgreSQL",
      "Prisma",
      "Docker",
      "Kubernetes",
    ],
    connections: ["dsp", "multi-swarm", "summum"],
  },

  // ═══════════════════════════════════════════════════
  // Cluster: ZWM (Distributed Work Management)
  // Directory: ZWM/
  // ═══════════════════════════════════════════════════
  {
    id: "zwm",
    name: "ZWM",
    shortName: "ZWM",
    category: "enterprise-infra",
    cluster: "zwm",
    status: "development",
    progress: 35,
    description: "Distributed Work Management — управление распределённой работой на Rust",
    keyFeatures: [
      "Rust-based microservices (crates)",
      "Task orchestration",
      "Distributed state machine",
      "P2P work coordination",
    ],
    technologies: ["Rust", "Tokio", "gRPC", "NATS"],
    connections: ["gprod", "multi-swarm"],
  },

  // ═══════════════════════════════════════════════════
  // Cluster: StrategicPartners
  // Directory: StrategicPartners/
  // ═══════════════════════════════════════════════════
  {
    id: "canton-otc",
    name: "Canton OTC",
    shortName: "Canton OTC",
    category: "defi-finance",
    cluster: "partners",
    status: "production",
    description: "Безопасная OTC-платформа для обмена Canton Coin на USDT",
    keyFeatures: [
      "Manual OTC Exchange с 5-этапной верификацией",
      "USDT (TRC-20) поддержка",
      "QR Code payments",
      "Solver Node для автоматического исполнения",
    ],
    technologies: ["Next.js 15", "TypeScript", "NEAR Protocol", "REF Finance + Pyth Network"],
    connections: ["cantonfi", "tech-hy"],
  },
  {
    id: "kikimora",
    name: "KIKIMORA",
    shortName: "KIKIMORA",
    category: "ai-content",
    cluster: "partners",
    status: "development",
    progress: 45,
    description: "AI-платформа стратегического партнёра для автоматизации бизнес-процессов",
    keyFeatures: [
      "AI Business Automation",
      "Process mining",
      "Intelligent workflows",
      "Partner integration API",
    ],
    technologies: ["Python", "FastAPI", "PostgreSQL", "Redis"],
    connections: ["maximus", "cag-chains"],
  },
  {
    id: "tech-hy",
    name: "TECH-HY Ecosystem",
    shortName: "TECH-HY",
    category: "defi-finance",
    cluster: "partners",
    status: "production",
    description: "DeFi-экосистема на BSC с двумя токенами и системой стейкинга",
    keyFeatures: [
      "VC Token (utility) и VG Token (governance)",
      "Burn and Earn механизм",
      "NFT boosters для стейкинга",
      "DAO governance через OpenZeppelin Governor",
    ],
    technologies: ["Solidity", "BSC (Binance Smart Chain)", "PancakeSwap", "OpenZeppelin Governor"],
    connections: ["canton-otc"],
  },

  // ═══════════════════════════════════════════════════
  // Cluster: CybersociumFoundation
  // Directory: CybersociumFoundation/
  // ═══════════════════════════════════════════════════
  {
    id: "the-macroeconomic-dao",
    name: "The Macroeconomic DAO",
    shortName: "TMD",
    category: "blockchain-infra",
    cluster: "foundation",
    status: "production",
    description: "DAO для управления экосистемой, казначейством и макроэкономической политикой",
    keyFeatures: [
      "DAO governance",
      "Treasury management",
      "Voting mechanisms",
      "Economic policy framework",
      "DUNA-CLA v1.0",
    ],
    technologies: ["Solidity", "OpenZeppelin Governor", "IPFS"],
    connections: ["dsp", "unit-manager-dao", "summum"],
  },
  {
    id: "summum",
    name: "SUMMUM Network",
    shortName: "SUMMUM",
    category: "blockchain-infra",
    cluster: "foundation",
    status: "testnet",
    progress: 60,
    description: "Приватный блокчейн на Substrate с SubstraTEE для приватности",
    keyFeatures: [
      "Приватность через DAML модель",
      "1000+ TPS, латентность <2 секунды",
      "Низкие комиссии (1-5 центов)",
      "TEE интеграция (Intel SGX / AMD SEV)",
      "SUMMUM токен с deflationary механизмом",
    ],
    technologies: ["Substrate", "Rust", "DAML", "TEE (Trusted Execution Environment)"],
    connections: ["gprod", "the-macroeconomic-dao"],
  },

  // ═══════════════════════════════════════════════════
  // Cluster: Infrastructure (standalone repos)
  // Directories: cag-chains/, cruster/, dev-ops/, open-processor/
  // ═══════════════════════════════════════════════════
  {
    id: "cag-chains",
    name: "CAG-Chains",
    shortName: "CAG-Chains",
    category: "ai-content",
    cluster: "infra",
    status: "production",
    description: "Экосистема где AI-экспертиза становится торгуемым цифровым активом",
    keyFeatures: [
      "CAG-Nodes → Chain Nodes",
      "Marketplace для торговли AI-компонентами",
      "Immutable contexts через IPFS",
      "Мгновенное развертывание экспертов",
      "Oracle для автоматического планирования",
    ],
    technologies: [
      "Bun 1.1+",
      "Hono",
      "TypeScript",
      "IPFS (Kubo, js-ipfs, Pinata)",
      "PostgreSQL + Redis + Drizzle ORM",
    ],
    connections: ["maximus", "multi-swarm", "kikimora"],
  },
  {
    id: "cruster",
    name: "Cruster",
    shortName: "Cruster",
    category: "enterprise-infra",
    cluster: "infra",
    status: "development",
    progress: 30,
    description: "Cluster orchestration и управление распределённой инфраструктурой",
    keyFeatures: [
      "Cluster management",
      "Container orchestration",
      "Service mesh",
      "Auto-scaling",
    ],
    technologies: ["Rust", "Docker", "Kubernetes", "gRPC"],
    connections: ["gprod", "devops"],
  },
  {
    id: "devops",
    name: "DevOps",
    shortName: "DevOps",
    category: "enterprise-infra",
    cluster: "infra",
    status: "production",
    description: "CI/CD пайплайны, мониторинг и инфраструктура развёртывания",
    keyFeatures: [
      "CI/CD pipelines",
      "Infrastructure as Code",
      "Monitoring & alerting",
      "Container registry",
    ],
    technologies: ["GitHub Actions", "Docker", "Kubernetes", "Terraform", "Prometheus"],
    connections: ["gprod", "cruster"],
  },
  {
    id: "ddp",
    name: "DDP",
    shortName: "DDP",
    category: "blockchain-infra",
    cluster: "infra",
    status: "development",
    progress: 25,
    description: "Decentralized Data Platform — IPFS storage, P2P messaging, E2E encryption",
    keyFeatures: [
      "IPFS storage & content registry",
      "E2E encryption",
      "ACL smart contracts",
      "P2P messaging layer",
    ],
    technologies: ["IPFS/Helia", "TypeScript", "Solidity", "libp2p"],
    connections: ["dsp", "gprod"],
  },
];

export const ecosystemMetrics: EcosystemMetrics = {
  totalProjects: ecosystemProjects.length,
  productionReady: ecosystemProjects.filter(p => p.status === 'production').length,
  inDevelopment: ecosystemProjects.filter(p => p.status === 'development' || p.status === 'testnet').length,
  technologies: 60,
  teamSize: 20,
  developmentCost: "$2.5M+",
};

/**
 * Получить проекты по категории
 */
export function getProjectsByCategory(category: ProjectCategory): EcosystemProject[] {
  return ecosystemProjects.filter((project) => project.category === category);
}

/**
 * Получить проекты по статусу
 */
export function getProjectsByStatus(status: EcosystemProject["status"]): EcosystemProject[] {
  return ecosystemProjects.filter((project) => project.status === status);
}

/**
 * Получить проекты по кластеру
 */
export function getProjectsByCluster(cluster: string): EcosystemProject[] {
  return ecosystemProjects.filter((project) => project.cluster === cluster);
}

/**
 * Получить все технологии из всех проектов
 */
export function getAllTechnologies(): string[] {
  const techSet = new Set<string>();
  ecosystemProjects.forEach((project) => {
    project.technologies.forEach((tech) => techSet.add(tech));
  });
  return Array.from(techSet).sort();
}
