import { WalletButton } from '@/core-ui/components';
import { useNetworkConfigStore } from '@/core-ui/stores';

export const LemonAuthButton = () => {
  const walletAddress = useNetworkConfigStore((s) => s.walletAddress);

  return (
    <div className="flex items-center m-2">
      {!!walletAddress && <WalletButton startContentSrc="/chains/evm.png" startContentAlt="EVM" />}
    </div>
  );
};
