import { DepositFunction, WithdrawFunction } from '@/types';
import { create } from 'zustand';

type TransactionStore = {
  transactionDeposit: null | DepositFunction;
  transactionWithdraw: null | WithdrawFunction;
  setTransactions: (transactionDeposit: null | DepositFunction, transactionWithdraw: null | WithdrawFunction) => void;
};

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactionDeposit: null,
  transactionWithdraw: null,
  setTransactions: (transactionDeposit, transactionWithdraw) =>
    set((state) => ({ ...state, transactionDeposit, transactionWithdraw })),
}));
