// app/api/destaques/route.ts
import { NextResponse } from 'next/server'
import { getFeaturedProperties, getAllProperties, Property } from '../../../lib/sanity/queries'

// Função para normalizar a estrutura da imagem
function normalizarImageAPI(imovel: Property) {
    const imovelProcessado = { ...imovel } as any

    if (imovel.imagem?.asset?.url) {
        imovelProcessado.imagemUrl = imovel.imagem.asset.url
    }

    if (imovel.imagemOpenGraph?.asset?.url) {
        imovelProcessado.imagemOpenGraphUrl = imovel.imagemOpenGraph.asset.url
    }

    return imovelProcessado
}

// Rota GET da API
export async function GET(request: Request) {
    try {
        // Extrair parâmetros da URL
        const { searchParams } = new URL(request.url)
        const finalidade = searchParams.get('finalidade')
        const destaque = searchParams.get('destaque')
        
        // Buscar todos os imóveis em destaque primeiro
        let imoveis = await getFeaturedProperties()
        
        // Se não há imóveis em destaque e foi solicitado uma finalidade específica, 
        // buscar todos os imóveis dessa finalidade
        if (imoveis.length === 0 && finalidade) {
            console.log('📋 Nenhum imóvel em destaque encontrado, buscando todos os imóveis da finalidade:', finalidade)
            
            // Importar as funções específicas por finalidade
            const todosImoveis = await getAllProperties()
            
            // Filtrar por finalidade
            imoveis = todosImoveis.filter((imovel: Property) => 
                imovel.finalidade && imovel.finalidade.toLowerCase() === finalidade.toLowerCase()
            ).slice(0, 12) // Limitar a 12 imóveis
        }

        // Aplicar filtros adicionais
        let imoveisFiltrados = imoveis
        
        if (finalidade && imoveis.length > 0) {
            imoveisFiltrados = imoveisFiltrados.filter(imovel => 
                imovel.finalidade && imovel.finalidade.toLowerCase() === finalidade.toLowerCase()
            )
        }
        
        if (destaque) {
            const isDestaque = destaque.toLowerCase() === 'true'
            imoveisFiltrados = imoveisFiltrados.filter(imovel => 
                Boolean(imovel.destaque) === isDestaque
            )
        }

        console.log('API destaques - finalidade:', finalidade)
        console.log('API destaques - destaque:', destaque)
        console.log('API destaques - total imóveis:', imoveis.length)
        console.log('API destaques - imóveis filtrados:', imoveisFiltrados.length)
        console.log('API destaques - primeiro imóvel filtrado:',
            imoveisFiltrados[0]
                ? JSON.stringify({
                    id: imoveisFiltrados[0]._id,
                    finalidade: imoveisFiltrados[0].finalidade,
                    temImagem: !!imoveisFiltrados[0].imagem,
                    formatoImagem: imoveisFiltrados[0].imagem
                        ? Object.keys(imoveisFiltrados[0].imagem)
                        : 'sem imagem',
                })
                : 'sem imóveis'
        )

        const imoveisProcessados = imoveisFiltrados.map(normalizarImageAPI)

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
