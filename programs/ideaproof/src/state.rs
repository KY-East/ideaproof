use anchor_lang::prelude::*;

/// 创意记录账户结构
#[account]
pub struct IdeaRecord {
    /// 创意哈希值
    pub idea_hash: String,       // 64 bytes
    /// 提交者公钥
    pub submitter: Pubkey,       // 32 bytes
    /// 提交时间戳
    pub timestamp: i64,          // 8 bytes
    /// 文件类型
    pub file_type: FileType,     // 1 byte
    /// 可选标题
    pub title: Option<String>,   // 4 + len bytes
    /// 可选描述
    pub description: Option<String>, // 4 + len bytes
    /// PDA bump
    pub bump: u8,                // 1 byte
}

/// 文件类型枚举
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum FileType {
    Text,    // 文本类型
    Image,   // 图片类型
    Video,   // 视频类型
    Audio,   // 音频类型
    Code,    // 代码类型
    Other,   // 其他类型
}

impl Default for FileType {
    fn default() -> Self {
        FileType::Text
    }
}

/// 用于生成IdeaRecord的PDA种子
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

/// 计算IdeaRecord账户所需空间
pub fn get_idea_record_size(
    idea_hash_len: usize, 
    title_len: Option<usize>, 
    description_len: Option<usize>
) -> usize {
    8 +                             // 歧义器
    4 + idea_hash_len +             // String前缀 + idea_hash
    32 +                            // Pubkey
    8 +                             // i64 timestamp
    1 +                             // FileType enum
    1 +                             // Option<String> title is_some
    title_len.map_or(0, |len| 4 + len) + // 如果有title，加上String前缀和长度
    1 +                             // Option<String> description is_some
    description_len.map_or(0, |len| 4 + len) + // 如果有description，加上String前缀和长度
    1                               // bump
}

