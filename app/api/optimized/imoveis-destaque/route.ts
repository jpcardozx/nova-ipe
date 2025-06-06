import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from 'next-sanity';
import { projectId, dataset, apiVersion } from '@/studio/env';

// Removed edge runtime to support @sanity/client
export const revalidate = 3600; // Revalidate hourly

// Create edge-compatible Sanity client
const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Use CDN for better edge performance
});

export async function GET(req: NextRequest) {
  try {
    // Optimized Sanity query for featured properties
    const query = `*[_type == "imovel" && destaque == true && status == "disponivel"] | order(_createdAt desc)[0...6] {
      _id, titulo, slug, preco, finalidade, tipoImovel, 
      bairro, cidade, dormitorios, banheiros, areaUtil, vagas, destaque,
      "imagem": { "asset": imagem.asset->, "_type": "image", "alt": imagem.alt, "url": imagem.asset->url }
    }`;

    const data = await sanityClient.fetch(query);

    // Set appropriate caching headers
    const response = NextResponse.json(data);
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured properties' },
      { status: 500 }
    );
  }
}
