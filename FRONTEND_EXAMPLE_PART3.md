# IdeaProof 前端示例代码 - 第三部分

## Anchor 程序交互

### Anchor 连接工具 (app/lib/anchor.ts)

```typescript
import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { FileType } from '@/types/idea';
import { PROGRAM_ID } from '@/lib/constants';

// Anchor IDL 类型定义 (由 Anchor 生成)
import { Ideaproof } from '@/types/ideaproof';
import idl from '@/public/ideaproof.json';

// 创建程序连接
export function createProgramConnection(wallet: AnchorWallet | undefined) {
  // 获取网络连接
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  const endpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT || clusterApiUrl(network);
  const connection = new Connection(endpoint, 'confirmed');

  // 如果钱包未连接，返回null
  if (!wallet) {
    return null;
  }

  // 创建Provider
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    { commitment: 'confirmed' }
  );

  // 创建程序实例
  const programId = new PublicKey(PROGRAM_ID);
  const program = new anchor.Program(
    idl as anchor.Idl,
    programId,
    provider
  ) as anchor.Program<Ideaproof>;

  return { program, provider, connection };
}

// 记录创意
export async function recordIdea(
  ideaHash: string,
  fileType: FileType,
  title?: string,
  description?: string
): Promise<{ txid: string; timestamp: number }> {
  // 获取钱包
  // 注意：在实际应用中，应通过 React Context 获取钱包
  const wallet = window.solana as AnchorWallet;
  
  if (!wallet || !wallet.publicKey) {
    throw new Error('钱包未连接');
  }

  // 创建程序连接
  const connection = createProgramConnection(wallet);
  if (!connection) {
    throw new Error('无法连接到程序');
  }

  const { program } = connection;

  try {
    // 将前端 FileType 转换为合约 FileType 枚举
    const fileTypeEnum = convertToFileTypeEnum(fileType);

    // 计算 PDA
    const [ideaRecordPda] = await PublicKey.findProgramAddress(
      [
        Buffer.from('idea_record'),
        Buffer.from(ideaHash),
        wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    // 发送交易
    const tx = await program.methods
      .recordIdea(
        ideaHash,
        fileTypeEnum,
        title || null,
        description || null
      )
      .accounts({
        submitter: wallet.publicKey,
        ideaRecord: ideaRecordPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // 获取时间戳 (实际应用中应从区块链获取)
    const timestamp = Math.floor(Date.now() / 1000);

    return {
      txid: tx,
      timestamp,
    };
  } catch (error) {
    console.error('记录创意失败:', error);
    throw error;
  }
}

// 通过哈希获取创意记录
export async function getIdeaByHash(
  ideaHash: string
): Promise<any | null> {
  // 这里简化实现，实际应查询区块链
  // 获取钱包和连接
  const wallet = window.solana as AnchorWallet;
  
  if (!wallet || !wallet.publicKey) {
    throw new Error('钱包未连接');
  }

  // 创建程序连接
  const connection = createProgramConnection(wallet);
  if (!connection) {
    throw new Error('无法连接到程序');
  }

  const { program } = connection;

  try {
    // 模拟获取所有记录并筛选
    // 在实际实现中，应使用正确的 API 进行查询
    const accounts = await program.account.ideaRecord.all();
    
    // 查找匹配哈希的记录
    const record = accounts.find(acc => acc.account.ideaHash === ideaHash);
    
    if (!record) {
      return null;
    }
    
    // 转换为前端格式
    return {
      ideaHash: record.account.ideaHash,
      submitter: record.account.submitter.toString(),
      timestamp: record.account.timestamp.toNumber(),
      fileType: convertFromFileTypeEnum(record.account.fileType),
      title: record.account.title || undefined,
      description: record.account.description || undefined,
    };
  } catch (error) {
    console.error('获取创意记录失败:', error);
    throw error;
  }
}

// 获取用户的创意记录
export async function getIdeasByUser(
  userAddress: string
): Promise<any[]> {
  // 获取钱包和连接
  const wallet = window.solana as AnchorWallet;
  
  if (!wallet || !wallet.publicKey) {
    throw new Error('钱包未连接');
  }

  // 创建程序连接
  const connection = createProgramConnection(wallet);
  if (!connection) {
    throw new Error('无法连接到程序');
  }

  const { program } = connection;

  try {
    // 获取所有记录
    const accounts = await program.account.ideaRecord.all();
    
    // 过滤用户的记录
    const userPubkey = new PublicKey(userAddress);
    const userRecords = accounts.filter(
      acc => acc.account.submitter.equals(userPubkey)
    );
    
    // 转换为前端格式
    return userRecords.map(record => ({
      ideaHash: record.account.ideaHash,
      submitter: record.account.submitter.toString(),
      timestamp: record.account.timestamp.toNumber(),
      fileType: convertFromFileTypeEnum(record.account.fileType),
      title: record.account.title || undefined,
      description: record.account.description || undefined,
    }));
  } catch (error) {
    console.error('获取用户创意记录失败:', error);
    throw error;
  }
}

// 将前端 FileType 转换为合约枚举
function convertToFileTypeEnum(fileType: FileType): any {
  const typeMap: Record<FileType, any> = {
    text: { text: {} },
    image: { image: {} },
    video: { video: {} },
    audio: { audio: {} },
    code: { code: {} },
    other: { other: {} },
  };
  
  return typeMap[fileType];
}

// 将合约枚举转换为前端 FileType
function convertFromFileTypeEnum(fileTypeEnum: any): FileType {
  if ('text' in fileTypeEnum) return 'text';
  if ('image' in fileTypeEnum) return 'image';
  if ('video' in fileTypeEnum) return 'video';
  if ('audio' in fileTypeEnum) return 'audio';
  if ('code' in fileTypeEnum) return 'code';
  return 'other';
}
```

### 创意相关钩子 (app/hooks/use-idea.ts)

```typescript
'use client';

import { useState, useCallback } from 'react';
import { getIdeaByHash, getIdeasByUser, recordIdea } from '@/lib/anchor';
import { IdeaRecord, FileType } from '@/types/idea';
import { toast } from 'react-hot-toast';

export function useIdea() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 提交创意
  const submitIdea = useCallback(async (
    ideaHash: string,
    fileType: FileType,
    title?: string,
    description?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await recordIdea(
        ideaHash,
        fileType,
        title,
        description
      );
      
      toast.success('创意已成功记录在区块链上');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '提交创意失败';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 通过哈希查询创意
  const getIdeaByHashWithFormat = useCallback(async (hash: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getIdeaByHash(hash);
      return result as IdeaRecord | null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '查询创意失败';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 查询用户的创意
  const getIdeasByUserWithFormat = useCallback(async (userAddress: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const results = await getIdeasByUser(userAddress);
      return results as IdeaRecord[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '查询用户创意失败';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    submitIdea,
    getIdeaByHash: getIdeaByHashWithFormat,
    getIdeasByUser: getIdeasByUserWithFormat,
  };
}
```

## 工具函数与类型定义

### 工具函数 (app/lib/utils.ts)

```typescript
/**
 * 通用工具函数
 */

// 截断地址显示
export function truncateAddress(address: string, front: number = 4, back: number = 4): string {
  if (!address) return '';
  if (address.length <= front + back) return address;
  return `${address.slice(0, front)}...${address.slice(-back)}`;
}

// 格式化时间戳为可读日期
export function formatTimestamp(timestamp: number): string {
  if (!timestamp) return 'Unknown Time';
  
  const date = new Date(timestamp * 1000);
  
  // 格式化为 YYYY-MM-DD HH:MM:SS
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

// 格式化文件大小
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 将十六进制颜色转换为 RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // 去除 # 字符
  hex = hex.replace(/^#/, '');
  
  // 解析 RGB 值
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return { r, g, b };
}

// 检查字符串是否为有效的 Solana 地址
export function isValidSolanaAddress(address: string): boolean {
  try {
    if (!address) return false;
    // Solana 地址是 base58 编码的 32 字节公钥
    // 长度通常为 32-44 个字符
    if (address.length < 32 || address.length > 44) return false;
    
    // 只允许 base58 字符: [1-9A-HJ-NP-Za-km-z]
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
    return base58Regex.test(address);
  } catch (error) {
    return false;
  }
}

// 检查字符串是否为有效的 SHA-256 哈希值
export function isValidSha256Hash(hash: string): boolean {
  // SHA-256 哈希值是 64 个十六进制字符
  const sha256Regex = /^[0-9a-f]{64}$/i;
  return sha256Regex.test(hash);
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

### 类型定义 (app/types/idea.ts)

```typescript
/**
 * 创意相关类型定义
 */

export type FileType = 'text' | 'image' | 'video' | 'audio' | 'code' | 'other';

// 创意记录接口
export interface IdeaRecord {
  ideaHash: string;       // 创意哈希值
  submitter: string;      // 提交者钱包地址
  timestamp: number;      // 提交时间戳
  fileType: FileType;     // 文件类型
  title?: string;         // 可选标题
  description?: string;   // 可选描述
}

// 创意提交数据接口
export interface IdeaSubmission {
  content: string;        // 创意内容
  fileType: FileType;     // 文件类型
  title?: string;         // 可选标题
  description?: string;   // 可选描述
  file?: File;            // 可选文件
}

// 创意查询结果接口
export interface IdeaQueryResult {
  found: boolean;         // 是否找到
  record?: IdeaRecord;    // 找到的记录
  error?: string;         // 错误信息
}

// 创意提交结果接口
export interface IdeaSubmitResult {
  success: boolean;       // 是否成功
  txid?: string;          // 交易ID
  timestamp?: number;     // 时间戳
  error?: string;         // 错误信息
}
```

### 常量定义 (app/lib/constants.ts)

```typescript
/**
 * 项目常量定义
 */

// Solana 程序 ID
export const PROGRAM_ID = "ideaproofXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

// 支持的文件类型
export const SUPPORTED_FILE_TYPES = {
  text: ['text/plain', 'text/markdown', 'application/pdf', 'application/msword'],
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  code: ['text/plain', 'text/html', 'text/javascript', 'application/json'],
};

// 文件类型名称映射
export const FILE_TYPE_NAMES = {
  text: '文本',
  image: '图片',
  video: '视频',
  audio: '音频',
  code: '代码',
  other: '其他',
};

// 最大文件大小（字节）
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

// API 路径
export const API_PATHS = {
  recordIdea: '/api/ideas/record',
  getIdeaByHash: '/api/ideas/hash',
  getIdeasByUser: '/api/ideas/user',
};

// 网站路由
export const ROUTES = {
  home: '/',
  submit: '/submit',
  verify: '/verify',
  profile: '/profile',
  about: '/about',
};

// 主题颜色
export const THEME_COLORS = {
  primary: '#10b981', // Emerald 500
  secondary: '#0f172a', // Slate 900
  accent: '#8b5cf6', // Violet 500
  success: '#22c55e', // Green 500
  warning: '#f59e0b', // Amber 500
  error: '#ef4444', // Red 500
  info: '#3b82f6', // Blue 500
};