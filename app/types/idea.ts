import { PublicKey } from '@solana/web3.js';

// File types enum
export type FileType = 'text' | 'image' | 'video' | 'audio' | 'code' | 'other';

// File type for Anchor
export interface FileTypeAnchor {
  text?: {}; // empty object for text type
  image?: {};
  video?: {};
  audio?: {};
  code?: {};
  other?: {};
}

// Idea record from blockchain
export interface IdeaRecord {
  ideaHash: string;
  submitter: PublicKey;
  timestamp: number;
  fileType: FileTypeAnchor;
  title?: string;
  description?: string;
  bump: number;
}

// For idea submission
export interface IdeaSubmission {
  content: string;
  fileType: FileType;
  title?: string;
  description?: string;
  file?: File;
}

// Idea with additional metadata for frontend
export interface IdeaDisplay extends IdeaRecord {
  txid?: string;
  formattedDate?: string;
  fileTypeLabel?: string;
}

// Result of idea record transaction
export interface RecordIdeaResult {
  success: boolean;
  txid?: string;
  pda?: PublicKey;
  error?: any;
}

// Result of idea query
export interface QueryIdeaResult {
  success: boolean;
  txid?: string;
  data?: IdeaRecord | IdeaRecord[];
  error?: any;
} 