use anchor_lang::prelude::*;
use crate::error::IdeaProofError;
use crate::state::{IdeaRecord, get_idea_record_seeds};

// 通过哈希查询创意的上下文
#[derive(Accounts)]
#[instruction(idea_hash: String)]
pub struct GetIdeaByHash<'info> {
    pub submitter: Signer<'info>,

    #[account(
        seeds = [
            b"idea_record",
            idea_hash.as_bytes(),
            submitter.key().as_ref()
        ],
        bump = idea_record.bump
    )]
    pub idea_record: Account<'info, IdeaRecord>,
}

// 获取用户所有创意的上下文
#[derive(Accounts)]
pub struct GetIdeasByUser<'info> {
    pub user: Signer<'info>,
}

// 通过哈希查询创意的实现
pub fn get_idea_by_hash(ctx: Context<GetIdeaByHash>, idea_hash: String) -> Result<()> {
    // 这个函数实际上并不需要做什么，因为账户已经通过约束找到
    // 在前端可以直接从返回的账户中读取数据
    msg!("Found idea record with hash: {}", idea_hash);
    msg!("Submitter: {}", ctx.accounts.idea_record.submitter);
    msg!("Timestamp: {}", ctx.accounts.idea_record.timestamp);
    Ok(())
}

// 获取用户所有创意的实现
pub fn get_ideas_by_user(ctx: Context<GetIdeasByUser>) -> Result<()> {
    // 在这个函数中，我们通过前端调用getProgramAccounts来获取过滤的结果
    // 这里只需要记录一下请求的用户地址
    msg!("Requested ideas for user: {}", ctx.accounts.user.key());
    Ok(())
}

