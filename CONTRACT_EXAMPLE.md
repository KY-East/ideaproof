# IdeaProof 智能合约示例代码

以下是 IdeaProof 项目智能合约的核心示例代码，使用 Anchor 框架和 Rust 语言编写。

## 主程序入口 (lib.rs)

```rust
use anchor_lang::prelude::*;
use instructions::*;
use state::*;

pub mod error;
pub mod instructions;
pub mod state;

declare_id!("ideaproofXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

#[program]
pub mod ideaproof {
    use super::*;

    // 记录创意哈希的指令
    pub fn record_idea(
        ctx: Context<RecordIdea>,
        idea_hash: String,
        file_type: FileType,
        title: Option<String>,
        description: Option<String>,
    ) -> Result<()> {
        instructions::record::record_idea(ctx, idea_hash, file_type, title, description)
    }

    // 通过哈希获取创意记录的指令
    pub fn get_idea_by_hash(ctx: Context<GetIdeaByHash>, idea_hash: String) -> Result<()> {
        instructions::query::get_idea_by_hash(ctx, idea_hash)
    }

    // 查询用户提交的所有创意记录的指令
    pub fn get_ideas_by_user(ctx: Context<GetIdeasByUser>) -> Result<()> {
        instructions::query::get_ideas_by_user(ctx)
    }
}
```

## 状态定义 (state.rs)

```rust
use anchor_lang::prelude::*;

// 文件类型枚举
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum FileType {
    Text,   // 文本类型
    Image,  // 图片类型
    Video,  // 视频类型
    Audio,  // 音频类型
    Code,   // 代码类型
    Other,  // 其他类型
}

// 创意记录数据结构
#[account]
pub struct IdeaRecord {
    pub idea_hash: String,         // 创意哈希值 (64 字符)
    pub submitter: Pubkey,         // 提交者钱包地址
    pub timestamp: i64,            // 上链时间戳
    pub file_type: FileType,       // 文件类型
    pub title: Option<String>,     // 可选标题
    pub description: Option<String>, // 可选描述
    pub bump: u8,                  // PDA bump
}

// 计算创意记录账户地址的种子
pub fn get_idea_record_seeds<'a>(
    idea_hash: &'a str,
    submitter: &'a Pubkey,
) -> [&'a [u8]; 3] {
    [
        b"idea_record",
        idea_hash.as_bytes(),
        submitter.as_ref(),
    ]
}

// 实现默认值
impl Default for FileType {
    fn default() -> Self {
        FileType::Text
    }
}
```

## 错误定义 (error.rs)

```rust
use anchor_lang::prelude::*;

#[error_code]
pub enum IdeaProofError {
    #[msg("哈希值长度无效，应为64个字符的十六进制字符串")]
    InvalidHashLength,
    
    #[msg("创意哈希已存在")]
    IdeaHashAlreadyExists,
    
    #[msg("标题长度超出限制")]
    TitleTooLong,
    
    #[msg("描述长度超出限制")]
    DescriptionTooLong,
    
    #[msg("未找到创意记录")]
    IdeaRecordNotFound,
    
    #[msg("没有权限访问此记录")]
    Unauthorized,
}
```

## 记录创意指令 (instructions/record.rs)

```rust
use anchor_lang::prelude::*;
use crate::error::IdeaProofError;
use crate::state::{FileType, IdeaRecord, get_idea_record_seeds};

// 记录创意的指令上下文
#[derive(Accounts)]
#[instruction(idea_hash: String)]
pub struct RecordIdea<'info> {
    #[account(mut)]
    pub submitter: Signer<'info>,

    #[account(
        init,
        payer = submitter,
        space = 8 + 4 + 64 + 32 + 8 + 1 + 4 + 100 + 4 + 500 + 1, // 账户空间计算
        seeds = [
            b"idea_record", 
            idea_hash.as_bytes(),
            submitter.key().as_ref()
        ],
        bump
    )]
    pub idea_record: Account<'info, IdeaRecord>,

    pub system_program: Program<'info, System>,
}

// 记录创意的业务逻辑
pub fn record_idea(
    ctx: Context<RecordIdea>,
    idea_hash: String,
    file_type: FileType,
    title: Option<String>,
    description: Option<String>,
) -> Result<()> {
    // 验证哈希长度
    if idea_hash.len() != 64 || !idea_hash.chars().all(|c| c.is_ascii_hexdigit()) {
        return Err(IdeaProofError::InvalidHashLength.into());
    }
    
    // 如果提供了标题，验证长度
    if let Some(ref title_str) = title {
        if title_str.len() > 100 {
            return Err(IdeaProofError::TitleTooLong.into());
        }
    }
    
    // 如果提供了描述，验证长度
    if let Some(ref desc_str) = description {
        if desc_str.len() > 500 {
            return Err(IdeaProofError::DescriptionTooLong.into());
        }
    }
    
    // 获取当前时间戳
    let clock = Clock::get()?;
    let timestamp = clock.unix_timestamp;
    
    // 构建创意记录
    let idea_record = &mut ctx.accounts.idea_record;
    idea_record.idea_hash = idea_hash;
    idea_record.submitter = ctx.accounts.submitter.key();
    idea_record.timestamp = timestamp;
    idea_record.file_type = file_type;
    idea_record.title = title;
    idea_record.description = description;
    idea_record.bump = *ctx.bumps.get("idea_record").unwrap();
    
    // 记录事件
    emit!(IdeaRecorded {
        idea_hash: idea_record.idea_hash.clone(),
        submitter: idea_record.submitter,
        timestamp: idea_record.timestamp,
        file_type: idea_record.file_type.clone(),
    });
    
    Ok(())
}

// 创意记录事件
#[event]
pub struct IdeaRecorded {
    pub idea_hash: String,
    pub submitter: Pubkey,
    pub timestamp: i64,
    pub file_type: FileType,
}
```

## 查询指令 (instructions/query.rs)

```rust
use anchor_lang::prelude::*;
use crate::error::IdeaProofError;
use crate::state::{IdeaRecord, get_idea_record_seeds};

// 通过哈希查询创意的指令上下文
#[derive(Accounts)]
#[instruction(idea_hash: String)]
pub struct GetIdeaByHash<'info> {
    /// 查询者，可以是任何人
    pub querier: Signer<'info>,
    
    /// 通过哈希查找的创意记录
    #[account(
        seeds = [
            b"idea_record",
            idea_hash.as_bytes(),
            owner.key().as_ref()
        ],
        bump = idea_record.bump,
    )]
    pub idea_record: Account<'info, IdeaRecord>,
    
    /// 创意所有者
    pub owner: AccountInfo<'info>,
}

// 查询用户创意的指令上下文
#[derive(Accounts)]
pub struct GetIdeasByUser<'info> {
    /// 查询者，可以是任何人
    pub querier: Signer<'info>,
    
    /// 要查询的用户地址
    #[account()]
    pub target_user: AccountInfo<'info>,
}

// 通过哈希查询创意的业务逻辑
pub fn get_idea_by_hash(ctx: Context<GetIdeaByHash>, _idea_hash: String) -> Result<()> {
    // 创意记录已经被验证并加载
    let idea_record = &ctx.accounts.idea_record;
    
    // 触发查询结果事件
    emit!(IdeaRecordQueried {
        idea_hash: idea_record.idea_hash.clone(),
        submitter: idea_record.submitter,
        timestamp: idea_record.timestamp,
        file_type: idea_record.file_type.clone(),
        title: idea_record.title.clone(),
        description: idea_record.description.clone(),
    });
    
    Ok(())
}

// 查询用户创意的业务逻辑
pub fn get_ideas_by_user(ctx: Context<GetIdeasByUser>) -> Result<()> {
    // 此功能在链下进行，会查询节点的账户数据库
    // 这里仅触发一个事件表示查询开始
    emit!(UserIdeasQueried {
        user: ctx.accounts.target_user.key(),
        querier: ctx.accounts.querier.key(),
    });
    
    Ok(())
}

// 查询结果事件
#[event]
pub struct IdeaRecordQueried {
    pub idea_hash: String,
    pub submitter: Pubkey,
    pub timestamp: i64,
    pub file_type: crate::state::FileType,
    pub title: Option<String>,
    pub description: Option<String>,
}

// 用户创意查询事件
#[event]
pub struct UserIdeasQueried {
    pub user: Pubkey,
    pub querier: Pubkey,
}
```

## 指令模块入口 (instructions/mod.rs)

```rust
pub mod record;
pub mod query;
```

## Anchor.toml 配置示例

```toml
[features]
seeds = false
skip-lint = false

[programs.localnet]
ideaproof = "ideaproofXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

[programs.devnet]
ideaproof = "ideaproofXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "devnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
deploy = "anchor deploy"
```

## 测试示例

```typescript
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { assert } from "chai";
import { Ideaproof } from "../target/types/ideaproof";

describe("ideaproof", () => {
  // 配置测试环境
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Ideaproof as Program<Ideaproof>;
  const submitter = anchor.web3.Keypair.generate();
  
  // 测试前准备
  before(async () => {
    // 为测试用户充值SOL
    const airdropSignature = await provider.connection.requestAirdrop(
      submitter.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSignature);
  });
  
  // 测试创意记录
  it("记录创意并验证存储", async () => {
    // 测试数据
    const ideaHash = "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2";
    const fileType = { text: {} };
    const title = "测试创意";
    const description = "这是一个测试创意的描述";
    
    // 计算PDA地址
    const [ideaRecordPda] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("idea_record"),
        Buffer.from(ideaHash),
        submitter.publicKey.toBuffer(),
      ],
      program.programId
    );
    
    // 记录创意
    await program.methods
      .recordIdea(ideaHash, fileType, title, description)
      .accounts({
        submitter: submitter.publicKey,
        ideaRecord: ideaRecordPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([submitter])
      .rpc();
      
    // 获取并验证创意记录
    const ideaRecord = await program.account.ideaRecord.fetch(ideaRecordPda);
    assert.equal(ideaRecord.ideaHash, ideaHash);
    assert.deepEqual(ideaRecord.submitter, submitter.publicKey);
    assert.isAbove(ideaRecord.timestamp, 0);
    assert.deepEqual(ideaRecord.fileType, fileType);
    assert.equal(ideaRecord.title, title);
    assert.equal(ideaRecord.description, description);
  });
  
  // 测试查询功能
  it("查询创意记录", async () => {
    // 查询逻辑测试
    // ...
  });
});
```

## 智能合约注意事项

1. **账户大小计算**：
   - 在创建账户时确保为每个字段分配足够的空间
   - 考虑可变长度字段的最大长度

2. **安全考虑**：
   - 使用PDA（程序派生地址）确保唯一性
   - 添加适当的权限验证
   - 验证所有用户输入

3. **优化**：
   - 只在链上存储必要的数据
   - 考虑批量处理操作以减少交易费用

4. **测试**：
   - 编写全面的单元测试和集成测试
   - 在部署前在测试网进行测试

5. **升级路径**：
   - 考虑将来可能需要的升级
   - 设计灵活的数据结构 