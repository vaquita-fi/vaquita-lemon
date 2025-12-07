'use client';

import { DesktopSidebar, MobileNavigation } from '@/components';
import { TransactionsProvider } from '@/components/providers/TransactionsProvider';
import { WalletProvider, useWallet } from '@/components/providers/WalletProvider';
import { LemonSync } from '@/components/providers/LemonSync';
import { AblyProvider, NetworksProvider, sendLogToAbly } from '@/core-ui/components';
import { useNetworks } from '@/core-ui/hooks';
import { useLoader, useResizeStore } from '@/core-ui/stores';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { HeroUIProvider } from '@heroui/react';
import { ToastProvider } from '@heroui/toast';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import * as Ably from 'ably';
import { ChannelProvider, useChannel } from 'ably/react';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { initPosthog } from './posthog';
import { config } from './wagmi';
import { isWebView } from '@lemoncash/mini-app-sdk';

export const queryClient = new QueryClient();

const originalLog = console.log;
const originalInfo = console.info;
const originalError = console.error;
const originalWarn = console.warn;

console.log = (...args) => {
  void sendLogToAbly('log', args);
  originalLog(...args);
};
console.info = (...args) => {
  void sendLogToAbly('info', args);
  originalInfo(...args);
};
console.error = (...args) => {
  void sendLogToAbly('error', args);
  originalError(...args);
};
console.warn = (...args) => {
  void sendLogToAbly('warn', args);
  originalWarn(...args);
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WalletProvider>
      <ProvidersWithWallet>{children}</ProvidersWithWallet>
    </WalletProvider>
  );
}

const ProvidersWithWallet = ({ children }: { children: ReactNode }) => {
  const { width = 0, height = 0, ref } = useResizeDetector();
  const router = useRouter();
  const setResize = useResizeStore((store) => store.setResize);
  useEffect(() => {
    setResize(width, height);
  }, [width, height, setResize]);
  useEffect(() => {
    initPosthog();
  }, []);

  const setLoading = useLoader((store) => store.setLoading);

  useEffect(() => {
    (async () => {
      setLoading('isInLemonMiniApp', true);
      const isInLemonMiniApp = isWebView();
      setLoading('isInLemonMiniApp', false);
      if (!isInLemonMiniApp && process.env.NEXT_PUBLIC_ENV !== 'development') {
        console.info('Redirecting from miniapp to app.vaquita.fi');
        router.push('https://app.vaquita.fi/');
      }
    })();
  }, [router, setLoading]);

  return (
    <AblyProvider>
      <LemonSync />
      <HeroUIProvider>
        <ToastProvider placement="top-center" />
        <QueryClientProvider client={queryClient}>
          <MiniKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
            chain={base}
            config={{
              appearance: {
                mode: 'auto',
                theme: 'mini-app-theme',
                name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
                logo: process.env.NEXT_PUBLIC_ICON_URL,
              },
            }}
          >
            <NetworksProvider>
              <div className="flex bg-background" style={{ overflow: 'hidden' }} ref={ref}>
                <DesktopSidebar />
                <Main>{children}</Main>
                <MobileNavigation />
              </div>
            </NetworksProvider>
            <TransactionsProvider />
          </MiniKitProvider>
          <ChannelProvider channelName="deposits-changes">
            <ListenDepositsChanges />
          </ChannelProvider>
        </QueryClientProvider>
      </HeroUIProvider>
    </AblyProvider>
  );
};

const ListenDepositsChanges = () => {
  const queryClient = useQueryClient();
  const handleChange = (message: Ably.Message) => {
    console.info('handleChange', message);
    return queryClient.invalidateQueries({
      queryKey: ['deposit'],
      exact: false,
    });
  };
  useChannel('deposits-changes', 'change', handleChange);

  return null;
};

const Main = ({ children }: { children: ReactNode }) => {
  const {
    data: { types },
  } = useNetworks();
  console.info('Main types', types);
  return (
    <main
      className="flex-1 md:ml-64 flex flex-col"
      style={{
        height: 'var(--100VH)',
        minHeight: 'var(--100VH)',
        maxHeight: 'var(--100VH)',
        overflow: 'hidden',
      }}
      key={types.join(',')}
    >
      {children}
    </main>
  );
};
