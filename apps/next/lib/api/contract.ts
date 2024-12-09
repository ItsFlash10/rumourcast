import { ContractTransactionReceipt, ethers, Signer } from 'ethers';
import {api } from "."
class ContractService {
  private readonly contract: ethers.Contract;
  private static instance: ContractService;

  private constructor(
    signer: Signer
  ) {
    this.contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      [{
          "inputs": [
              {
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
              },
              {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
              },
              {
                  "internalType": "uint256",
                  "name": "quantity",
                  "type": "uint256"
              }
          ],
          "name": "mint",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
      }],
      signer
    );
  }
  static getBrowserInstance(signer: Signer): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService(
        signer
      );
    }
    return ContractService.instance;
  }

  async mint(
    to: string,
    tokenId: bigint,
    quantity: bigint
  ):  Promise<null | ContractTransactionReceipt> {
      if (quantity <= 0) {
        throw new Error('Quantity must be a positive number');
      }
      if (!ethers.isAddress(to)) {
        throw new Error('Invalid recipient address');
      }

      try {
        const mintPrice = await api.getMintPrice();
        const maxMintLimit = await api.getMaxMintLimit();
        const currentMintCount = await api.getTokenMintCount(tokenId.toString());
        if (!mintPrice || !maxMintLimit ){
          throw new Error("Contract not initialized")
        }
        if (!currentMintCount) {
          throw new Error("Token not generated.")
        }
        if (BigInt(currentMintCount) + quantity > BigInt(maxMintLimit)) {
          throw new Error('Mint limit would be exceeded');
        }

        const totalPayment = BigInt(mintPrice) * quantity;
        const tx = await this.contract.mint(
          to,
          tokenId,
          quantity,
          {
            value: totalPayment
          }
        );

        return await tx.wait();
      } catch (error) {
        console.error(error);
        throw new Error(`Mint failed`);
      }
    }
}

export const getContract = (signer: Signer) => {
  return ContractService.getBrowserInstance(signer);
}
