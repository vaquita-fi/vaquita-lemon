import { isBaseNetwork, isBaseSepoliaTestnetNetwork } from './base';

export const isNewDepositHandled = (networkName: string) => {
  return isBaseSepoliaTestnetNetwork(networkName) || isBaseNetwork(networkName);
};

export const getLendingMarketName = (networkName: string) => {
  if (isBaseSepoliaTestnetNetwork(networkName) || isBaseNetwork(networkName)) {
    return 'Aave';
  }
  return '';
};
