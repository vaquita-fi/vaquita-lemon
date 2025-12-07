import { useNetworkConfigStore } from '@/core-ui/stores';

export const isDummyNetwork = () => {
  return useNetworkConfigStore.getState().network?.name === 'Dummy';
};
