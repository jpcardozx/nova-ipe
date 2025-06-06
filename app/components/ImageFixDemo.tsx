'use client';

import { getImoveisDestaque } from '@/lib/queries';
import EnhancedImage from './EnhancedImage';
import { fixSanityImageReferences } from '@/lib/image-fix';
import { useEffect, useState } from 'react';

export default function ImageFixDemo() {
    const [imoveis, setImoveis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                // Buscar os imóveis normalmente
                const data = await getImoveisDestaque();

                // Para cada imóvel, corrigir as referências da imagem
                const processedImoveis = data.map(imovel => {
                    if (imovel.imagem) {
                        return {
                            ...imovel,
                            imagem: fixSanityImageReferences(imovel.imagem)
                        };
                    }
                    return imovel;
                });

                setImoveis(processedImoveis);

                // Log das estruturas processadas para debug
                console.log('Imóveis processados com fixSanityImageReferences:',
                    processedImoveis.map(i => ({
                        id: i._id,
                        temImagem: !!i.imagem,
                        props: i.imagem ? Object.keys(i.imagem) : [],
                        assetProps: i.imagem?.asset ? Object.keys(i.imagem.asset) : []
                    }))
                );

            } catch (err) {
                console.error('Erro ao buscar e processar imóveis:', err);
                setError(err instanceof Error ? err.message : 'Erro desconhecido');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) return <div className="p-8">Carregando imóveis...</div>;
    if (error) return <div className="p-8 text-red-600">Erro: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Demo: Correção de Imagens Sanity</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {imoveis.map((imovel) => (
                    <div key={imovel._id} className="border rounded-lg overflow-hidden shadow-sm">
                        {/* Cabeçalho com título */}
                        <div className="p-3 bg-gray-50 border-b">
                            <h3 className="font-medium">{imovel.titulo || 'Imóvel sem título'}</h3>
                        </div>

                        {/* Imagem com o novo componente */}
                        <div className="aspect-video relative">
                            <EnhancedImage
                                image={imovel.imagem}
                                alt={imovel.titulo}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                        </div>

                        {/* Propriedades básicas */}
                        <div className="p-4">
                            <p className="text-sm text-gray-600">{imovel.finalidade || ''} - {imovel.tipoImovel || ''}</p>
                            <p className="text-sm text-gray-600">{imovel.bairro || ''}, {imovel.cidade || ''}</p>
                            <p className="font-bold mt-1">
                                {typeof imovel.preco === 'number'
                                    ? `R$ ${imovel.preco.toLocaleString('pt-BR')}`
                                    : 'Preço não disponível'
                                }
                            </p>
                        </div>

                        {/* Debug: dados da imagem */}
                        <div className="p-2 bg-gray-50 border-t text-xs">
                            <p>Status da imagem:</p>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Tem imagem: {imovel.imagem ? 'Sim' : 'Não'}</li>
                                {imovel.imagem && (
                                    <>
                                        <li>Propriedades: {Object.keys(imovel.imagem).join(', ')}</li>
                                        <li>Tem URL: {imovel.imagem.url ? 'Sim' : 'Não'}</li>
                                        <li>Tem asset: {imovel.imagem.asset ? 'Sim' : 'Não'}</li>
                                        {imovel.imagem.asset && (
                                            <li>Asset ref: {imovel.imagem.asset._ref || 'N/A'}</li>
                                        )}
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
