import { useUserStore } from '@/stores';

export const isDummyNetwork = () => {
  return useUserStore.getState().networkName === 'Dummy';
};
