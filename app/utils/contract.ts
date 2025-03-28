// @ts-nocheck
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { IDL } from '../idl/ideaproof';

// 合约程序ID (TODO: 替换为实际部署后的程序ID)
const PROGRAM_ID = new PublicKey('11111111111111111111111111111111');

// 获取Provider
export const getProvider = () => {
  if (typeof window === 'undefined') {
    throw new Error('只能在客户端使用');
  }

  const connection = new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.devnet.solana.com');
  const provider = new AnchorProvider(
    connection,
    // @ts-ignore - window.solana 类型问题
    window.solana,
    { commitment: 'confirmed' }
  );
  return provider;
};

// 获取Program实例
export const getProgram = () => {
  const provider = getProvider();
  return new Program(IDL, PROGRAM_ID, provider);
};

// 验证创意哈希
export const verifyIdeaHash = async (hash: string): Promise<{
  found: boolean;
  timestamp?: number;
  owner?: string;
}> => {
  try {
    const program = getProgram();
    
    // 查找记录账户
    const [recordPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('idea'), Buffer.from(hash)],
      program.programId
    );

    // 获取记录数据
    const record = await program.account.ideaRecord.fetch(recordPda);
    
    return {
      found: true,
      timestamp: record.timestamp.toNumber(),
      owner: record.submitter.toString()
    };
  } catch (error: any) {
    console.error('验证哈希失败:', error);
    // 如果找不到账户，返回未找到
    if (error.message?.includes('Account does not exist')) {
      return { found: false };
    }
    // 其他错误则抛出
    throw error;
  }
};

// 记录创意哈希
export const recordIdeaHash = async (hash: string): Promise<{
  success: boolean;
  signature?: string;
  error?: string;
}> => {
  try {
    const program = getProgram();
    
    // 生成记录账户的PDA
    const [recordPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('idea'), Buffer.from(hash)],
      program.programId
    );

    // 调用合约记录哈希
    const tx = await program.methods
      .recordIdea(hash)
      .accounts({
        ideaRecord: recordPda,
        submitter: program.provider.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return {
      success: true,
      signature: tx
    };
  } catch (error: any) {
    console.error('记录哈希失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 