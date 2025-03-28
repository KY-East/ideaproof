'use client';

import React, { useState } from 'react';
import VerifyForm from '@/components/idea/VerifyForm';
import IdeaResultCard from '@/components/idea/IdeaResultCard';
import { IdeaDisplay, IdeaRecord } from '@/types/idea';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

// 模拟验证API调用
const mockVerifyByHash = async (hash: string): Promise<IdeaDisplay | null> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 模拟数据
  if (hash && hash.length > 10) {
    return {
      ideaHash: hash,
      submitter: new PublicKey('5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CerATqtZoLB'),
      timestamp: Math.floor(Date.now() / 1000) - 86400, // 一天前
      fileType: { text: {} },
      title: '测试创意',
      description: '这是一个测试创意的描述，用于演示验证功能。',
      bump: 1,
      txid: '4Fj6vYHSqN6Amu7ArfmXxPYpVhzWGvZgc9PfTXTbWqV7RQ9JrQDZfDELHcQMtWVy8HuLYdZfBc8ixzBP32VWZDF8',
      formattedDate: new Date().toLocaleString(),
      fileTypeLabel: '文本'
    };
  }
  return null;
};

// 模拟获取用户创意列表
const mockGetUserIdeas = async (): Promise<IdeaDisplay[]> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 返回模拟数据
  return [
    {
      ideaHash: '7db2ca5ab4f9972d9b3055bdfd394f612fd317d6daccfdf6e4657c201c938380',
      submitter: new PublicKey('5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CerATqtZoLB'),
      timestamp: Math.floor(Date.now() / 1000) - 86400, // 一天前
      fileType: { text: {} },
      title: '小说创意',
      description: '一个关于未来科技的小说创意，探讨AI与人类共存的社会形态。',
      bump: 1,
      txid: '4Fj6vYHSqN6Amu7ArfmXxPYpVhzWGvZgc9PfTXTbWqV7RQ9JrQDZfDELHcQMtWVy8HuLYdZfBc8ixzBP32VWZDF8',
      formattedDate: new Date().toLocaleString(),
      fileTypeLabel: '文本'
    },
    {
      ideaHash: 'c5ad732de3247031ecb41cf16fcdd2b1e5a7c2cc7fe7f267ceb37cc6eca18eec',
      submitter: new PublicKey('5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CerATqtZoLB'),
      timestamp: Math.floor(Date.now() / 1000) - 172800, // 两天前
      fileType: { image: {} },
      title: '标志设计',
      description: '一款现代化的品牌标志设计，使用简约几何形状。',
      bump: 1,
      txid: '3eV1yvFnHT3TxBUiC6wCuPnG5HBkDDSeJrX2PrXFrXAAG9yZmUnZFgYkPiEi9hV1rzPfnH7BpiGKzT8rs7Wge5AC',
      formattedDate: new Date().toLocaleString(),
      fileTypeLabel: '图片'
    }
  ];
};

const VerifyFormContainer: React.FC = () => {
  const { connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<IdeaDisplay[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const handleVerifyByHash = async (hash: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const result = await mockVerifyByHash(hash);
      if (result) {
        setResults([result]);
      } else {
        setError('找不到匹配的创意记录');
        setResults([]);
      }
    } catch (err) {
      setError('验证过程中发生错误');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGetUserIdeas = async () => {
    if (!connected) {
      setError('请先连接钱包');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      const ideas = await mockGetUserIdeas();
      if (ideas.length > 0) {
        setResults(ideas);
      } else {
        setError('未找到与您钱包关联的创意记录');
        setResults([]);
      }
    } catch (err) {
      setError('获取创意记录时发生错误');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-slate-700 rounded-md p-6 mb-2">
        <VerifyForm 
          onVerifyByHash={handleVerifyByHash}
          onGetUserIdeas={handleGetUserIdeas}
          isLoading={isLoading}
        />
      </div>
      
      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-md p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}
      
      {results.length > 0 && (
        <div className="bg-slate-700 p-6 rounded-md">
          <h3 className="text-lg font-semibold mb-4 text-emerald-300">验证结果</h3>
          <div className="space-y-4">
            {results.map(idea => (
              <IdeaResultCard key={idea.ideaHash} idea={idea} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyFormContainer; 