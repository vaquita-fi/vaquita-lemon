/* eslint-disable */
// import USDC from '@/abis/USDC.json';
import { NetworkResponseDTO } from '@/core-ui/types';
// import { DepositFn, WithdrawFn } from '@/core-ui/types/transaction';
import { isBaseSepoliaTestnetNetwork } from '@/networks/base/index';
import { callSmartContract, ChainId, TransactionResult } from '@lemoncash/mini-app-sdk';
// import { useWagmiStore } from '@/stores';
// import { Abi, createPublicClient, http, parseUnits, PublicClient, WalletClient } from 'viem';
import { parseUnits } from 'viem';
import { base, baseSepolia } from 'viem/chains';

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
// export const generatePermitSignature = async (
//   walletClient: WalletClient,
//   publicClient: PublicClient,
//   account: `0x${string}`,
//   usdcAddress: `0x${string}`,
//   spender: `0x${string}`,
//   value: bigint,
//   deadline: bigint,
//   chainId: number
// ) => {
//   try {
//     // Get current nonce for the owner using the public client
//     const nonce = await publicClient.readContract({
//       address: usdcAddress,
//       abi: USDC,
//       functionName: 'nonces',
//       args: [account],
//       authorizationList: undefined,
//     });

//     // Prepare domain data
//     const domain = {
//       name:
//         chainId === baseSepolia.id
//           ? 'USDC'
//           : chainId === lisk.id
//             ? 'Bridged USDC (Lisk)'
//             : 'USD Coin',
//       version: '2',
//       chainId: chainId,
//       verifyingContract: usdcAddress,
//     };
//     // Prepare message data
//     const message = {
//       owner: account,
//       spender: spender,
//       value: value,
//       nonce: nonce as bigint,
//       deadline: deadline,
//     };
//     // Sign the typed data
//     const signature = await walletClient.signTypedData({
//       account,
//       domain,
//       types: permitTypes,
//       primaryType: 'Permit',
//       message,
//     });
//     console.info('signature', signature);
//     return {
//       signature,
//       nonce,
//       deadline,
//     };
//   } catch (error) {
//     console.error('Error generating permit signature:', error);
//     throw error;
//   }
// };

export const baseTransactions = async (
  network: NetworkResponseDTO,
  token: NetworkResponseDTO['tokens'][number]
) => {
  const chain = isBaseSepoliaTestnetNetwork(network.name) ? baseSepolia : base;

  const transactionDeposit = async (_: any, amount: any, lockPeriod: any, log: any) => {
    const parsedAmount = parseUnits(amount + '', token.decimals);
    const periodInSeconds = BigInt(lockPeriod / 1000);
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now

    // const { writeContract: deposit } = useWagmiStore.getState().useDepositWriteContract!;

    console.info('token.symbol', token.symbol);

    const batchResult = await callSmartContract({
      contracts: [
        {
          contractAddress: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
          functionName: 'approve',
          functionParams: ['0x644F71d3376b44965222829E6974Ad88459b608D', parsedAmount],
          value: '0',
          chainId: ChainId.BASE_SEPOLIA,
        },
        {
          contractAddress: '0x644F71d3376b44965222829E6974Ad88459b608D',
          functionName: 'deposit',
          functionParams: [
            '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
            parsedAmount,
            periodInSeconds,
            deadline,
            '0x',
          ],
          value: '0',
          chainId: ChainId.BASE_SEPOLIA,
        },
      ],
    });

    console.log('transactionDeposit', batchResult);

    return {
      success: batchResult?.result === TransactionResult.SUCCESS,
      txHash: batchResult?.result === TransactionResult.SUCCESS ? batchResult.data.txHash : '',
      transaction: batchResult,
      explorer: '',
      depositIdHex: '*',
      error: null,
    };
  };

  const transactionWithdraw = async (_: any, depositIdHex: any, __: any, log: any) => {
    const withdrawResult = await callSmartContract({
      contracts: [
        {
          contractAddress: '0x644F71d3376b44965222829E6974Ad88459b608D',
          functionName: 'withdraw',
          functionParams: [depositIdHex],
          value: '0',
          chainId: ChainId.BASE_SEPOLIA,
        },
      ],
    });

    console.log('transactionWithdraw', withdrawResult);

    return {
      success: withdrawResult?.result === TransactionResult.SUCCESS,
      txHash:
        withdrawResult?.result === TransactionResult.SUCCESS ? withdrawResult.data.txHash : '',
      transaction: withdrawResult,
      explorer: '',
      depositIdHex: '',
      error: null,
    };
  };

  return {
    transactionDeposit,
    transactionWithdraw,
  };
};
