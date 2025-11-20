/* eslint-disable */
'use client';

import { Address, Avatar, EthBalance, Identity, Name } from '@coinbase/onchainkit/identity';
import { useAddFrame, useMiniKit, useOpenUrl } from '@coinbase/onchainkit/minikit';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import Link from 'next/link';
import { useCallback, useMemo, useRef, useState } from 'react';
import { decodeEventLog, formatUnits, parseUnits, PublicClient, WalletClient } from 'viem';
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useSwitchChain,
  useWalletClient,
  useWriteContract,
} from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import USDC from '../../abis/USDC.json'; // Contract addresses - set these in your .env.local file
import VaquitaPoolABI from '../../abis/VaquitaPool.json';
import { Button, Features, Home, Icon } from '../../components/DemoComponents';
import { generatePermitSignature } from '../crypto';

// Contract addresses - set these in your .env.local file
const VAQUITA_POOL_ADDRESS = process.env.NEXT_PUBLIC_VAQUITA_POOL_ADDRESS || '0x...';
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x...';

const PERIOD_90_DAYS = 7776000;
const PERIOD_1_MINUTE = 60;

export default function TestPage() {
  const { context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [depositAmount, setDepositAmount] = useState('');
  const [manualDepositId, setManualDepositId] = useState('');
  const { chain } = useAccount();
  const chainId = chain?.id;

  const selectedChainId = process.env.NEXT_PUBLIC_ENV === 'production' ? base.id : baseSepolia.id;
  console.log('🔗 Selected chain ID:', selectedChainId);

  // Debug chain connection
  console.log('🔗 Chain info:', { chain, chainId });

  // Function to switch to Base mainnet or Base Sepolia Testnet
  const switchToBase = async () => {
    try {
      await switchChain({ chainId: selectedChainId });
    } catch (error) {
      console.error(
        'Failed to switch to' +
          (process.env.NEXT_PUBLIC_ENV === 'production' ? 'Base' : 'Base Sepolia'),
        error
      );
    }
  };
  const [lockPeriod, setLockPeriod] = useState(
    process.env.NEXT_PUBLIC_ENV === 'production' ? PERIOD_90_DAYS : PERIOD_1_MINUTE
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);

  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { switchChain } = useSwitchChain();

  const [transactions, setTransactions] = useState(
    [] as Array<{
      id: number;
      date: string;
      amount: number;
      type: string;
      txHash?: string;
      depositId?: string;
      withdrawn?: boolean;
    }>
  );

  // Contract write for deposit
  const {
    writeContract: deposit,
    isPending: isDepositLoading,
    data: depositData,
  } = useWriteContract();

  // Debug: Log when deposit function is called
  const depositWithLogging = (args: any) => {
    console.log('🚀 deposit function called with args:', args);
    return deposit(args);
  };

  // Contract write for withdraw
  const {
    writeContract: withdraw,
    isPending: isWithdrawLoading,
    data: withdrawData,
  } = useWriteContract();

  // Contract read for USDC balance
  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS as `0x${string}`,
    abi: USDC,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Contract read for USDC decimals
  const { data: usdcDecimals } = useReadContract({
    address: USDC_ADDRESS as `0x${string}`,
    abi: USDC,
    functionName: 'decimals',
  });

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  // Function to extract depositId from transaction receipt
  const extractDepositId = async (txHash: string) => {
    console.log('🔍 extractDepositId called with txHash:', txHash);

    if (!publicClient) {
      console.log('❌ No public client available');
      return null;
    }

    try {
      console.log('⏳ Fetching transaction receipt...');
      const receipt = await publicClient.getTransactionReceipt({ hash: txHash as `0x${string}` });
      console.log('📄 Receipt received:', { logsCount: receipt.logs.length });

      // Look for the FundsDeposited event in the logs
      for (let i = 0; i < receipt.logs.length; i++) {
        const log = receipt.logs[i];
        console.log(`🔍 Checking log ${i}:`, { data: log.data, topics: log.topics });

        try {
          // Try to decode the log as a FundsDeposited event
          const decodedLog = decodeEventLog({
            abi: VaquitaPoolABI,
            data: log.data,
            topics: log.topics,
          });

          console.log('📝 Decoded log:', {
            eventName: decodedLog.eventName,
            args: decodedLog.args,
          });

          if (decodedLog.eventName === 'FundsDeposited' && decodedLog.args) {
            // The first indexed parameter is the depositId
            const args = decodedLog.args as any;
            if (args.depositId) {
              console.log('✅ Found depositId:', args.depositId);
              return args.depositId;
            }
          }
        } catch (error) {
          console.log(`⚠️ Log ${i} doesn't match FundsDeposited event:`, error);
          // Log doesn't match FundsDeposited event, continue to next log
          continue;
        }
      }

      console.log('❌ No FundsDeposited event found in logs');
      return null;
    } catch (error) {
      console.error('❌ Error extracting depositId:', error);
      return null;
    }
  };

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  const handleDeposit = async () => {
    console.log('🚀 handleDeposit called with:', { depositAmount, lockPeriod });

    if (!isConnected || !address) {
      console.log('❌ Wallet not connected');
      alert('Please connect your wallet first');
      return;
    }

    if (chainId !== selectedChainId) {
      console.log('❌ Wrong chain:', chainId);
      alert(
        `Please switch to ${process.env.NEXT_PUBLIC_ENV === 'production' ? 'Base Mainnet' : 'Base Sepolia Testnet'} first`
      );
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      console.log('❌ Invalid deposit amount:', depositAmount);
      alert('Please enter a valid deposit amount');
      return;
    }

    // Check USDC balance
    if (usdcBalance && usdcDecimals) {
      const userBalance = Number(formatUnits(usdcBalance as bigint, usdcDecimals as number));
      console.log('💰 USDC Balance check:', {
        userBalance,
        requestedAmount: parseFloat(depositAmount),
      });
      if (parseFloat(depositAmount) > userBalance) {
        alert(`Insufficient USDC balance. You have ${userBalance.toFixed(2)} USDC`);
        return;
      }
    }

    try {
      console.log('⏳ Starting deposit process...');
      setIsLoading(true);

      // Reset approval processed flag for new deposit
      approvalProcessedRef.current = false;

      // Convert amount to USDC units (6 decimals)
      const amountInUSDCUnits = parseUnits(depositAmount, 6);
      const periodInSeconds = BigInt(lockPeriod); // Convert minutes to seconds

      // First approve USDC spending
      console.log('🔐 Initiating USDC approval...');
      setIsWaitingForApproval(true);

      console.log('✅ Approval successful, triggering deposit...');
      approvalProcessedRef.current = true; // Mark as processed immediately
      setIsWaitingForApproval(false);
      console.log('✅ USDC approval initiated, waiting for confirmation...');
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now
      console.log({
        walletClient,
        publicClient,
        address,
        USDC_ADDRESS,
        VAQUITA_POOL_ADDRESS,
        amountInUSDCUnits,
        deadline,
        chainId,
      });
      const {
        signature,
        nonce,
        deadline: permitDeadline,
      } = await generatePermitSignature(
        walletClient as WalletClient,
        publicClient as PublicClient,
        address as `0x${string}`,
        USDC_ADDRESS as `0x${string}`,
        VAQUITA_POOL_ADDRESS as `0x${string}`,
        amountInUSDCUnits,
        deadline,
        chainId as number
      );
      console.log('🔐 Permit signature:', signature);
      console.log('🔐 Nonce:', nonce);
      console.log('🔐 Permit deadline:', permitDeadline);

      console.log('📝 Deposit parameters:', {
        amountInUSDCUnits: amountInUSDCUnits.toString(),
        periodInSeconds: periodInSeconds.toString(),
        deadline: deadline.toString(),
        signature,
      });

      // Now proceed with deposit
      depositWithLogging({
        address: VAQUITA_POOL_ADDRESS as `0x${string}`,
        abi: VaquitaPoolABI,
        functionName: 'deposit',
        args: [amountInUSDCUnits, periodInSeconds, deadline, signature],
        gas: BigInt(1000000),
      });
      // Note: The deposit will be triggered automatically when approval is successful
      // via the useMemo hook that watches isApprovalSuccess
    } catch (error) {
      console.error('❌ Deposit error:', error);
      alert('Failed to initiate deposit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (id: number) => {
    console.log('🚀 handleWithdraw called with id:', id);
    console.log('🔍 Current state:', { isConnected, address, chainId });

    if (!isConnected || !address) {
      console.log('❌ Wallet not connected');
      alert('Please connect your wallet first');
      return;
    }

    if (chainId !== selectedChainId) {
      console.log('❌ Wrong chain:', chainId);
      alert(
        `Please switch to ${process.env.NEXT_PUBLIC_ENV === 'production' ? 'Base Mainnet' : 'Base Sepolia Testnet'} first`
      );
      return;
    }

    try {
      const transaction = transactions.find((t) => t.id === id);
      console.log('🔍 Found transaction:', transaction);

      if (!transaction) {
        console.log('❌ Transaction not found');
        alert('Transaction not found');
        return;
      }

      // Allow retry even if previously withdrawn (in case of failures)
      console.log('✅ Proceeding with withdraw...');

      if (transaction.type === 'deposit' && transaction.depositId) {
        console.log('🔐 Calling contract withdraw with depositId:', transaction.depositId);
        // We have a depositId, so we can call the actual contract withdraw function
        withdraw({
          address: VAQUITA_POOL_ADDRESS as `0x${string}`,
          abi: VaquitaPoolABI,
          functionName: 'withdraw',
          args: [transaction.depositId as `0x${string}`],
          gas: BigInt(1000000),
        });

        // Mark transaction as withdrawn instead of removing it
        setTransactions((prevTransactions) =>
          prevTransactions.map((tx) => (tx.id === id ? { ...tx, withdrawn: true } : tx))
        );
      } else {
        console.log('⚠️ No depositId, marking as withdrawn locally');
        // Fallback: mark as withdrawn for transactions without depositId
        setTransactions((prevTransactions) =>
          prevTransactions.map((tx) => (tx.id === id ? { ...tx, withdrawn: true } : tx))
        );
      }
    } catch (error) {
      console.error('Withdraw error:', error);
      alert('Failed to withdraw');
    }
  };

  const handleManualWithdraw = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!manualDepositId.trim()) {
      alert('Please enter a deposit ID');
      return;
    }

    if (chainId !== selectedChainId) {
      alert(
        `Please switch to ${process.env.NEXT_PUBLIC_ENV === 'production' ? 'Base Mainnet' : 'Base Sepolia Testnet'} first`
      );
      return;
    }

    try {
      console.log('🚀 Manual withdraw called with depositId:', manualDepositId);

      withdraw({
        address: VAQUITA_POOL_ADDRESS as `0x${string}`,
        abi: VaquitaPoolABI,
        functionName: 'withdraw',
        args: [manualDepositId as `0x${string}`],
        gas: BigInt(1000000),
      });

      // Clear the input after successful withdrawal initiation
      setManualDepositId('');
    } catch (error) {
      console.error('Manual withdraw error:', error);
      alert('Failed to withdraw');
    }
  };

  // Automatically trigger deposit when approval is successful
  const approvalProcessedRef = useRef(false);

  // Update transactions when deposit is successful
  useMemo(() => {
    console.log('🔍 Deposit useMemo triggered:', {
      depositData,
      depositAmount,
      transactionsLength: transactions.length,
    });

    if (depositData && depositAmount && !transactions.some((tx) => tx.txHash === depositData)) {
      console.log('✅ Deposit successful, creating transaction record...');

      // Create initial transaction entry
      const newTransaction = {
        id: transactions.length + 1,
        date: new Date().toISOString().split('T')[0],
        amount: parseFloat(depositAmount),
        type: 'deposit',
        txHash: depositData,
        depositId: '', // Will be populated when we get the receipt
      };

      console.log('📝 New transaction:', newTransaction);

      setTransactions([...transactions, newTransaction]);
      setDepositAmount(''); // Reset input

      // Reset approval processed flag for next deposit
      approvalProcessedRef.current = false;

      // Extract depositId from the transaction receipt
      extractDepositId(depositData).then((depositId) => {
        if (depositId) {
          console.log('🔍 Extracted depositId:', depositId);
          // Update the transaction with the depositId
          setTransactions((prevTransactions) =>
            prevTransactions.map((tx) =>
              tx.txHash === depositData ? { ...tx, depositId: depositId as string } : tx
            )
          );
        } else {
          console.log('⚠️ No depositId found in transaction logs');
        }
      });
    } else if (depositData && transactions.some((tx) => tx.txHash === depositData)) {
      console.log('⚠️ Transaction already exists, skipping duplicate creation');
    }
  }, [depositData, transactions, depositAmount]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-3 h-11">
          <div className=" w-full flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-inherit" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>

            <Link href="/">
              <Button icon={<Icon name="left-right" size="sm" />}>Back</Button>
            </Link>
          </div>
          <div>{saveFrameButton}</div>
        </header>

        <main className="flex-1">
          {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
          {activeTab === 'features' && <Features setActiveTab={setActiveTab} />}

          {/* Deposit Section */}
          <div className="w-full mt-4 space-y-4">
            <div className="bg-[var(--app-card)] rounded-xl p-4 shadow-sm border border-[var(--app-border)]">
              <h3 className="text-lg font-semibold mb-3 text-[var(--app-foreground)]">
                Deposit to VaquitaPool
              </h3>

              {/* Amount Input */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-[var(--app-foreground-muted)] mb-2">
                  Amount (USDC)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.0"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-[var(--app-border)] rounded-lg bg-[var(--app-background)] text-[var(--app-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]"
                />
                {/* USDC Balance Display */}
                {isConnected && usdcBalance && usdcDecimals ? (
                  <div className="mt-1 text-xs text-[var(--app-foreground-muted)]">
                    Balance:{' '}
                    {Number(formatUnits(usdcBalance as bigint, usdcDecimals as number)).toFixed(2)}{' '}
                    USDC
                  </div>
                ) : null}
              </div>

              {/* Lock Period Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--app-foreground-muted)] mb-2">
                  Lock Period (days)
                </label>
                <select
                  value={lockPeriod}
                  onChange={(e) => setLockPeriod(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-[var(--app-border)] rounded-lg bg-[var(--app-background)] text-[var(--app-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]"
                >
                  <option value="60">1 minute</option>
                  <option value="604800">1 week</option>
                </select>
              </div>

              {/* Deposit Button */}
              <button
                onClick={handleDeposit}
                disabled={
                  !isConnected ||
                  isLoading ||
                  isDepositLoading ||
                  isWaitingForApproval ||
                  !depositAmount ||
                  chainId !== selectedChainId
                }
                className={`w-full font-semibold py-3 px-6 rounded-xl shadow-sm transition-colors duration-200 ${
                  !isConnected ||
                  isLoading ||
                  isDepositLoading ||
                  isWaitingForApproval ||
                  !depositAmount ||
                  chainId !== selectedChainId
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white'
                }`}
              >
                {chainId !== selectedChainId
                  ? `Switch to ${process.env.NEXT_PUBLIC_ENV === 'production' ? 'Base Mainnet' : 'Base Sepolia Testnet'}`
                  : isWaitingForApproval
                    ? 'Waiting for Approval...'
                    : isDepositLoading
                      ? 'Processing...'
                      : isLoading
                        ? 'Preparing...'
                        : 'Deposit'}
              </button>

              {/* Connection Status */}
              {!isConnected && (
                <p className="text-sm text-red-500 mt-2 text-center">
                  Please connect your wallet to deposit
                </p>
              )}

              {/* Chain Status */}
              {isConnected && chainId !== selectedChainId && (
                <div className="mt-2 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
                  <p className="text-sm text-yellow-800 mb-2">
                    Please switch to{' '}
                    {process.env.NEXT_PUBLIC_ENV === 'production'
                      ? 'Base Mainnet'
                      : 'Base Sepolia Testnet'}{' '}
                    to use this app
                  </p>
                  <button
                    onClick={switchToBase}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                  >
                    Switch to{' '}
                    {process.env.NEXT_PUBLIC_ENV === 'production'
                      ? 'Base Mainnet'
                      : 'Base Sepolia Testnet'}
                  </button>
                </div>
              )}

              {/* Chain Info */}
              {isConnected && chainId && (
                <div className="mt-2 text-xs text-gray-600 text-center">
                  Connected to: {chain?.name || `Chain ${chainId}`}
                </div>
              )}
            </div>
          </div>

          {/* Manual Withdraw Section */}
          <div className="w-full mt-4 space-y-4">
            <div className="bg-[var(--app-card)] rounded-xl p-4 shadow-sm border border-[var(--app-border)]">
              <h3 className="text-lg font-semibold mb-3 text-[var(--app-foreground)]">
                Manual Withdraw
              </h3>

              {/* Deposit ID Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--app-foreground-muted)] mb-2">
                  Deposit ID
                </label>
                <input
                  type="text"
                  value={manualDepositId}
                  onChange={(e) => setManualDepositId(e.target.value)}
                  placeholder="Enter deposit ID (e.g., 0x1234...)"
                  className="w-full px-3 py-2 border border-[var(--app-border)] rounded-lg bg-[var(--app-background)] text-[var(--app-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]"
                />
                <div className="mt-1 text-xs text-[var(--app-foreground-muted)]">
                  Enter the deposit ID you want to withdraw
                </div>
              </div>

              {/* Manual Withdraw Button */}
              <button
                onClick={handleManualWithdraw}
                disabled={!isConnected || isWithdrawLoading || !manualDepositId.trim()}
                className={`w-full font-semibold py-3 px-6 rounded-xl shadow-sm transition-colors duration-200 ${
                  !isConnected || isWithdrawLoading || !manualDepositId.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {isWithdrawLoading ? 'Processing...' : 'Withdraw'}
              </button>

              {/* Manual Withdraw Status */}
              {!isConnected && (
                <p className="text-sm text-red-500 mt-2 text-center">
                  Please connect your wallet to withdraw
                </p>
              )}

              {isConnected && chainId !== selectedChainId && (
                <p className="text-sm text-yellow-600 mt-2 text-center">
                  Note: You're not on{' '}
                  {process.env.NEXT_PUBLIC_ENV === 'production'
                    ? 'Base Mainnet'
                    : 'Base Sepolia Testnet'}
                  . The transaction may fail.
                </p>
              )}
            </div>
          </div>

          {/* Transactions List (Mobile-friendly) */}
          <div className="space-y-3 mt-4">
            <h3 className="text-lg font-semibold text-[var(--app-foreground)]">
              Recent Transactions
            </h3>
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-[var(--app-card)] rounded-xl p-4 shadow-sm border border-[var(--app-border)]"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-[var(--app-foreground-muted)]">
                      #{transaction.id}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'deposit'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.type}
                    </span>
                    {transaction.withdrawn && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Withdrawn
                      </span>
                    )}
                  </div>
                  <span className="text-lg font-semibold text-[var(--app-foreground)]">
                    ${transaction.amount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--app-foreground-muted)]">
                    {transaction.date}
                  </span>
                  {transaction.type === 'deposit' && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🖱️ Withdraw button clicked for transaction:', transaction.id);
                        handleWithdraw(transaction.id);
                      }}
                      disabled={isWithdrawLoading}
                      className={`font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm ${
                        isWithdrawLoading
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      {isWithdrawLoading
                        ? 'Processing...'
                        : transaction.withdrawn
                          ? 'Withdraw Again'
                          : 'Withdraw'}
                    </button>
                  )}
                </div>

                {/* Transaction Hash and Deposit ID for deposits */}
                {transaction.txHash && (
                  <div className="mt-2 pt-2 border-t border-[var(--app-border)] space-y-1">
                    <div className="text-xs text-[var(--app-foreground-muted)]">
                      TX: {transaction.txHash.slice(0, 10)}...{transaction.txHash.slice(-8)}
                    </div>
                    {transaction.depositId && (
                      <div className="text-xs text-[var(--app-foreground-muted)]">
                        Deposit ID: {transaction.depositId.slice(0, 10)}...
                        {transaction.depositId.slice(-8)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>

        <footer className="mt-2 pt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl('https://base.org/builders/minikit')}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}
