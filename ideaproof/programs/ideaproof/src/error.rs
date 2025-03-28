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

