# IdeaProof 前端示例代码 - 第二部分

## 哈希计算与创意组件

### 哈希计算工具 (app/lib/hash.ts)

```typescript
/**
 * 哈希计算工具，支持文本和文件哈希计算
 */

// 计算文本的 SHA-256 哈希值
export async function calculateTextHash(text: string): Promise<string> {
  // 使用 Web Crypto API 计算哈希
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // 将 ArrayBuffer 转换为十六进制字符串
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// 计算文件的 SHA-256 哈希值
export async function calculateFileHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        if (!event.target || !event.target.result) {
          throw new Error('读取文件失败');
        }
        
        // 获取文件内容作为 ArrayBuffer
        const arrayBuffer = event.target.result as ArrayBuffer;
        
        // 计算哈希
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        
        // 转换为十六进制字符串
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
          
        resolve(hashHex);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = error => reject(error);
    
    // 以 ArrayBuffer 形式读取文件
    reader.readAsArrayBuffer(file);
  });
}

// 计算大文件哈希的分块处理函数
export async function calculateLargeFileHash(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    // 分块大小：2MB
    const CHUNK_SIZE = 2 * 1024 * 1024;
    const fileSize = file.size;
    const chunks = Math.ceil(fileSize / CHUNK_SIZE);
    let currentChunk = 0;
    
    // 创建哈希上下文
    const hashContext = {
      hash: '',
      update: async (chunk: ArrayBuffer) => {
        // 简化实现 - 实际应用中应使用增量哈希算法
        const hashBuffer = await crypto.subtle.digest('SHA-256', chunk);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        hashContext.hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      },
    };
    
    const processNextChunk = async () => {
      if (currentChunk >= chunks) {
        // 所有区块处理完成，返回最终哈希
        resolve(hashContext.hash);
        return;
      }
      
      const start = currentChunk * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, fileSize);
      const chunk = file.slice(start, end);
      
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            if (!e.target || !e.target.result) {
              throw new Error('读取文件块失败');
            }
            
            const arrayBuffer = e.target.result as ArrayBuffer;
            await hashContext.update(arrayBuffer);
            
            currentChunk++;
            
            // 报告进度
            if (onProgress) {
              onProgress((currentChunk / chunks) * 100);
            }
            
            // 继续处理下一块
            setTimeout(processNextChunk, 0);
          } catch (error) {
            reject(error);
          }
        };
        
        reader.onerror = error => reject(error);
        reader.readAsArrayBuffer(chunk);
      } catch (error) {
        reject(error);
      }
    };
    
    // 开始处理第一块
    processNextChunk();
  });
}
```

### 哈希计算钩子 (app/hooks/use-hash.ts)

```typescript
'use client';

import { useState, useCallback } from 'react';
import { calculateTextHash, calculateFileHash, calculateLargeFileHash } from '@/lib/hash';

interface UseHashOptions {
  onProgress?: (progress: number) => void;
}

export function useHash(options?: UseHashOptions) {
  const [hash, setHash] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // 计算文本哈希
  const calculateHash = useCallback(async (text: string) => {
    if (!text.trim()) {
      setError('请输入内容');
      return null;
    }

    try {
      setIsCalculating(true);
      setError(null);
      setProgress(0);
      
      const hashValue = await calculateTextHash(text);
      
      setHash(hashValue);
      setProgress(100);
      return hashValue;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '计算哈希失败';
      setError(errorMessage);
      return null;
    } finally {
      setIsCalculating(false);
    }
  }, []);

  // 计算文件哈希
  const calculateFromFile = useCallback(async (file: File) => {
    if (!file) {
      setError('请选择文件');
      return null;
    }

    try {
      setIsCalculating(true);
      setError(null);
      setProgress(0);
      
      // 对于大文件使用分块处理
      const hashValue = file.size > 10 * 1024 * 1024 // 10MB 以上使用分块处理
        ? await calculateLargeFileHash(file, (p) => {
            setProgress(p);
            options?.onProgress?.(p);
          })
        : await calculateFileHash(file);
      
      setHash(hashValue);
      setProgress(100);
      return hashValue;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '计算文件哈希失败';
      setError(errorMessage);
      return null;
    } finally {
      setIsCalculating(false);
    }
  }, [options]);

  // 重置状态
  const reset = useCallback(() => {
    setHash(null);
    setError(null);
    setProgress(0);
  }, []);

  return {
    hash,
    isCalculating,
    error,
    progress,
    calculateHash,
    calculateFromFile,
    reset,
  };
}
```

### 创意表单 (app/components/idea/idea-form.tsx)

```tsx
'use client';

import { useState } from 'react';
import { useHash } from '@/hooks/use-hash';
import { recordIdea } from '@/lib/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { IdeaSubmission } from '@/types/idea';

interface IdeaFormProps {
  onSubmit: (data: { hash: string; txid: string }) => void;
  isSubmitting: boolean;
}

export function IdeaForm({ onSubmit, isSubmitting }: IdeaFormProps) {
  const wallet = useWallet();
  const { hash, isCalculating, error, calculateHash } = useHash();
  
  const [formData, setFormData] = useState<IdeaSubmission>({
    content: '',
    fileType: 'text',
    title: '',
    description: '',
  });
  
  const [isAutoCalculate, setIsAutoCalculate] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // 更新表单数据
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // 如果启用了自动计算，在内容变化时计算哈希
    if (name === 'content' && isAutoCalculate && value.trim()) {
      calculateHash(value);
    }
  };

  // 手动计算哈希
  const handleCalculateClick = () => {
    if (!formData.content.trim()) {
      setFormError('请输入内容后再计算哈希');
      return;
    }
    
    setFormError(null);
    calculateHash(formData.content);
  };

  // 提交创意
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!wallet.publicKey) {
      setFormError('请先连接钱包');
      return;
    }
    
    if (!hash) {
      setFormError('请先计算哈希值');
      return;
    }
    
    try {
      const result = await recordIdea(
        hash,
        formData.fileType,
        formData.title || undefined,
        formData.description || undefined
      );
      
      onSubmit({ hash, txid: result.txid });
    } catch (error) {
      console.error('提交失败', error);
      setFormError('提交失败，请稍后重试');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          标题 (可选)
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 px-4 py-2"
          placeholder="为你的创意添加一个标题"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          创意内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 min-h-[200px] px-4 py-2"
          placeholder="在此输入你的创意内容..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          描述 (可选)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 min-h-[100px] px-4 py-2"
          placeholder="添加额外描述..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="autoCalculate"
          checked={isAutoCalculate}
          onChange={(e) => setIsAutoCalculate(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="autoCalculate" className="text-sm">
          自动计算哈希值
        </label>
      </div>

      {!isAutoCalculate && (
        <div>
          <button
            type="button"
            onClick={handleCalculateClick}
            disabled={isCalculating}
            className="btn btn-secondary"
          >
            {isCalculating ? '计算中...' : '计算哈希值'}
          </button>
        </div>
      )}

      {hash && (
        <div className="bg-gray-100 dark:bg-slate-700 rounded-md p-4">
          <h3 className="text-sm font-medium mb-2">创意哈希值 (SHA-256)</h3>
          <div className="overflow-x-auto">
            <code className="text-sm break-all">{hash}</code>
          </div>
        </div>
      )}

      {(error || formError) && (
        <div className="bg-red-100 text-red-700 rounded-md p-4">
          {error || formError}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || isCalculating || !hash}
          className="btn btn-primary"
        >
          {isSubmitting ? '提交中...' : '提交存证'}
        </button>
      </div>
    </form>
  );
}
```

### 文件上传组件 (app/components/file/file-upload.tsx)

```tsx
'use client';

import { useState, useRef } from 'react';
import { useHash } from '@/hooks/use-hash';
import { FileType, IdeaSubmission } from '@/types/idea';
import { recordIdea } from '@/lib/anchor';
import { useWallet } from '@solana/wallet-adapter-react';

interface FileUploadProps {
  onSubmit: (data: { hash: string; txid: string }) => void;
  isSubmitting: boolean;
  fileType: FileType;
}

export function FileUpload({ onSubmit, isSubmitting, fileType }: FileUploadProps) {
  const wallet = useWallet();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { hash, isCalculating, error, progress, calculateFromFile } = useHash({
    onProgress: (p) => setUploadProgress(p),
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState<IdeaSubmission>({
    content: '',
    fileType,
    title: '',
    description: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 处理拖放相关事件
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  // 处理文件并计算哈希
  const handleFile = async (file: File) => {
    setSelectedFile(file);
    
    // 验证文件类型
    const fileTypeMap: Record<FileType, string[]> = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      video: ['video/mp4', 'video/webm', 'video/quicktime'],
      audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
      text: ['text/plain', 'text/markdown', 'application/pdf', 'application/msword'],
      code: ['text/plain', 'text/html', 'text/javascript', 'application/json'],
      other: [],
    };
    
    const validTypes = fileTypeMap[fileType];
    if (validTypes.length > 0 && !validTypes.includes(file.type)) {
      setFormError(`文件类型不支持。支持的类型: ${validTypes.join(', ')}`);
      return;
    }
    
    // 计算文件哈希
    calculateFromFile(file);
  };

  // 更新表单数据
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 提交创意
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!wallet.publicKey) {
      setFormError('请先连接钱包');
      return;
    }
    
    if (!hash || !selectedFile) {
      setFormError('请先上传文件并计算哈希值');
      return;
    }
    
    try {
      const result = await recordIdea(
        hash,
        formData.fileType,
        formData.title || undefined,
        formData.description || undefined
      );
      
      onSubmit({ hash, txid: result.txid });
    } catch (error) {
      console.error('提交失败', error);
      setFormError('提交失败，请稍后重试');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          标题 (可选)
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 px-4 py-2"
          placeholder="为你的文件添加一个标题"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          文件上传 <span className="text-red-500">*</span>
        </label>
        
        <div
          className={`border-2 border-dashed rounded-md p-8 text-center ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
              : 'border-gray-300 dark:border-gray-700'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div>
              <p className="mb-2 font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
              </p>
              
              {isCalculating && (
                <div className="mt-4">
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded">
                    <div
                      className="h-full bg-emerald-500 rounded"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm">
                    正在计算哈希值... {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}
              
              <button
                type="button"
                className="mt-4 text-sm text-red-600 hover:text-red-800"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                移除文件
              </button>
            </div>
          ) : (
            <div>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mt-2">拖放文件到此处，或</p>
              <button
                type="button"
                className="mt-2 text-sm text-emerald-600 hover:text-emerald-800"
                onClick={() => fileInputRef.current?.click()}
              >
                选择文件
              </button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          描述 (可选)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 min-h-[100px] px-4 py-2"
          placeholder="添加额外描述..."
        />
      </div>

      {hash && (
        <div className="bg-gray-100 dark:bg-slate-700 rounded-md p-4">
          <h3 className="text-sm font-medium mb-2">文件哈希值 (SHA-256)</h3>
          <div className="overflow-x-auto">
            <code className="text-sm break-all">{hash}</code>
          </div>
        </div>
      )}

      {(error || formError) && (
        <div className="bg-red-100 text-red-700 rounded-md p-4">
          {error || formError}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || isCalculating || !hash}
          className="btn btn-primary"
        >
          {isSubmitting ? '提交中...' : '提交存证'}
        </button>
      </div>
    </form>
  );
}
```

### 创意卡片组件 (app/components/idea/idea-card.tsx)

```tsx
import { IdeaRecord } from '@/types/idea';
import { formatTimestamp, truncateAddress } from '@/lib/utils';

interface IdeaCardProps {
  record: IdeaRecord;
}

export function IdeaCard({ record }: IdeaCardProps) {
  const fileTypeIcons = {
    text: '📄',
    image: '🖼️',
    video: '🎬',
    audio: '🎵',
    code: '👨‍💻',
    other: '📎',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">
            {record.title || '未命名创意'}
          </h3>
          <span className="text-2xl" title={`文件类型: ${record.fileType}`}>
            {fileTypeIcons[record.fileType]}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              哈希值
            </h4>
            <div className="bg-gray-100 dark:bg-slate-700 rounded p-2 overflow-x-auto">
              <code className="text-sm">{record.ideaHash}</code>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                提交者
              </h4>
              <div className="flex items-center">
                <span className="font-mono">
                  {truncateAddress(record.submitter)}
                </span>
                <button
                  className="ml-2 text-emerald-600 hover:text-emerald-800"
                  onClick={() =>
                    navigator.clipboard.writeText(record.submitter)
                  }
                  title="复制地址"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                时间戳
              </h4>
              <p>{formatTimestamp(record.timestamp)}</p>
            </div>
          </div>

          {record.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                描述
              </h4>
              <p className="text-sm">{record.description}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <a
              href={`https://explorer.solana.com/address/${record.submitter}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 rounded-full"
            >
              在浏览器中查看
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(record.ideaHash)}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full"
            >
              复制哈希
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 