import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

// Cliente com token de escrita
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN, // Token de escrita
  apiVersion: '2024-01-01',
  useCdn: false
})

export async function POST(request: NextRequest) {
  try {
    const { mutations } = await request.json()

    if (!mutations || !Array.isArray(mutations)) {
      return NextResponse.json(
        { error: 'Mutations array is required' },
        { status: 400 }
      )
    }

    if (!process.env.SANITY_API_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'SANITY_API_WRITE_TOKEN não configurado' },
        { status: 500 }
      )
    }

    const result = await writeClient.mutate(mutations)

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Erro na mutação do Sanity:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}