'use client';

import { WalletButton } from '@/core-ui/components';
import { useNetworkConfigStore } from '@/core-ui/stores';
import { isBaseNetwork, isBaseSepoliaTestnetNetwork } from '@/networks/base';
import { Address, Avatar, EthBalance, Identity, Name } from '@coinbase/onchainkit/identity';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';

export const AuthButtons = () => {
  const { network } = useNetworkConfigStore();
  // const { switchChain } = useSwitchChain();
  const { /*chain,*/ address } = useAccount();
  const { disconnect } = useDisconnect();

  const handleLogout = async () => {
    await disconnect();
  };
  if (network && (isBaseNetwork(network?.name) || isBaseSepoliaTestnetNetwork(network?.name))) {
    return (
      <div className="flex items-center space-x-2">
        {/*<select*/}
        {/*  value={chain?.id}*/}
        {/*  onChange={(e) => switchChain?.({ chainId: Number(e.target.value) })}*/}
        {/*  className="border rounded px-2 py-1 text-sm text-gray-700"*/}
        {/*>*/}
        {/*  <option value="8453">Base Mainnet</option>*/}
        {/*  <option value="84532">Base Sepolia Testnet</option>*/}
        {/*</select>*/}
        {address ? (
          <WalletButton
            startContentSrc="/chains/evm.png"
            startContentAlt="EVM"
            handleLogout={handleLogout}
          />
        ) : (
          <Wallet className="z-10 bg-primary rounded-lg m-2 text-sm border border-black border-b-3 shadow-sm">
            <ConnectWallet disconnectedLabel="Start!">
              <Name className="text-inherit" />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        )}
      </div>
    );
  }

  return <div>Seleccione una red valida</div>;
};
