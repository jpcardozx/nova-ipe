'use client';

import { useState, useEffect } from 'react';
import { getImoveisDestaque } from '@/lib/queries';
import SanityImage from '../components/SanityImage';
import { ImageDiagnostic } from '../components/ImageDiagnostic';
import { DiagnosticImage } from '../components/DiagnosticImage';
import SanityImageDebugger from '../components/SanityImageDebugger';
import SerializationTest from '../components/SerializationTest';

export default function DebugImagesPage() {
    const [activeTab, setActiveTab] = useState<'imagens' | 'serializacao'>('imagens');
    const [imoveis, setImoveis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    useEffect(() => {
        async function loadData() {
            try {
                addLog('Buscando imóveis de destaque...');
                const data = await getImoveisDestaque();
                addLog(`Recebidos ${data.length} imóveis`);
                setImoveis(data);

                // Debug no console para cada imóvel
                data.forEach((imovel: any, index: number) => {
                    console.log(`Imóvel ${index + 1}:`, {
                        id: imovel._id,
                        temImagem: !!imovel.imagem,
                        imagemProps: imovel.imagem ? Object.keys(imovel.imagem) : [],
                        temAsset: !!imovel.imagem?.asset,
                        assetProps: imovel.imagem?.asset ? Object.keys(imovel.imagem.asset) : [],
                        temAssetRef: !!imovel.imagem?.asset?._ref,
                        assetRef: imovel.imagem?.asset?._ref || 'não disponível'
                    });
                    addLog(`Analisando imóvel ${index + 1}: ${imovel.titulo || 'Sem título'}`);
                    addLog(`- Tem imagem: ${!!imovel.imagem}`);
                    if (imovel.imagem) {
                        addLog(`- Propriedades da imagem: ${Object.keys(imovel.imagem).join(', ')}`);
                        addLog(`- Tem asset: ${!!imovel.imagem.asset}`);
                        if (imovel.imagem.asset) {
                            addLog(`- Propriedades do asset: ${Object.keys(imovel.imagem.asset).join(', ')}`);
                        }
                    }
                });
            } catch (error) {
                console.error('Erro ao carregar imóveis:', error);
                addLog(`Erro: ${error instanceof Error ? error.message : String(error)}`);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Diagnóstico de Imagens Sanity</h1>

            {loading ? (
                <p>Carregando imóveis...</p>
            ) : (
                <>
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Logs de Diagnóstico:</h2>
                        <div className="bg-gray-100 p-4 rounded-lg h-64 overflow-y-auto">
                            {logs.map((log, i) => (
                                <pre key={i} className="text-sm">{log}</pre>
                            ))}
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-4">Galeria de Diagnóstico ({imoveis.length} imóveis):</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {imoveis.map((imovel, index) => (
                            <div key={imovel._id || index} className="border rounded-lg p-4">
                                <h3 className="font-medium mb-2">{imovel.titulo || `Imóvel ${index + 1}`}</h3>

                                {/* Informações de debug da imagem */}
                                <div className="mb-4 text-xs bg-gray-50 p-2 rounded">
                                    <p>ID: {imovel._id}</p>
                                    <p>Tipo de imagem: {typeof imovel.imagem}</p>
                                    <p>Tem asset: {imovel.imagem?.asset ? 'Sim' : 'Não'}</p>
                                    {imovel.imagem?.asset && (
                                        <p>Asset ref: {imovel.imagem.asset._ref || 'Não disponível'}</p>
                                    )}
                                </div>
                                {/* Componente de diagnóstico detalhado */}
                                <ImageDiagnostic
                                    image={imovel.imagem}
                                    title={`Diagnóstico: ${imovel.titulo || 'Imóvel sem título'}`}
                                />
                                {/* Teste de renderização da imagem */}
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <div className="aspect-video bg-gray-200 relative rounded overflow-hidden">
                                        <h4 className="absolute top-0 left-0 bg-black/50 text-white text-xs p-1">SanityImage</h4>
                                        {imovel.imagem ? (
                                            <SanityImage
                                                image={imovel.imagem}
                                                alt={imovel.titulo || 'Imagem do imóvel'}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <p>Sem imagem</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="aspect-video bg-gray-200 relative rounded overflow-hidden">
                                        <h4 className="absolute top-0 left-0 bg-black/50 text-white text-xs p-1">DiagnosticImage</h4>
                                        {imovel.imagem ? (
                                            <DiagnosticImage
                                                image={imovel.imagem}
                                                alt={imovel.titulo || 'Imagem do imóvel'}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <p>Sem imagem</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Informações adicionais do imóvel */}
                                <div className="text-sm">
                                    <p>{imovel.finalidade} - {imovel.tipoImovel}</p>
                                    <p>{imovel.bairro}, {imovel.cidade}</p>
                                    <p className="font-bold">
                                        {typeof imovel.preco === 'number'
                                            ? `R$ ${imovel.preco.toLocaleString('pt-BR')}`
                                            : 'Preço não disponível'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
