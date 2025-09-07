'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface PropertyGalleryProps {
    images: (string | undefined)[];
    propertyTitle?: string;
}

export default function PropertyGallery({
    images,
    propertyTitle = 'Imóvel'
}: PropertyGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const validImages = images.filter((img): img is string => !!img && img.trim() !== '');

    if (validImages.length === 0) {
        return (
            <div className="mb-8 sm:mb-10">
                <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-slate-500">
                            <div className="w-24 h-24 mx-auto mb-4 bg-slate-300 rounded-2xl flex items-center justify-center">
                                <ZoomIn className="w-12 h-12 text-slate-400" />
                            </div>
                            <p className="text-lg font-medium">Nenhuma imagem disponível</p>
                            <p className="text-sm">Este imóvel ainda não possui fotos</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % validImages.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    };

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setIsLightboxOpen(true);
    };

    return (
        <>
            <div className="mb-8 sm:mb-10">
                {/* Galeria Principal com Design Premium */}
                <div className="group relative overflow-hidden mb-4 sm:mb-6 transform transition-all duration-500 hover:scale-[1.02]">
                    {/* Background gradients para efeito de profundidade */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-800/60 via-transparent to-slate-900/80 rounded-3xl"></div>

                    {/* Container da imagem principal */}
                    <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] rounded-3xl overflow-hidden cursor-pointer">
                        {/* Skeleton/Loading state */}
                        {isLoading && (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 animate-pulse"></div>
                        )}

                        {/* Imagem principal */}
                        <Image
                            src={validImages[currentIndex]}
                            alt={`${propertyTitle} - Foto ${currentIndex + 1}`}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                            onClick={() => openLightbox(currentIndex)}
                            onLoad={() => setIsLoading(false)}
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                        />

                        {/* Overlay de zoom interativo */}
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center"
                            onClick={() => openLightbox(currentIndex)}
                        >
                            <div className="relative transform transition-transform duration-300 group-hover:scale-110">
                                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-150"></div>
                                <div className="relative p-4 sm:p-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-2xl">
                                    <ZoomIn className="w-8 h-8 sm:w-12 sm:h-12 text-white transition-transform duration-300" />
                                </div>
                                <ZoomIn className="absolute inset-4 sm:inset-6 w-8 h-8 sm:w-12 sm:h-12 text-white/40 blur-sm scale-125" />
                            </div>
                        </div>
                        {/* Controles de navegação aprimorados */}
                        {validImages.length > 1 && (
                            <>
                                {/* Botão Anterior */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="group/nav absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 z-10"
                                    aria-label="Imagem anterior"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/80 to-black/70 rounded-full backdrop-blur-sm"></div>
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 rounded-full"></div>
                                    <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover/nav:opacity-100 transition-all duration-300"></div>
                                    <div className="absolute inset-0 border border-white/20 rounded-full group-hover/nav:border-white/40 transition-all duration-300"></div>
                                    <div className="relative p-3 sm:p-4">
                                        <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 text-white group-hover/nav:scale-110 transition-transform duration-300 drop-shadow-lg" />
                                        <ChevronLeft className="absolute inset-3 sm:inset-4 w-5 h-5 sm:w-7 sm:h-7 text-white/40 opacity-0 group-hover/nav:opacity-100 transition-all duration-300 blur-sm scale-125" />
                                    </div>
                                </button>

                                {/* Botão Próximo */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="group/nav absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 z-10"
                                    aria-label="Próxima imagem"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/80 to-black/70 rounded-full backdrop-blur-sm"></div>
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 rounded-full"></div>
                                    <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover/nav:opacity-100 transition-all duration-300"></div>
                                    <div className="absolute inset-0 border border-white/20 rounded-full group-hover/nav:border-white/40 transition-all duration-300"></div>
                                    <div className="relative p-3 sm:p-4">
                                        <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 text-white group-hover/nav:scale-110 transition-transform duration-300 drop-shadow-lg" />
                                        <ChevronRight className="absolute inset-3 sm:inset-4 w-5 h-5 sm:w-7 sm:h-7 text-white/40 opacity-0 group-hover/nav:opacity-100 transition-all duration-300 blur-sm scale-125" />
                                    </div>
                                </button>
                            </>
                        )}

                        {/* Contador de imagens premium */}
                        {validImages.length > 1 && (
                            <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-10">
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/90 to-black/80 rounded-2xl backdrop-blur-md border border-white/10"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 rounded-2xl"></div>
                                <div className="relative px-4 sm:px-6 py-2.5 sm:py-3 text-white font-semibold tracking-wide">
                                    <span className="text-sm sm:text-base text-white/90">{currentIndex + 1}</span>
                                    <span className="text-xs sm:text-sm text-white/60 mx-2">/</span>
                                    <span className="text-sm sm:text-base text-white/90">{validImages.length}</span>
                                    <div className="absolute inset-x-2 bottom-1 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
                                </div>
                            </div>
                        )}

                        {/* Indicadores de posição */}
                        {validImages.length > 1 && (
                            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                {validImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                                        className={`transition-all duration-300 rounded-full ${index === currentIndex
                                                ? 'w-8 h-2 bg-white shadow-lg'
                                                : 'w-2 h-2 bg-white/50 hover:bg-white/70'
                                            }`}
                                        aria-label={`Ir para imagem ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Efeito de sombra inferior */}
                    <div className="absolute inset-x-6 -bottom-3 h-8 bg-gradient-to-r from-transparent via-slate-600/20 to-transparent rounded-full blur-xl"></div>
                </div>

                {/* Thumbnails aprimorados */}
                {validImages.length > 1 && (
                    <div className="hidden sm:block">
                        <div className="relative">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                Galeria de Fotos
                                <span className="text-sm text-slate-500 font-normal">({validImages.length} imagens)</span>
                            </h3>
                            <div className="flex gap-3 lg:gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
                                {validImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`group relative flex-shrink-0 transition-all duration-300 ${index === currentIndex
                                                ? 'scale-105 ring-2 ring-amber-500 ring-offset-2'
                                                : 'hover:scale-102 opacity-70 hover:opacity-100'
                                            }`}
                                        aria-label={`Ver imagem ${index + 1}`}
                                    >
                                        <div className="relative w-24 h-24 lg:w-28 lg:h-28 rounded-2xl overflow-hidden shadow-lg">
                                            {/* Background placeholder */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200"></div>

                                            {/* Thumbnail image */}
                                            <Image
                                                src={image}
                                                alt={`${propertyTitle} - Thumbnail ${index + 1}`}
                                                fill
                                                className="object-cover transition-all duration-300 group-hover:scale-110"
                                                sizes="(max-width: 768px) 96px, 112px"
                                            />

                                            {/* Active indicator */}
                                            {index === currentIndex && (
                                                <>
                                                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-2xl opacity-75 blur-sm"></div>
                                                    <div className="absolute inset-0 border-2 border-amber-500 rounded-2xl"></div>
                                                    <div className="absolute inset-0 border border-amber-300 rounded-2xl"></div>
                                                    <div className="absolute inset-1 bg-gradient-to-br from-amber-400/20 via-transparent to-amber-600/20 rounded-xl"></div>
                                                </>
                                            )}

                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl"></div>

                                            {/* Image number indicator */}
                                            <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                {index + 1}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Scroll indicators for mobile */}
                            <div className="sm:hidden absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white via-white to-transparent pl-8 pr-2">
                                <div className="w-1 h-8 bg-gradient-to-b from-slate-300 to-slate-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Thumbnails para mobile (carrossel compacto) */}
                {validImages.length > 1 && (
                    <div className="block sm:hidden">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {validImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`relative flex-shrink-0 transition-all duration-300 ${index === currentIndex
                                            ? 'scale-110 ring-2 ring-amber-500'
                                            : 'opacity-60'
                                        }`}
                                >
                                    <div className="w-16 h-16 rounded-xl overflow-hidden">
                                        <Image
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox Premium com configurações avançadas */}
            <Lightbox
                open={isLightboxOpen}
                close={() => setIsLightboxOpen(false)}
                slides={validImages.map((img, index) => ({
                    src: img,
                    alt: `${propertyTitle} - Imagem ${index + 1} de ${validImages.length}`,
                    width: 1920,
                    height: 1080
                }))}
                index={currentIndex}
                plugins={[Thumbnails, Zoom]}
                thumbnails={{
                    showToggle: true,
                    position: "bottom",
                    width: 120,
                    height: 80,
                    border: 2,
                    borderRadius: 8,
                    padding: 4,
                    gap: 8,
                }}
                zoom={{
                    maxZoomPixelRatio: 5,
                    zoomInMultiplier: 2,
                    doubleTapDelay: 300,
                    doubleClickDelay: 300,
                    doubleClickMaxStops: 2,
                    keyboardMoveDistance: 50,
                    wheelZoomDistanceFactor: 100,
                    pinchZoomDistanceFactor: 100,
                    scrollToZoom: true
                }}
                animation={{
                    fade: 500,
                    swipe: 500
                }}
                carousel={{
                    finite: false,
                    preload: 2,
                    padding: "16px",
                    spacing: "30%",
                    imageFit: "contain"
                }}
                controller={{
                    closeOnPullDown: true,
                    closeOnBackdropClick: true,
                }}
                render={{
                    buttonPrev: () => (
                        <div className="p-2 bg-black/50 rounded-full backdrop-blur-sm border border-white/20 hover:bg-black/70 transition-all duration-300">
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </div>
                    ),
                    buttonNext: () => (
                        <div className="p-2 bg-black/50 rounded-full backdrop-blur-sm border border-white/20 hover:bg-black/70 transition-all duration-300">
                            <ChevronRight className="w-6 h-6 text-white" />
                        </div>
                    ),
                }}
            />
        </>
    );
}