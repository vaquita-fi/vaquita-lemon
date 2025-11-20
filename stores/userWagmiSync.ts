import { create } from "zustand";

type UsePublicClientReturnType = any;

type TransactionStore = {
  writeContract: any;
  walletClient: any;
  publicClient: UsePublicClientReturnType;
  setProps: (props: Partial<TransactionStore>) => void;
};

export const useWagmiSyncStore = create<TransactionStore>((set) => ({
  writeContract: null,
  walletClient: null,
  publicClient: undefined,
  setProps: (newState) => set((state) => ({ ...state, ...newState })),
}));
