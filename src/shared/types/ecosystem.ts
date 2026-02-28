/**
 * Types for Gybernaty Ecosystem
 * Based on Investment Deck 2026
 */

export type ProjectStatus = "production" | "development" | "testnet";

export type ProjectCategory =
  | "ai-content"
  | "defi-finance"
  | "crypto-wallets"
  | "blockchain-infra"
  | "web3-apps"
  | "trading-analytics"
  | "enterprise-infra";

export type CoreComponent =
  | "dsp"
  | "gprod"
  | "sapp(messager comunity)"
  | "the_macroeconomic_dao"
  | "ddp";

export interface CoreComponentInfo {
  id: CoreComponent;
  name: string;
  fullName: string;
  description: string;
  function: string;
  layer: "frontend" | "backend" | "data" | "blockchain" | "storage";
  color: string;
  position: [number, number, number];
  concept: string;
  value: string;
  connections: string[];
}

export interface EcosystemProject {
  id: string;
  name: string;
  shortName: string;
  category: ProjectCategory;
  status: ProjectStatus;
  isCore?: boolean; // Core infrastructure (DSP, GPROD)
  description: string;
  keyFeatures: string[];
  technologies: string[];
  position?: [number, number, number]; // для 3D визуализации
  connections?: string[]; // ID связанных проектов
  progress?: number; // процент готовности (для development)
  website?: string;
  github?: string;
}

export interface EcosystemMetrics {
  totalProjects: number;
  productionReady: number;
  inDevelopment: number;
  technologies: number;
  teamSize: number;
  developmentCost: string; // в миллионах
}

export interface CategoryInfo {
  id: ProjectCategory;
  name: string;
  description: string;
  color: string;
  icon?: string;
  concept: string;
  value: string;
}

export const CATEGORIES: Record<ProjectCategory, CategoryInfo> = {
  "ai-content": {
    id: "ai-content",
    name: "AI & Content Generation",
    description: "Революционные AI-решения для генерации контента и автоматизации",
    color: "#00d4ff",
    concept: "Интеллект",
    value: "Автоматизация создания контента и экспертизы",
  },
  "defi-finance": {
    id: "defi-finance",
    name: "DeFi & Financial Infrastructure",
    description: "Децентрализованные финансовые платформы и инфраструктура",
    color: "#42b8f3",
    concept: "Финансы",
    value: "Децентрализованное кредитование, trading, OTC",
  },
  "crypto-wallets": {
    id: "crypto-wallets",
    name: "Crypto Wallets & Infrastructure",
    description: "Безопасные криптокошельки и инфраструктура для управления активами",
    color: "#d49d32",
    concept: "Управление Активами",
    value: "Безопасное хранение и управление криптоактивами",
  },
  "blockchain-infra": {
    id: "blockchain-infra",
    name: "Blockchain Infrastructure",
    description: "Блокчейн-инфраструктура и приватные сети",
    color: "#f5576c",
    concept: "Инфраструктура",
    value: "Приватные блокчейны и DAO-управление",
  },
  "web3-apps": {
    id: "web3-apps",
    name: "Web3 Applications",
    description: "Децентрализованные приложения и социальные платформы",
    color: "#9c27b0",
    concept: "Приложения",
    value: "Социальные платформы и пользовательские интерфейсы",
  },
  "trading-analytics": {
    id: "trading-analytics",
    name: "Trading & Analytics",
    description: "AI-ассистенты для трейдинга и аналитики рынка",
    color: "#ff9800",
    concept: "Аналитика",
    value: "AI-трейдинг и рыночная аналитика",
  },
  "enterprise-infra": {
    id: "enterprise-infra",
    name: "Enterprise Infrastructure",
    description: "Enterprise-grade инфраструктура и платформы",
    color: "#4caf50",
    concept: "Предприятие",
    value: "Корпоративные решения и distributed AI",
  },
};

export const CORE_COMPONENTS: CoreComponentInfo[] = [
  {
    id: "dsp",
    name: "DSP",
    fullName: "Decentralized Social Platform",
    description: "The sensory cortex — user interface and intent translation",
    function: "Wallet connection, AI chat, real-time updates, content management",
    layer: "frontend",
    color: "#00d4ff",
    position: [0, 0, 0],
    concept: "Точка Входа",
    value: "Бесшовный UX, доступ к AI-ассистенту, управление кошельком",
    connections: ["gprod", "sapp(messager comunity)", "the_macroeconomic_dao"],
  },
  {
    id: "gprod",
    name: "GPROD",
    fullName: "Gybernaty Production Backend",
    description: "The processing brain — authentication, indexing, orchestration",
    function:
      "SIWE verification, Activity Signer, Event Indexer, Recovery, AI Proxy",
    layer: "backend",
    color: "#42b8f3",
    position: [1.2, 0.3, 0.5],
    concept: "Нервная Система",
    value: "Единая точка входа для API, безопасность, масштабируемость",
    connections: [
      "dsp",
      "sapp(messager comunity)",
      "the_macroeconomic_dao",
      "ddp",
    ],
  },
  {
    id: "sapp(messager comunity)",
    name: "SAPP",
    fullName: "Social App — Messenger & Community",
    description: "The hippocampus — community messaging and social coordination",
    function:
      "Real-time messaging, community channels, social graph, notifications",
    layer: "data",
    color: "#9c27b0",
    position: [-1.2, -0.2, 0.8],
    concept: "Социальная Ткань",
    value: "Коммуникация, координация сообщества, социальный граф",
    connections: ["dsp", "gprod", "ddp"],
  },
  {
    id: "the_macroeconomic_dao",
    name: "TMD",
    fullName: "The Macroeconomic DAO",
    description:
      "The spinal cord — governance, treasury, macroeconomic decisions",
    function: "DAO governance, treasury management, voting, economic policy",
    layer: "blockchain",
    color: "#ff6b35",
    position: [0, -1.0, -1.0],
    concept: "Управление Экосистемой",
    value:
      "Децентрализованное управление, казначейство, экономическая политика",
    connections: ["gprod", "dsp"],
  },
  {
    id: "ddp",
    name: "DDP",
    fullName: "Decentralized Data Platform",
    description:
      "Neural pathways (Phase 2) — permanent storage, P2P messaging",
    function: "IPFS storage, content registry, E2E encryption, ACL contracts",
    layer: "storage",
    color: "#4caf50",
    position: [0, 1.5, -0.5],
    concept: "Нейронные Пути",
    value: "Устойчивость, цензуроустойчивость, перманентность",
    connections: ["dsp", "sapp(messager comunity)", "gprod"],
  },
];
