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

export interface UnitProfile {
  address: string;
  unitname: string;
  avatar?: string;
  bio?: string;
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
  // CLA acceptance status (DUNA-CLA v1.0)
  claAccepted?: DUNACLA;
  skills?: string[];
  location?: string;
  timezone?: string;
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