'use client';

import { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { authenticate } from '@lemoncash/mini-app-sdk';

type Wallet = Awaited<ReturnType<typeof authenticate>> extends { data: { wallet: infer T } }
  ? T
  : unknown;

type WalletContextValue = {
  wallet: Wallet | null;
  setWallet: (wallet: Wallet | null) => void;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const value = useMemo(() => ({ wallet, setWallet }), [wallet]);

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }

  return context;
};

