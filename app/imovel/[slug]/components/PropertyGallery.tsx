'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface PropertyGalleryProps {
    images: string[];
    propertyTitle?: string;
}

export default function PropertyGallery({
    images,
    propertyTitle = 'Imóvel'
}: PropertyGalleryProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!images || images.length === 0) return null;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const openModal = (index: number) => {
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {/* Galeria Principal */}
            <div className="mb-6 sm:mb-8">
                {/* Imagem Principal */}
                <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] rounded-xl overflow-hidden bg-slate-200 mb-3 sm:mb-4 group cursor-pointer">
                    <Image
                        src={images[currentImageIndex]}
                        alt={`${propertyTitle} - Foto ${currentImageIndex + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        onClick={() => openModal(currentImageIndex)}
                        priority
                    />

                    {/* Overlay com zoom */}
                    <div
                        className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                        onClick={() => openModal(currentImageIndex)}
                    >
                        <ZoomIn className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                    </div>

                    {/* Navegação */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage();
                                }}
                                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 hover:scale-110"
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage();
                                }}
                                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 hover:scale-110"
                            >
                                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                            </button>
                        </>
                    )}

                    {/* Contador */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/70 text-white text-sm rounded-full">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    )}
                </div>

                {/* Thumbnails (apenas desktop) */}
                {images.length > 1 && (
                    <div className="hidden sm:flex gap-2 lg:gap-3 overflow-x-auto pb-2">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`relative flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden transition-all duration-300 ${index === currentImageIndex
                                        ? 'ring-2 ring-blue-500 opacity-100'
                                        : 'opacity-70 hover:opacity-100'
                                    }`}
                            >
                                <Image
                                    src={image}
                                    alt={`${propertyTitle} - Thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de Visualização */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
                    {/* Botão Fechar */}
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 z-10 p-2 sm:p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    {/* Imagem Modal */}
                    <div className="relative w-full h-full max-w-7xl max-h-full flex items-center justify-center p-4">
                        <div className="relative w-full h-full">
                            <Image
                                src={images[currentImageIndex]}
                                alt={`${propertyTitle} - Foto ${currentImageIndex + 1}`}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Navegação Modal */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300"
                            >
                                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                            </button>

                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300"
                            >
                                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                            </button>
                        </>
                    )}

                    {/* Contador Modal */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 text-white rounded-full">
                        {currentImageIndex + 1} de {images.length}
                    </div>
                </div>
            )}
        </>
    );
}
