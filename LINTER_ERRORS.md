# Linter 错误记录

以下是当前项目中存在的 linter 错误，记录以便于系统性解决。

## 依赖相关错误

### 找不到模块
```
找不到模块"react"或其相应的类型声明。
找不到模块"next/router"或其相应的类型声明。
找不到模块"next-i18next"或其相应的类型声明。
找不到模块"@solana/wallet-adapter-react"或其相应的类型声明。
找不到模块"@solana/wallet-adapter-base"或其相应的类型声明。
找不到模块"@solana/wallet-adapter-wallets"或其相应的类型声明。 
找不到模块"@solana/wallet-adapter-react-ui"或其相应的类型声明。
找不到模块"@solana/web3.js"或其相应的类型声明。
找不到模块"@coral-xyz/anchor"或其相应的类型声明。
```

### Node.js 类型定义
```
找不到名称"Buffer"。是否需要安装 Node.js 的类型定义? 请尝试运行 `npm i --save-dev @types/node`。
```

## React 错误

### UMD 全局引用
```
"React"指 UMD 全局，但当前文件是模块。请考虑改为添加导入。
```

## CSS 相关错误

```
Unknown word (CssSyntaxError)
```

```
Missed semicolon (CssSyntaxError)
```

## 类型定义错误

```
类型"ButtonProps"上不存在属性"className"。
类型"ButtonProps"上不存在属性"disabled"。
```

```
不能将类型"{ children: string; jsx: true; }"分配给类型"DetailedHTMLProps<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>"。
类型"DetailedHTMLProps<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>"上不存在属性"jsx"。
```

## 修复计划

1. 安装缺少的依赖
```bash
npm install react react-dom next @types/react @types/react-dom @types/node
npm install next-i18next
npm install @solana/web3.js @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets
npm install @coral-xyz/anchor
```

2. 修复 React 导入
- 在有 JSX 的文件顶部添加: `import React from 'react';`

3. 修复 styled-jsx 相关错误
- 确保 next.js 配置正确支持 styled-jsx

4. 修复类型定义
- 修正 ButtonProps 接口，确保包含 className 和 disabled 属性
- 研究 styled-jsx 的正确类型定义 