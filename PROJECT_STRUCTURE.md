# IdeaProof 项目结构

本文档详细描述了 IdeaProof 项目的文件夹和文件结构，作为开发参考。

## 前端结构 (Next.js)

```
ideaproof/
├── app/                      # Next.js App 目录
│   ├── layout.tsx            # 全局布局组件
│   ├── page.tsx              # 首页
│   ├── favicon.ico           # 网站图标
│   ├── globals.css           # 全局样式
│   ├── actions/              # 服务器操作
│   │   └── idea.ts           # 创意相关操作
│   ├── (routes)/             # 应用路由
│   │   ├── submit/           # 提交创意页面
│   │   │   └── page.tsx      # 提交页面组件
│   │   ├── verify/           # 验证创意页面
│   │   │   └── page.tsx      # 验证页面组件
│   │   ├── profile/          # 用户资料页面
│   │   │   └── page.tsx      # 资料页面组件
│   │   └── about/            # 关于页面
│   │       └── page.tsx      # 关于页面组件
│   ├── components/           # React 组件
│   │   ├── ui/               # UI 组件
│   │   │   ├── button.tsx    # 按钮组件
│   │   │   ├── card.tsx      # 卡片组件
│   │   │   ├── input.tsx     # 输入框组件
│   │   │   └── ...           # 其他UI组件
│   │   ├── wallet/           # 钱包相关组件
│   │   │   ├── wallet-button.tsx    # 钱包连接按钮
│   │   │   ├── wallet-provider.tsx  # 钱包提供者
│   │   │   └── wallet-modal.tsx     # 钱包选择模态框
│   │   ├── idea/             # 创意相关组件
│   │   │   ├── idea-form.tsx         # 创意提交表单
│   │   │   ├── idea-card.tsx         # 创意展示卡片
│   │   │   ├── idea-list.tsx         # 创意列表
│   │   │   └── hash-calculator.tsx   # 哈希计算组件
│   │   ├── file/             # 文件相关组件
│   │   │   ├── file-upload.tsx       # 文件上传组件
│   │   │   └── file-preview.tsx      # 文件预览组件
│   │   ├── layout/           # 布局组件
│   │   │   ├── header.tsx            # 页头组件
│   │   │   ├── footer.tsx            # 页脚组件
│   │   │   └── sidebar.tsx           # 侧边栏组件
│   │   └── i18n/              # 国际化组件
│   │       ├── language-switcher.tsx # 语言切换组件
│   │       └── localized-text.tsx    # 本地化文本组件
│   ├── hooks/                # 自定义 Hooks
│   │   ├── use-wallet.ts     # 钱包相关钩子
│   │   ├── use-idea.ts       # 创意相关钩子
│   │   ├── use-hash.ts       # 哈希计算钩子
│   │   └── use-translation.ts # 国际化钩子
│   ├── lib/                  # 工具库
│   │   ├── utils.ts          # 通用工具函数
│   │   ├── hash.ts           # 哈希计算工具
│   │   ├── anchor.ts         # Anchor 程序连接工具
│   │   └── constants.ts      # 常量定义
│   ├── providers/            # 全局提供者
│   │   ├── wallet-provider.tsx     # 钱包提供者
│   │   ├── theme-provider.tsx      # 主题提供者
│   │   └── i18n-provider.tsx       # 国际化提供者
│   └── types/                # TypeScript 类型定义
│       ├── idea.ts           # 创意相关类型
│       └── wallet.ts         # 钱包相关类型
├── public/                   # 静态资源
│   ├── assets/               # 资源文件
│   │   ├── images/           # 图片资源
│   │   └── icons/            # 图标资源
│   ├── fonts/                # 字体文件
│   └── locales/              # 本地化文件
│       ├── en/               # 英语
│       │   ├── common.json   # 通用翻译
│       │   ├── home.json     # 首页翻译
│       │   └── ...           # 其他页面翻译
│       ├── zh/               # 中文
│       ├── ja/               # 日语
│       ├── ko/               # 韩语
│       ├── fr/               # 法语
│       └── es/               # 西班牙语
├── programs/                 # Solana 程序
│   └── ideaproof/            # IdeaProof 程序
│       ├── src/              # 源代码
│       │   ├── lib.rs        # 程序入口
│       │   ├── state.rs      # 状态定义
│       │   ├── error.rs      # 错误定义
│       │   └── instructions/ # 指令定义
│       │       ├── mod.rs    # 模块入口
│       │       ├── record.rs # 记录创意指令
│       │       └── query.rs  # 查询指令
│       ├── Cargo.toml        # Rust 依赖配置
│       └── Xargo.toml        # Rust 交叉编译配置
├── tests/                    # 测试文件
│   ├── e2e/                  # 端到端测试
│   │   └── submit-idea.spec.ts  # 提交创意测试
│   └── unit/                 # 单元测试
│       └── hash.test.ts      # 哈希计算测试
├── i18n.json                 # next-i18next 配置
├── next-i18next.config.js    # 国际化配置
├── .env.local                # 本地环境变量
├── .gitignore                # Git 忽略文件
├── next.config.js            # Next.js 配置
├── package.json              # NPM 依赖配置
├── tsconfig.json             # TypeScript 配置
├── tailwind.config.js        # Tailwind CSS 配置
├── postcss.config.js         # PostCSS 配置
├── Anchor.toml               # Anchor 配置
├── README.md                 # 项目说明
└── CHANGELOG.md              # 变更日志
```

## 关键文件说明

### 前端核心文件

1. **app/layout.tsx**:
   - 全局布局组件，包含钱包提供者、主题提供者和国际化提供者

2. **app/page.tsx**:
   - 首页组件，展示项目介绍和主要功能入口

3. **app/components/wallet/wallet-provider.tsx**:
   - 整合 Solana 钱包适配器，提供全局钱包连接状态

4. **app/components/idea/idea-form.tsx**:
   - 创意提交表单，包含文本输入和文件上传功能

5. **app/lib/hash.ts**:
   - SHA-256 哈希计算工具，支持文本和文件处理

6. **app/lib/anchor.ts**:
   - 与 Solana 智能合约交互的工具函数

7. **app/components/i18n/language-switcher.tsx**:
   - 语言切换组件，允许用户选择界面语言

8. **next-i18next.config.js**:
   - 国际化配置文件，定义支持的语言和命名空间

### 智能合约核心文件

1. **programs/ideaproof/src/lib.rs**:
   - Anchor 程序入口文件，定义程序 ID 和主要模块

2. **programs/ideaproof/src/state.rs**:
   - 定义创意存证的数据结构

3. **programs/ideaproof/src/instructions/record.rs**:
   - 实现记录创意哈希的指令逻辑

4. **programs/ideaproof/src/instructions/query.rs**:
   - 实现查询创意记录的指令逻辑

## 关键数据结构

### 创意记录 (IdeaRecord)

```rust
#[account]
pub struct IdeaRecord {
    pub idea_hash: String,       // 创意哈希值
    pub submitter: Pubkey,       // 提交者公钥
    pub timestamp: i64,          // 提交时间戳
    pub file_type: FileType,     // 文件类型枚举
    pub title: Option<String>,   // 可选标题
    pub description: Option<String>, // 可选描述
    pub bump: u8,                // PDA bump
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum FileType {
    Text,    // 文本类型
    Image,   // 图片类型
    Video,   // 视频类型
    Audio,   // 音频类型
    Code,    // 代码类型
    Other,   // 其他类型
}
```

### 前端创意类型 (TypeScript)

```typescript
export type FileType = 'text' | 'image' | 'video' | 'audio' | 'code' | 'other';

export interface IdeaRecord {
  ideaHash: string;
  submitter: string;
  timestamp: number;
  fileType: FileType;
  title?: string;
  description?: string;
}

export interface IdeaSubmission {
  content: string;
  fileType: FileType;
  title?: string;
  description?: string;
  file?: File;
}
```

### 国际化配置和类型

```typescript
// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'ja', 'ko', 'fr', 'es'],
    localeDetection: true,
  },
  defaultNS: 'common',
  localePath: './public/locales',
}

// 翻译钩子接口
export interface UseTranslation {
  t: (key: string, options?: object) => string;
  i18n: {
    changeLanguage: (lang: string) => Promise<void>;
    language: string;
  };
}
```

## 接口定义

### 前端与智能合约的接口

1. **记录创意**:
   ```typescript
   async function recordIdea(
     ideaHash: string,
     fileType: FileType,
     title?: string,
     description?: string
   ): Promise<{ txid: string; timestamp: number }>
   ```

2. **获取创意记录**:
   ```typescript
   async function getIdeaByHash(
     ideaHash: string
   ): Promise<IdeaRecord | null>
   ```

3. **获取用户的创意记录**:
   ```typescript
   async function getIdeasByUser(
     userAddress: string
   ): Promise<IdeaRecord[]>
   ```

## 用户界面流程

1. **首页**:
   - 项目介绍
   - 功能导航
   - 连接钱包入口
   - 语言切换选项

2. **提交创意页**:
   - 钱包连接状态
   - 创意输入/文件上传
   - 哈希计算结果显示
   - 提交按钮
   - 交易状态显示
   - 多语言提示信息

3. **验证页**:
   - 哈希/地址输入框
   - 查询结果显示
   - 验证状态
   - 本地化结果展示

4. **个人资料页**:
   - 用户创意历史记录
   - 创意详情展示
   - 按语言优化的内容展示

## 国际化实现方案

1. **基础架构**:
   - 使用next-i18next库
   - JSON格式的语言文件
   - 按页面和功能模块划分命名空间

2. **语言切换流程**:
   - 用户从语言切换器选择语言
   - 保存选择到localStorage
   - 切换界面语言
   - 记住用户偏好下次访问时使用

3. **自动检测功能**:
   - 首次访问自动检测浏览器语言
   - 提供默认值(英语)
   - 允许用户手动切换

4. **翻译管理**:
   - 模块化组织翻译文件
   - 使用命名空间避免键名冲突
   - 支持动态内容插值 