import { isBaseNetwork, isBaseSepoliaTestnetNetwork } from "@/networks/base";

export const isEvmNetwork = (networkName: string) => {
  return isBaseSepoliaTestnetNetwork(networkName) || isBaseNetwork(networkName);
};
