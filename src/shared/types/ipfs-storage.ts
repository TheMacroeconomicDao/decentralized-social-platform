export interface IPFSHash {
  hash: string;
  size: number;
  timestamp: number;
}

export interface EncryptedData {
  data: string; // Base64 encoded encrypted data
  iv: string; // Initialization vector
  salt: string; // Salt for key derivation
  algorithm: 'AES-GCM' | 'AES-CBC';
  keyDerivation: 'PBKDF2' | 'scrypt';
}

export interface IPFSUserProfile {
  unitname: string;
  avatar?: string;
  bio?: string;
  publicKey: string;
  walletAddress: string;
  socialLinks?: {
    telegram?: string;
    github?: string;
    twitter?: string;
  };
  preferences: {
    encryptByDefault: boolean;
    allowDirectMessages: boolean;
    showOnlineStatus: boolean;
  };
  createdAt: number;
  lastUpdated: number;
}

export interface IPFSMessage {
  id: string;
  from: string; // wallet address
  to?: string; // for direct messages
  chatId?: string; // for group chats
  content: string | EncryptedData;
  messageType: 'text' | 'image' | 'file' | 'system';
  timestamp: number;
  signature: string; // Message signature for authenticity
  isEncrypted: boolean;
  replyTo?: string; // message ID for replies
  metadata?: {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
  };
}

export interface IPFSChat {
  id: string;
  name: string;
  description?: string;
  type: 'direct' | 'group' | 'public';
  participants: string[]; // wallet addresses
  admins: string[]; // wallet addresses
  encryptionKey?: string; // Encrypted group key
  messagesHash: string; // IPFS hash of messages array
  avatar?: string;
  createdBy: string;
  createdAt: number;
  lastActivity: number;
  settings: {
    isEncrypted: boolean;
    allowNewMembers: boolean;
    requireApproval: boolean;
  };
}

export interface IPFSChatMessage {
  messages: IPFSMessage[];
  lastUpdated: number;
  version: number;
}

export interface DecentralizedDBEntry {
  id: string;
  type: 'profile' | 'chat' | 'message' | 'file';
  ipfsHash: string;
  owner: string; // wallet address
  sharedWith?: string[]; // wallet addresses for encrypted sharing
  isEncrypted: boolean;
  timestamp: number;
  metadata?: {
    chatId?: string;
    messageCount?: number;
    participants?: string[];
  };
}

export interface GroupChatAccess {
  chatId: string;
  participantAddress: string;
  encryptedGroupKey: string; // Group key encrypted with participant's public key
  permissions: {
    canRead: boolean;
    canWrite: boolean;
    canAddMembers: boolean;
    canRemoveMembers: boolean;
    isAdmin: boolean;
  };
  addedBy: string;
  addedAt: number;
}

export interface IPFSStorageConfig {
  gateway: string;
  apiEndpoint: string;
  pinataApiKey?: string;
  pinataSecretKey?: string;
  web3StorageToken?: string;
}

export interface CryptoKeys {
  publicKey: string;
  privateKey: string; // Should be derived from wallet, not stored
  keyType: 'secp256k1' | 'ed25519';
} 