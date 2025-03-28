'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function VerifyForm() {
  const { publicKey } = useWallet();
  const [language, setLanguage] = useState('en');
  const [verifyMethod, setVerifyMethod] = useState('content'); // 'content' or 'file'
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<null | {
    exists: boolean;
    timestamp?: string;
    owner?: string;
  }>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') || 'en';
      setLanguage(savedLanguage);
    }
  }, []);

  const isEnglish = language === 'en';

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setVerificationResult(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setVerificationResult(null);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Implement verification logic
      // This is a placeholder for demonstration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setVerificationResult({
        exists: true,
        timestamp: new Date().toISOString(),
        owner: publicKey?.toBase58(),
      });
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationResult({
        exists: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      <div>
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              verifyMethod === 'content'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
            onClick={() => setVerifyMethod('content')}
          >
            {isEnglish ? 'Input Content' : '输入内容'}
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              verifyMethod === 'file'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
            onClick={() => setVerifyMethod('file')}
          >
            {isEnglish ? 'Upload File' : '上传文件'}
          </button>
        </div>

        {verifyMethod === 'content' ? (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {isEnglish ? 'Content to Verify' : '要验证的内容'}
            </label>
            <textarea
              className="w-full h-32 px-3 py-2 text-gray-300 bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={content}
              onChange={handleContentChange}
              placeholder={isEnglish ? 'Enter your content here...' : '在此输入您的内容...'}
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {isEnglish ? 'File to Verify' : '要验证的文件'}
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-slate-700 file:text-gray-300
                hover:file:bg-slate-600"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || (!content && !file)}
        className={`w-full py-3 px-4 rounded-md text-white font-medium
          ${
            isLoading || (!content && !file)
              ? 'bg-slate-600 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500'
          }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {isEnglish ? 'Verifying...' : '验证中...'}
          </span>
        ) : (
          isEnglish ? 'Verify' : '验证'
        )}
      </button>

      {verificationResult !== null && (
        <div className={`mt-6 p-4 rounded-md ${
          verificationResult.exists
            ? 'bg-emerald-900 bg-opacity-30 border border-emerald-700'
            : 'bg-red-900 bg-opacity-30 border border-red-700'
        }`}>
          <h3 className={`font-medium mb-2 ${
            verificationResult.exists ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {verificationResult.exists
              ? (isEnglish ? 'Verification Successful!' : '验证成功！')
              : (isEnglish ? 'No Match Found' : '未找到匹配')}
          </h3>
          {verificationResult.exists && (
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">
                <span className="font-medium">
                  {isEnglish ? 'Timestamp: ' : '时间戳：'}
                </span>
                {new Date(verificationResult.timestamp!).toLocaleString()}
              </p>
              <p className="text-gray-300">
                <span className="font-medium">
                  {isEnglish ? 'Owner: ' : '所有者：'}
                </span>
                {verificationResult.owner}
              </p>
            </div>
          )}
          <p className="text-sm mt-2 text-gray-300">
            {verificationResult.exists
              ? (isEnglish
                  ? 'The content has been verified on the blockchain with the above details.'
                  : '该内容已在区块链上得到验证，详细信息如上。')
              : (isEnglish
                  ? 'The provided content does not match any records on the blockchain.'
                  : '提供的内容与区块链上的任何记录都不匹配。')}
          </p>
        </div>
      )}
    </form>
  );
} 