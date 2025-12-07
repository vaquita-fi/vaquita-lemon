import { NetworkResponseDTO } from '@/core-ui/types';
import { isBaseSepoliaTestnetNetwork } from '@/networks/base/index';
import { DepositFn, WithdrawFn } from '@/core-ui/types';
import { callSmartContract, ChainId, TransactionResult } from '@lemoncash/mini-app-sdk';
import { parseUnits } from 'viem';

export const baseTransactions = async (
  network: NetworkResponseDTO,
  token: NetworkResponseDTO['tokens'][number]
) => {
  const chainId = isBaseSepoliaTestnetNetwork(network.name) ? ChainId.BASE_SEPOLIA : ChainId.BASE;

  const transactionDeposit: DepositFn = async (_, amount, lockPeriod, log) => {
    const parsedAmount = parseUnits(amount + '', token.decimals);
    const periodInSeconds = BigInt(lockPeriod / 1000);
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now

    const batchResult = await callSmartContract({
      contracts: [
        {
          contractAddress: token.contractAddress as `0x${string}`,
          functionName: 'approve',
          functionParams: [token.vaquitaContractAddress, parsedAmount],
          value: '0',
          chainId,
        },
        {
          contractAddress: token.vaquitaContractAddress as `0x${string}`,
          functionName: 'deposit',
          functionParams: [token.contractAddress, parsedAmount, periodInSeconds, deadline, '0x'],
          value: '0',
          chainId,
        },
      ],
    });

    log('transactionDeposit', batchResult);

    return {
      success: batchResult?.result === TransactionResult.SUCCESS,
      txHash: batchResult?.result === TransactionResult.SUCCESS ? batchResult.data.txHash : '',
      transaction: batchResult,
      explorer: '',
      depositIdHex: '*',
      error: null,
    };
  };

  const transactionWithdraw: WithdrawFn = async (_, depositIdHex, __, log) => {
    const withdrawResult = await callSmartContract({
      contracts: [
        {
          contractAddress: token.vaquitaContractAddress as `0x${string}`,
          functionName: 'withdraw',
          functionParams: [depositIdHex],
          value: '0',
          chainId: ChainId.BASE_SEPOLIA,
        },
      ],
    });

    log('transactionWithdraw', withdrawResult);

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
