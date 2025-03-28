use anchor_lang::prelude::*;

mod state;
mod error;
mod instructions;

use instructions::*;
use state::*;
use error::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod ideaproof {
    use super::*;

    /// 记录创意哈希到区块链
    pub fn record_idea(ctx: Context<RecordIdea>, 
                      idea_hash: String, 
                      file_type: FileType,
                      title: Option<String>,
                      description: Option<String>) -> Result<()> {
        instructions::record::record_idea(ctx, idea_hash, file_type, title, description)
    }

    /// 通过哈希查询创意记录
    pub fn get_idea_by_hash(ctx: Context<GetIdeaByHash>, idea_hash: String) -> Result<()> {
        instructions::query::get_idea_by_hash(ctx, idea_hash)
    }

    /// 获取用户所有创意记录
    pub fn get_ideas_by_user(ctx: Context<GetIdeasByUser>) -> Result<()> {
        instructions::query::get_ideas_by_user(ctx)
    }
}

