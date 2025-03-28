// @ts-nocheck
import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { FileType, IdeaRecord } from '../types/idea';

// Program ID from Anchor build
export const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

// Get Anchor provider
export function getProvider(connection: Connection, wallet: anchor.Wallet) {
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    { commitment: 'confirmed' }
  );
  return provider;
}

// Get Anchor program
export function getProgram(provider: anchor.AnchorProvider) {
  // This will be updated once we have actual IDL
  const idl = {} as anchor.Idl; // placeholder until we have IDL
  return new anchor.Program(idl, PROGRAM_ID, provider);
}

// Find PDA for IdeaRecord
export async function findIdeaRecordPDA(
  ideaHash: string,
  submitter: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('idea_record'),
      Buffer.from(ideaHash),
      submitter.toBuffer(),
    ],
    PROGRAM_ID
  );
}

// Record Idea
export async function recordIdea(
  program: Program,
  ideaHash: string,
  fileType: FileType,
  title?: string,
  description?: string
) {
  const wallet = (program.provider as anchor.AnchorProvider).wallet;
  const [ideaRecordPda] = await findIdeaRecordPDA(ideaHash, wallet.publicKey);

  try {
    const tx = await program.methods
      .recordIdea(ideaHash, fileType, title, description)
      .accounts({
        submitter: wallet.publicKey,
        ideaRecord: ideaRecordPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
      
    return {
      success: true,
      txid: tx,
      pda: ideaRecordPda,
    };
  } catch (error) {
    console.error('Error recording idea:', error);
    return {
      success: false,
      error,
    };
  }
}

// Get Idea by Hash
export async function getIdeaByHash(
  program: Program,
  ideaHash: string
) {
  const wallet = (program.provider as anchor.AnchorProvider).wallet;
  const [ideaRecordPda] = await findIdeaRecordPDA(ideaHash, wallet.publicKey);
  
  try {
    const tx = await program.methods
      .getIdeaByHash(ideaHash)
      .accounts({
        submitter: wallet.publicKey,
        ideaRecord: ideaRecordPda,
      })
      .rpc();
      
    // Fetch account data
    const ideaRecord = await program.account.ideaRecord.fetch(ideaRecordPda);
    
    return {
      success: true,
      txid: tx,
      data: ideaRecord,
    };
  } catch (error) {
    console.error('Error getting idea by hash:', error);
    return {
      success: false,
      error,
    };
  }
}

// Get All Ideas by User
export async function getIdeasByUser(
  program: Program
) {
  const wallet = (program.provider as anchor.AnchorProvider).wallet;
  
  try {
    const tx = await program.methods
      .getIdeasByUser()
      .accounts({
        user: wallet.publicKey,
      })
      .rpc();
    
    // This is just to trigger the transaction
    // In reality, we'd use the connection.getProgramAccounts directly
    
    // Get all accounts owned by our program with filters
    const connection = program.provider.connection;
    const accounts = await connection.getProgramAccounts(program.programId, {
      filters: [
        {
          memcmp: {
            offset: 8 + 4 + 64, // Account discriminator + ideaHash string prefix + ideaHash
            bytes: wallet.publicKey.toBase58(),
          },
        },
      ],
    });
    
    // Decode accounts
    const ideas = accounts.map((account) => {
      return program.coder.accounts.decode('ideaRecord', account.account.data);
    });
    
    return {
      success: true,
      txid: tx,
      data: ideas,
    };
  } catch (error) {
    console.error('Error getting ideas by user:', error);
    return {
      success: false,
      error,
    };
  }
} 