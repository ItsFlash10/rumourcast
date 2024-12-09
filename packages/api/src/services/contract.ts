import { ContractTransactionReceipt, ethers, Signer } from 'ethers';
import { Redis } from 'ioredis';
import { ABI } from './contract_abi';
import { neynar } from './neynar';

const CACHE_TTL = 60 * 60 * 24; // 24 hours

class ContractService {
  private readonly contract: ethers.Contract;
  private readonly provider: ethers.Provider;
  private readonly redis: Redis;
  private static instance: ContractService;

  private constructor(
    contractAddress: string,
    rpcUrl: string,
    redisUrl: string,
    signer: Signer
  ) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.contract = new ethers.Contract(
      contractAddress,
      ABI,
      this.provider
    );
    this.redis = new Redis(redisUrl);
  }

  static getInstance(): ContractService {
    if (!ContractService.instance) {
      const contractAddress = process.env.CONTRACT_ADDRESS;
      const rpcUrl = process.env.RPC_URL;
      const redisUrl = process.env.REDIS_URL;
      const signer = process.env.SERVER_PRIVATE_KEY;

      if (!contractAddress || !rpcUrl || !redisUrl || !signer) {
        throw new Error("CONTRACT_ADDRESS, RPC_URL, REDIS_URL & signer environment variables must be set");
      }

      ContractService.instance = new ContractService(
        contractAddress,
        rpcUrl,
        redisUrl,
        new ethers.Wallet(signer)
      );
    }
    return ContractService.instance;
  }

  async getCastId(tokenId: string): Promise<string> {
    try {
      // Convert to bigint
      const cacheKey = `castId:${tokenId}`;
      const cachedValue = await this.redis.get(cacheKey);
      if (cachedValue) return cachedValue
      const tokenIdBigInt = BigInt(tokenId);
      const castId: string = await this.contract.getCastId(tokenIdBigInt);
      if (castId) {
        await this.redis.set(cacheKey, castId, 'EX', CACHE_TTL);
      }

      return castId;
    } catch (error) {
      throw new Error(`Cast ID not found for token ${tokenId}`);
    }
  }
  async checkTokenIdExists(tokenId: string): Promise<boolean> {
    try {
      const cast_id = await this.contract.getCastId(BigInt(tokenId));
      if (!cast_id) return false;
      return true;
    } catch(error) {
      return false;
    }
  }

  async getOrCreateTokenId(castId: string): Promise<string> {
    try {
      const cacheKey = `tokenId:${castId}`;
      const cachedValue = await this.redis.get(cacheKey);
      if (cachedValue) return cachedValue
      const tokenId = await this.getComputeTokenId(castId);
      const exists = await this.checkTokenIdExists(tokenId);
      if (!exists) {
        try {
          await neynar.getCast(castId); // ensure creating tokens for valid casts
        } catch (e) {
          throw new Error("HTTP Error: Invalid cast id");
        }
        const tx = await this.contract.generateTokenId(castId);
        await tx.wait();
        console.log("New Token Id Generated: ", tokenId);
      }
      if (tokenId) {
        await this.redis.set(cacheKey, tokenId.toString(), 'EX', CACHE_TTL);
      }
      return tokenId;
    } catch (error) {
      throw new Error(`Could not resolve token Id for cast ${castId}`);
    }
  }
  async generateTokenId(castId: string): Promise<string> {
    const cacheKey = `tokenId:${castId}`;
    const cachedValue = await this.redis.get(cacheKey);
    if (cachedValue) {
      throw new Error("Cast already exists");
    }
    try {
      await neynar.getCast(castId); // ensure creating tokens for valid casts
    } catch (e) {
      throw new Error("HTTP Error: Invalid cast id");
    }
    try {
      const tx = await this.contract.generateTokenId(castId);
      await tx.wait();
      const tokenId = await this.getComputeTokenId(castId);
      await this.redis.set(cacheKey, tokenId.toString(), 'EX', CACHE_TTL);
      return tokenId;
    } catch (error) {
      throw new Error(`Failed to generate token ID: ${(error as Error).message}`);
    }
  }
  async getMintPrice(): Promise<string> {
    const cacheKey = 'mintPrice';
    const cachedValue = await this.redis.get(cacheKey);
    if (cachedValue) return cachedValue;
    const price = await this.contract.mintPrice();
    await this.redis.set(cacheKey, price.toString(), 'EX', CACHE_TTL);
    return price;
  }

  async getMaxMintLimit(): Promise<string> {
    const cacheKey = 'maxMintLimit';
    const cachedValue = await this.redis.get(cacheKey);
    if (cachedValue) return cachedValue;
    const maxMintLimit = await this.contract.maxMintLimit();
    await this.redis.set(cacheKey, maxMintLimit.toString(), 'EX', CACHE_TTL);
    return maxMintLimit.toString();
  }

  async getTokenMintCount(tokenId: string): Promise<string> {
    const cacheKey = `tokenMintCount:${tokenId}`;
    const cachedCount = await this.redis.get(cacheKey);
    if (cachedCount) return cachedCount;
    const count = await this.contract.getTokenMintCount(BigInt(tokenId));
    await this.redis.set(cacheKey, count.toString(), 'EX', CACHE_TTL);
    return count.toString();
  }
  async getComputeTokenId(castId: string): Promise<string> {
    const tokenId = await this.contract.computeTokenId(castId);
    return tokenId.toString();
  }
}

export const contract = ContractService.getInstance();
