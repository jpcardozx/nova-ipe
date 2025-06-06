import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

// Inicializa o cliente do Sanity
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0nks58lj',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false, // Garantir que temos a versão mais recente
    apiVersion: '2023-05-03', // Usar uma versão recente da API
    token: process.env.SANITY_API_TOKEN // Token de API para acesso de escrita
});

/**
 * API para corrigir problemas com referências de imagens quebradas
 * Este endpoint pode ser chamado para corrigir imagens específicas
 * 
 * Body esperado:
 * {
 *   propertyId: string,    // ID do imóvel a corrigir
 *   fixType: "placeholder" | "regenerate" | "reference",
 *   replacementRef?: string  // Referência de substituição (quando fixType === "reference")
 * }
 */
export async function POST(req: NextRequest) {
    try {
        // Verificar autenticação/autorização
        // (implementação simplificada, deve ser melhorada em produção)
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ') ||
            authHeader.replace('Bearer ', '') !== process.env.API_SECRET_KEY) {
            return NextResponse.json(
                { success: false, message: 'Acesso não autorizado' },
                { status: 401 }
            );
        }

        // Obter dados do corpo
        const body = await req.json();
        const { propertyId, fixType, replacementRef } = body;

        // Validação básica
        if (!propertyId) {
            return NextResponse.json(
                { success: false, message: 'ID do imóvel é obrigatório' },
                { status: 400 }
            );
        }

        if (!['placeholder', 'regenerate', 'reference'].includes(fixType)) {
            return NextResponse.json(
                { success: false, message: 'Tipo de correção inválido' },
                { status: 400 }
            );
        }

        // Obter documento atual
        const imovel = await client.getDocument(propertyId);
        if (!imovel) {
            return NextResponse.json(
                { success: false, message: 'Imóvel não encontrado' },
                { status: 404 }
            );
        }

        // Aplicar correção baseada no tipo
        switch (fixType) {
            case 'placeholder': {
                // Substituir por um placeholder genérico pré-existente no Sanity
                await client
                    .patch(propertyId)
                    .set({
                        imagem: {
                            _type: 'image',
                            asset: {
                                _type: 'reference',
                                _ref: 'image-placeholder-default-jpg'  // Este deve ser um ID real no seu dataset
                            }
                        }
                    })
                    .commit();
                break;
            }

            case 'reference': {
                // Substituir por uma referência específica
                if (!replacementRef) {
                    return NextResponse.json(
                        { success: false, message: 'Referência de substituição é necessária' },
                        { status: 400 }
                    );
                }

                await client
                    .patch(propertyId)
                    .set({
                        imagem: {
                            _type: 'image',
                            asset: {
                                _type: 'reference',
                                _ref: replacementRef
                            }
                        }
                    })
                    .commit();
                break;
            }

            case 'regenerate': {
                // Tenta buscar uma imagem do imóvel de outra fonte (galeria, imagens secundárias, etc)
                // Implementação depende da estrutura específica dos seus documentos Sanity

                // Exemplo: usar primeira imagem da galeria como imagem principal
                if (imovel.galeria && imovel.galeria.length > 0 && imovel.galeria[0].asset?._ref) {
                    await client
                        .patch(propertyId)
                        .set({
                            imagem: {
                                _type: 'image',
                                asset: {
                                    _type: 'reference',
                                    _ref: imovel.galeria[0].asset._ref
                                }
                            }
                        })
                        .commit();
                } else {
                    return NextResponse.json(
                        { success: false, message: 'Não foi possível regenerar a imagem' },
                        { status: 400 }
                    );
                }
                break;
            }
        }

        // Registrar ação para fins de auditoria
        await client
            .create({
                _type: 'imageFixLog',
                propertyId,
                fixType,
                timestamp: new Date().toISOString(),
                replacementRef: fixType === 'reference' ? replacementRef : undefined
            });

        return NextResponse.json({
            success: true,
            message: `Imagem do imóvel ${propertyId} corrigida com sucesso`,
            fixType
        });

    } catch (error: any) {
        console.error('Erro ao corrigir imagem:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'Erro ao processar solicitação',
                error: error.message
            },
            { status: 500 }
        );
    }
}
