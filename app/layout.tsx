import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import WalletProvider from './providers/wallet-provider';

export const metadata: Metadata = {
  title: 'IdeaProof - 区块链创意保护',
  description: '在Solana区块链上安全记录并验证您的创意',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className="bg-slate-900 text-gray-200 min-h-screen">
        <WalletProvider>
          <main className="container mx-auto px-4">
            {children}
          </main>
        </WalletProvider>
      </body>
    </html>
  );
} 