'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/optimized-sanity-image';
import { extractImageUrl } from '@/lib/image-sanity';
import { ensureValidImageUrl } from '@/lib/sanity-image-utils';

// Interface para o objeto de imagem
interface ImageObject {
    _type?: string;
    alt?: string;
    url?: string;
    imagemUrl?: string;
    hotspot?: {
        x: number;
        y: number;
    };
    asset?: {
        _ref?: string;
        url?: string;
        _type?: string;
    };
}

interface ImageDiagnosticProps {
    image: ImageObject | string | null | undefined;
    title?: string;
}

// Componente para vizualizar todas as estratégias de processamento de imagens
export function ImageDiagnostic({ image, title = 'Diagnóstico da Imagem' }: ImageDiagnosticProps) {
    const [viewMode, setViewMode] = useState<'metadata' | 'preview'>('metadata');
    // Estados para o monitoramento
    const [validationStatus, setValidationStatus] = useState<'pending' | 'valid' | 'invalid'>('pending');
    const [fixAttempted, setFixAttempted] = useState(false);
    const [fixedImage, setFixedImage] = useState<any>(null);

    // Garante que não haverá erros mesmo se a imagem for indefinida
    if (!image) {
        return (
            <div className="border p-4 rounded-lg mb-4 bg-red-50">
                <h3 className="font-bold text-red-600">Imagem não definida</h3>
                <p className="text-sm text-red-700 mt-2">
                    O objeto de imagem é nulo ou indefinido. Verifique se a consulta GROQ está retornando os dados de imagem corretamente.
                </p>
            </div>
        );
    }

    // Validação utilizando o sistema de monitoramento
    const runImageValidation = async () => {
        try {
            // Importar dinamicamente o sistema de monitoramento
            const { isValidImageObject, ensureValidImage } = await import('@/lib/image-monitor');

            // Verificar se a imagem é válida
            const isValid = isValidImageObject(image);
            setValidationStatus(isValid ? 'valid' : 'invalid');

            // Se não for válida, tentar corrigir
            if (!isValid && !fixAttempted) {
                const corrected = ensureValidImage(image);
                setFixedImage(corrected);
                setFixAttempted(true);
            }
        } catch (error) {
            console.error('Erro ao validar imagem:', error);
        }
    };    // Obtém URLs usando diferentes estratégias para comparação
    const standardUrl = typeof image === 'string' ? image : image.url || image.imagemUrl || '';
    let sanityExtractedUrl = '';
    let normalizedImageResult: any = null; try {
        if (typeof image === 'object' && image && image.asset && image.asset._ref) {
            const extractedUrl = extractImageUrl(image);
            sanityExtractedUrl = extractedUrl || '';
        }

        // Tenta a função robusta
        normalizedImageResult = ensureValidImageUrl(image);
    } catch (error) {
        console.error('Erro ao processar imagem para diagnóstico:', error);
    }

    // Pega a URL final otimizada
    const optimizedUrl = getImageUrl(image);

    // Prepara os dados de diagnóstico
    const metadata = {
        tipoImagem: typeof image,
        estrutura: typeof image === 'object' ? Object.keys(image) : [],
        temAsset: typeof image === 'object' && !!image.asset,
        estruturaAsset: typeof image === 'object' && image.asset ? Object.keys(image.asset) : [],
        temRef: typeof image === 'object' && image.asset && !!image.asset._ref,
        refValue: typeof image === 'object' && image.asset && image.asset._ref ? image.asset._ref : 'N/A',
        estrategias: {
            urlDireta: standardUrl,
            extractImageUrl: sanityExtractedUrl,
            ensureValidImageUrl: normalizedImageResult ? normalizedImageResult.url : 'falhou',
            getImageUrl: optimizedUrl,
        }
    };

    return (
        <div className="border rounded-lg overflow-hidden mb-6">
            <div className="bg-gray-100 p-3 flex justify-between items-center">
                <h3 className="font-semibold">{title}</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('metadata')}
                        className={`px-2 py-1 text-sm rounded ${viewMode === 'metadata' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Metadados
                    </button>
                    <button
                        onClick={() => setViewMode('preview')}
                        className={`px-2 py-1 text-sm rounded ${viewMode === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Visualização
                    </button>
                </div>
            </div>

            {viewMode === 'metadata' ? (
                <div className="p-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-1">Estrutura:</h4>
                            <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                                <p>Tipo: {metadata.tipoImagem}</p>
                                {metadata.tipoImagem === 'object' && (
                                    <>
                                        <p>Propriedades: {metadata.estrutura.join(', ')}</p>
                                        <p>Tem asset: {metadata.temAsset ? 'Sim' : 'Não'}</p>
                                        {metadata.temAsset && (
                                            <>
                                                <p>Propriedades asset: {metadata.estruturaAsset.join(', ')}</p>
                                                <p>Tem referência: {metadata.temRef ? 'Sim' : 'Não'}</p>
                                                <p>Valor da ref: {metadata.refValue}</p>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-1">Resultados de cada estratégia:</h4>
                            <div className="grid grid-cols-1 gap-2">
                                <div className="bg-gray-50 p-2 rounded text-xs">
                                    <p className="font-semibold">URL Direta:</p>
                                    <p className="truncate">{metadata.estrategias.urlDireta || 'Não disponível'}</p>
                                </div>

                                <div className="bg-gray-50 p-2 rounded text-xs">
                                    <p className="font-semibold">extractImageUrl:</p>
                                    <p className="truncate">{metadata.estrategias.extractImageUrl || 'Não disponível'}</p>
                                </div>

                                <div className="bg-gray-50 p-2 rounded text-xs">
                                    <p className="font-semibold">ensureValidImageUrl:</p>
                                    <p className="truncate">{metadata.estrategias.ensureValidImageUrl || 'Não disponível'}</p>
                                </div>

                                <div className={`p-2 rounded text-xs ${optimizedUrl.includes('placeholder') ? 'bg-red-100' : 'bg-green-50'}`}>
                                    <p className="font-semibold">getImageUrl (final):</p>
                                    <p className="truncate">{optimizedUrl}</p>
                                    {optimizedUrl.includes('placeholder') && (
                                        <p className="text-red-600 mt-1">⚠️ URL de fallback detectada!</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-medium mb-1">Resultado getImageUrl:</p>
                            <div className="aspect-video relative bg-gray-100 rounded overflow-hidden">
                                {optimizedUrl && !optimizedUrl.includes('placeholder') ? (
                                    <Image
                                        src={optimizedUrl}
                                        alt="Imagem otimizada"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-red-500">
                                        Imagem não disponível
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-medium mb-1">Diretamente da referência:</p>
                            <div className="aspect-video relative bg-gray-100 rounded overflow-hidden">
                                {sanityExtractedUrl ? (
                                    <Image
                                        src={sanityExtractedUrl}
                                        alt="Imagem da referência"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-red-500">
                                        Não foi possível extrair URL
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ImageDiagnosticPage() {
    return (
        <div>
            <h1>Diagnóstico de Imagens</h1>
            <p>Esta página permite diagnóstico de imagens individuais.</p>
        </div>
    );
}
