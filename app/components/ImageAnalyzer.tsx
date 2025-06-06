'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Tipos para imagens Sanity
 */
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

interface ImageAnalyzerProps {
    image: ImageObject | string | null | undefined;
    title?: string;
}

/**
 * Componente para analisar e diagnosticar imagens usando nosso sistema de monitoramento
 * Permite verificar, validar e corrigir problemas com imagens do Sanity
 */
export default function ImageAnalyzer({ image, title = 'Análise de Imagem' }: ImageAnalyzerProps) {
    const [validationResult, setValidationResult] = useState<{
        isValid: boolean;
        details: string[];
        fixedImage?: any;
    }>({ isValid: false, details: [] });
    const [isProcessing, setIsProcessing] = useState(false);
    const [showOriginal, setShowOriginal] = useState(true);
    const [imageUrl, setImageUrl] = useState('');
    const [fixedImageUrl, setFixedImageUrl] = useState('');
    const [expanded, setExpanded] = useState(false);

    // Verificar imagem usando o sistema de monitoramento
    useEffect(() => {
        async function validateImage() {
            try {
                setIsProcessing(true);

                // Importa dinamicamente os utilitários
                const {
                    isValidImageObject,
                    ensureValidImage
                } = await import('@/lib/image-monitor');

                // Avaliação básica da imagem
                const details: string[] = [];
                if (!image) {
                    details.push('❌ Objeto de imagem é nulo ou undefined');
                    setValidationResult({ isValid: false, details });
                    return;
                }

                if (typeof image !== 'object') {
                    details.push(`⚠️ Imagem não é um objeto (é ${typeof image})`);
                }

                // Verifica as propriedades da imagem
                if (typeof image === 'object') {
                    const props = Object.keys(image);
                    details.push(`ℹ️ Propriedades: ${props.join(', ')}`);

                    if (image.url) {
                        details.push('✓ Tem URL direta');
                        setImageUrl(image.url);
                    }

                    if (image.asset) {
                        details.push('✓ Tem asset');

                        if (image.asset._ref) {
                            details.push('✓ Asset tem referência');
                        } else {
                            details.push('❌ Asset sem referência');
                        }

                        if (image.asset.url) {
                            details.push('✓ Asset tem URL');
                        }
                    } else {
                        details.push('❌ Não tem asset');
                    }
                }

                // Validar se a imagem está completa
                const isValid = isValidImageObject(image);
                details.push(isValid ? '✅ Imagem válida e completa' : '❌ Imagem incompleta');

                // Se inválida, tenta corrigir
                let fixedImage;
                if (!isValid) {
                    details.push('⚙️ Aplicando correções...');
                    fixedImage = ensureValidImage(image);

                    // Verifica se a correção funcionou
                    const isFixedValid = isValidImageObject(fixedImage);
                    details.push(isFixedValid
                        ? '✅ Correção bem-sucedida'
                        : '❌ Correção não resolveu todos os problemas');

                    // Extrai URL da imagem corrigida
                    if (fixedImage) {
                        const url = fixedImage.url ||
                            (fixedImage.asset?.url) ||
                            '';
                        setFixedImageUrl(url);
                    }
                }

                setValidationResult({
                    isValid,
                    details,
                    fixedImage: fixedImage
                });
            } catch (error) {
                console.error('Erro ao analisar imagem:', error);
                setValidationResult({
                    isValid: false,
                    details: [`❌ Erro durante análise: ${error instanceof Error ? error.message : String(error)}`]
                });
            } finally {
                setIsProcessing(false);
            }
        }

        validateImage();
    }, [image]);

    return (
        <div className="border rounded-lg overflow-hidden mb-4">
            {/* Cabeçalho com status */}
            <div className={cn(
                "p-3 flex justify-between items-center",
                validationResult.isValid ? "bg-green-50" : "bg-amber-50"
            )}>
                <div>
                    <h3 className="font-medium">{title}</h3>
                    {!isProcessing && (
                        <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            validationResult.isValid ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                        )}>
                            {validationResult.isValid ? 'Válida' : 'Requer correção'}
                        </span>
                    )}
                </div>

                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs px-3 py-1.5 bg-white rounded shadow-sm hover:bg-gray-50"
                >
                    {expanded ? 'Ocultar detalhes' : 'Ver detalhes'}
                </button>
            </div>

            {/* Corpo expandido */}
            {expanded && (
                <div className="p-4 bg-white">
                    {/* Resultado da verificação */}
                    <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Diagnóstico:</h4>
                        <div className="bg-gray-50 rounded p-3 text-sm">
                            {isProcessing ? (
                                <p className="text-gray-500">Analisando imagem...</p>
                            ) : (
                                <ul className="space-y-1">
                                    {validationResult.details.map((detail, i) => (
                                        <li key={i}>{detail}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Visualização de imagens */}
                    {(imageUrl || fixedImageUrl) && (
                        <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Visualização:</h4>

                            <div className="flex space-x-3">
                                {validationResult.fixedImage && (
                                    <div className="flex space-x-2 mb-3 items-center">
                                        <span className="text-sm">Mostrar:</span>
                                        <button
                                            onClick={() => setShowOriginal(true)}
                                            className={cn(
                                                "px-2 py-1 text-xs rounded",
                                                showOriginal ? "bg-blue-100 text-blue-800" : "bg-gray-100"
                                            )}
                                        >
                                            Original
                                        </button>
                                        <button
                                            onClick={() => setShowOriginal(false)}
                                            className={cn(
                                                "px-2 py-1 text-xs rounded",
                                                !showOriginal ? "bg-blue-100 text-blue-800" : "bg-gray-100"
                                            )}
                                        >
                                            Corrigida
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {showOriginal ? (
                                    <div className="rounded overflow-hidden border">
                                        <div className="bg-gray-100 px-3 py-2 text-xs font-medium">
                                            Imagem Original
                                        </div>
                                        <div className="aspect-video relative">
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt="Imagem original"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                                                    Sem imagem disponível
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded overflow-hidden border">
                                        <div className="bg-green-100 px-3 py-2 text-xs font-medium">
                                            Imagem Corrigida
                                        </div>
                                        <div className="aspect-video relative">
                                            {fixedImageUrl ? (
                                                <Image
                                                    src={fixedImageUrl}
                                                    alt="Imagem corrigida"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                                                    Sem correção disponível
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Dados técnicos */}
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium mb-2">Objeto Original:</h4>
                            <div className="bg-slate-800 text-white p-3 rounded text-xs overflow-auto max-h-48">
                                <pre>{JSON.stringify(image, null, 2)}</pre>
                            </div>
                        </div>

                        {validationResult.fixedImage && (
                            <div>
                                <h4 className="text-sm font-medium mb-2">Objeto Corrigido:</h4>
                                <div className="bg-slate-800 text-white p-3 rounded text-xs overflow-auto max-h-48">
                                    <pre>{JSON.stringify(validationResult.fixedImage, null, 2)}</pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
