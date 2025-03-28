'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { calculateTextHash, calculateFileHash } from '@/utils/hash';
import { recordIdeaHash } from '@/utils/contract';
import { mintNFT } from '@/utils/nft';

export default function IdeaForm() {
  const { publicKey, connected } = useWallet();
  const [language, setLanguage] = useState('en');
  const [submitMethod, setSubmitMethod] = useState('text'); // 'text' or 'file'
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [createNFT, setCreateNFT] = useState(false);
  const [category, setCategory] = useState('技术创新');
  const [license, setLicense] = useState('MIT');
  const [result, setResult] = useState<{
    success: boolean;
    hash?: string;
    signature?: string;
    timestamp?: string;
    nft?: {
      mintAddress: string;
      metadataUri: string;
    };
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') || 'en';
      setLanguage(savedLanguage);
    }
  }, []);

  const isEnglish = language === 'en';

  const categories = {
    en: ['Technology', 'Art', 'Business', 'Science', 'Literature', 'Other'],
    zh: ['技术创新', '艺术设计', '商业模式', '科学研究', '文学创作', '其他']
  };

  const licenses = {
    en: ['MIT', 'Creative Commons', 'All Rights Reserved', 'Public Domain'],
    zh: ['MIT', '知识共享', '版权所有', '公共领域']
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setResult(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !publicKey) {
      alert(isEnglish ? 'Please connect your wallet first' : '请先连接钱包');
      return;
    }

    if ((submitMethod === 'text' && !content) || (submitMethod === 'file' && !file)) {
      alert(isEnglish ? 'Please enter content or select a file' : '请输入内容或选择文件');
      return;
    }

    if (createNFT && !category) {
      alert(isEnglish ? 'Please select a category' : '请选择创意类别');
      return;
    }

    if (createNFT && !license) {
      alert(isEnglish ? 'Please select a license' : '请选择版权声明');
      return;
    }

    setIsLoading(true);
    setResult(null);
    
    try {
      // 计算哈希值
      let hash;
      if (submitMethod === 'text') {
        hash = await calculateTextHash(content);
      } else {
        if (!file) return;
        hash = await calculateFileHash(file);
      }

      // 记录哈希值到区块链
      const recordResult = await recordIdeaHash(hash);
      const timestamp = new Date().toISOString();

      if (recordResult.success) {
        let nftResult = null;

        // 如果用户选择创建 NFT，铸造 NFT
        if (createNFT) {
          const nftMintResult = await mintNFT({
            wallet: { publicKey },
            name: `IdeaProof #${Date.now()}`,
            description: submitMethod === 'text' ? content : file?.name || '',
            ideaHash: hash,
            timestamp,
            category,
            license,
            image: submitMethod === 'file' ? file : null,
          });

          if (nftMintResult.success) {
            nftResult = {
              mintAddress: nftMintResult.mintAddress,
              metadataUri: nftMintResult.metadataUri,
            };
          } else {
            console.error('NFT 铸造失败:', nftMintResult.error);
          }
        }

        setResult({
          success: true,
          hash,
          signature: recordResult.signature,
          timestamp,
          ...(nftResult ? { nft: nftResult } : {})
        });
      } else {
        setResult({
          success: false,
          hash,
          error: recordResult.error || 'Unknown error'
        });
      }
    } catch (error: any) {
      console.error('提交创意失败:', error);
      setResult({
        success: false,
        error: error.message || 'Unknown error'
      });
    } finally {
      setIsLoading(false);
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

    // TODO: 实现上架功能
    alert(isEnglish 
      ? `NFT will be listed for sale at ${price} SOL (Coming soon)`
      : `NFT 将以 ${price} SOL 上架出售（即将推出）`
    );
  };

  return (
    <div className="space-y-6">
      {!connected && (
        <div className="mb-6 p-4 bg-yellow-800 bg-opacity-30 border border-yellow-700 rounded-md">
          <h3 className="font-medium text-yellow-400 mb-2">
            {isEnglish ? 'Wallet Not Connected' : '钱包未连接'}
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            {isEnglish 
              ? 'You need to connect your wallet to submit an idea to blockchain.' 
              : '您需要连接钱包才能将创意提交到区块链。'}
          </p>
          {typeof window !== 'undefined' && (
            <WalletMultiButton className="bg-yellow-700 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors" />
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${
                submitMethod === 'text'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
              onClick={() => setSubmitMethod('text')}
            >
              {isEnglish ? 'Text Input' : '文本输入'}
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${
                submitMethod === 'file'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
              onClick={() => setSubmitMethod('file')}
            >
              {isEnglish ? 'File Upload' : '文件上传'}
            </button>
          </div>

          {submitMethod === 'text' ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {isEnglish ? 'Idea Content' : '创意内容'}
              </label>
              <textarea
                className="w-full px-3 py-2 text-gray-300 bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[200px]"
                value={content}
                onChange={handleContentChange}
                placeholder={isEnglish ? 'Enter your idea here...' : '在此输入您的创意...'}
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

        {/* NFT 选项 */}
        <div className="bg-slate-800 p-4 rounded-md">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="createNFT"
              checked={createNFT}
              onChange={(e) => setCreateNFT(e.target.checked)}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-500 rounded mr-2"
            />
            <label htmlFor="createNFT" className="text-sm font-medium text-gray-300">
              {isEnglish ? 'Create NFT for this idea' : '为此创意创建 NFT'}
            </label>
          </div>

          {createNFT && (
            <div className="space-y-4 mt-4 p-4 bg-slate-700 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {isEnglish ? 'Category' : '创意类别'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-gray-300 bg-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {categories[isEnglish ? 'en' : 'zh'].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {isEnglish ? 'License' : '版权声明'}
                </label>
                <select
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  className="w-full px-3 py-2 text-gray-300 bg-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {licenses[isEnglish ? 'en' : 'zh'].map((lic) => (
                    <option key={lic} value={lic}>{lic}</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-800 rounded text-xs text-gray-400">
                <p>
                  {isEnglish
                    ? 'Creating an NFT will incur additional network fees. The NFT will be saved to your wallet.'
                    : '创建 NFT 将产生额外的网络费用。NFT 将保存到您的钱包中。'}
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !connected || (submitMethod === 'text' && !content) || (submitMethod === 'file' && !file)}
          className={`w-full py-3 px-4 rounded-md text-white font-medium
            ${
              isLoading || !connected || (submitMethod === 'text' && !content) || (submitMethod === 'file' && !file)
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
              {isEnglish ? 'Submitting...' : '提交中...'}
            </span>
          ) : (
            isEnglish ? 'Submit Idea' : '提交创意'
          )}
        </button>
      </form>

      {result && (
        <div className={`mt-6 p-4 rounded-md ${
          result.success
            ? 'bg-emerald-900 bg-opacity-30 border border-emerald-700'
            : 'bg-red-900 bg-opacity-30 border border-red-700'
        }`}>
          <h3 className={`font-medium mb-2 ${
            result.success ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {result.success 
              ? (isEnglish ? 'Idea Recorded Successfully!' : '创意记录成功！')
              : (isEnglish ? 'Submission Failed' : '提交失败')}
          </h3>
          
          {result.success && result.hash && (
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">
                <span className="font-medium">
                  {isEnglish ? 'Hash: ' : '哈希值：'}
                </span>
                <span className="font-mono break-all">{result.hash}</span>
              </p>
              {result.signature && (
                <p className="text-gray-300">
                  <span className="font-medium">
                    {isEnglish ? 'Transaction: ' : '交易：'}
                  </span>
                  <span className="font-mono break-all">{result.signature}</span>
                </p>
              )}
              {result.timestamp && (
                <p className="text-gray-300">
                  <span className="font-medium">
                    {isEnglish ? 'Timestamp: ' : '时间戳：'}
                  </span>
                  {new Date(result.timestamp).toLocaleString()}
                </p>
              )}

              {/* NFT 信息 */}
              {result.nft && (
                <div className="mt-4 p-3 bg-slate-700 rounded-md">
                  <h4 className="font-medium text-emerald-400 mb-2">
                    {isEnglish ? 'NFT Created!' : 'NFT 创建成功！'}
                  </h4>
                  <p className="text-gray-300">
                    <span className="font-medium">
                      {isEnglish ? 'Mint Address: ' : '铸造地址：'}
                    </span>
                    <span className="font-mono break-all">{result.nft.mintAddress}</span>
                  </p>
                  
                  <div className="mt-3 flex space-x-3">
                    <a 
                      href={`https://solscan.io/token/${result.nft.mintAddress}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded-md text-xs text-white inline-flex items-center"
                    >
                      {isEnglish ? 'View on Solscan' : '在 Solscan 查看'}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    
                    <button 
                      onClick={() => handleListForSale(result.nft!.mintAddress)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-md text-xs text-white"
                    >
                      {isEnglish ? 'List for Sale' : '上架出售'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!result.success && (
            <p className="text-sm text-gray-300">
              <span className="font-medium">
                {isEnglish ? 'Error: ' : '错误：'}
              </span>
              {result.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
} 