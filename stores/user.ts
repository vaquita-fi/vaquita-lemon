import { isEvmNetwork } from "@/networks/evm";
import { Network } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Store = {
  walletAddress: string;
  networkName: string;
  tokenName: string;
  tokenDecimals: number;
  tokenSymbol: string;
  tokenVaquitaContract: string;
  setWalletAddress: (walletAddress: string) => void;
  setNetwork: (network: Network) => void;
  reset: () => void;
  tokenContract: string;
};

const resetObj = {
  walletAddress: "",
  networkName: "",
  tokenName: "",
  tokenDecimals: 0,
  tokenSymbol: "",
  tokenVaquitaContract: "",
  tokenContract: "",
};

export const useUserStore = create<Store>()(
  persist(
    (set, get) => ({
      ...resetObj,
      reset: () => {
        set((state) => ({ ...state, ...resetObj }));
      },
      setWalletAddress: (walletAddress: string) => {
        set((state) => ({ ...state, walletAddress }));
      },
      setNetwork: async (network) => {
        const token = network.tokens[0];
        const { networkName, walletAddress } = get();
        let newWalletAddress = walletAddress;
        if (isEvmNetwork(networkName) !== isEvmNetwork(network.name)) {
          console.log("reset");
          newWalletAddress = "";
        }
        if (token) {
          set((state) => ({
            ...state,
            networkName: network.name,
            tokenName: token.name,
            tokenSymbol: token.symbol,
            tokenDecimals: token.decimals,
            tokenVaquitaContract: token.vaquitaContract,
            tokenContract: token.contract,
            walletAddress: newWalletAddress,
          }));
        } else {
          set((state) => ({ ...state, ...resetObj }));
        }
      },
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
