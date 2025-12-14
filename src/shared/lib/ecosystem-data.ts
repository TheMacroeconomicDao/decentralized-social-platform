/**
 * Данные экосистемы Gybernaty
 * Основано на Investment Deck 2026
 */

import { EcosystemProject, EcosystemMetrics, ProjectCategory } from '@/shared/types/ecosystem';

export const ecosystemProjects: EcosystemProject[] = [
  // Category 1: AI & Content Generation
  {
    id: 'maximus',
    name: 'MAXIMUS',
    shortName: 'MAXIMUS',
    category: 'ai-content',
    status: 'production',
    description: 'Революционная мультиагентная система для автоматизации маркетинга с 5 специализированными AI-агентами',
    keyFeatures: [
      'Генерация контента за <30 секунд',
      'Advanced Video Prompting',
      'Высокая точность предсказания вирусности',
      'Мультиплатформенность (Telegram, Instagram, YouTube, TikTok)',
      'Автоматизация от стратегии до публикации',
    ],
    technologies: [
      'Next.js 15',
      'TypeScript',
      'Tailwind CSS',
      'Prisma + PostgreSQL',
      'Puter.js (GPT-5, Claude Sonnet 4, Grok-4)',
    ],
    connections: ['cag-chains'],
  },
  {
    id: 'cag-chains',
    name: 'CAG-Chains',
    shortName: 'CAG-Chains',
    category: 'ai-content',
    status: 'production',
    description: 'Революционная экосистема, где AI-экспертиза становится торгуемым цифровым активом',
    keyFeatures: [
      'CAG-Nodes → Chain Nodes',
      'Marketplace для торговли AI-компонентами',
      'Immutable contexts через IPFS',
      'Мгновенное развертывание экспертов',
      'Oracle для автоматического планирования',
    ],
    technologies: [
      'Bun 1.1+',
      'Hono',
      'TypeScript',
      'IPFS (Kubo, js-ipfs, Pinata)',
      'PostgreSQL + Redis + Drizzle ORM',
    ],
    connections: ['maximus', 'multi-swarm'],
  },

  // Category 2: DeFi & Financial Infrastructure
  {
    id: 'cantonfi',
    name: 'CantonFi (LQD-BANKS)',
    shortName: 'CantonFi',
    category: 'defi-finance',
    status: 'development',
    progress: 65,
    description: 'Платформа для институционального DeFi-кредитования, объединяющая B2B кредитование с P2P yield opportunities',
    keyFeatures: [
      'B2B кредитование для малого и среднего бизнеса',
      'P2P yield opportunities',
      'Многоуровневая система страхования',
      'Real-time аналитика и мониторинг',
      'Полная прозрачность через блокчейн',
    ],
    technologies: [
      'NestJS',
      'TypeScript',
      'Solidity',
      'BSC (Binance Smart Chain)',
      'OpenZeppelin Governor',
    ],
    connections: ['lqd', 'canton-otc'],
  },
  {
    id: 'canton-otc',
    name: 'Canton OTC',
    shortName: 'Canton OTC',
    category: 'defi-finance',
    status: 'production',
    description: 'Безопасная OTC-платформа для обмена Canton Coin на USDT с ручной верификацией',
    keyFeatures: [
      'Manual OTC Exchange с 5-этапной верификацией',
      'USDT (TRC-20) поддержка',
      'QR Code payments',
      'Solver Node для автоматического исполнения',
      'Multi-step verification',
    ],
    technologies: [
      'Next.js 15',
      'TypeScript',
      'NEAR Protocol',
      'REF Finance + Pyth Network',
    ],
    connections: ['cantonfi'],
  },
  {
    id: 'tech-hy',
    name: 'TECH-HY Ecosystem',
    shortName: 'TECH-HY',
    category: 'defi-finance',
    status: 'production',
    description: 'Комплексная DeFi-экосистема на Binance Smart Chain с двумя токенами и системой стейкинга',
    keyFeatures: [
      'VC Token (utility) и VG Token (governance)',
      'Burn and Earn механизм',
      'NFT boosters для стейкинга',
      'DAO governance через OpenZeppelin Governor',
      'Staking программы',
    ],
    technologies: [
      'Solidity',
      'BSC (Binance Smart Chain)',
      'PancakeSwap',
      'OpenZeppelin Governor',
    ],
  },

  // Category 3: Crypto Wallets & Infrastructure
  {
    id: 'g-wallet',
    name: 'G-Wallet',
    shortName: 'G-Wallet',
    category: 'crypto-wallets',
    status: 'development',
    progress: 70,
    description: 'Криптокошелек с интегрированной Graph RAG системой и AI-ассистентом',
    keyFeatures: [
      'Graph RAG система (3 режима работы)',
      'AI Chat с 10+ моделями',
      'Multi-chain поддержка (Ethereum, Solana, BSC, Polygon, Arbitrum)',
      'Bank-level security (AES-256, biometric auth)',
      'Real-time market intelligence',
    ],
    technologies: [
      'Flutter 3.19+',
      'Dart 3.3+',
      'OpenAI API + Puter.js',
      'ObjectBox',
      'Firebase',
    ],
    connections: ['lqd'],
  },
  {
    id: 'lqd',
    name: 'LQD',
    shortName: 'LQD',
    category: 'crypto-wallets',
    status: 'production',
    description: 'Высокопроизводительная микросервисная система для безопасного управления криптовалютными кошельками',
    keyFeatures: [
      'Микросервисная архитектура (Go + TypeScript)',
      'AES-256-GCM шифрование',
      'Multi-chain (Ethereum, Sepolia, Optimism, Arbitrum)',
      '75+ тестов (оценка 8.5/10)',
      'gRPC для быстрой коммуникации',
    ],
    technologies: [
      'Go 1.23+',
      'TypeScript',
      'Node.js 18+',
      'gRPC',
      'Docker + Kubernetes',
    ],
    connections: ['g-wallet', 'cantonfi'],
  },

  // Category 4: Blockchain Infrastructure
  {
    id: 'summum',
    name: 'SUMMUM Network',
    shortName: 'SUMMUM',
    category: 'blockchain-infra',
    status: 'testnet',
    progress: 60,
    description: 'Приватный блокчейн на основе Substrate с интеграцией SubstraTEE для приватности',
    keyFeatures: [
      'Приватность через DAML модель',
      '1000+ TPS, латентность <2 секунды',
      'Низкие комиссии (1-5 центов)',
      'TEE интеграция (Intel SGX / AMD SEV)',
      'SUMMUM токен с deflationary механизмом',
    ],
    technologies: [
      'Substrate',
      'Rust',
      'DAML',
      'TEE (Trusted Execution Environment)',
    ],
  },
  {
    id: 'unit-manager-dao',
    name: 'Unit Manager DAO',
    shortName: 'Unit Manager',
    category: 'blockchain-infra',
    status: 'development',
    progress: 50,
    description: 'Upgradeable система смарт-контрактов для управления участниками DAO',
    keyFeatures: [
      'Иерархическая система ролей',
      'Автоматизированное голосование',
      'Система наград',
      'EIP-712 подписи',
      'Деградация статуса при неактивности',
    ],
    technologies: [
      'Solidity 0.8.20+',
      'OpenZeppelin (UUPS, Governor)',
      'Hardhat',
    ],
  },

  // Category 5: Web3 Applications
  {
    id: 'dsp',
    name: 'DSP',
    shortName: 'DSP',
    category: 'web3-apps',
    status: 'production',
    description: 'Децентрализованная социальная платформа сообщества Gybernaty с AI-ассистентом',
    keyFeatures: [
      'Gybernaty AI Assistant (Claude 3.7 Sonnet)',
      'Анимированные иконки (20+ криптовалют и технологий)',
      'Responsive design (mobile-first)',
      'Feature-Sliced Design архитектура',
      'Docker + Kubernetes deployment',
    ],
    technologies: [
      'Next.js 15.3.2',
      'React 18.2.0',
      'Puter.js + Claude 3.7 Sonnet',
      'Framer Motion',
      'SCSS/Sass',
    ],
    connections: ['g-wallet'],
  },
  {
    id: 'aura-domus',
    name: 'Aura Domus',
    shortName: 'Aura Domus',
    category: 'web3-apps',
    status: 'production',
    description: 'Элегантный веб-сайт мебельной компании с AI-консультантом',
    keyFeatures: [
      '4 категории мебели (65 изображений)',
      'AI-консультант по мебели',
      'Темная элегантная тема',
      'Полная мобильная адаптация',
    ],
    technologies: [
      'Next.js 15.3.2',
      'Framer Motion',
      'SCSS модули',
    ],
  },

  // Category 6: Trading & Analytics
  {
    id: 'trader-agent',
    name: 'TRADER-AGENT',
    shortName: 'TRADER-AGENT',
    category: 'trading-analytics',
    status: 'production',
    description: 'Интерактивный AI трейдинг-ассистент, работающий через MCP Server в Cursor IDE',
    keyFeatures: [
      'Real-time анализ крипторынка',
      'Поиск точек входа (>70% вероятность)',
      'Детальное объяснение каждого решения',
      'Открытие позиций после подтверждения',
      '24/7 мониторинг позиций',
    ],
    technologies: [
      'Python (MCP Server)',
      'Node.js',
      'Bybit API integration',
      '31 инструментов (12 analysis + 19 trading)',
    ],
  },

  // Category 7: Enterprise Infrastructure
  {
    id: 'gprod',
    name: 'GPROD',
    shortName: 'GPROD',
    category: 'enterprise-infra',
    status: 'production',
    description: 'Enterprise-grade monorepo для масштабируемой микросервисной архитектуры',
    keyFeatures: [
      'Monorepo архитектура',
      'Microservices ready (NestJS backend)',
      'Modern frontend (React + Feature-Sliced Design)',
      'Enterprise security (JWT, SSL, RBAC)',
      'Docker + Kubernetes native',
    ],
    technologies: [
      'NestJS',
      'TypeScript',
      'React',
      'Vite',
      'PostgreSQL',
      'Prisma',
      'Docker',
      'Kubernetes',
    ],
    connections: ['multi-swarm'],
  },
  {
    id: 'multi-swarm',
    name: 'Multi-Swarm System',
    shortName: 'Multi-Swarm',
    category: 'enterprise-infra',
    status: 'development',
    progress: 65,
    description: 'Enterprise-grade distributed AI agent platform для решения сложных проблем',
    keyFeatures: [
      'AutoAgent Generation (в разработке)',
      'Internet of Agents (P2P координация)',
      'Graph Neural Coordination',
      'Self-Healing Architecture',
      'Enterprise Observability',
    ],
    technologies: [
      'TypeScript + Python',
      'Rust',
      'Apache Kafka',
      'CockroachDB + Redis',
      'Prometheus + Grafana',
    ],
    connections: ['cag-chains', 'gprod'],
  },
];

export const ecosystemMetrics: EcosystemMetrics = {
  totalProjects: 14,
  productionReady: 9,
  inDevelopment: 4,
  technologies: 50,
  teamSize: 20,
  developmentCost: '$2.5M+',
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
export function getProjectsByStatus(status: EcosystemProject['status']): EcosystemProject[] {
  return ecosystemProjects.filter((project) => project.status === status);
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
