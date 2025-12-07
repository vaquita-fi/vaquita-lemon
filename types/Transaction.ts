export type DepositFunction = (
  id: number,
  amount: number
) => Promise<{
  success: boolean;
  depositIdHex: string;
  txHash: string;
  explorer: string;
  error: null | Error | unknown;
  transaction: object | null;
}>;

export type WithdrawFunction = (
  id: number,
  depositIdHex: string
) => Promise<{
  success: boolean;
  txHash: string;
  explorer: string;
  error: null | Error | unknown;
  transaction: object | null;
}>;
