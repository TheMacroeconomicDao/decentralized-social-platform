import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from 'wagmi/chains';
import { http, cookieStorage, createStorage, createConfig } from 'wagmi';
import type { Config } from 'wagmi';

let configInstance: Config | null = null;
let serverConfigInstance: Config | null = null;

// Get config - create full config for both server and client
// Both must have ssr: true and storage for cookieToInitialState to work
export function getConfig(): Config {
  // On server, create config manually without getDefaultConfig (which is client-only)
  if (typeof window === 'undefined') {
    if (!serverConfigInstance) {
      // Create config on server with SSR support using createConfig
      // cookieToInitialState requires config with ssr: true and storage properties
      serverConfigInstance = createConfig({
        chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
        transports: {
          [mainnet.id]: http('https://eth.llamarpc.com'),
          [polygon.id]: http('https://polygon.llamarpc.com'),
          [optimism.id]: http('https://opt-mainnet.g.alchemy.com/v2/demo'),
          [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
          [base.id]: http('https://mainnet.base.org'),
          [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/demo'),
        },
        ssr: true, // Required for SSR - cookieToInitialState checks this property
        storage: createStorage({
          storage: cookieStorage, // Required for cookie-based state persistence
        }),
      });
    }
    return serverConfigInstance;
  }
  
  // On client, use getDefaultConfig from RainbowKit (includes WalletConnect, etc.)
  if (!configInstance) {
    configInstance = getDefaultConfig({
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
      ssr: true, // Enable SSR with cookie storage
      storage: createStorage({
        storage: cookieStorage,
      }),
    });
  }
  return configInstance;
}

// Export config for backward compatibility (only use on client)
export const config = typeof window !== 'undefined' ? getConfig() : null as any;

export const supportedChains = [mainnet, polygon, optimism, arbitrum, base, sepolia]; 