import { UnitProfile } from '@/shared/types/unit-profile';

export const mockUnitProfile: UnitProfile = {
  address: '0x742d35Cc6634C0532925a3b8D1c9d9e5C13F2c1B',
  unitname: 'CyberPioneer',
  bio: 'Passionate Web3 developer and blockchain enthusiast. Building the future of decentralized applications with cutting-edge technologies. Always learning, always innovating.',
  avatar: '/images/teams/member-placeholder.png',
  ensName: 'cyberpinoeer.eth',
  chainId: 1,
  balance: '2.4567',
  isConnected: true,
  createdAt: Date.now() - (30 * 24 * 60 * 60 * 1000), // 30 days ago
  lastLoginAt: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
  socialLinks: {
    github: 'https://github.com/cyberpinoeer',
    telegram: '@cyberpinoeer',
    twitter: 'https://twitter.com/cyberpinoeer',
    discord: 'CyberPioneer#1337',
    website: 'https://cyberpinoeer.dev',
  },
  preferences: {
    encryptByDefault: true,
    allowDirectMessages: true,
    showOnlineStatus: true,
    theme: 'dark',
    language: 'en',
  },
  stats: {
    messagesCount: 1247,
    chatsCount: 23,
    connectionsCount: 156,
    reputation: 892,
  },
  skills: [
    'React',
    'TypeScript',
    'Solidity',
    'Web3',
    'DeFi',
    'Smart Contracts',
    'IPFS',
    'Ethereum',
    'Next.js',
    'Node.js'
  ],
  location: 'San Francisco, CA',
  timezone: 'PST',
}; 