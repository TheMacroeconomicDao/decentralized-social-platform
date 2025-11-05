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
  skills?: string[];
  location?: string;
  timezone?: string;
}

export interface UnitProfileState {
  profile: UnitProfile | null;
  isLoading: boolean;
  error: string | null;
}

export interface SignatureData {
  message: string;
  signature: string;
  address: string;
  timestamp: number;
} 