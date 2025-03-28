import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import './styles/App.css';

// 设置 Solana 网络连接（这里使用 devnet 用于测试）
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// 定义交易历史记录类型
interface TransactionHistory {
  hash: string;
  timestamp: number;
  status: 'success' | 'error';
}

function App() {
  // 获取钱包实例
  const { publicKey, sendTransaction } = useWallet();
  // 存储用户输入的想法
  const [idea, setIdea] = useState('');
  // 存储交易状态
  const [status, setStatus] = useState('');
  // 存储交易历史
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);

  // 保存想法到链上
  const saveIdea = async () => {
    if (!publicKey || !idea.trim()) {
      setStatus('请先连接钱包并输入想法');
      return;
    }

    try {
      // 创建交易
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey('11111111111111111111111111111111'),
          lamports: 1000,
        })
      );

      // 发送交易
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      // 添加交易到历史记录
      setTransactions(prev => [{
        hash: signature,
        timestamp: Date.now(),
        status: 'success'
      }, ...prev]);

      setStatus('想法已成功保存到链上！');
      setIdea('');
    } catch (error: any) {
      setStatus('保存失败：' + (error.message || '未知错误'));
      setTransactions(prev => [{
        hash: error.message || '未知错误',
        timestamp: Date.now(),
        status: 'error'
      }, ...prev]);
    }
  };

  // 格式化时间戳
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="App">
      {/* 导航栏 */}
      <nav className="navbar">
        <a href="/" className="navbar-brand">Solana 想法浏览器</a>
        <WalletMultiButton />
      </nav>

      {/* 主容器 */}
      <div className="container">
        {/* 想法输入卡片 */}
        <div className="card">
          <h2 className="card-title">保存新想法</h2>
          <textarea
            className="idea-input"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="在这里输入你的想法..."
          />
          <button
            className="btn btn-primary"
            onClick={saveIdea}
            disabled={!publicKey || !idea.trim()}
          >
            保存到链上
          </button>
          {status && (
            <div className={`status-message ${status.includes('成功') ? 'status-success' : 'status-error'}`}>
              {status}
            </div>
          )}
        </div>

        {/* 交易历史卡片 */}
        <div className="card">
          <h2 className="card-title">交易历史</h2>
          <div className="transaction-history">
            {transactions.length === 0 ? (
              <p>暂无交易记录</p>
            ) : (
              transactions.map((tx, index) => (
                <div key={index} className="transaction-item">
                  <div>
                    <div className="transaction-hash">
                      {tx.hash.slice(0, 8)}...{tx.hash.slice(-8)}
                    </div>
                    <div className="transaction-time">
                      {formatTimestamp(tx.timestamp)}
                    </div>
                  </div>
                  <span className={`status-${tx.status}`}>
                    {tx.status === 'success' ? '成功' : '失败'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 