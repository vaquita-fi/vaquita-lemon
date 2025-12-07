'use client';

import { NetworkSelector } from '@/core-ui/components';
import { useNetworks } from '@/core-ui/hooks';
import { useNetworkConfigStore } from '@/core-ui/stores';
import { LemonAuthButton } from './LemonAuthButton';

export const AuthButtons = () => {
  const { network } = useNetworkConfigStore();
  const {
    data: { types },
  } = useNetworks();
  if (types.length === 0) {
    return null;
  }
  return (
    <div className="absolute top-0 left-0 right-0">
      <div className="flex justify-end gap-1 w-full">
        <NetworkSelector />
        {network && <LemonAuthButton />}
      </div>
    </div>
  );
};
