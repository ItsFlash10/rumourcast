import { NextRequest } from 'next/server'
import { generateNFTMetadata } from '../../../lib/api/nft'
import { notFound } from 'next/navigation'

// Validate the format: only digits followed by .json
const isValidNFTRequest = (slug: string) => /^\d+\.json$/.test(slug)

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  // Validate both length and format
  if (params.slug.length !== 1 || !isValidNFTRequest(params.slug[0])) {
    notFound()
  }

  try {
    // Get the ID from the slug array
    const idWithExtension = params.slug[0] // We know it's valid at this point
    const id = idWithExtension.replace(/\.json$/, '')
    
    if (!id) {
      notFound()
    }
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const domain = host ? `${protocol}://${host}` : undefined;

    const metadata = await generateNFTMetadata(id, domain)
    
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