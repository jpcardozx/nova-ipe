'use client';

import { useState, useEffect } from 'react';
import { getImoveisDestaque } from '@/lib/queries';
import SanityImage from '../components/SanityImage';
import EnhancedImage from '../components/EnhancedImage';
import ImageAnalyzer from '../components/ImageAnalyzer';
import Link from 'next/link';
import { fixSanityImageReferences } from '@/lib/image-fix';

export default function ImagesComparePage() {
    const [imoveis, setImoveis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [processedImages, setProcessedImages] = useState<any[]>([]);
    const [showInstruction, setShowInstruction] = useState(true);

    // Carregar imóveis como exemplo
    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const data = await getImoveisDestaque();
                setImoveis(data);

                // Processar as imagens
                if (data && data.length > 0) {
                    const processed = data.map(imovel => {
                        if (!imovel.imagem) return { original: null, fixed: null };

                        return {
                            original: imovel.imagem,
                            fixed: fixSanityImageReferences(imovel.imagem)
                        };
                    });

                    setProcessedImages(processed);
                }
            } catch (error) {
                console.error('Erro ao carregar imóveis para comparação:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // Selecionar um imóvel específico
    const selectImovel = (index: number) => {
        setSelectedIndex(index);
    };

    // Conteúdo principal
    const renderContent = () => {
        if (loading) {
            return <div className="text-center p-8">Carregando imagens para comparação...</div>;
        }

        if (imoveis.length === 0) {
            return (
                <div className="text-center p-8">
                    <h2 className="text-xl font-bold text-red-600">Sem imóveis disponíveis</h2>
                    <p className="mt-2">Não foi possível carregar imóveis para comparação.</p>
                </div>
            );
        }

        const selectedImovel = imoveis[selectedIndex];
        const processedImage = processedImages[selectedIndex];

        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Painel de análise */}
                <div>
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <h2 className="font-bold text-lg mb-2">{selectedImovel.titulo}</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            {selectedImovel.tipoImovel} para {selectedImovel.finalidade} em {selectedImovel.bairro}, {selectedImovel.cidade}
                        </p>

                        <ImageAnalyzer
                            image={processedImage?.original}
                            title="Análise da Imagem"
                        />
                    </div>
                </div>

                {/* Comparação de componentes */}
                <div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="font-bold text-lg mb-4">Comparação de Componentes</h2>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Componente SanityImage */}
                            <div>
                                <h3 className="font-medium text-sm text-gray-700 mb-2">Componente SanityImage:</h3>
                                <div className="aspect-video relative border border-gray-200 rounded-md overflow-hidden">
                                    <SanityImage
                                        image={processedImage?.original}
                                        alt={selectedImovel.titulo}
                                        fill
                                    />
                                </div>
                            </div>

                            {/* Componente EnhancedImage */}
                            <div>
                                <h3 className="font-medium text-sm text-gray-700 mb-2">Componente EnhancedImage:</h3>
                                <div className="aspect-video relative border border-gray-200 rounded-md overflow-hidden">
                                    <EnhancedImage
                                        image={processedImage?.original}
                                        alt={selectedImovel.titulo}
                                        fill
                                    />
                                </div>
                            </div>

                            {/* Imagem Corrigida */}
                            <div>
                                <h3 className="font-medium text-sm text-gray-700 mb-2">Com fixSanityImageReferences:</h3>
                                <div className="aspect-video relative border border-gray-200 rounded-md overflow-hidden">
                                    <EnhancedImage
                                        image={processedImage?.fixed}
                                        alt={selectedImovel.titulo}
                                        fill
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4 py-6">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Comparação de Soluções de Imagem</h1>
                    <p className="text-gray-600">Compare diferentes componentes e técnicas de renderização de imagens do Sanity</p>
                </div>

                <div className="mt-4 md:mt-0 flex space-x-3">
                    <Link
                        href="/debug-images"
                        className="px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                    >
                        Ver Diagnósticos
                    </Link>
                    <Link
                        href="/fixed-images"
                        className="px-3 py-2 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100"
                    >
                        Ver Demo de Imagens Fixadas
                    </Link>
                </div>
            </div>

            {/* Instrução de uso */}
            {showInstruction && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="font-bold text-blue-800">Como usar este comparador:</h3>
                            <ol className="list-decimal ml-5 mt-2 text-sm space-y-1 text-blue-800">
                                <li>Selecione um imóvel na lista abaixo para comparar</li>
                                <li>Analise a estrutura da imagem original no painel esquerdo</li>
                                <li>Compare os três componentes de imagem no painel direito</li>
                                <li>Observe como cada componente lida com diferentes problemas</li>
                            </ol>
                        </div>
                        <button
                            className="text-blue-600 text-sm"
                            onClick={() => setShowInstruction(false)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            {/* Seleção de imóvel */}
            {!loading && imoveis.length > 0 && (
                <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                    <h2 className="font-medium mb-3">Selecione um imóvel para análise:</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {imoveis.map((imovel, index) => (
                            <div
                                key={imovel._id}
                                className={`cursor-pointer border rounded-lg overflow-hidden ${selectedIndex === index ? 'ring-2 ring-blue-500' : ''
                                    }`}
                                onClick={() => selectImovel(index)}
                            >
                                <div className="aspect-square relative">
                                    <SanityImage
                                        image={imovel.imagem}
                                        alt={imovel.titulo}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-2 bg-gray-50 text-xs truncate">
                                    {imovel.titulo || `Imóvel ${index + 1}`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Conteúdo principal */}
            {renderContent()}
        </div>
    );
}
