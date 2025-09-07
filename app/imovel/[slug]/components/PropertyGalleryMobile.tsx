'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface PropertyGalleryMobileProps {
    images: (string | undefined)[];
    propertyTitle?: string;
}

export default function PropertyGalleryMobile({
    images,
    propertyTitle = 'Imóvel'
}: PropertyGalleryMobileProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const galleryRef = useRef<HTMLDivElement>(null);

    const validImages = images.filter((img): img is string => !!img && img.trim() !== '');

    if (validImages.length === 0) {
        return (
            <div className="mb-6">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-slate-500">
                            <div className="w-16 h-16 mx-auto mb-3 bg-slate-300 rounded-xl flex items-center justify-center">
                                <ZoomIn className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-base font-medium">Sem fotos</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Touch handlers para swipe
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && validImages.length > 1) {
            nextImage();
        }
        if (isRightSwipe && validImages.length > 1) {
            prevImage();
        }
    };

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

    const lightboxSlides = validImages.map((src) => ({ src }));

    return (
        <>
            <div className="mb-6">
                {/* Galeria Mobile-First */}
                <div
                    ref={galleryRef}
                    className="relative"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Imagem Principal */}
                    <div className="relative aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100">
                        <Image
                            src={validImages[currentIndex]}
                            alt={`${propertyTitle} - Foto ${currentIndex + 1}`}
                            fill
                            className="object-cover"
                            onClick={() => openLightbox(currentIndex)}
                            priority
                            sizes="100vw"
                        />

                        {/* Área de touch para navegação */}
                        {validImages.length > 1 && (
                            <>
                                {/* Área touch esquerda */}
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-1/3 flex items-center justify-start pl-3 z-10"
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                >
                                    <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 active:opacity-100 transition-opacity">
                                        <ChevronLeft className="w-5 h-5 text-white" />
                                    </div>
                                </div>

                                {/* Área touch direita */}
                                <div
                                    className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-end pr-3 z-10"
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                >
                                    <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 active:opacity-100 transition-opacity">
                                        <ChevronRight className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Contador */}
                        {validImages.length > 1 && (
                            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                                <span className="text-white text-xs font-medium">
                                    {currentIndex + 1} / {validImages.length}
                                </span>
                            </div>
                        )}

                        {/* Ícone de zoom */}
                        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-lg p-1.5">
                            <ZoomIn className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    {/* Indicadores de pontos */}
                    {validImages.length > 1 && validImages.length <= 8 && (
                        <div className="flex justify-center gap-1.5 mt-3">
                            {validImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                            ? 'bg-amber-500 scale-125'
                                            : 'bg-slate-300'
                                        }`}
                                    aria-label={`Ver foto ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Swipe indicator */}
                    {validImages.length > 1 && (
                        <div className="text-center mt-2">
                            <p className="text-xs text-slate-500">
                                Deslize para ver mais fotos
                            </p>
                        </div>
                    )}
                </div>

                {/* Thumbnails horizontais (mobile) */}
                {validImages.length > 1 && (
                    <div className="mt-4 sm:hidden">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {validImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ${index === currentIndex
                                            ? 'ring-2 ring-amber-500'
                                            : 'opacity-70'
                                        }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`Miniatura ${index + 1}`}
                                        width={64}
                                        height={64}
                                        className="object-cover w-full h-full"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Grid de thumbnails (desktop) */}
                {validImages.length > 1 && (
                    <div className="hidden sm:block mt-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                            Todas as fotos ({validImages.length})
                        </h3>
                        <div className="grid grid-cols-6 lg:grid-cols-8 gap-3">
                            {validImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`aspect-square rounded-lg overflow-hidden transition-all ${index === currentIndex
                                            ? 'ring-2 ring-amber-500 scale-105'
                                            : 'hover:scale-105 opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`Miniatura ${index + 1}`}
                                        width={80}
                                        height={80}
                                        className="object-cover w-full h-full"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <Lightbox
                open={isLightboxOpen}
                close={() => setIsLightboxOpen(false)}
                slides={lightboxSlides}
                index={currentIndex}
                plugins={[Thumbnails, Zoom]}
                thumbnails={{
                    position: "bottom",
                    width: 80,
                    height: 60,
                    border: 2,
                    borderColor: "#f59e0b",
                    padding: 4,
                    gap: 8
                }}
                zoom={{
                    maxZoomPixelRatio: 3,
                    zoomInMultiplier: 2,
                    doubleTapDelay: 300,
                    doubleClickDelay: 300,
                    doubleClickMaxStops: 2,
                    keyboardMoveDistance: 50,
                    wheelZoomDistanceFactor: 100,
                    pinchZoomDistanceFactor: 100,
                    scrollToZoom: true
                }}
                styles={{
                    container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
                }}
                render={{
                    buttonNext: () => null,
                    buttonPrev: () => null,
                }}
                on={{
                    view: ({ index }) => setCurrentIndex(index),
                }}
            />
        </>
    );
}
