import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

interface UseTransactionProps {
  provider: ethers.BrowserProvider;
  signer: ethers.JsonRpcSigner;
}

export const useTransaction = ({ provider, signer }: UseTransactionProps) => {
  const [txStatus, setTxStatus] = useState<string | undefined>(undefined); // 트랜잭션 상태
  const [txHash, setTxHash] = useState<string | undefined>(undefined); // 트랜잭션 해시

  const sendTransaction = useCallback(async (to: string, amount: string) => {
    try {
      setTxStatus('Transaction Sent...');
      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(amount),
      });
      setTxHash(tx.hash); // 트랜잭션 해시 설정
      setTxStatus('Transaction Pending...');
      
      // 트랜잭션이 블록에 포함될 때까지 기다립니다.
      const receipt = await tx.wait();
      setTxStatus('Transaction Successful!');
      console.log('Transaction Receipt:', receipt);
    } catch (error) {
      console.error('Transaction Error:', error);
      setTxStatus('Transaction Failed!');
    }
  }, [signer]);

  return { sendTransaction, txStatus, txHash };
};
