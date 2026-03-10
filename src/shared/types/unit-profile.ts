// ============================================
// IP Assignment & CLA Types
// ============================================

export interface DUNACLA {
  version: string;
  acceptedAt: number;
  signature: string;
  githubUsername?: string;
  claType: 'electronic' | 'on-chain';
}

export interface CLARecord {
  cla: DUNACLA;
  message: string;
  address: string;
  timestamp: number;
}

export type Specialisation = 'frontend' | 'backend' | 'fullstack' | 'devops' | 'blockchain' | 'ai-ml' | 'design' | 'research' | 'pm' | 'other';
export type QualificationLevel = 'junior' | 'middle' | 'senior' | 'lead' | 'principal';
export type ProfileVisibility = 'public' | 'community' | 'private';

export interface ProfileLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export interface ProfileProject {
  id: string;
  title: string;
  description?: string;
  url?: string;
  role?: string;
}

export interface ProfileDoc {
  id: string;
  title: string;
  url?: string;
  type?: 'paper' | 'article' | 'spec' | 'other';
}

export interface UnitProfile {
  address: string;
  unitname: string;
  avatar?: string;
  bio?: string;
  fullName?: string;
  email?: string;
  unitType?: string;
  ensName?: string;
  chainId: number;
  balance?: string;
  isConnected: boolean;
  createdAt: number;
  lastLoginAt: number;
  socialLinks?: {
    telegram?: string;
    github?: string;
    twitter?: string;
    discord?: string;
    website?: string;
  };
  preferences: {
    encryptByDefault: boolean;
    allowDirectMessages: boolean;
    showOnlineStatus: boolean;
    theme: 'dark' | 'light' | 'auto';
    language: 'en' | 'ru' | 'auto';
  };
  stats: {
    messagesCount: number;
    chatsCount: number;
    connectionsCount: number;
    reputation: number;
  };
  claAccepted?: DUNACLA;
  skills?: string[];
  location?: string;
  timezone?: string;
  specialisation?: Specialisation;
  stack?: string[];
  qualifications?: QualificationLevel;
  profileVisibility?: ProfileVisibility;
  languages?: string[];
  links?: ProfileLink[];
  projects?: ProfileProject[];
  docs?: ProfileDoc[];
}

export interface UnitProfileState {
  profile: UnitProfile | null;
  isLoading: boolean;
  error: string | null;
  isCLARequired?: boolean;
  isCLALoading?: boolean;
  claError?: string | null;
}

export interface SignatureData {
  message: string;
  signature: string;
  address: string;
  timestamp: number;
} 