# Changelog

本文件记录项目的所有重要更改。

## [Unreleased]

### Added
- 创建基础项目结构
  - 使用 Next.js 框架
  - 集成 Solana 钱包适配器
  - 配置 Tailwind CSS

- 实现主页面 (`app/page.tsx`)
  - 添加钱包连接功能
  - 实现中英文切换
  - 创建主要功能区块
  - 添加响应式设计

- 创建验证组件 (`app/components/idea/VerifyForm.tsx`)
  - 支持哈希值输入和文件上传两种验证方式
  - 实现文件哈希计算功能
  - 添加验证结果展示
  - 集成钱包状态
  - 支持多语言

- 创建提交组件 (`app/components/idea/IdeaForm.tsx`)
  - 支持文本和文件两种提交方式
  - 实现实时哈希计算
  - 添加提交结果展示
  - 集成钱包状态
  - 支持多语言

- 添加工具函数
  - `app/utils/hash.ts`: 实现文件和文本哈希计算
  - `app/utils/contract.ts`: 实现合约交互功能
  - `app/idl/ideaproof.ts`: 定义合约接口

- 创建智能合约 (`programs/ideaproof/src/lib.rs`)
  - 实现创意记录功能
  - 添加时间戳记录
  - 实现 PDA 账户创建
  - 添加基本错误处理

- 集成前端和智能合约
  - 实现哈希值验证功能
  - 实现创意提交功能
  - 添加错误处理和结果展示

- 新功能规划
  - 创建项目目标文档 (`PROJECT_GOALS.md`)
  - 规划 NFT 创意保护与交易功能
  - 规划平台代币(IDEA Token)机制
  - 设计创意市场交易系统

- 实现 NFT 功能
  - 集成 Metaplex SDK
  - 创建 NFT 工具函数 (`app/utils/nft.ts`)
    - 实现 NFT 铸造功能
    - 添加 NFT 上架功能
    - 添加 NFT 购买功能
    - 实现用户 NFT 查询功能
    - 实现市场 NFT 查询功能
  - 升级创意提交表单(`app/components/idea/IdeaForm.tsx`)
    - 添加 NFT 创建选项
    - 增加创意分类与版权许可选择
    - 实现 NFT 铸造与提交流程
  - 创建个人 NFT 页面 (`app/my-nfts/page.tsx`)
    - 显示用户拥有的 NFT
    - 提供 NFT 上架功能
    - 支持多语言显示
  - 创建 NFT 市场页面 (`app/market/page.tsx`)
    - 显示所有出售中的 NFT
    - 提供 NFT 购买功能
    - 支持多语言显示
    - 添加示例 NFT 数据用于开发测试

- 智能合约优化与迁移
  - 将完整功能合约从 `/ideaproof/programs/ideaproof/` 移动到标准路径 `/programs/ideaproof/`
  - 统一合约账户结构，支持不同文件类型
  - 增强错误处理机制，添加详细错误类型
  - 完善指令接口，支持标题和描述字段
  - 优化 PDA 账户种子设计，确保唯一性
  - 添加查询功能支持，包括按哈希查询和按用户查询
  - 迁移测试文件到 `/tests/` 目录

### Changed
- 优化验证表单的用户体验
  - 添加加载状态显示
  - 改进错误处理
  - 优化验证结果展示

- 优化提交表单的用户体验
  - 添加钱包连接检查
  - 添加表单验证
  - 优化结果展示
  - 增加 NFT 创建选项

- 更新项目进度文档
  - 添加 NFT 功能开发计划
  - 添加平台代币规划
  - 添加创意市场功能规划

- 项目结构优化
  - 将 .gitignore 文件从子目录迁移到项目根目录
  - 统一忽略文件规则，确保正确管理编译输出和临时文件

### Fixed
- 修复文件上传时的哈希计算问题
- 优化验证状态管理
- 修复客户端组件中错误导出 metadata 的问题
  - 为 submit 和 verify 页面创建单独的 layout.tsx 文件
  - 将 metadata 移至服务器端布局组件
- 修复 `@project-serum/anchor` 依赖问题
  - 更新导入路径为 `@coral-xyz/anchor`
  - 确保所有文件使用正确的包名
- 修复 node-fetch 中缺少 'encoding' 模块的问题
  - 安装 encoding 依赖
- 修复 TypeScript 配置问题
  - 添加 JSX 类型定义
  - 配置 tsconfig.json 解决类型检查错误

### Technical Debt
- CSS 配置问题待解决
  - Tailwind CSS 配置错误
  - PostCSS 插件问题
- `pino-pretty` 依赖缺失问题待解决
- 需要优化错误处理机制
- 需要添加更多的单元测试
- Metaplex 依赖问题
  - `@metaplex-foundation/js` 包已被弃用，需更新到最新替代品
  - bundlrStorage/irysStorage 导入错误持续出现
  - NFT 功能受到影响，需要更新到新版 SDK

- Next.js 构建与缓存问题
  - 多个 webpack 缓存错误影响构建过程
  - 需要定期清理缓存文件
  - 考虑添加自动化清理脚本

- 客户端水合错误
  - 钱包组件在服务器和客户端渲染结果不一致
  - 需要优化组件的服务器/客户端差异处理
  - 考虑使用 dynamic imports 和 ssr: false 选项

- 合约交互配置问题
  - 合约程序 ID 尚未更新（仍然使用占位符）
  - 前端与合约的 PDA 种子不一致，导致查询失败
  - 需要同步前端和合约的账户结构和交互逻辑

### Security
- 使用安全的哈希算法 (SHA-256)
- 实现安全的文件处理机制
- 添加智能合约输入验证
- NFT 交易安全
  - 实现安全的 NFT 交易机制
  - 添加交易签名验证
  - 确保创作者版权和版税权益

## 未来计划
- NFT 功能完善
  - 完善 NFT 市场交易机制
  - 添加 NFT 详情页面
  - 实现 NFT 交易历史查询
  - 添加 NFT 收藏功能

- 平台代币
  - 代币分配：平台保留 50%，用户领取 50%
  - Web2 端协助用户处理侵权案件
  - 支持优秀创意项目发展

- 去中心化创意交易
  - 实现创意 NFT 买卖
  - 添加版税机制
  - 构建知识产权交易中心

## [0.1.0] - 2024-03-xx
### 初始化
- 项目基础设置
- 核心功能实现
- 基础UI组件创建 