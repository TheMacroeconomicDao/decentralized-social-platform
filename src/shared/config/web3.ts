import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from 'wagmi/chains';
import { http, cookieStorage, createStorage, createConfig } from 'wagmi';
import type { Config } from 'wagmi';

let configInstance: Config | null = null;
let serverConfigInstance: Config | null = null;

// Reliable public RPC endpoints (not blocked by ad-blockers)
const transports = {
  [mainnet.id]: http('https://rpc.ankr.com/eth'),
  [polygon.id]: http('https://rpc.ankr.com/polygon'),
  [optimism.id]: http('https://rpc.ankr.com/optimism'),
  [arbitrum.id]: http('https://rpc.ankr.com/arbitrum'),
  [base.id]: http('https://rpc.ankr.com/base'),
  [sepolia.id]: http('https://rpc.ankr.com/eth_sepolia'),
};

export function getConfig(): Config {
  if (typeof window === 'undefined') {
    if (!serverConfigInstance) {
      serverConfigInstance = createConfig({
        chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
        transports,
        ssr: true,
        storage: createStorage({ storage: cookieStorage }),
      });
    }
    return serverConfigInstance;
  }

  if (!configInstance) {
    configInstance = getDefaultConfig({
      appName: 'DSP - Decentralized Social Platform',
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '21fef48091f12692cad574a6f7753643',
      chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
      transports,
      ssr: true,
      storage: createStorage({ storage: cookieStorage }),
    });
  }
  return configInstance;
}

export const config = typeof window !== 'undefined' ? getConfig() : null as any;

export const supportedChains = [mainnet, polygon, optimism, arbitrum, base, sepolia]; 