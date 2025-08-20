'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface PropertyGalleryProps {
    images: (string | undefined)[];
    propertyTitle?: string;
}

export default function PropertyGallery({
    images,
    propertyTitle = 'Imóvel'
}: PropertyGalleryProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filtrar imagens válidas
    const validImages = images.filter((img): img is string => img !== undefined && img !== null && img.trim() !== '');

    if (!validImages || validImages.length === 0) return null;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
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
            {/* Enhanced Premium Gallery */}
            <div className="mb-8 sm:mb-10">
                {/* Enhanced Main Image Container */}
                <div className="group relative overflow-hidden mb-4 sm:mb-6">
                    {/* Sophisticated backdrop layers */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-800/60 via-transparent to-slate-900/80 rounded-3xl"></div>

                    {/* Main image container with advanced styling */}
                    <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] rounded-3xl overflow-hidden cursor-pointer">
                        {/* Image backdrop for smooth loading */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 animate-pulse"></div>

                        <Image
                            src={validImages[currentImageIndex]}
                            alt={`${propertyTitle} - Foto ${currentImageIndex + 1}`}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                            onClick={() => openModal(currentImageIndex)}
                            priority
                        />

                        {/* Enhanced overlay with premium effects */}
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center"
                            onClick={() => openModal(currentImageIndex)}
                        >
                            {/* Zoom icon with multiple effects */}
                            <div className="relative">
                                {/* Icon glow background */}
                                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-150"></div>

                                {/* Main zoom icon */}
                                <div className="relative p-4 sm:p-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                                    <ZoomIn className="w-8 h-8 sm:w-12 sm:h-12 text-white group-hover:scale-110 transition-transform duration-300" />
                                </div>

                                {/* Icon reflection */}
                                <ZoomIn className="absolute inset-4 sm:inset-6 w-8 h-8 sm:w-12 sm:h-12 text-white/40 blur-sm scale-125" />
                            </div>
                        </div>

                        {/* Enhanced Navigation Buttons */}
                        {validImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage();
                                    }}
                                    className="group/nav absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110"
                                >
                                    {/* Button background layers */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/70 to-black/60 rounded-full"></div>
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 rounded-full"></div>
                                    <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover/nav:opacity-100 transition-all duration-300"></div>

                                    {/* Button border */}
                                    <div className="absolute inset-0 border border-white/20 rounded-full group-hover/nav:border-white/30 transition-all duration-300"></div>

                                    <div className="relative p-3 sm:p-4">
                                        <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 text-white group-hover/nav:scale-110 transition-transform duration-300" />
                                        <ChevronLeft className="absolute inset-3 sm:inset-4 w-5 h-5 sm:w-7 sm:h-7 text-white/40 opacity-0 group-hover/nav:opacity-100 transition-all duration-300 blur-sm scale-125" />
                                    </div>
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }}
                                    className="group/nav absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110"
                                >
                                    {/* Button background layers */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/70 to-black/60 rounded-full"></div>
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 rounded-full"></div>
                                    <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover/nav:opacity-100 transition-all duration-300"></div>

                                    {/* Button border */}
                                    <div className="absolute inset-0 border border-white/20 rounded-full group-hover/nav:border-white/30 transition-all duration-300"></div>

                                    <div className="relative p-3 sm:p-4">
                                        <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 text-white group-hover/nav:scale-110 transition-transform duration-300" />
                                        <ChevronRight className="absolute inset-3 sm:inset-4 w-5 h-5 sm:w-7 sm:h-7 text-white/40 opacity-0 group-hover/nav:opacity-100 transition-all duration-300 blur-sm scale-125" />
                                    </div>
                                </button>
                            </>
                        )}

                        {/* Enhanced Image Counter */}
                        {validImages.length > 1 && (
                            <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6">
                                {/* Counter background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/80 to-black/70 rounded-full backdrop-blur-sm"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 rounded-full"></div>
                                <div className="absolute inset-0 border border-white/20 rounded-full"></div>

                                <div className="relative px-4 sm:px-5 py-2 sm:py-2.5 text-white text-sm sm:text-base font-semibold tracking-wide">
                                    {currentImageIndex + 1} / {validImages.length}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Floating shadow effect */}
                    <div className="absolute inset-x-6 -bottom-3 h-8 bg-gradient-to-r from-transparent via-slate-600/20 to-transparent rounded-full blur-xl"></div>
                </div>

                {/* Enhanced Thumbnails Grid */}
                {validImages.length > 1 && (
                    <div className="hidden sm:block">
                        <div className="flex gap-3 lg:gap-4 overflow-x-auto pb-3 scrollbar-hide">
                            {validImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`group relative flex-shrink-0 transition-all duration-300 ${index === currentImageIndex
                                            ? 'scale-105'
                                            : 'hover:scale-102 opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    {/* Thumbnail container with sophisticated styling */}
                                    <div className="relative w-24 h-24 lg:w-28 lg:h-28 rounded-2xl overflow-hidden">
                                        {/* Background gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200"></div>

                                        <Image
                                            src={image}
                                            alt={`${propertyTitle} - Thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover transition-all duration-300 group-hover:scale-110"
                                        />

                                        {/* Active state indicator */}
                                        {index === currentImageIndex && (
                                            <>
                                                {/* Outer glow */}
                                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 rounded-2xl opacity-60 blur-sm"></div>

                                                {/* Border highlight */}
                                                <div className="absolute inset-0 border-2 border-blue-500 rounded-2xl"></div>
                                                <div className="absolute inset-0 border border-blue-300 rounded-2xl"></div>

                                                {/* Inner highlight */}
                                                <div className="absolute inset-1 bg-gradient-to-br from-blue-400/20 via-transparent to-blue-600/20 rounded-xl"></div>
                                            </>
                                        )}

                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl"></div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced Modal with Premium Styling */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Sophisticated backdrop */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/98 to-black/95 backdrop-blur-sm"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80"></div>

                    {/* Enhanced Close Button */}
                    <button
                        onClick={closeModal}
                        className="absolute top-6 right-6 z-10 group transition-all duration-300 hover:scale-110"
                    >
                        {/* Button background layers */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/70 to-black/60 rounded-full"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 rounded-full"></div>
                        <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                        {/* Button border */}
                        <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-white/30 transition-all duration-300"></div>

                        <div className="relative p-4 sm:p-5">
                            <X className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:scale-110 transition-transform duration-300" />
                            <X className="absolute inset-4 sm:inset-5 w-6 h-6 sm:w-7 sm:h-7 text-white/40 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm scale-125" />
                        </div>
                    </button>

                    {/* Modal Image Container */}
                    <div className="relative w-full h-full max-w-7xl max-h-full flex items-center justify-center p-6 sm:p-8">
                        <div className="relative w-full h-full">
                            <Image
                                src={validImages[currentImageIndex]}
                                alt={`${propertyTitle} - Foto ${currentImageIndex + 1}`}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Enhanced Modal Navigation */}
                    {validImages.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-6 top-1/2 -translate-y-1/2 group transition-all duration-300 hover:scale-110"
                            >
                                {/* Button styling similar to close button */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/70 to-black/60 rounded-full"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 rounded-full"></div>
                                <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-white/30 transition-all duration-300"></div>

                                <div className="relative p-4 sm:p-5">
                                    <ChevronLeft className="w-7 h-7 sm:w-9 sm:h-9 text-white group-hover:scale-110 transition-transform duration-300" />
                                    <ChevronLeft className="absolute inset-4 sm:inset-5 w-7 h-7 sm:w-9 sm:h-9 text-white/40 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm scale-125" />
                                </div>
                            </button>

                            <button
                                onClick={nextImage}
                                className="absolute right-6 top-1/2 -translate-y-1/2 group transition-all duration-300 hover:scale-110"
                            >
                                {/* Button styling similar to close button */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/70 to-black/60 rounded-full"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 rounded-full"></div>
                                <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-white/30 transition-all duration-300"></div>

                                <div className="relative p-4 sm:p-5">
                                    <ChevronRight className="w-7 h-7 sm:w-9 sm:h-9 text-white group-hover:scale-110 transition-transform duration-300" />
                                    <ChevronRight className="absolute inset-4 sm:inset-5 w-7 h-7 sm:w-9 sm:h-9 text-white/40 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm scale-125" />
                                </div>
                            </button>
                        </>
                    )}

                    {/* Enhanced Modal Counter */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                        {/* Counter background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/80 to-black/70 rounded-full backdrop-blur-sm"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 rounded-full"></div>
                        <div className="absolute inset-0 border border-white/20 rounded-full"></div>

                        <div className="relative px-6 sm:px-8 py-3 sm:py-4 text-white text-base sm:text-lg font-semibold tracking-wide">
                            {currentImageIndex + 1} de {validImages.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
