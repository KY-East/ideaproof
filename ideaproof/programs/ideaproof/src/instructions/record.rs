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
    if idea_hash.len() != 64 {
        return Err(IdeaProofError::InvalidHashLength.into());
    }

    // 验证标题长度
    if let Some(title_str) = &title {
        if title_str.len() > 100 {
            return Err(IdeaProofError::TitleTooLong.into());
        }
    }

    // 验证描述长度
    if let Some(desc_str) = &description {
        if desc_str.len() > 500 {
            return Err(IdeaProofError::DescriptionTooLong.into());
        }
    }

    // 获取当前时间戳
    let clock = Clock::get()?;
    let timestamp = clock.unix_timestamp;

    // 获取PDA的bump
    let bump = *ctx.bumps.get("idea_record").unwrap();

    // 存储创意记录
    let idea_record = &mut ctx.accounts.idea_record;
    idea_record.idea_hash = idea_hash;
    idea_record.submitter = ctx.accounts.submitter.key();
    idea_record.timestamp = timestamp;
    idea_record.file_type = file_type;
    idea_record.title = title;
    idea_record.description = description;
    idea_record.bump = bump;

    Ok(())
}

