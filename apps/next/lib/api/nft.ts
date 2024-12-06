import { ERC1155Metadata } from './types'
import type { Cast } from "../types"

const getCastForTokenId = async (id: string): Promise<Cast> => {
  // TODO: Implement this
  return {
    text: "Hello, world!",
    author: {
      username: "testuser"
    },
    timestamp: new Date().toISOString()
  } as Cast
};

export const generateNFTMetadata = async (id: string): Promise<ERC1155Metadata> => {
  // Ensure id is padded to 64 hex characters without 0x prefix
  const cast = await getCastForTokenId(id);
  
  return {
    name: `I heard a rumour...`,
    decimals: 0,
    description: "This NFT represents a unique cast in the system",
    image: `https://rumourcast.xyz/nft/${id}.svg`,
    properties: {
      id: {
        name: "Token ID",
        value: id,
        display_value: `#${parseInt(id, 16)}`,
        class: "emphasis"
      },
      cast: {
        name: "Cast Data",
        value: cast,
        display_value: cast.text.substring(0, 100) + (cast.text.length > 100 ? '...' : ''),
        class: "cast-data"
      },
      author: {
        name: "Author",
        value: cast.author,
        display_value: `@${cast.author.username}`,
        class: "author"
      },
      timestamp: {
        name: "Created At",
        value: cast.timestamp,
        display_value: new Date(cast.timestamp).toLocaleString(),
        class: "timestamp"
      }
    }
  }
};
