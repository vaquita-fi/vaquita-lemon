import { parseErc6492Signature, PublicClient, WalletClient } from 'viem';
import { base } from 'wagmi/chains';
import USDC from '../abis/USDC.json';

const permitTypes = {
  Permit: [
    { name: 'owner', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
} as const;

// Function to generate EIP-712 permit signature
const generatePermitSignature = async (
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
    });

    // Prepare domain data
    const domain = {
      name: chainId === base.id ? 'USD Coin' : 'USDC',
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

    return {
      signature: parseErc6492Signature(signature).signature,
      nonce,
      deadline,
    };
  } catch (error) {
    console.error('Error generating permit signature:', error);
    throw error;
  }
};

export { generatePermitSignature };
