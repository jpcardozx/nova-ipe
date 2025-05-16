// app/api/destaques/route.ts
import { NextResponse } from 'next/server'
import { getImovelEmDestaque } from '../../../lib/sanity/fetchImoveis'

// Função para normalizar a estrutura da imagem
function normalizarImageAPI(imovel: any) {
    const imovelProcessado = { ...imovel }

    if (imovel.imagem?.asset?.url) {
        imovelProcessado.imagemUrl = imovel.imagem.asset.url
    }

    if (imovel.imagemOpenGraph?.asset?.url) {
        imovelProcessado.imagemOpenGraphUrl = imovel.imagemOpenGraph.asset.url
    }

    return imovelProcessado
}

// Rota GET da API
export async function GET() {
    try {
        const imoveis = await getImovelEmDestaque()

        console.log('API destaques - primeiro imóvel:',
            imoveis[0]
                ? JSON.stringify({
                    id: imoveis[0]._id,
                    temImagem: !!imoveis[0].imagem,
                    formatoImagem: imoveis[0].imagem
                        ? Object.keys(imoveis[0].imagem)
                        : 'sem imagem',
                })
                : 'sem imóveis'
        )

        const imoveisProcessados = imoveis.map(normalizarImageAPI)

        return NextResponse.json(imoveisProcessados)
    } catch (err: any) {
        console.error('Erro no GET /api/destaques:', err?.message || err)
        console.error('Stack do erro:', err?.stack || 'stack não disponível')

        return NextResponse.json(
            {
                error: 'Erro ao buscar imóveis.',
                detail: err?.message || 'Sem detalhes',
            },
            { status: 500 }
        )
    }
}
