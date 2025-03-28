'use client';

import React from 'react';
import { IdeaDisplay } from '@/types/idea';

interface IdeaResultCardProps {
  idea: IdeaDisplay;
}

// 格式化显示公钥，显示开头4位和结尾4位
const formatPublicKey = (publicKey: string): string => {
  if (!publicKey || publicKey.length < 10) return publicKey;
  return `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
};

const IdeaResultCard: React.FC<IdeaResultCardProps> = ({ idea }) => {
  const fileTypeLabels: Record<string, string> = {
    text: '文本',
    image: '图片',
    video: '视频',
    audio: '音频',
    code: '代码',
    other: '其他',
  };

  // 确定文件类型
  let fileType = 'other';
  for (const key of Object.keys(idea.fileType)) {
    if (key !== 'other' && idea.fileType[key as keyof typeof idea.fileType]) {
      fileType = key;
      break;
    }
  }

  // 格式化日期
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000); // 转换为毫秒
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden mb-4">
      <div className="p-4 bg-slate-700">
        <h3 className="text-lg font-semibold text-emerald-300">{idea.title || '未命名创意'}</h3>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start">
          <span className="text-gray-400 w-24 flex-shrink-0">哈希值:</span>
          <span className="text-gray-200 break-all">{idea.ideaHash}</span>
        </div>
        
        <div className="flex items-start">
          <span className="text-gray-400 w-24 flex-shrink-0">提交者:</span>
          <span className="text-gray-200">{formatPublicKey(idea.submitter.toString())}</span>
        </div>
        
        <div className="flex items-start">
          <span className="text-gray-400 w-24 flex-shrink-0">时间戳:</span>
          <span className="text-gray-200">{formatDate(idea.timestamp)}</span>
        </div>
        
        <div className="flex items-start">
          <span className="text-gray-400 w-24 flex-shrink-0">创意类型:</span>
          <span className="text-gray-200">{fileTypeLabels[fileType] || '其他'}</span>
        </div>
        
        {idea.description && (
          <div className="flex items-start">
            <span className="text-gray-400 w-24 flex-shrink-0">描述:</span>
            <span className="text-gray-200">{idea.description}</span>
          </div>
        )}
        
        {idea.txid && (
          <div className="flex items-start">
            <span className="text-gray-400 w-24 flex-shrink-0">交易ID:</span>
            <span className="text-gray-200 break-all">{idea.txid}</span>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-emerald-900 bg-opacity-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span className="text-emerald-400 font-medium">已验证</span>
          </div>
          
          <a 
            href={`https://explorer.solana.com/tx/${idea.txid}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 text-sm"
          >
            在区块浏览器中查看
          </a>
        </div>
      </div>
    </div>
  );
};

export default IdeaResultCard; 