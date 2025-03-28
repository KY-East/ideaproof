import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Ideaproof } from "../target/types/ideaproof";
import { PublicKey } from '@solana/web3.js';
import { expect } from 'chai';

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
    expect(ideaRecord.ideaHash).to.equal(ideaHash);
    expect(ideaRecord.submitter.toBase58()).to.equal(submitter.publicKey.toBase58());
    expect(ideaRecord.timestamp).to.be.above(0);
    expect(ideaRecord.fileType).to.deep.equal(fileType);
    expect(ideaRecord.title).to.equal(title);
    expect(ideaRecord.description).to.equal(description);
    
    console.log("✅ 创意记录成功存储");
    console.log("📝 哈希值:", ideaRecord.ideaHash);
    console.log("👤 提交者:", ideaRecord.submitter.toBase58());
    console.log("⏰ 时间戳:", new Date(ideaRecord.timestamp * 1000).toISOString());
    console.log("📄 文件类型:", Object.keys(ideaRecord.fileType)[0]);
    console.log("🔤 标题:", ideaRecord.title);
    console.log("📋 描述:", ideaRecord.description);
  });
  
  // 测试查询功能
  it("查询创意记录", async () => {
    // 测试数据
    const ideaHash = "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2";
    
    // 计算PDA地址
    const [ideaRecordPda] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("idea_record"),
        Buffer.from(ideaHash),
        submitter.publicKey.toBuffer(),
      ],
      program.programId
    );
    
    // 查询创意
    await program.methods
      .getIdeaByHash(ideaHash)
      .accounts({
        submitter: submitter.publicKey,
        ideaRecord: ideaRecordPda,
      })
      .signers([submitter])
      .rpc();
      
    console.log("✅ 成功查询创意记录");
  });
  
  // 测试错误处理
  it("拒绝无效的哈希长度", async () => {
    // 测试数据 - 无效的哈希
    const invalidHash = "too_short_hash";
    const fileType = { text: {} };
    
    try {
      // 计算PDA地址
      const [ideaRecordPda] = await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("idea_record"),
          Buffer.from(invalidHash),
          submitter.publicKey.toBuffer(),
        ],
        program.programId
      );
      
      // 尝试记录创意，应该失败
      await program.methods
        .recordIdea(invalidHash, fileType, null, null)
        .accounts({
          submitter: submitter.publicKey,
          ideaRecord: ideaRecordPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([submitter])
        .rpc();
        
      // 如果执行到这里，表示没有抛出错误，测试失败
      expect.fail("应当拒绝无效的哈希长度");
    } catch (error) {
      // 检查错误类型
      console.log("✅ 成功拒绝了无效的哈希长度");
      expect(error.toString()).to.include("InvalidHashLength");
    }
  });
});

