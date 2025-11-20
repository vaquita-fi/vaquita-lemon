'use client';

import { useUserStore } from '@/stores';

export const DummyAuthButtons = () => {
  const { walletAddress, setWalletAddress } = useUserStore();

  return (
    <div className="flex items-center gap-4">
      {walletAddress ? (
        <>
          <button
            onClick={() => {
              setWalletAddress('');
            }}
            className="px-5 py-2 rounded-lg w-full bg-transparent border border-black text-black text-sm font-semibold hover:bg-[#e68a00] transition shadow-sm"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            setWalletAddress('0xDummy...wallet');
          }}
          className="px-5 py-2 rounded-lg w-full bg-[#FF9B00] text-black text-sm font-semibold hover:bg-[#e68a00] transition shadow-sm"
        >
          Conectar Dummy Wallet
        </button>
      )}
    </div>
  );
};
