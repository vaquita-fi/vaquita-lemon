import USDC from '@/abis/USDC.json';
import { NetworkResponseDTO } from '@/core-ui/types';
import { DepositFn, WithdrawFn } from '@/core-ui/types/transaction';
import { isBaseSepoliaTestnetNetwork } from '@/networks/base/index';
import { useWagmiStore } from '@/stores';
import { Abi, createPublicClient, http, parseUnits, PublicClient, WalletClient } from 'viem';
import { base, baseSepolia, lisk } from 'viem/chains';
import { callSmartContract } from '@lemoncash/mini-app-sdk';

// Define permit types for EIP-712
const permitTypes = {
  Permit: [
    { name: 'owner', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
} as const;

// TODO: move to helpers
// Function to generate EIP-712 permit signature
export const generatePermitSignature = async (
  walletClient: WalletClient,
  publicClient: PublicClient,
  account: `0x${string}`,
  usdcAddress: `0x${string}`,
  spender: `0x${string}`,
  value: bigint,
  deadline: bigint,
  chainId: number
) => {
  try {
    // Get current nonce for the owner using the public client
    const nonce = await publicClient.readContract({
      address: usdcAddress,
      abi: USDC,
      functionName: 'nonces',
      args: [account],
      authorizationList: undefined,
    });

    // Prepare domain data
    const domain = {
      name:
        chainId === baseSepolia.id
          ? 'USDC'
          : chainId === lisk.id
            ? 'Bridged USDC (Lisk)'
            : 'USD Coin',
      version: '2',
      chainId: chainId,
      verifyingContract: usdcAddress,
    };
    // Prepare message data
    const message = {
      owner: account,
      spender: spender,
      value: value,
      nonce: nonce as bigint,
      deadline: deadline,
    };
    // Sign the typed data
    const signature = await walletClient.signTypedData({
      account,
      domain,
      types: permitTypes,
      primaryType: 'Permit',
      message,
    });
    console.info('signature', signature);
    return {
      signature,
      nonce,
      deadline,
    };
  } catch (error) {
    console.error('Error generating permit signature:', error);
    throw error;
  }
};

export const baseTransactions = async (
  network: NetworkResponseDTO,
  token: NetworkResponseDTO['tokens'][number]
) => {
  const chain = isBaseSepoliaTestnetNetwork(network.name) ? baseSepolia : base;

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  const transactionDeposit: DepositFn = async (_, amount, lockPeriod, log) => {
    const useAccount = useWagmiStore.getState().useAccount;
    const useWalletClient = useWagmiStore.getState().useWalletClient;
    if (useAccount && useWalletClient) {
      const { address, isConnected, chain } = useAccount;
      if (!isConnected || !address) {
        log('Please connect your wallet first.', {
          walletAddress: address,
          isConnected: !!isConnected,
        });
        return {
          success: false,
          txHash: '',
          transaction: null,
          explorer: '',
          depositIdHex: '',
          error: new Error('Please connect your wallet first.'),
        };
      }
      const chainId = chain?.id;

      if (amount <= 0) {
        log('Invalid deposit amount.', {
          amount,
        });
        return {
          success: false,
          txHash: '',
          transaction: null,
          explorer: '',
          depositIdHex: '',
          error: new Error('Invalid deposit amount.'),
        };
      }

      const parsedAmount = parseUnits(amount + '', token.decimals);
      const periodInSeconds = BigInt(lockPeriod / 1000);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now

      const { writeContract: deposit } = useWagmiStore.getState().useDepositWriteContract!;

      console.info('token.symbol', token.symbol);
      if (token.symbol === 'cbBTC') {
        const { writeContract: approve } = useWagmiStore.getState().useApproveWriteContract!;
        console.info('approving cbBTC spending', parsedAmount);
        console.info('token.contractAddress', token.contractAddress);
        console.info('token.vaquitaContractAddress', token.vaquitaContractAddress);
        console.info('token contract abi', token.contractAbi);
        console.info('token vaquita contract abi', token.vaquitaContractAbi);
        // approve({
        //   address: token.contractAddress as `0x${string}`,
        //   abi: token.contractAbi as Abi,
        //   functionName: 'approve',
        //   args: [token.vaquitaContractAddress as `0x${string}`, parsedAmount],
        // });
        const deadline = Math.floor(new Date().getTime() / 1000) + 3600;

        const batchResult = await callSmartContract({
          contracts:[
            {
              contractAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
              functionName: "approve",
              functionParams: ["0x644F71d3376b44965222829E6974Ad88459b608D", amount],
              value: "0",
              chainId: ChainId.BASE_SEPOLIA
            },
            {
              contractAddress: "0x644F71d3376b44965222829E6974Ad88459b608D",
              functionName: "deposit",
              functionParams: ["0x036CbD53842c5426634e7929541eC2318f3dCF7e", amount, 604800, deadline, "0x"],
              value: "0",
              chainId: ChainId.BASE_SEPOLIA
            }
          ]
        });

        await new Promise((resolve) => setTimeout(resolve, 5000));

        while (true) {
          const {
            isPending: isApproveLoading,
            data: approveData,
            error: depositError,
          } = useWagmiStore.getState().useApproveWriteContract!;
          if (!isApproveLoading) {
            const approveHash = approveData!;
  
            const transaction = await publicClient.waitForTransactionReceipt({ hash: approveHash });
            const depositIdHex =
              (transaction?.logs?.[transaction?.logs?.length - 1] as unknown as { topics: string[] })
                ?.topics?.[1] || '';
            if (transaction.status?.toLowerCase() !== 'success' || depositError) {
              return {
                success: false,
                txHash: approveHash,
                transaction,
                depositIdHex,
                explorer: '',
                error: depositError || new Error('Transaction failed: ' + transaction.status),
              };
            }
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        console.info('parsedAmount', parsedAmount);

        // deposit({
        //   address: token.vaquitaContractAddress as `0x${string}`,
        //   abi: token.vaquitaContractAbi as Abi,
        //   functionName: 'deposit',
        //   args: [token.contractAddress as `0x${string}`, parsedAmount, periodInSeconds, deadline, '0x'],
        // });

        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else if (token.symbol === 'ETH') {
        deposit({
          address: token.vaquitaContractAddress as `0x${string}`,
          abi: token.vaquitaContractAbi as Abi,
          functionName: 'depositETH',
          value: parsedAmount,
          args: [periodInSeconds],
          gas: BigInt(1000000),
        });
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        const { data: walletClient } = useWalletClient;
        const { signature } = await generatePermitSignature(
          walletClient as WalletClient,
          publicClient as PublicClient,
          address as `0x${string}`,
          token.contractAddress as `0x${string}`,
          token.vaquitaContractAddress as `0x${string}`,
          parsedAmount,
          deadline,
          chainId as number
        );

        deposit({
          address: token.vaquitaContractAddress as `0x${string}`,
          abi: token.vaquitaContractAbi as Abi,
          functionName: 'deposit',
          args: [
            token.contractAddress as `0x${string}`,
            parsedAmount,
            periodInSeconds,
            deadline,
            signature,
          ],
          gas: BigInt(1000000),
        });
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      while (true) {
        const {
          isPending: isDepositLoading,
          data: depositData,
          error: depositError,
        } = useWagmiStore.getState().useDepositWriteContract!;
        if (!isDepositLoading) {
          const depositHash = depositData!;

          const transaction = await publicClient.waitForTransactionReceipt({ hash: depositHash });
          const depositIdHex =
            (transaction?.logs?.[transaction?.logs?.length - 1] as unknown as { topics: string[] })
              ?.topics?.[1] || '';
          if (transaction.status?.toLowerCase() !== 'success' || depositError) {
            return {
              success: false,
              txHash: depositHash,
              transaction,
              depositIdHex,
              explorer: '',
              error: depositError || new Error('Transaction failed: ' + transaction.status),
            };
          }

          return {
            success: true,
            txHash: depositHash,
            transaction,
            depositIdHex,
            explorer: '',
            error: null,
          };
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    log('useAccount or useWalletClient not set');
    return {
      success: false,
      txHash: '',
      transaction: null,
      explorer: '',
      depositIdHex: '',
      error: new Error('useAccount or useWalletClient not set'),
    };
  };

  const transactionWithdraw: WithdrawFn = async (_, depositIdHex, __, log) => {
    const useAccount = useWagmiStore.getState().useAccount;
    const useWalletClient = useWagmiStore.getState().useWalletClient;
    if (useAccount && useWalletClient) {
      const { address, isConnected } = useAccount;
      if (!isConnected || !address) {
        log('Please connect your wallet first.', { address, isConnected });
        return {
          success: false,
          txHash: '',
          transaction: null,
          explorer: '',
          error: new Error('Please connect your wallet first.'),
        };
      }

      const { writeContract: withdraw } = useWagmiStore.getState().useWithdrawWriteContract!;

      withdraw({
        address: token.vaquitaContractAddress as `0x${string}`,
        abi: token.vaquitaContractAbi as Abi,
        functionName: 'withdraw',
        args: [depositIdHex as `0x${string}`],
        gas: BigInt(1000000),
      });
      await new Promise((resolve) => setTimeout(resolve, 5000));
      while (true) {
        const {
          isPending: isWithdrawLoading,
          data: withdrawData,
          error: withdrawError,
        } = useWagmiStore.getState().useWithdrawWriteContract!;
        if (!isWithdrawLoading) {
          const withdrawHash = withdrawData!;
          const transaction = await publicClient.waitForTransactionReceipt({ hash: withdrawHash });
          if (transaction.status?.toLowerCase() !== 'success' || withdrawError) {
            return {
              success: false,
              txHash: withdrawHash,
              transaction,
              explorer: '',
              error: withdrawError || new Error('Transaction failed: ' + transaction.status),
            };
          }

          return {
            success: true,
            txHash: withdrawHash,
            transaction,
            explorer: '',
            error: null,
          };
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    log('useAccount or useWalletClient not set');
    return {
      success: false,
      txHash: '',
      transaction: null,
      explorer: '',
      depositIdHex: '',
      error: new Error('useAccount or useWalletClient not set'),
    };
  };

  return {
    transactionDeposit,
    transactionWithdraw,
  };
};
