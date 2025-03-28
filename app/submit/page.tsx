'use client';

import React, { useState, useEffect } from 'react';
import IdeaForm from '../components/idea/IdeaForm';
import Header from '../components/layout/header';

export default function SubmitPage() {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') || 'en';
      setLanguage(savedLanguage);
    }
  }, []);

  const isEnglish = language === 'en';

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-emerald-400">
          {isEnglish ? 'Submit Your Idea' : '提交您的创意'}
        </h1>
        
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-emerald-300">
              {isEnglish ? 'About Idea Submission' : '关于创意提交'}
            </h2>
            <p className="text-gray-300 mb-4">
              {isEnglish 
                ? 'Fill out the form below to securely record your idea on the Solana blockchain. Your content will be converted into a secure hash and stored with a precise timestamp, providing immutable proof of your intellectual property.'
                : '填写下面的表单以在 Solana 区块链上安全记录您的创意。您的内容会被转换为安全的哈希值，并与精确的时间戳一起存储，从而为您的知识产权提供了一个不可篡改的存在证明。'
              }
            </p>
            <p className="text-gray-300 mb-4">
              {isEnglish
                ? 'You can input your idea as text or upload a file. Your original content will not be uploaded to the blockchain, only storing an irreversible hash while keeping your idea completely confidential.'
                : '您可以输入文本形式的创意，或上传文件。您的原始内容不会上传至区块链，仅储存不可逆的哈希值，同时保持您的创意完全保密。'
              }
            </p>
          </div>
          
          {/* 创意提交表单 */}
          <IdeaForm />
          
          <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-md p-4 mt-6">
            <h3 className="text-yellow-400 font-medium mb-2">
              {isEnglish ? 'Please Note' : '请注意'}
            </h3>
            <p className="text-yellow-200 text-sm">
              {isEnglish
                ? 'Submitting an idea will incur a small Solana network transaction fee. Please ensure you have sufficient SOL in your wallet. Once recorded on the blockchain, this record cannot be deleted or modified.'
                : '提交创意会产生小额的 Solana 网络交易费用。请确保您的钱包中有足够的 SOL。一旦记录在区块链上，此记录将无法删除或修改。'
              }
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-between items-center">
          <a 
            href="/"
            className="text-emerald-400 hover:text-emerald-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            {isEnglish ? 'Back to Home' : '返回首页'}
          </a>
          
          <a 
            href="/verify"
            className="text-emerald-400 hover:text-emerald-300 flex items-center"
          >
            {isEnglish ? 'Verify Idea' : '验证创意'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
} 