'use client';

import React, { useState, useEffect } from 'react';
import VerifyForm from '../components/idea/VerifyForm';
import Header from '../components/layout/header';

export default function VerifyPage() {
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
          {isEnglish ? 'Verify Idea' : '验证创意'}
        </h1>
        
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-emerald-300">
              {isEnglish ? 'About Idea Verification' : '关于创意验证'}
            </h2>
            <p className="text-gray-300 mb-4">
              {isEnglish 
                ? 'Use this tool to verify the existence and timestamp of any idea recorded on the Solana blockchain. Simply input the content or upload the file, and we will check if it matches any recorded proofs.'
                : '使用此工具验证任何在 Solana 区块链上记录的创意的存在性和时间戳。只需输入内容或上传文件，我们将检查它是否与任何已记录的证明匹配。'
              }
            </p>
            <p className="text-gray-300 mb-4">
              {isEnglish
                ? 'The verification process is completely free and does not require any blockchain transaction. Your content will be locally hashed and compared with on-chain records.'
                : '验证过程完全免费，不需要任何区块链交易。您的内容将在本地进行哈希处理，并与链上记录进行比对。'
              }
            </p>
          </div>
          
          <VerifyForm />
          
          <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-md p-4 mt-6">
            <h3 className="text-yellow-400 font-medium mb-2">
              {isEnglish ? 'Please Note' : '请注意'}
            </h3>
            <p className="text-yellow-200 text-sm">
              {isEnglish
                ? 'The verification process only confirms if the exact content was previously recorded. Any modification to the original content, even a single character, will result in a different hash and thus no match will be found.'
                : '验证过程仅确认完全相同的内容是否曾被记录。对原始内容的任何修改，哪怕是一个字符，都会导致不同的哈希值，因此将无法找到匹配。'
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
            href="/submit"
            className="text-emerald-400 hover:text-emerald-300 flex items-center"
          >
            {isEnglish ? 'Submit Idea' : '提交创意'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
} 