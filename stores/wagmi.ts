import { UseAccountReturnType, UseWalletClientReturnType, UseWriteContractReturnType } from 'wagmi';
import { create } from 'zustand';

type WagmiStore = {
  useAccount: UseAccountReturnType | null;
  useWalletClient: UseWalletClientReturnType | null;
  useApproveWriteContract: UseWriteContractReturnType | null;
  useDepositWriteContract: UseWriteContractReturnType | null;
  useWithdrawWriteContract: UseWriteContractReturnType | null;
  setData: (props: Partial<Omit<WagmiStore, 'setData'>>) => void;
};

export const useWagmiStore = create<WagmiStore>((set) => ({
  useAccount: null,
  useWalletClient: null,
  useApproveWriteContract: null,
  useDepositWriteContract: null,
  useWithdrawWriteContract: null,
  setData: (props) => set(props),
}));
