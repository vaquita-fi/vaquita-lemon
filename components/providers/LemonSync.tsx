'use client';

import { useNetworks } from '@/core-ui/hooks';
import { useLoading, useNetworkConfigStore } from '@/core-ui/stores';
import { useEffect } from 'react';
import { authenticate, TransactionResult } from '@lemoncash/mini-app-sdk';

const chainIds: { [key: number]: string } = {
  84532: 'Base Sepolia Testnet',
  8453: 'Base',
};

export const LemonSync = () => {
  const { setWalletAddress, setNetwork, walletAddress } = useNetworkConfigStore();

  useEffect(() => {
    const handleAuthentication = async () => {
      const result = await authenticate();
      if (result.result === TransactionResult.SUCCESS) {
        console.log('>>', { result });
        setWalletAddress(result.data.wallet);
      }
    };
    void handleAuthentication();
  }, [setWalletAddress]);

  const { data } = useNetworks();

  useEffect(() => {
    const network = (data?.networks ?? []).find((n) => n.name === chainIds[84532]) ?? null;
    setNetwork(network);
  }, [data.networks, setNetwork]);

  const isLoading = !walletAddress;
  useLoading('account', isLoading);

  return null;
};
