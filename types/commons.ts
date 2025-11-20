export enum WithdrawalStatus {
  INITIATED = 'initiated',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}

export enum DepositStatus {
  INITIATED = 'initiated',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}

export enum DepositWithdrawalStatus {
  NONE = 'none',
  DEPOSITING = 'depositing',
  DEPOSITED = 'deposited',
  DEPOSIT_FAILED = 'deposit_failed',
  WITHDRAWING = 'withdrawing',
  WITHDRAWN = 'withdrawn',
  WITHDRAWN_FAILED = 'withdrawn_failed',
}

export interface DepositResponseDTO {
  amount: number;
  status: DepositWithdrawalStatus;
  id: number;
  withdrawals: null | { status: string };
  transactionHash: string;
  depositIdHex: string;
  vaquitaInterest: number;
  aaveInterest: number;
}
