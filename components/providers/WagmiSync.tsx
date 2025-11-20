'use client';

import { AuthButtons } from '@/components';
import { LoaderScreen } from '@/core-ui/components';
import { useNetworks } from '@/core-ui/hooks';
import { useLoading, useNetworkConfigStore } from '@/core-ui/stores';
import { publicClientRef } from '@/helpers';
import { useWagmiStore } from '@/stores';
import React, { useEffect } from 'react';
import {
  useAccount,
  useConnect,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
  useWriteContract,
} from 'wagmi';
import { config } from './wagmi';

const chainIds: { [key: number]: string } = {
  84532: 'Base Sepolia Testnet',
  8453: 'Base',
};

export const WagmiSync = () => {
  const { setWalletAddress, setNetwork, walletAddress } = useNetworkConfigStore();
  const { data } = useNetworks();
  publicClientRef.current = usePublicClient();

  const { error, status } = useConnect();
  const useAccountData = useAccount();
  const accountStatus = useAccountData.status;
  const accountAddress = useAccountData.address;
  const useWalletClientData = useWalletClient();
  const useApproveWriteContract = useWriteContract();
  const useDepositWriteContract = useWriteContract();
  const useWithdrawWriteContract = useWriteContract();
  console.log('WagmiSync', {
    error: error?.message,
    walletAddress,
    status,
    accountStatus,
    accountAddress,
  });

  const setData = useWagmiStore((store) => store.setData);
  setData({
    useAccount: useAccountData,
    useWalletClient: useWalletClientData,
    useApproveWriteContract,
    useDepositWriteContract,
    useWithdrawWriteContract,
  });

  const { switchChain } = useSwitchChain();
  useEffect(() => {
    switchChain?.({ chainId: 8453 });
  }, [switchChain]);

  // useEffect(() => {
  //   console.info('connecting with injected connector (?)');
  //   connect({ connector: injected() });
  // }, [connect]);

  useEffect(() => {
    const unsubscribe = config.subscribe(
      (state) => {
        console.log('wagmi state changed', { state });
        const chainId = state.chainId;
        const network = (data?.networks ?? []).find((n) => n.name === chainIds[chainId]) ?? null;
        setNetwork(network);
        let walletAddress = '';
        if (state.current) {
          const connection = state.connections.get(state.current);
          walletAddress = connection?.accounts?.[0] ?? '';
          console.log('wagmi state changed >', { account: connection?.accounts });
        }
        setWalletAddress(walletAddress);
      },
      () => null
    );

    return () => {
      unsubscribe();
    };
  }, [data.networks, setNetwork, setWalletAddress]);

  const isLoading = accountStatus === 'connecting' || accountStatus === 'reconnecting';
  useLoading('account', isLoading);

  if (!isLoading && (!accountAddress || accountStatus !== 'connected')) {
    return (
      <LoaderScreen>
        <AuthButtons />
      </LoaderScreen>
    );
  }

  return null;
};
