'use client';

import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider, type State, cookieToInitialState } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getConfig } from '@/shared/config/web3';
import { useState, useMemo } from 'react';
import '@rainbow-me/rainbowkit/styles.css';

interface Web3ProviderProps {
  children: React.ReactNode;
  cookie?: string | null;
}

export const Web3Provider = ({ children, cookie }: Web3ProviderProps) => {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  }));

  // Создаем initialState из cookie на клиенте
  const initialState = useMemo(() => {
    if (cookie) {
      return cookieToInitialState(config, cookie);
    }
    return undefined;
  }, [config, cookie]);

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#d49d32',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
          appInfo={{
            appName: 'DSP - Decentralized Social Platform',
            learnMoreUrl: 'https://gyber.org',
          }}
          showRecentTransactions={true}
          coolMode={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}; 