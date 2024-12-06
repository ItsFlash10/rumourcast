import { ethers } from 'ethers';
import { Redis } from 'ioredis';
import { ABI } from './contract_abi';

const redis = new Redis(process.env.REDIS_URL as string);
const CACHE_TTL = 60 * 60 * 24; // 24 hours

class ContractService {
  private readonly contract: ethers.Contract;
  private static instance: ContractService;

  private constructor(contractAddress: string, rpcUrl: string) {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    this.contract = new ethers.Contract(contractAddress, ABI, provider);
  }

  static getInstance(): ContractService {
    if (!ContractService.instance) {
      const contractAddress = process.env.CONTRACT_ADDRESS;
      const rpcUrl = process.env.RPC_URL;
      
      if (!contractAddress || !rpcUrl) {
        throw new Error("CONTRACT_ADDRESS and RPC_URL environment variables must be set");
      }
      
      ContractService.instance = new ContractService(contractAddress, rpcUrl);
    }
    return ContractService.instance;
  }

  async getCastId(tokenId: string): Promise<string> {
    try {
      // Convert to bigint
      const tokenIdBigInt = BigInt(tokenId);

      // Check cache first
      const cacheKey = `castId:${tokenIdBigInt}`;
      const cachedValue = await redis.get(cacheKey);
      
      if (cachedValue) {
        return cachedValue;
      }

      // If not in cache, get from contract
      const castId = await this.contract.getCastId(tokenIdBigInt);
      
      // Cache the result
      if (castId) {
        await redis.set(cacheKey, castId, 'EX', CACHE_TTL);
      }
      
      return castId;
    } catch (error) {
      // Treat any error as 404
      throw new Error("Cast ID not found");
    }
  }
}

export const contract = ContractService.getInstance();
