import { ERC1155Metadata } from './types'
import { api } from '.';

export const generateNFTMetadata = async (id: string, domain: string = "https://rumourcast.xyz"): Promise<ERC1155Metadata> => {
  // Ensure id is padded to 64 hex characters without 0x prefix
  const cast = await api.getPostByNftId(id);
  if (!cast) {
    throw new Error("Cast not found");
  }
  const trimmedCast = cast.text.substring(0, 100) + (cast.text.length > 100 ? '...' : '');
  
  return {
    name: trimmedCast,
    decimals: 0,
    description: "This NFT represents a unique cast in the system",
    image: `${domain}/nft/${id}.svg`,
    properties: {
      id: {
        name: "Token ID",
        value: id,
        display_value: id,
        class: "emphasis"
      },
      cast: {
        name: "Cast Data",
        value: cast,
        display_value: trimmedCast,
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
