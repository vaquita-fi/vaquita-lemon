import { useUserStore } from "@/stores";

export function getVaquitaContract(): string {
  return useUserStore.getState().tokenVaquitaContract;
}

export function getTokenContract(): string {
  return useUserStore.getState().tokenContract;
}

export const getDecimals = () => {
  return useUserStore.getState().tokenDecimals;
};
