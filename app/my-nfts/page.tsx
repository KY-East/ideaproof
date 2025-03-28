'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import { getUserNFTs, listNFTForSale } from '@/utils/nft';

export default function MyNFTsPage() {
  const { publicKey, connected } = useWallet();
  const [language, setLanguage] = useState('en');
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') || 'en';
      setLanguage(savedLanguage);
    }
  }, []);

  const isEnglish = language === 'en';

  useEffect(() => {
    if (connected && publicKey) {
      fetchNFTs();
    } else {
      setNfts([]);
    }
  }, [connected, publicKey]);

  const fetchNFTs = async () => {
    if (!connected || !publicKey) return;

    setLoading(true);
    setError(null);

    try {
      const userNfts = await getUserNFTs({ publicKey });
      setNfts(userNfts);
    } catch (err: any) {
      console.error('获取 NFT 失败:', err);
      setError(err.message || 'Failed to fetch NFTs');
    } finally {
      setLoading(false);
    }
  };

  const handleListForSale = async (mintAddress: string) => {
    if (!connected || !publicKey) {
      alert(isEnglish ? 'Please connect your wallet first' : '请先连接钱包');
      return;
    }

    const price = prompt(isEnglish ? 'Enter the price in SOL:' : '请输入价格（以 SOL 为单位）:');
    if (!price || isNaN(Number(price))) {
      alert(isEnglish ? 'Please enter a valid price' : '请输入有效的价格');
      return;
    }

    try {
      // 这里简化处理，实际应该添加状态管理
      alert(isEnglish 
        ? `NFT will be listed for sale at ${price} SOL (Coming soon)`
        : `NFT 将以 ${price} SOL 上架出售（即将推出）`
      );
      
      // 完整实现示例（将在市场功能完善后启用）
      /*
      const result = await listNFTForSale({
        wallet: { publicKey },
        mintAddress,
        price: Number(price),
      });

      if (result.success) {
        alert(isEnglish 
          ? 'NFT has been listed for sale!'
          : 'NFT 已上架出售！'
        );
        // 重新获取 NFT 列表
        fetchNFTs();
      } else {
        alert(isEnglish
          ? `Failed to list NFT: ${result.error}`
          : `上架 NFT 失败: ${result.error}`
        );
      }
      */
    } catch (error: any) {
      console.error('上架 NFT 失败:', error);
      alert(isEnglish
        ? `Failed to list NFT: ${error.message}`
        : `上架 NFT 失败: ${error.message}`
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-white">
          {isEnglish ? 'My NFTs' : '我的 NFT'}
        </h1>
        
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            {isEnglish ? 'Home' : '首页'}
          </Link>
          <Link
            href="/market"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            {isEnglish ? 'NFT Market' : 'NFT 市场'}
          </Link>
          <WalletMultiButton className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors" />
        </div>
      </header>

      {/* Wallet Not Connected */}
      {!connected && (
        <div className="p-8 bg-slate-800 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">
            {isEnglish ? 'Wallet Not Connected' : '钱包未连接'}
          </h2>
          <p className="text-gray-300 mb-8 max-w-lg mx-auto">
            {isEnglish 
              ? 'Please connect your wallet to view your NFTs. You will be able to see all the idea NFTs you own and list them for sale on the marketplace.'
              : '请连接您的钱包以查看您的 NFT。您将能够看到您拥有的所有创意 NFT，并可以在市场上出售它们。'}
          </p>
          <WalletMultiButton className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg transition-colors mx-auto" />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-3 text-emerald-400">
            {isEnglish ? 'Loading your NFTs...' : '正在加载您的 NFT...'}
          </span>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="p-6 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg mb-8">
          <h2 className="text-xl font-bold text-red-400 mb-2">
            {isEnglish ? 'Error' : '错误'}
          </h2>
          <p className="text-gray-300">{error}</p>
        </div>
      )}

      {/* NFTs Grid */}
      {!loading && connected && nfts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <div key={nft.address.toString()} className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
              {/* NFT Image (if available) */}
              {nft.json?.image && (
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={nft.json.image} 
                    alt={nft.json.name || 'NFT'} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* NFT Details */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-emerald-400 mb-2">
                  {nft.json?.name || `NFT #${nft.address.toString().slice(0, 6)}`}
                </h3>
                
                {nft.json?.description && (
                  <p className="text-gray-300 mb-4 text-sm line-clamp-2">
                    {nft.json.description}
                  </p>
                )}
                
                {/* NFT Properties */}
                <div className="mb-4">
                  {/* Category */}
                  {nft.json?.attributes?.find((attr: any) => attr.trait_type === 'Category') && (
                    <div className="flex items-center text-sm mb-1">
                      <span className="text-gray-400 mr-2">
                        {isEnglish ? 'Category:' : '类别:'}
                      </span>
                      <span className="text-gray-300">
                        {nft.json.attributes.find((attr: any) => attr.trait_type === 'Category').value}
                      </span>
                    </div>
                  )}
                  
                  {/* License */}
                  {nft.json?.attributes?.find((attr: any) => attr.trait_type === 'License') && (
                    <div className="flex items-center text-sm mb-1">
                      <span className="text-gray-400 mr-2">
                        {isEnglish ? 'License:' : '许可:'}
                      </span>
                      <span className="text-gray-300">
                        {nft.json.attributes.find((attr: any) => attr.trait_type === 'License').value}
                      </span>
                    </div>
                  )}
                  
                  {/* Timestamp */}
                  {nft.json?.attributes?.find((attr: any) => attr.trait_type === 'Timestamp') && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-400 mr-2">
                        {isEnglish ? 'Created:' : '创建时间:'}
                      </span>
                      <span className="text-gray-300">
                        {new Date(nft.json.attributes.find((attr: any) => attr.trait_type === 'Timestamp').value).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2 mt-4">
                  <a 
                    href={`https://solscan.io/token/${nft.address.toString()}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-white text-sm"
                  >
                    {isEnglish ? 'View on Solscan' : '在 Solscan 查看'}
                  </a>
                  
                  <button 
                    onClick={() => handleListForSale(nft.address.toString())}
                    className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-md text-white text-sm"
                  >
                    {isEnglish ? 'List for Sale' : '上架出售'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No NFTs */}
      {!loading && connected && nfts.length === 0 && (
        <div className="text-center py-16 px-6 bg-slate-800 rounded-lg shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">
            {isEnglish ? 'No NFTs Found' : '未找到 NFT'}
          </h2>
          <p className="text-gray-300 max-w-lg mx-auto mb-8">
            {isEnglish 
              ? 'You don\'t have any IdeaProof NFTs yet. Start by submitting an idea and creating an NFT for it.'
              : '您还没有任何 IdeaProof NFT。首先提交一个创意并为其创建 NFT。'}
          </p>
          <Link 
            href="/submit"
            className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {isEnglish ? 'Submit an Idea' : '提交创意'}
          </Link>
        </div>
      )}
    </div>
  );
} 