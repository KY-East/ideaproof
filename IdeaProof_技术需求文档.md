# IdeaProof 技术需求文档（MVP v1.0）

## 1. 项目概述
- **项目名称**：IdeaProof
- **版本**：MVP v1.0
- **目标**：
  - 让开发者将创意（Idea）存证到 Solana 区块链，确保时间戳可追溯。
  - 通过计算 SHA-256 哈希值，存储不可篡改的记录，防止抄袭争议。
  - 允许用户通过钱包地址 / 哈希值查询存证信息。

## 2. 功能需求

### 2.1 用户端功能
- 提交 Idea：输入内容，计算 SHA-256，连接钱包，上链存证。
- 查询存证：通过哈希值或钱包地址查询存证记录。
- 钱包交互：支持 Phantom / Solflare。
- 文件存证：支持图片、视频、音频等文件的哈希存证。
- Git 集成：支持读取 Git 仓库提交历史，生成时间线证明。

### 2.2 管理端功能（未来扩展）
- NFT / SBT 存证证明。
- DAO 仲裁机制（防抢注）。
- 多签名验证（协作项目）。
- 创意演变时间线（版本记录）。

## 3. 交互流程

### 3.1 提交存证
1. 用户连接钱包
2. 输入 Idea 内容或上传文件
3. 计算哈希并调用合约
4. 返回 TXID 和存证信息

### 3.2 查询存证
1. 输入哈希值 / 钱包地址
2. 返回时间戳 + TXID + 归属地址

### 3.3 文件存证
1. 用户上传文件（支持拖拽）
2. 前端计算文件哈希值
3. 显示文件类型、大小和哈希值
4. 用户可添加标题和描述
5. 连接钱包上链存证

### 3.4 Git 仓库存证
1. 用户提供 Git 仓库地址
2. 系统读取提交历史
3. 计算提交记录的哈希值
4. 上链存证创意时间线

## 4. 技术架构

### Solana 智能合约
- 语言：Rust + Anchor
- 存储结构：
  - Idea Hash（string, 64 bytes）
  - 提交者地址（Pubkey, 32 bytes）
  - 时间戳（i64, 8 bytes）
  - 文件类型（FileType enum, 1 byte）
  - 标题（string, 可选）
  - 描述（string, 可选）
- 核心函数：
  - record_idea(idea_hash: String, user: Pubkey, timestamp: i64, file_type: FileType, title: Option<String>, description: Option<String>)
  - get_idea_by_hash(idea_hash: String)
  - get_ideas_by_user(user: Pubkey)

### 前端
- 框架：Next.js + React
- 钱包支持：Solana.js + Web3.js
- 存储：只存哈希，保护隐私
- 文件处理：浏览器原生 FileReader API 计算哈希
- Git 集成：通过 API 读取仓库提交历史

### API 设计
| API | Method | 参数 | 说明 |
|------|--------|------|------|
| recordIdea | POST | idea_hash, user_pubkey, file_type, title, description | 存证 Idea |
| getIdeaByHash | GET | idea_hash | 查询存证 |
| getIdeasByUser | GET | user_pubkey | 查询用户存证历史 |
| getGitHistory | POST | repo_url | 获取 Git 提交历史 |

## 5. 文件类型支持
- 文本：TXT, MD, PDF, DOC, DOCX 等
- 图片：JPG, PNG, GIF, SVG, WEBP 等
- 视频：MP4, WEBM, MOV 等
- 音频：MP3, WAV, OGG 等
- 代码：各种编程语言源文件

## 6. 特殊场景处理
- **超大文件**：提供分块哈希计算
- **多人协作**：支持多签名存证
- **创意演变**：支持版本记录和时间线展示
- **衍生作品**：记录与原作品的关联关系

## 7. 未来扩展
- NFT / SBT 认证证明
- DAO 治理
- Idea 交易市场（Token 经济）
- AI 创意辅助工具

## 8. 任务拆解 & 进度
| 任务 | 负责人 | 时间 | 状态 |
|------|------|------|------|
| 智能合约开发 | 开发者 A | 1-2 周 | ⏳ 进行中 |
| 钱包连接 | 开发者 B | 1 周 | ✅ 已完成 |
| UI 设计 | 设计师 | 1 周 | ⏳ 进行中 |
| 哈希计算实现 | 开发者 | 1 周 | 🔜 待开始 |
| 文件处理 | 开发者 | 1 周 | 🔜 待开始 |
| Git 集成 | 开发者 | 2 周 | 🔜 待开始 |
| 数据查询 API | 开发者 C | 1 周 | 🔜 待开始 |
| 部署测试 | 全体 | 1 周 | 🔜 待开始 |

## 9. 里程碑
| 阶段 | 目标 | 时间 |
|------|------|------|
| MVP Alpha | 上链存证 + 钱包交互 | 4 周 |
| MVP Beta | UI + 查询功能 + 文件存证 | 8 周 |
| 进阶版本 | Git 集成 + 多类型存证 | 12 周 |
| 正式版 | 对外发布测试 | 14 周 |
