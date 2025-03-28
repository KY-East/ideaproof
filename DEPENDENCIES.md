# IdeaProof 项目依赖

## 前端依赖

### 核心框架
- Next.js
- React
- TypeScript

### UI和样式
- Tailwind CSS
- PostCSS
- Autoprefixer

### Solana生态
- @solana/web3.js - Solana Web3 API
- @solana/wallet-adapter-base - 钱包适配器基础包
- @solana/wallet-adapter-react - React钱包适配器
- @solana/wallet-adapter-react-ui - 钱包UI组件
- @solana/wallet-adapter-wallets - 主流钱包适配器

### Anchor框架
- @coral-xyz/anchor - Anchor智能合约框架

### 国际化
- next-i18next - Next.js国际化解决方案
- i18next - i18next核心库
- react-i18next - React绑定

### 工具库
- @types/node - Node.js类型定义
- @types/react - React类型定义

## 后端/智能合约依赖

### Rust依赖
- anchor-lang = "0.29.0" - Anchor语言库
- anchor-spl = "0.29.0" - Anchor SPL拓展
- solana-program = "~1.16.5" - Solana程序库

## 开发工具

### 构建工具
- TypeScript
- Rust
- Solana CLI
- Anchor CLI

### 测试工具
- Jest - JavaScript测试框架
- Mocha - Anchor测试

## 安装命令

```bash
# 安装前端依赖
npm install next react react-dom typescript @types/react @types/node
npm install tailwindcss postcss autoprefixer
npm install @solana/web3.js @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets
npm install @coral-xyz/anchor
npm install next-i18next i18next react-i18next

# 安装Solana和Anchor CLI（需要先安装Rust）
sh -c "$(curl -sSfL https://release.solana.com/v1.16.5/install)"
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install 0.29.0
avm use 0.29.0
```

## 注意事项
- 确保Rust和Node.js环境已正确设置
- Solana需要配置为devnet进行开发测试
- 项目中有TypeScript文件可能需要修复导入错误和类型定义问题 