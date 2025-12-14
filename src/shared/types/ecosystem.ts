/**
 * Типы для экосистемы Gybernaty
 * Основано на данных из Investment Deck 2026
 */

export type ProjectStatus = 'production' | 'development' | 'testnet';

export type ProjectCategory =
  | 'ai-content'
  | 'defi-finance'
  | 'crypto-wallets'
  | 'blockchain-infra'
  | 'web3-apps'
  | 'trading-analytics'
  | 'enterprise-infra';

export interface EcosystemProject {
  id: string;
  name: string;
  shortName: string;
  category: ProjectCategory;
  status: ProjectStatus;
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
  color: string; // цвет для визуализации
  icon?: string;
}

export const CATEGORIES: Record<ProjectCategory, CategoryInfo> = {
  'ai-content': {
    id: 'ai-content',
    name: 'AI & Content Generation',
    description: 'Революционные AI-решения для генерации контента и автоматизации',
    color: '#00d4ff',
  },
  'defi-finance': {
    id: 'defi-finance',
    name: 'DeFi & Financial Infrastructure',
    description: 'Децентрализованные финансовые платформы и инфраструктура',
    color: '#42b8f3',
  },
  'crypto-wallets': {
    id: 'crypto-wallets',
    name: 'Crypto Wallets & Infrastructure',
    description: 'Безопасные криптокошельки и инфраструктура для управления активами',
    color: '#d49d32',
  },
  'blockchain-infra': {
    id: 'blockchain-infra',
    name: 'Blockchain Infrastructure',
    description: 'Блокчейн-инфраструктура и приватные сети',
    color: '#f5576c',
  },
  'web3-apps': {
    id: 'web3-apps',
    name: 'Web3 Applications',
    description: 'Децентрализованные приложения и социальные платформы',
    color: '#9c27b0',
  },
  'trading-analytics': {
    id: 'trading-analytics',
    name: 'Trading & Analytics',
    description: 'AI-ассистенты для трейдинга и аналитики рынка',
    color: '#ff9800',
  },
  'enterprise-infra': {
    id: 'enterprise-infra',
    name: 'Enterprise Infrastructure',
    description: 'Enterprise-grade инфраструктура и платформы',
    color: '#4caf50',
  },
};
