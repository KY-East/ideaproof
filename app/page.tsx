'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
  const [language, setLanguage] = useState('en'); // 默认英文
  const { publicKey, connected } = useWallet();
  
  // 在客户端组件中，页面加载后检查localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  const isEnglish = language === 'en';

  // 切换语言
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'zh' : 'en';
    setLanguage(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Wallet Button */}
      <header className="flex justify-between items-center mb-16">
        <h1 className="text-2xl font-bold text-white">IdeaProof</h1>
        <div className="flex items-center space-x-4">
          <a 
            href="http://localhost:3004"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Dev
          </a>
          <a 
            href="https://the-answer-is-ks.gitbook.io/ideaproof"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Docs
          </a>
          <button 
            onClick={toggleLanguage} 
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
          >
            {language === 'en' ? '中文' : 'English'}
          </button>
          {typeof window !== 'undefined' && (
            <WalletMultiButton className="bg-gray-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors" />
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold mb-4 text-white">
          {isEnglish ? (
            <>
              In the age of AI, imitation is instant.<br />
              Your idea needs to be on-chain first.
            </>
          ) : (
            <>
              AI 时代，模仿最快。<br />
              你的创意，必须上链。
            </>
          )}
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          {isEnglish ? (
            "In an era of generative AI, ideas can be copied or stolen in seconds. IdeaProof timestamps your thoughts on the blockchain — instantly and immutably."
          ) : (
            "在 AI 爆炸式增长的时代，创意随时可能被复制或篡改。IdeaProof 帮你第一时间将创意上链，生成不可伪造的时间戳证据。"
          )}
        </p>
      </div>

      {/* Feature Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-emerald-300">
            {isEnglish ? "Submit Idea" : "提交创意"}
          </h2>
          <p className="text-gray-300 mb-6 h-20">
            {isEnglish 
              ? "Get immutable timestamp proof, recording idea ownership and first appearance time."
              : "获取不可篡改的时间戳证明，记录创意归属与首次出现时间。"
            }
          </p>
          <Link 
            href="/submit"
            className="block text-center bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium transition-colors w-40 mx-auto"
          >
            {isEnglish ? "Start Recording" : "立即开始"}
          </Link>
        </div>

        <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-emerald-300">
            {isEnglish ? "Verify Idea" : "验证创意"}
          </h2>
          <p className="text-gray-300 mb-6 h-20">
            {isEnglish
              ? "Verify if ideas have already been recorded, ensuring uniqueness."
              : "验证创意是否已被记录，确保独特性。"
            }
          </p>
          <Link 
            href="/verify"
            className="block text-center bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium transition-colors w-40 mx-auto"
          >
            {isEnglish ? "Verify Proof" : "立即验证"}
          </Link>
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-16 text-center mb-16">
        <h2 className="text-3xl font-bold mb-8 text-emerald-300">
          {isEnglish ? "How It Works" : "工作原理"}
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800 p-6 rounded-lg h-64 flex flex-col items-center">
            <div className="text-4xl font-bold text-emerald-400 mb-4">1</div>
            <h3 className="text-xl font-semibold mb-4">
              {isEnglish ? "Write or Upload" : "撰写创意"}
            </h3>
            <p className="text-gray-400">
              {isEnglish 
                ? "Write your idea or upload a file to generate a hash"
                : "撰写创意或上传文件，生成哈希"
              }
            </p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg h-64 flex flex-col items-center">
            <div className="text-4xl font-bold text-emerald-400 mb-4">2</div>
            <h3 className="text-xl font-semibold mb-4">
              {isEnglish ? "Authorize Wallet" : "授权签名"}
            </h3>
            <p className="text-gray-400">
              {isEnglish 
                ? "Authorize wallet signature"
                : "授权钱包签名"
              }
            </p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg h-64 flex flex-col items-center">
            <div className="text-4xl font-bold text-emerald-400 mb-4">3</div>
            <h3 className="text-xl font-semibold mb-4">
              {isEnglish ? "Get Timestamp" : "上链记录"}
            </h3>
            <p className="text-gray-400">
              {isEnglish 
                ? "Submit to the blockchain for a timestamp"
                : "提交至区块链，获取时间戳"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Status Section - Only show if wallet is connected */}
      {connected && publicKey && (
        <div className="bg-slate-800 p-6 rounded-lg max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-4 text-emerald-300 text-center">
            {isEnglish ? "Wallet Connected" : "钱包已连接"}
          </h2>
          <p className="text-gray-300 text-center mb-4">
            {isEnglish 
              ? "Your wallet is connected and ready to record ideas on the blockchain."
              : "您的钱包已连接，可以在区块链上记录创意。"
            }
          </p>
          <p className="bg-slate-700 rounded p-2 text-center text-emerald-400 font-mono">
            {publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-4)}
          </p>
        </div>
      )}

      <footer className="mt-16 text-center text-gray-400">
        <p>
          {isEnglish 
            ? "© 2024 IdeaProof - Protect your ideas with blockchain timestamps."
            : "© 2024 IdeaProof - 用区块链时间戳保护您的创意。"
          }
        </p>
      </footer>
    </div>
  );
} 