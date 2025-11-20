import { createConfig, createStorage, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  syncConnectedChain: true,
  chains: [base],
  connectors: [
    injected(),
    // walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'default' }),
    // coinbaseWallet({
    //   appName: 'Vaquita MiniApp',
    // }),
  ],
  transports: {
    [base.id]: http(),
  },
  storage: createStorage({
    storage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    },
  }),
});
