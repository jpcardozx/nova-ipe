'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    MapPin,
    Calendar,
    Share2,
    Heart,
    ChevronLeft,
    ChevronRight,
    Expand,
    X
} from 'lucide-react';
import { cn, formatarMoeda } from '../../../../lib/utils';
import { Button } from '@/app/components/ui/button';
import { PropertyStatus, PropertyType } from '@/app/components/ui/property/PropertyCardUnified';

interface PropertyImageType {
    url: string;
    alt?: string;
}

interface PropertyHeroProps {
    id: string;
    title: string;
    address?: string;
    city?: string;
    state?: string;
    price: number;
    formattedPrice?: string;
    propertyType: PropertyType;
    status?: PropertyStatus;
    createdAt?: string;
    updatedAt?: string;
    mainImage: PropertyImageType;
    images?: PropertyImageType[];
    className?: string;
    onScheduleVisit?: () => void;
    onShare?: () => void;
}

export function PropertyHero({
    id,
    title,
    address,
    city,
    state,
    price,
    formattedPrice,
    propertyType,
    status = 'available',
    createdAt,
    updatedAt,
    mainImage,
    images = [],
    className,
    onScheduleVisit,
    onShare,
}: PropertyHeroProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isFullscreenGallery, setIsFullscreenGallery] = useState(false);

    // Preparar todas as imagens
    const allImages = [mainImage, ...images];

    // Formatação de preço
    const displayPrice = formattedPrice || formatarMoeda(price);

    // Formatação de endereço completo
    const fullAddress = [address, city, state].filter(Boolean).join(', ');

    // Formatação de data de atualização
    const formattedDate = updatedAt
        ? new Date(updatedAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) : null;

    // Status config
    const statusConfig: Record<PropertyStatus, { color: string; text: string }> = {
        available: { color: 'bg-accent-emerald-500', text: 'Disponível' },
        sold: { color: 'bg-accent-red-500', text: 'Vendido' },
        rented: { color: 'bg-blue-500', text: 'Alugado' },
        pending: { color: 'bg-yellow-500', text: 'Pendente' },
    };

    // Property type config
    const propertyTypeConfig: Record<PropertyType, { text: string }> = {
        sale: { text: 'Venda' },
        rent: { text: 'Aluguel' },
    };

    // Navegação de imagens
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    // Toggle favorite
    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    // Animações para elementos
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <>
            <div className={cn("relative w-full bg-neutral-50", className)}>
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Coluna da esquerda - Galeria de imagens */}
                        <div className="relative">
                            <motion.div
                                className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Image
                                    src={allImages[currentImageIndex].url}
                                    alt={allImages[currentImageIndex].alt || title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />

                                {/* Botões de navegação da galeria */}
                                {allImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md backdrop-blur-sm transition-all"
                                            aria-label="Imagem anterior"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md backdrop-blur-sm transition-all"
                                            aria-label="Próxima imagem"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </>
                                )}

                                {/* Botão de expandir galeria */}
                                <button
                                    onClick={() => setIsFullscreenGallery(true)}
                                    className="absolute bottom-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-md backdrop-blur-sm transition-all"
                                    aria-label="Ver galeria em tela cheia"
                                >
                                    <Expand size={20} />
                                </button>

                                {/* Status badge */}
                                {status !== 'available' && (
                                    <div className={cn(
                                        "absolute top-4 left-4 px-3 py-1.5 text-sm font-medium text-white rounded-md shadow-md",
                                        statusConfig[status].color
                                    )}>
                                        {statusConfig[status].text}
                                    </div>
                                )}
                            </motion.div>

                            {/* Miniaturas da galeria */}
                            {allImages.length > 1 && (
                                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 snap-x">
                                    {allImages.map((image, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={cn(
                                                "relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden snap-start",
                                                "transition-all duration-300 hover:opacity-90",
                                                idx === currentImageIndex
                                                    ? "ring-2 ring-primary-500 opacity-100"
                                                    : "opacity-70 hover:opacity-100"
                                            )}
                                            aria-label={`Ver imagem ${idx + 1}`}
                                            aria-current={idx === currentImageIndex}
                                        >
                                            <Image
                                                src={image.url}
                                                alt={image.alt || `Imagem ${idx + 1} de ${title}`}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Coluna da direita - Informações do imóvel */}
                        <div className="flex flex-col">
                            <motion.div
                                variants={fadeInUp}
                                initial="hidden"
                                animate="visible"
                                className="mb-2 flex items-center"
                            >
                                <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                                    {propertyTypeConfig[propertyType].text}
                                </span>
                                {formattedDate && (
                                    <div className="flex items-center text-sm text-neutral-500 ml-4">
                                        <Calendar size={14} className="mr-1" />
                                        <span>Atualizado em {formattedDate}</span>
                                    </div>
                                )}
                            </motion.div>                            <motion.h1
                                variants={fadeInUp}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.1, duration: 0.6 }}
                                className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3"
                            >
                                {title}
                            </motion.h1>

                            {fullAddress && (<motion.div
                                variants={fadeInUp}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="flex items-center text-neutral-600 mb-6"
                            >
                                <MapPin size={18} className="mr-2 flex-shrink-0" />
                                <span>{fullAddress}</span>
                            </motion.div>
                            )}                            <motion.div
                                variants={fadeInUp}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="text-3xl md:text-4xl font-bold text-primary-600 mb-8"
                            >
                                {displayPrice}
                            </motion.div>                            <motion.div
                                variants={fadeInUp}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="flex flex-wrap gap-4 mt-auto"
                            >                                <Button
                                variant="default"
                                size="lg"
                                className="flex-grow"
                                onClick={onScheduleVisit}
                            >
                                    Agendar visita
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-4"
                                    onClick={toggleFavorite}
                                    aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                >
                                    <Heart fill={isFavorite ? "currentColor" : "none"} />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-4"
                                    onClick={onShare}
                                    aria-label="Compartilhar"
                                >
                                    <Share2 />
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de galeria em tela cheia */}
            {isFullscreenGallery && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
                    <button
                        onClick={() => setIsFullscreenGallery(false)}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                        aria-label="Fechar galeria"
                    >
                        <X size={24} />
                    </button>

                    <div className="relative w-full h-full max-w-6xl max-h-[80vh] mx-auto">
                        <Image
                            src={allImages[currentImageIndex].url}
                            alt={allImages[currentImageIndex].alt || title}
                            fill
                            className="object-contain"
                            sizes="100vw"
                        />

                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                                    aria-label="Imagem anterior"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                                    aria-label="Próxima imagem"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}

                        {/* Contador de imagens */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                            {currentImageIndex + 1} / {allImages.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PropertyHero; 