import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'DSP - Decentralized Social Platform',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  transports: {
    [mainnet.id]: http('https://eth.llamarpc.com'),
    [polygon.id]: http('https://polygon.llamarpc.com'),
    [optimism.id]: http('https://opt-mainnet.g.alchemy.com/v2/demo'),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [base.id]: http('https://mainnet.base.org'),
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/demo'),
  },
  ssr: false, // Disable SSR to prevent hydration issues
});

export const supportedChains = [mainnet, polygon, optimism, arbitrum, base, sepolia]; 