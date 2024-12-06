import { NextRequest } from 'next/server'
import { generateNFTMetadata } from '../../../lib/api/nft'
import { notFound } from 'next/navigation'
import generateCastCard from '@/components/nft/generateNft'
import { api } from '@/lib/api'

// Validate the format: only digits followed by .json
const isValidJSONRequest = (slug: string) => /^\d+\.json$/.test(slug)
const isValidSvgRequest = (slug: string) => /^0x[0-9a-fA-F]{40}\.svg$/.test(slug);

const generateCastCardFromHash = async (hash: string) => {
  const cast = await api.getPost(hash);
  if (!cast) {
    throw new Error("Cast not found");
  }

  return generateCastCard(cast);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  if (params.slug.length !== 1) {
    notFound()
  }
  const isJsonRequest = isValidJSONRequest(params.slug[0]);
  const isSvgRequest = isValidSvgRequest(params.slug[0]);
  // Validate both length and format
  if (!isJsonRequest && !isSvgRequest) {
    notFound()
  }

  try {
    // Get the ID from the slug array
    const idWithExtension = params.slug[0] // We know it's valid at this point
    const idOrHash = idWithExtension.replace(/\.json$/, '').replace(/\.svg$/, '');
    
    if (!idOrHash) {
      notFound()
    }
    if (isJsonRequest) {
        const host = request.headers.get('host');
        const protocol = request.headers.get('x-forwarded-proto') || 'https';
        const domain = host ? `${protocol}://${host}` : undefined;
    
        const metadata = await generateNFTMetadata(idOrHash, domain)

        return new Response(
          JSON.stringify(metadata),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'public, max-age=31536000, immutable'
            }
          }
        )
    } else if (isSvgRequest) {
        const svg = await generateCastCardFromHash(idOrHash)
        return new Response(svg, {
            status: 200,
            headers: { 'Content-Type': 'image/svg+xml' }
        })
    }

  } catch (error: unknown) { // Type assertion to any to handle error.message
    console.error('Error generating NFT metadata:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate metadata', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
} 