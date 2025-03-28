# IdeaProof 前端示例代码 - 第一部分

以下是 IdeaProof 项目前端的核心示例代码，使用 Next.js 框架和 TypeScript 编写。

## 页面组件

### 主页 (app/page.tsx)

```tsx
import Link from 'next/link';
import { WalletButton } from '@/components/wallet/wallet-button';
import { Hero } from '@/components/layout/hero';
import { FeatureCard } from '@/components/ui/feature-card';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero 
        title="IdeaProof" 
        subtitle="在区块链上保护你的创意" 
        description="使用 Solana 区块链技术，为你的创意提供不可篡改的时间戳证明，防止抄袭争议。"
      />
      
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">核心功能</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="创意存证" 
              description="上传你的创意，生成哈希值，永久记录在 Solana 区块链上"
              icon="document"
              link="/submit"
            />
            <FeatureCard 
              title="文件存证" 
              description="支持图片、视频、音频等多媒体文件的哈希存证"
              icon="file"
              link="/submit"
            />
            <FeatureCard 
              title="验证查询" 
              description="通过哈希值或钱包地址查询验证创意的归属与时间戳"
              icon="search"
              link="/verify"
            />
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">立即开始</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            连接你的 Solana 钱包，开始记录和保护你的创意产权
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
            <WalletButton />
            <Link href="/submit" className="btn btn-primary">
              提交创意
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
```

### 创意提交页面 (app/(routes)/submit/page.tsx)

```tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { IdeaForm } from '@/components/idea/idea-form';
import { FileUpload } from '@/components/file/file-upload';
import { WalletButton } from '@/components/wallet/wallet-button';
import { Alert } from '@/components/ui/alert';
import { FileType } from '@/types/idea';

export default function SubmitPage() {
  const { connected } = useWallet();
  const [fileType, setFileType] = useState<FileType>('text');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    txid?: string;
  } | null>(null);

  const handleFileTypeChange = (type: FileType) => {
    setFileType(type);
  };

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-8">提交创意</h1>
        <p className="text-xl mb-8">请先连接你的钱包以继续</p>
        <WalletButton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">提交创意存证</h1>

      {result && (
        <Alert
          type={result.success ? 'success' : 'error'}
          title={result.success ? '提交成功' : '提交失败'}
          message={result.message}
          action={
            result.txid
              ? {
                  label: '查看交易',
                  url: `https://explorer.solana.com/tx/${result.txid}?cluster=devnet`,
                }
              : undefined
          }
          className="mb-8"
        />
      )}

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md ${
              fileType === 'text'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onClick={() => handleFileTypeChange('text')}
          >
            文本创意
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              fileType === 'image' || fileType === 'video' || fileType === 'audio'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onClick={() => handleFileTypeChange('image')}
          >
            文件存证
          </button>
        </div>

        {fileType === 'text' ? (
          <IdeaForm
            onSubmit={(data) => {
              setIsSubmitting(true);
              // 提交逻辑
              setTimeout(() => {
                setResult({
                  success: true,
                  message: '创意已成功记录在区块链上',
                  txid: '3xampleTXIDsolana123456789abcdef',
                });
                setIsSubmitting(false);
              }, 2000);
            }}
            isSubmitting={isSubmitting}
          />
        ) : (
          <FileUpload
            onSubmit={(data) => {
              setIsSubmitting(true);
              // 文件提交逻辑
              setTimeout(() => {
                setResult({
                  success: true,
                  message: '文件哈希已成功记录在区块链上',
                  txid: '3xampleTXIDsolana123456789abcdef',
                });
                setIsSubmitting(false);
              }, 2000);
            }}
            fileType={fileType}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
```

### 验证页面 (app/(routes)/verify/page.tsx)

```tsx
'use client';

import { useState } from 'react';
import { IdeaRecord } from '@/types/idea';
import { SearchBar } from '@/components/ui/search-bar';
import { IdeaCard } from '@/components/idea/idea-card';
import { Spinner } from '@/components/ui/spinner';
import { useIdea } from '@/hooks/use-idea';

export default function VerifyPage() {
  const { getIdeaByHash, getIdeasByUser, isLoading } = useIdea();
  const [searchType, setSearchType] = useState<'hash' | 'wallet'>('hash');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IdeaRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setError('请输入查询内容');
      return;
    }

    setSearchQuery(query);
    setError(null);

    try {
      if (searchType === 'hash') {
        const result = await getIdeaByHash(query);
        setSearchResults(result ? [result] : []);
      } else {
        const results = await getIdeasByUser(query);
        setSearchResults(results);
      }
    } catch (err) {
      setError('查询失败，请稍后重试');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">验证创意存证</h1>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md ${
              searchType === 'hash'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onClick={() => setSearchType('hash')}
          >
            通过哈希验证
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              searchType === 'wallet'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onClick={() => setSearchType('wallet')}
          >
            通过钱包地址查询
          </button>
        </div>

        <SearchBar
          placeholder={
            searchType === 'hash'
              ? '输入创意哈希值...'
              : '输入 Solana 钱包地址...'
          }
          onSearch={handleSearch}
        />

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Spinner size="large" />
          <p className="mt-4 text-gray-500">查询中，请稍候...</p>
        </div>
      ) : (
        <>
          {searchResults && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">查询结果</h2>

              {searchResults.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-500">未找到匹配的创意记录</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {searchResults.map((record) => (
                    <IdeaCard key={record.ideaHash} record={record} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

## 钱包集成

### 钱包提供者 (app/providers/wallet-provider.tsx)

```tsx
'use client';

import { useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  BackpackWalletAdapter,
  GlowWalletAdapter,
  LedgerWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// 默认样式
import '@solana/wallet-adapter-react-ui/styles.css';

interface SolanaWalletProviderProps {
  children: React.ReactNode;
}

export function SolanaWalletProvider({ children }: SolanaWalletProviderProps) {
  // 网络设置（可通过环境变量配置）
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) || 
    WalletAdapterNetwork.Devnet;
  
  // 自定义 RPC 节点端点（可选）
  const endpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT || clusterApiUrl(network);

  // 支持的钱包适配器
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new BackpackWalletAdapter(),
      new GlowWalletAdapter(),
      new LedgerWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

### 钱包按钮组件 (app/components/wallet/wallet-button.tsx)

```tsx
'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { truncateAddress } from '@/lib/utils';

export function WalletButton() {
  const { publicKey, connected, disconnect } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 使用默认的 WalletMultiButton 但添加一些自定义样式
  if (!connected) {
    return (
      <WalletMultiButton className="!bg-emerald-600 hover:!bg-emerald-700 !rounded-md !h-12 px-6" />
    );
  }

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md h-12 px-6"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
        <span>{truncateAddress(publicKey?.toBase58() || '')}</span>
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
          className={`transition-transform ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg overflow-hidden z-20">
          <div className="py-1">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              onClick={() => {
                navigator.clipboard.writeText(publicKey?.toBase58() || '');
                setIsDropdownOpen(false);
              }}
            >
              复制地址
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              onClick={() => {
                window.open(
                  `https://explorer.solana.com/address/${publicKey?.toBase58()}?cluster=devnet`,
                  '_blank'
                );
                setIsDropdownOpen(false);
              }}
            >
              在浏览器中查看
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700"
              onClick={() => {
                disconnect();
                setIsDropdownOpen(false);
              }}
            >
              断开连接
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 钱包状态钩子 (app/hooks/use-wallet.ts)

```tsx
'use client';

import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export function useWalletStatus() {
  const {
    publicKey,
    connected,
    connecting,
    disconnect,
    select,
    wallets,
    wallet,
  } = useSolanaWallet();
  
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 获取钱包余额
  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connected) {
      setBalance(null);
      return;
    }

    try {
      setIsLoading(true);
      // 使用 web3.js 获取余额的逻辑
      // 示例：const balance = await connection.getBalance(publicKey);
      // 这里简单模拟
      const mockBalance = Math.random() * 10;
      setBalance(mockBalance);
    } catch (error) {
      console.error('获取余额失败', error);
      toast.error('获取钱包余额失败');
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connected]);

  // 连接状态变化时获取余额
  useEffect(() => {
    if (connected) {
      fetchBalance();
    }
  }, [connected, fetchBalance]);

  return {
    publicKey,
    connected,
    connecting,
    disconnect,
    select,
    wallets,
    wallet,
    balance,
    isBalanceLoading: isLoading,
    refreshBalance: fetchBalance,
  };
}
```

## 布局组件

### 全局布局 (app/layout.tsx)

```tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { SolanaWalletProvider } from '@/providers/wallet-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'IdeaProof - 区块链创意存证系统',
  description: '使用 Solana 区块链技术，为你的创意提供不可篡改的时间戳证明，防止抄袭争议。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <SolanaWalletProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <Toaster position="bottom-right" />
          </SolanaWalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 页头组件 (app/components/layout/header.tsx)

```tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { WalletButton } from '@/components/wallet/wallet-button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const routes = [
    { name: '首页', path: '/' },
    { name: '提交创意', path: '/submit' },
    { name: '验证查询', path: '/verify' },
    { name: '关于项目', path: '/about' },
  ];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/images/logo.svg"
                alt="IdeaProof Logo"
                width={36}
                height={36}
              />
              <span className="text-xl font-bold">IdeaProof</span>
            </Link>

            <nav className="hidden md:ml-10 md:flex md:items-center md:space-x-6">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={`text-sm font-medium transition-colors hover:text-emerald-500 ${
                    pathname === route.path
                      ? 'text-emerald-500'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {route.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <WalletButton />

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={`text-sm font-medium py-2 transition-colors hover:text-emerald-500 ${
                    pathname === route.path
                      ? 'text-emerald-500'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {route.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
``` 