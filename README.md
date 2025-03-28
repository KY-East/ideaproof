# IdeaProof

![Status: In Development](https://img.shields.io/badge/Status-In%20Development-yellow)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Platform: Solana](https://img.shields.io/badge/Platform-Solana-green)

**IdeaProof** 是一个基于 Solana 区块链的创意存证系统，让开发者和创作者能够安全地记录创意的所有权和时间戳，防止抄袭争议。

## 🚀 项目介绍

在人工智能和创意经济快速发展的时代，创意保护变得前所未有的重要。IdeaProof 提供一种去中心化的方法，通过区块链技术为您的创意提供不可篡改的时间戳证明。

主要功能包括文本存证、文件存证、Git提交历史存证，以及使用钱包地址或哈希值查询历史记录。

## 🔮 核心功能

- **文本创意存证**: 记录文本内容，生成SHA-256哈希，上链存储
- **文件存证**: 支持图片、视频、音频等文件的哈希存证
- **Git仓库集成**: 读取提交历史，生成时间线证明
- **区块链验证**: 使用Solana提供不可篡改的时间戳
- **存证查询**: 通过哈希值或钱包地址查询记录
- **多语言支持**: 支持英语、中文、日语、韩语、法语和西班牙语

## 💻 技术栈

### 前端
- Next.js (TypeScript)
- Tailwind CSS
- Solana Web3.js
- Solana Wallet Adapter
- Web Crypto API
- next-i18next (国际化)

### 区块链
- Solana网络
- Anchor框架 (Rust)
- Solana程序模型

## 📝 使用方法

> ⚠️ 项目仍在开发中，以下为计划功能

### 存证创意
1. 连接您的Solana钱包 (支持Phantom, Solflare, Backpack等)
2. 输入您的创意内容或上传文件
3. 系统自动计算SHA-256哈希值
4. 确认后上链存证
5. 获取交易ID和时间戳证明

### 查询记录
1. 输入哈希值或钱包地址
2. 查看所有匹配的存证记录
3. 验证区块链上的时间戳和提交者信息

## 🌍 多语言支持

IdeaProof支持以下语言：
- 英语 (默认)
- 中文
- 日语
- 韩语
- 法语
- 西班牙语

用户可以根据个人偏好切换界面语言，系统将保存用户的语言设置。

## 🔧 技术实现

- **哈希计算**: 使用Web Crypto API和Web Workers处理大文件
- **钱包集成**: Solana Wallet Adapter支持多种钱包
- **存储结构**: 只存储哈希值，保护隐私，节省成本
- **合约安全**: PDA设计确保每个记录唯一性
- **国际化**: 使用next-i18next实现高效多语言支持

## 🛠️ 开发进度

项目目前处于开发规划阶段，预计按照以下里程碑进行：

- **MVP Alpha (4周)**: 基础上链存证 + 钱包交互
- **MVP Beta (8周)**: UI + 查询功能 + 文件存证 + 初步多语言支持
- **进阶版本 (12周)**: Git集成 + 多类型存证 + 完善多语言支持
- **正式版 (14周)**: 全功能发布

## 🤝 如何贡献

我们欢迎开发者和创意人贡献代码、翻译或改进文档。

1. Fork 项目
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的修改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

## 🔗 相关资源

- [Solana 开发文档](https://docs.solana.com/)
- [Anchor 框架](https://project-serum.github.io/anchor/)
- [Next.js 文档](https://nextjs.org/docs)
- [next-i18next 文档](https://next-i18next.com/)

---

**IdeaProof** - 保护您的创意，从一个哈希开始。 