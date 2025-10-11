/**
 * 🖼️ Image Proxy API Route
 * 
 * Resolve CORS e OpaqueResponseBlocking para imagens do WordPress
 * Adiciona cache headers para performance
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const imageUrl = searchParams.get('url')

  if (!imageUrl) {
    return NextResponse.json(
      { error: 'Missing url parameter' },
      { status: 400 }
    )
  }

  try {
    // Busca a imagem do servidor WordPress
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageProxy/1.0)',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const imageBuffer = await response.arrayBuffer()

    // Retorna com headers CORS corretos + cache
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // 1 ano
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    })
  } catch (error) {
    console.error('❌ Image proxy error:', error)
    
    // Retorna imagem placeholder em caso de erro
    return NextResponse.json(
      { error: 'Failed to load image' },
      { status: 500 }
    )
  }
}

export const runtime = 'edge' // Usa Edge Runtime para performance
