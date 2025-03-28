'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { calculateFileHash } from '@/utils/hash';
import { verifyIdeaHash } from '@/utils/contract';

export default function VerifyForm() {
  const { publicKey, connected } = useWallet();
  const [language, setLanguage] = useState('en');
  const [verifyMethod, setVerifyMethod] = useState('hash'); // 'hash' or 'file'
  const [hash, setHash] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<null | {
    success: boolean;
    found: boolean;
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

  const handleHashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHash(e.target.value);
    setVerifyResult(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setVerifyResult(null);
      // 自动计算文件哈希
      try {
        setIsLoading(true);
        const fileHash = await calculateFileHash(selectedFile);
        setHash(fileHash);
      } catch (error) {
        console.error('计算文件哈希失败:', error);
        setVerifyResult({
          success: false,
          found: false,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hash) return;
    
    setIsLoading(true);
    
    try {
      const result = await verifyIdeaHash(hash);
      setVerifyResult({
        success: true,
        found: result.found,
        timestamp: result.timestamp ? new Date(result.timestamp * 1000).toISOString() : undefined,
        owner: result.owner,
      });
    } catch (error: any) {
      console.error('验证失败:', error);
      setVerifyResult({
        success: false,
        found: false,
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
              verifyMethod === 'hash'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
            onClick={() => setVerifyMethod('hash')}
          >
            {isEnglish ? 'Input Hash' : '输入哈希'}
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

        {verifyMethod === 'hash' ? (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {isEnglish ? 'Hash Value' : '哈希值'}
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 text-gray-300 bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={hash}
              onChange={handleHashChange}
              placeholder={isEnglish ? 'Enter hash value...' : '请输入哈希值...'}
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {isEnglish ? 'Upload File' : '上传文件'}
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
            {file && (
              <p className="mt-2 text-sm text-emerald-400">
                {isEnglish ? 'Selected file: ' : '已选择文件：'}{file.name}
              </p>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !hash}
        className={`w-full py-3 px-4 rounded-md text-white font-medium
          ${
            isLoading || !hash
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
          isEnglish ? 'Verify Idea' : '验证创意'
        )}
      </button>

      {verifyResult !== null && (
        <div className={`mt-6 p-4 rounded-md ${
          verifyResult.success
            ? (verifyResult.found
              ? 'bg-emerald-900 bg-opacity-30 border border-emerald-700'
              : 'bg-yellow-900 bg-opacity-30 border border-yellow-700')
            : 'bg-red-900 bg-opacity-30 border border-red-700'
        }`}>
          <h3 className={`font-medium mb-2 ${
            verifyResult.success
              ? (verifyResult.found ? 'text-emerald-400' : 'text-yellow-400')
              : 'text-red-400'
          }`}>
            {verifyResult.success
              ? (verifyResult.found
                ? (isEnglish ? 'Idea Found!' : '找到创意！')
                : (isEnglish ? 'Idea Not Found' : '未找到创意'))
              : (isEnglish ? 'Verification Failed' : '验证失败')}
          </h3>
          {verifyResult.success && verifyResult.found && (
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">
                <span className="font-medium">
                  {isEnglish ? 'Timestamp: ' : '时间戳：'}
                </span>
                {new Date(verifyResult.timestamp!).toLocaleString()}
              </p>
              <p className="text-gray-300">
                <span className="font-medium">
                  {isEnglish ? 'Owner: ' : '所有者：'}
                </span>
                <span className="font-mono">{verifyResult.owner}</span>
              </p>
            </div>
          )}
          <p className="text-sm mt-2 text-gray-300">
            {verifyResult.success
              ? (verifyResult.found
                ? (isEnglish
                    ? 'This idea has been recorded on the blockchain.'
                    : '该创意已记录在区块链上。')
                : (isEnglish
                    ? 'This idea has not been recorded yet.'
                    : '该创意尚未被记录。'))
              : (isEnglish
                  ? 'There was an error during verification. Please try again.'
                  : '验证过程中发生错误，请重试。')}
          </p>
        </div>
      )}
    </form>
  );
} 