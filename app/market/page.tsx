'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import { getMarketNFTs, buyNFT } from '@/utils/nft';

export default function MarketPage() {
  const { publicKey, connected, wallet } = useWallet();
  const [language, setLanguage] = useState('en');
  const [marketNfts, setMarketNfts] = useState<any[]>([]);
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
    fetchMarketNFTs();
  }, []);

  const fetchMarketNFTs = async () => {
    setLoading(true);
    setError(null);

    try {
      const nfts = await getMarketNFTs(wallet);
      setMarketNfts(nfts);
    } catch (err: any) {
      console.error('获取市场 NFT 失败:', err);
      setError(isEnglish 
        ? 'Failed to fetch NFTs from the market. Please try again later.' 
        : '获取市场 NFT 失败。请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNFT = async (mintAddress: string, price: number) => {
    if (!connected || !publicKey) {
      alert(isEnglish ? 'Please connect your wallet first' : '请先连接钱包');
      return;
    }

    try {
      // 简化处理，实际应该添加状态管理
      alert(isEnglish 
        ? `Buying NFT for ${price} SOL (Coming soon)`
        : `正在购买 NFT，价格 ${price} SOL（即将推出）`
      );
      
      // 完整实现示例（将在市场功能完善后启用）
      /*
      const result = await buyNFT({
        wallet: { publicKey },
        mintAddress,
        price
      });

      if (result.success) {
        alert(isEnglish 
          ? 'NFT purchased successfully!'
          : 'NFT 购买成功！'
        );
        // 重新获取市场 NFT 列表
        fetchMarketNFTs();
      } else {
        alert(isEnglish
          ? `Failed to purchase NFT: ${result.error}`
          : `购买 NFT 失败: ${result.error}`
        );
      }
      */
    } catch (error: any) {
      console.error('购买 NFT 失败:', error);
      alert(isEnglish
        ? `Failed to purchase NFT: ${error.message}`
        : `购买 NFT 失败: ${error.message}`
      );
    }
  };

  // 示例 NFT 数据（开发阶段使用）
  const mockNfts = [
    {
      address: "mock1",
      price: 1.5,
      json: {
        name: "创意概念: 可持续城市建筑",
        description: "利用可再生材料和能源的未来城市建筑设计理念",
        image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&auto=format&fit=crop",
        attributes: [
          { trait_type: "Category", value: "建筑设计" },
          { trait_type: "License", value: "CC BY-NC-SA" },
          { trait_type: "Timestamp", value: new Date().toISOString() }
        ]
      },
      seller: "Wallet123"
    },
    {
      address: "mock2",
      price: 2.2,
      json: {
        name: "音乐创意: 新世代融合音乐",
        description: "结合传统民族乐器与电子音乐的创新音乐风格",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop",
        attributes: [
          { trait_type: "Category", value: "音乐创作" },
          { trait_type: "License", value: "CC BY" },
          { trait_type: "Timestamp", value: new Date().toISOString() }
        ]
      },
      seller: "Wallet456"
    },
    {
      address: "mock3",
      price: 0.8,
      json: {
        name: "文学创意: 平行宇宙理论探索",
        description: "探讨多元宇宙中人类命运与选择的科幻小说概念",
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop",
        attributes: [
          { trait_type: "Category", value: "文学创作" },
          { trait_type: "License", value: "All Rights Reserved" },
          { trait_type: "Timestamp", value: new Date().toISOString() }
        ]
      },
      seller: "Wallet789"
    }
  ];

  // 在开发阶段使用模拟数据
  useEffect(() => {
    if (marketNfts.length === 0 && !loading) {
      setMarketNfts(mockNfts);
    }
  }, [marketNfts, loading]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-white">
          {isEnglish ? 'NFT Market' : 'NFT 市场'}
        </h1>
        
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            {isEnglish ? 'Home' : '首页'}
          </Link>
          <Link
            href="/my-nfts"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            {isEnglish ? 'My NFTs' : '我的 NFT'}
          </Link>
          <WalletMultiButton className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors" />
        </div>
      </header>

      {/* Market Description */}
      <div className="mb-12 p-6 bg-slate-800 rounded-lg">
        <h2 className="text-2xl font-bold text-emerald-400 mb-4">
          {isEnglish ? 'Creative Ideas Marketplace' : '创意市场'}
        </h2>
        <p className="text-gray-300 max-w-3xl">
          {isEnglish 
            ? 'Discover and collect unique digital assets representing verified creative ideas. Each NFT represents an original idea that has been timestamped and verified on the blockchain.'
            : '发现并收集代表已验证创意的独特数字资产。每个 NFT 代表一个已在区块链上时间戳记和验证的原创创意。'}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-3 text-emerald-400">
            {isEnglish ? 'Loading marketplace...' : '正在加载市场...'}
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
      {!loading && marketNfts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketNfts.map((nft) => (
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
                
                {/* Price */}
                <div className="bg-slate-700 p-3 rounded-md mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">
                      {isEnglish ? 'Price:' : '价格:'}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {nft.price} SOL
                    </span>
                  </div>
                </div>
                
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
                  
                  {/* Seller */}
                  {nft.seller && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-400 mr-2">
                        {isEnglish ? 'Seller:' : '出售者:'}
                      </span>
                      <span className="text-gray-300">
                        {typeof nft.seller === 'string' 
                          ? `${nft.seller.slice(0, 4)}...${nft.seller.slice(-4)}` 
                          : `${nft.seller.toString().slice(0, 4)}...${nft.seller.toString().slice(-4)}`}
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
                    {isEnglish ? 'View Details' : '查看详情'}
                  </a>
                  
                  <button 
                    onClick={() => handleBuyNFT(nft.address.toString(), nft.price)}
                    className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-md text-white text-sm"
                    disabled={!connected}
                  >
                    {isEnglish ? 'Buy Now' : '立即购买'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No NFTs */}
      {!loading && marketNfts.length === 0 && (
        <div className="text-center py-16 px-6 bg-slate-800 rounded-lg shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">
            {isEnglish ? 'No NFTs Available' : '暂无可用 NFT'}
          </h2>
          <p className="text-gray-300 max-w-lg mx-auto mb-8">
            {isEnglish 
              ? 'There are currently no NFTs listed for sale on the marketplace. Be the first to create and list your idea NFT!'
              : '目前市场上没有上架出售的 NFT。成为第一个创建并上架创意 NFT 的用户！'}
          </p>
          <Link 
            href="/submit"
            className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {isEnglish ? 'Create an NFT' : '创建 NFT'}
          </Link>
        </div>
      )}
    </div>
  );
} 