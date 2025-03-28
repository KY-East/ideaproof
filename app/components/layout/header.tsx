'use client';

import React from 'react';
import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import LanguageSwitcher from '../i18n/language-switcher';

export default function Header() {
  return (
    <header className="flex justify-between items-center mb-16">
      <Link href="/" className="text-2xl font-bold text-white">
        IdeaProof
      </Link>
      <div className="flex items-center space-x-4">
        <a 
          href="http://localhost:3004"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Dev
        </a>
        <a 
          href="https://the-answer-is-ks.gitbook.io/ideaproof"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Docs
        </a>
        <LanguageSwitcher />
        <WalletMultiButton className="bg-gray-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors" />
      </div>
    </header>
  );
} 