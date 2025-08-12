'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn, Maximize2 } from 'lucide-react';

interface GaleriaImovelProps {
    imagemPrincipal: string;
    galeria: Array<{ imagemUrl: string; alt?: string }>;
    titulo: string;
}

export function GaleriaImovel({ imagemPrincipal, galeria, titulo }: GaleriaImovelProps) {
    const [imagemAtiva, setImagemAtiva] = useState(0);
    const [modalAberto, setModalAberto] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Combinar imagem principal com galeria
    const todasImagens = [
        { imagemUrl: imagemPrincipal, alt: titulo },
        ...galeria.filter(img => img.imagemUrl && img.imagemUrl !== imagemPrincipal)
    ];

    // Debug para verificar dados
    console.log('🖼️ GaleriaImovel Debug:', {
        imagemPrincipal,
        galeriaLength: galeria.length,
        todasImagensLength: todasImagens.length,
        imagemAtiva,
        modalAberto
    });

    // Preload das próximas imagens para melhor performance
    useEffect(() => {
        if (todasImagens.length > 1) {
            const nextIndex = (imagemAtiva + 1) % todasImagens.length;
            const prevIndex = (imagemAtiva - 1 + todasImagens.length) % todasImagens.length;

            // Preload next and previous images
            [nextIndex, prevIndex].forEach(index => {
                const img = new window.Image();
                img.src = todasImagens[index].imagemUrl;
            });
        }
    }, [imagemAtiva, todasImagens]);

    const proximaImagem = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setImageLoaded(false);

        setTimeout(() => {
            setImagemAtiva((prev) => (prev + 1) % todasImagens.length);
            setIsTransitioning(false);
        }, 150);
    }, [todasImagens.length, isTransitioning]);

    const imagemAnterior = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setImageLoaded(false);

        setTimeout(() => {
            setImagemAtiva((prev) => (prev - 1 + todasImagens.length) % todasImagens.length);
            setIsTransitioning(false);
        }, 150);
    }, [todasImagens.length, isTransitioning]);

    const abrirModal = useCallback(() => {
        setModalAberto(true);
        document.body.style.overflow = 'hidden';
    }, []);

    const fecharModal = useCallback(() => {
        setModalAberto(false);
        document.body.style.overflow = 'unset';
    }, []);

    // Navegação por teclado
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!modalAberto) return;

            switch (event.key) {
                case 'Escape':
                    fecharModal();
                    break;
                case 'ArrowLeft':
                    imagemAnterior();
                    break;
                case 'ArrowRight':
                    proximaImagem();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [modalAberto, fecharModal, imagemAnterior, proximaImagem]);

    if (todasImagens.length === 0) {
        return (
            <div className="bg-stone-200 rounded-2xl h-96 lg:h-[500px] flex items-center justify-center">
                <p className="text-stone-500">Nenhuma imagem disponível</p>
            </div>
        );
    }

    return (
        <>
            {/* Galeria Principal */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative h-96 lg:h-[500px] group cursor-pointer" onClick={abrirModal}>
                    <Image
                        src={todasImagens[imagemAtiva]?.imagemUrl}
                        alt={todasImagens[imagemAtiva]?.alt || titulo}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                    />

                    {/* Overlay de zoom com tooltip aprimorado */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                        <div className="flex flex-col items-center transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="bg-black/80 backdrop-blur-sm rounded-full p-4 mb-3 border-2 border-white/30 shadow-2xl">
                                <Maximize2 className="w-8 h-8 text-white" />
                            </div>
                            <div className="bg-black/90 text-white px-4 py-2 rounded-xl text-sm font-semibold backdrop-blur-sm border border-white/20 shadow-xl">
                                {todasImagens.length > 1
                                    ? `🖼️ Visualizar galeria (${todasImagens.length} fotos)`
                                    : '🔍 Ampliar imagem'
                                }
                            </div>
                        </div>
                    </div>                    {/* Navegação (apenas se houver mais de uma imagem) */}
                    {todasImagens.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    imagemAnterior();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    proximaImagem();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Contador de imagens */}
                    {todasImagens.length > 1 && (
                        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                            {imagemAtiva + 1} / {todasImagens.length}
                        </div>
                    )}
                </div>

                {/* Thumbnails */}
                {todasImagens.length > 1 && (
                    <div className="p-4 bg-stone-50">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {todasImagens.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setImagemAtiva(index)}
                                    className={`relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${imagemAtiva === index
                                        ? 'ring-2 ring-amber-500 ring-offset-2'
                                        : 'hover:ring-2 hover:ring-stone-300'
                                        }`}
                                >
                                    <Image
                                        src={img.imagemUrl}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Visualização */}
            {modalAberto && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    onClick={fecharModal}
                >
                    <div
                        className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Imagem no modal */}
                        <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
                            <Image
                                src={todasImagens[imagemAtiva]?.imagemUrl}
                                alt={todasImagens[imagemAtiva]?.alt || titulo}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                priority
                            />
                        </div>

                        {/* Controles do modal */}
                        <button
                            onClick={fecharModal}
                            className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
                            title="Fechar galeria (ESC)"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Navegação no modal */}
                        {todasImagens.length > 1 && (
                            <>
                                <button
                                    onClick={imagemAnterior}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
                                    title="Imagem anterior (←)"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={proximaImagem}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
                                    title="Próxima imagem (→)"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}

                        {/* Contador e informações no modal */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-6 py-3 rounded-full">
                            <div className="text-center">
                                <div className="text-lg font-semibold mb-1">
                                    {imagemAtiva + 1} / {todasImagens.length}
                                </div>
                                <div className="text-sm text-gray-300">
                                    {todasImagens.length > 1 ? 'Use ← → para navegar' : 'Clique para fechar'}
                                </div>
                            </div>
                        </div>

                        {/* Thumbnails no modal (para galerías com mais de 2 imagens) */}
                        {todasImagens.length > 2 && (
                            <div className="absolute bottom-4 left-4">
                                <div className="flex gap-2 overflow-x-auto max-w-xs">
                                    {todasImagens.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setImagemAtiva(index)}
                                            className={`relative w-12 h-9 rounded-md overflow-hidden flex-shrink-0 transition-all duration-200 ${imagemAtiva === index
                                                ? 'ring-2 ring-white ring-offset-2 ring-offset-black/50'
                                                : 'opacity-70 hover:opacity-100'
                                                }`}
                                        >
                                            <Image
                                                src={img.imagemUrl}
                                                alt={`Thumbnail ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="48px"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
