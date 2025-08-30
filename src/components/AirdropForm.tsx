'use client';

import { useMemo, useState } from 'react';
import InputField from '@/components/ui/inputField';
import { chainsToTSender, tsenderAbi, erc20Abi } from '@/constants';
import { useAccount, useChainId, useConfig, useWriteContract } from 'wagmi';
import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import { calculateTotal } from '@/utils/calculateTotal/calculateTotal';

export default function AirDropForm() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [recipients, setRecipients] = useState('');
  const [amounts, setAmounts] = useState('');
  const chainId = useChainId();
  const wagmiConfig = useConfig();
  const account = useAccount();
  const total: number = useMemo(() => calculateTotal(amounts), [amounts]);
  const totalAmountNeeded: number = total * 10 ** 18; // Assuming 18 decimals
  const { data: hash, isPending, writeContractAsync } = useWriteContract();

  async function getApprovedAmount(
    tSenderAddress: string | null
  ): Promise<number> {
    // Logic to get the approved amount from the token contract
    if (!tSenderAddress) {
      console.error('Unsupported chain ID or No tSender address found.');
      return 0;
    }

    if (!account?.address) {
      console.error('No connected account found.');
      return 0;
    }

    if (!tokenAddress) {
      console.error('Token address is required.');
      return 0;
    }

    // Read the allowance from the ERC20 contract
    const approvedAmount = await readContract(wagmiConfig, {
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: 'allowance',
      args: [
        account?.address as `0x${string}`,
        tSenderAddress as `0x${string}`,
      ],
    });

    return approvedAmount as number;
  }
  async function handleSubmit() {
    // Handle form submission logic here
    const tSenderAddress = chainsToTSender[chainId]['tsender'];
    const approvedAmount = await getApprovedAmount(tSenderAddress);

    // Proceed with airdrop logic
    // You can call your airdrop function here with the collected data
    console.log('Approved Amount:', approvedAmount);
    console.log('Token Address:', tokenAddress);
    console.log(
      'Recipients:',
      recipients.split(',').map((addr) => addr.trim())
    );
    console.log(
      'Amounts:',
      amounts.split(',').map((amt) => amt.trim())
    );
    console.log('Approved Amount:', approvedAmount);
    console.log('Total Amount Needed (in wei):', totalAmountNeeded);

    if (approvedAmount < total) {
      const approvalHash = await writeContractAsync({
        abi: tsenderAbi,
        address: tSenderAddress as `0x${string}`,
        functionName: 'approve',
        args: [tSenderAddress as `0x${string}`, BigInt(total)],
      });
      const approvalReceipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: approvalHash,
      });
      console.log('Approval Transaction Receipt:', approvalReceipt);

      const airdropHash = await writeContractAsync({
        abi: tsenderAbi,
        address: tSenderAddress as `0x${string}`,
        functionName: 'airdropToken',
        args: [
          tokenAddress as `0x${string}`,
          // Comma or new line separated
          recipients
            .split(/[,\n]+/)
            .map((addr) => addr.trim())
            .filter((addr) => addr !== ''),
          amounts
            .split(/[,\n]+/)
            .map((amt) => amt.trim())
            .filter((amt) => amt !== ''),
          BigInt(total),
        ],
      });
      const airdropReceipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: airdropHash,
      });
      console.log('Airdrop Transaction Receipt:', airdropReceipt);
    } else {
      await writeContractAsync({
        abi: tsenderAbi,
        address: tSenderAddress as `0x${string}`,
        functionName: 'airdropERC20',
        args: [
          tokenAddress,
          // Comma or new line separated
          recipients
            .split(/[,\n]+/)
            .map((addr) => addr.trim())
            .filter((addr) => addr !== ''),
          amounts
            .split(/[,\n]+/)
            .map((amt) => amt.trim())
            .filter((amt) => amt !== ''),
          BigInt(total),
        ],
      });
    }
    console.log('Airdrop process initiated.');
  }

  return (
    <div>
      <InputField
        label="Token Address"
        placeholder="0x"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
      <InputField
        label="Recipients"
        placeholder="0x1234, 0x5678, 0x9abc,..."
        value={recipients}
        onChange={(e) => setRecipients(e.target.value)}
      />
      <InputField
        label="Amount"
        placeholder="1000, 2000, 3000,..."
        value={amounts}
        onChange={(e) => setAmounts(e.target.value)}
      />

      <div className="flex justify-center">
        <button
          className="mt-2 w-full max-w-[180px] px-6 py-3 rounded-lg bg-blue-500 text-white backdrop-blur-sm bg-opacity-70 border border-white/20 shadow-md hover:shadow-lg hover:bg-opacity-90 transition-all duration-200 ease-in-out active:scale-95 active:shadow-inner"
          onClick={handleSubmit}
        >
          Airdrop Tokens
        </button>
      </div>
    </div>
  );
}
