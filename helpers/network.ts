import { useUserStore } from '@/stores';

export const logoutAll = async () => {};

export const getNetworkName = () => {
  return useUserStore.getState().networkName;
};

export const writeDepositContractRef: { current: any } = {
  current: null,
};

export const writeWithdrawContractRef: { current: any } = {
  current: null,
};

export const accountRef: { current: any } = {
  current: null,
};

export const publicClientRef: { current: any } = {
  current: null,
};

export const walletClientRef: { current: any } = {
  current: null,
};
