// @ts-nocheck
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Metaplex, walletAdapterIdentity, toMetaplexFile } from '@metaplex-foundation/js';

// 初始化 Metaplex
export const getMetaplex = (wallet: any) => {
  const connection = new Connection(
    process.env.NEXT_PUBLIC_RPC_ENDPOINT || clusterApiUrl('devnet')
  );
  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));
  return metaplex;
};

// 铸造 NFT
export const mintNFT = async ({
  wallet,
  name,
  description,
  ideaHash,
  timestamp,
  category,
  license,
  image = null,
}: {
  wallet: any;
  name: string;
  description: string;
  ideaHash: string;
  timestamp: string;
  category: string;
  license: string;
  image?: File | null;
}) => {
  try {
    const metaplex = getMetaplex(wallet);
    
    // 准备元数据
    const metadata = {
      name,
      description,
      properties: {
        hash: ideaHash,
        timestamp,
        category,
        license,
      },
      attributes: [
        { trait_type: 'Category', value: category },
        { trait_type: 'License', value: license },
        { trait_type: 'Timestamp', value: timestamp },
        { trait_type: 'Creator', value: wallet.publicKey.toString() },
      ],
    };
    
    // 如果有图片，上传到存储
    let imageUri;
    if (image) {
      const metaplexFile = await toMetaplexFile(image, image.name);
      const uploadResult = await metaplex.storage().upload(metaplexFile);
      imageUri = uploadResult.uri;
    }
    
    // 上传元数据
    const { uri } = await metaplex.nfts().uploadMetadata({
      ...metadata,
      image: imageUri,
    });
    
    // 铸造 NFT
    const { nft } = await metaplex.nfts().create({
      uri,
      name,
      sellerFeeBasisPoints: 500, // 5% 版税
      creators: [{ address: wallet.publicKey, share: 100 }],
    });
    
    return {
      success: true,
      mintAddress: nft.address.toString(),
      metadataUri: uri,
      txId: nft.mintAddress.toString(),
    };
  } catch (error: any) {
    console.error('铸造 NFT 失败:', error);
    return {
      success: false,
      error: error.message || '铸造 NFT 失败',
    };
  }
};

// 获取用户拥有的 NFT
export const getUserNFTs = async (wallet: any) => {
  try {
    const metaplex = getMetaplex(wallet);
    
    const nfts = await metaplex.nfts().findAllByOwner({
      owner: wallet.publicKey,
    });
    
    // 过滤出 IdeaProof 平台铸造的 NFT
    // 在实际项目中，可能需要添加更多过滤条件
    return nfts.filter(nft => 
      nft.creators?.some(creator => 
        creator.address.toString() === wallet.publicKey.toString()
      )
    );
  } catch (error) {
    console.error('获取 NFT 失败:', error);
    throw error;
  }
};

// 上架 NFT
export const listNFTForSale = async ({
  wallet,
  mintAddress,
  price,
}: {
  wallet: any;
  mintAddress: string;
  price: number;
}) => {
  try {
    const metaplex = getMetaplex(wallet);
    
    // 将 price 转换为 lamports (1 SOL = 10^9 lamports)
    const priceInLamports = price * 1e9;
    
    // 上架 NFT
    const result = await metaplex.nfts().list({
      mintAddress: new PublicKey(mintAddress),
      price: priceInLamports,
    });
    
    return {
      success: true,
      txId: result.response.signature,
    };
  } catch (error: any) {
    console.error('上架 NFT 失败:', error);
    return {
      success: false,
      error: error.message || '上架 NFT 失败',
    };
  }
};

// 购买 NFT
export const buyNFT = async ({
  wallet,
  mintAddress,
  price,
}: {
  wallet: any;
  mintAddress: string;
  price: number;
}) => {
  try {
    const metaplex = getMetaplex(wallet);
    
    // 将 price 转换为 lamports
    const priceInLamports = price * 1e9;
    
    // 购买 NFT
    const result = await metaplex.nfts().buy({
      mintAddress: new PublicKey(mintAddress),
      price: priceInLamports,
    });
    
    return {
      success: true,
      txId: result.response.signature,
    };
  } catch (error: any) {
    console.error('购买 NFT 失败:', error);
    return {
      success: false,
      error: error.message || '购买 NFT 失败',
    };
  }
};

// 获取市场上的 NFT
export const getMarketNFTs = async (wallet: any) => {
  try {
    const metaplex = getMetaplex(wallet);
    
    // 在实际项目中，这里需要调用市场 API 获取上架的 NFT
    // 这里简化为获取所有 NFT
    const nfts = await metaplex.nfts().findAllByCreator({
      creator: wallet.publicKey,
    });
    
    return nfts;
  } catch (error) {
    console.error('获取市场 NFT 失败:', error);
    throw error;
  }
}; 