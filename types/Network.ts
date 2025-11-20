export interface Network {
  name: string;
  tokens: {
    name: string;
    symbol: string;
    decimals: number;
    isGas: boolean;
    isNative: boolean;
    isSupported: boolean;
    vaquitaContract: string;
    contract: string;
  }[];
}
