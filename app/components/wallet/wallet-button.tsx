import React, { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useTranslation } from 'next-i18next';

const WalletButton: FC = () => {
  const { t } = useTranslation('common');
  const { connected } = useWallet();

  return (
    <div className="wallet-button-container">
      <WalletMultiButton className="wallet-adapter-button" />
      <style jsx>{`
        .wallet-button-container {
          display: flex;
          justify-content: center;
        }
        :global(.wallet-adapter-button) {
          background-color: #10b981;
          border-radius: 0.5rem;
          color: white;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          height: auto;
          padding: 0.625rem 1.25rem;
          transition: background-color 0.2s ease;
        }
        :global(.wallet-adapter-button:hover) {
          background-color: #059669;
        }
        :global(.wallet-adapter-button:not([disabled]):hover) {
          background-color: #059669;
        }
      `}</style>
    </div>
  );
};

export default WalletButton; 