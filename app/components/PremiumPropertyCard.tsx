"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Maximize2, BedDouble, Bath, Car, Ruler, Star } from 'lucide-react';
import { novaIpeColors, novaIpeGradients } from '../utils/nova-ipe-gradients';

interface PropertyCardProps {
    id: string;
    title: string;
    price: string | number;
    address: string;
    images: string[];
    bedrooms: number;
    bathrooms: number;
    area: number;
    parkingSpots?: number;
    tags?: string[];
    featured?: boolean;
    new?: boolean;
    exclusive?: boolean;
    type: 'sale' | 'rent';
}

const PremiumPropertyCard: React.FC<PropertyCardProps> = ({
    id,
    title,
    price,
    address,
    images,
    bedrooms,
    bathrooms,
    area,
    parkingSpots,
    tags,
    featured = false,
    new: isNew = false,
    exclusive = false,
    type
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Preço formatado
    const formattedPrice = typeof price === 'number'
        ? price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : price;

    // Função para avançar imagens
    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (images.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    return (
        <motion.div
            className="group relative rounded-xl overflow-hidden shadow-lg bg-white"
            style={{
                boxShadow: isHovered
                    ? `0 20px 35px -10px ${novaIpeColors.neutral.black}15, 0 10px 20px -5px ${novaIpeColors.primary.ipe}20`
                    : `0 10px 25px -5px ${novaIpeColors.neutral.black}10, 0 8px 12px -3px ${novaIpeColors.primary.ipe}10`
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <Link href={`/imovel/${id}`} className="block">
                {/* Imagem do imóvel com transição suave */}
                <div className="relative overflow-hidden aspect-[4/3] w-full">
                    <motion.div
                        className="w-full h-full"
                        animate={{
                            opacity: imageLoaded ? 1 : 0,
                            scale: imageLoaded ? 1 : 1.05
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <Image
                            src={images[currentImageIndex]}
                            alt={title}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            quality={90}
                            priority={featured}
                            onLoad={() => setImageLoaded(true)}
                        />
                    </motion.div>

                    {/* Efeito de gradiente no hover */}
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-amber-900/50 via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {isNew && (
                            <div
                                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-white"
                                style={{
                                    background: `linear-gradient(135deg, ${novaIpeColors.primary.ipe}, ${novaIpeColors.primary.ipeGlow})`,
                                    boxShadow: `0 2px 10px ${novaIpeColors.primary.ipe}60`
                                }}
                            >
                                <span>Novo</span>
                            </div>
                        )}

                        {exclusive && (
                            <div
                                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold"
                                style={{
                                    background: `linear-gradient(135deg, ${novaIpeColors.earth.brown}, ${novaIpeColors.earth.warmBrown})`,
                                    color: 'white',
                                    boxShadow: `0 2px 10px ${novaIpeColors.earth.brown}60`
                                }}
                            >
                                <Star className="w-3 h-3" />
                                <span>Exclusivo</span>
                            </div>
                        )}

                        {featured && (
                            <div
                                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold"
                                style={{
                                    background: `linear-gradient(135deg, ${novaIpeColors.neutral.black}, ${novaIpeColors.neutral.charcoal})`,
                                    color: novaIpeColors.neutral.white,
                                    boxShadow: `0 2px 10px ${novaIpeColors.neutral.black}60`
                                }}
                            >
                                <span>Destaque</span>
                            </div>
                        )}
                    </div>

                    {/* Botão para ver mais fotos */}
                    {images.length > 1 && (
                        <button
                            onClick={nextImage}
                            className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white p-1.5 rounded-md transition-all duration-300"
                            style={{
                                boxShadow: `0 2px 8px ${novaIpeColors.neutral.black}20`
                            }}
                            aria-label="Próxima foto"
                        >
                            <Maximize2
                                className="w-4 h-4"
                                style={{ color: novaIpeColors.primary.ipeDark }}
                            />
                        </button>
                    )}

                    {/* Indicador de progresso de fotos */}
                    {images.length > 1 && (
                        <div className="absolute bottom-3 left-3 flex gap-1.5">
                            {images.map((_, index) => (
                                <div
                                    key={index}
                                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                        background: currentImageIndex === index
                                            ? novaIpeColors.primary.ipe
                                            : `${novaIpeColors.neutral.white}80`,
                                        transform: currentImageIndex === index ? 'scale(1.2)' : 'scale(1)',
                                        boxShadow: currentImageIndex === index
                                            ? `0 0 6px ${novaIpeColors.primary.ipe}80`
                                            : 'none'
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Conteúdo do card */}
                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3
                            className="text-lg font-semibold line-clamp-2 group-hover:text-amber-700 transition-colors duration-300"
                            style={{ color: novaIpeColors.neutral.black }}
                        >
                            {title}
                        </h3>
                    </div>

                    {/* Tag de tipo (venda/aluguel) */}
                    <div
                        className="inline-block px-2 py-0.5 rounded text-xs font-medium mb-2"
                        style={{
                            background: type === 'sale'
                                ? `${novaIpeColors.primary.ipe}15`
                                : `${novaIpeColors.earth.brown}15`,
                            color: type === 'sale'
                                ? novaIpeColors.primary.ipeDark
                                : novaIpeColors.earth.brown
                        }}
                    >
                        {type === 'sale' ? 'Venda' : 'Aluguel'}
                    </div>

                    {/* Preço */}
                    <p
                        className="text-xl font-bold mb-2"
                        style={{
                            color: novaIpeColors.primary.ipeDark,
                            textShadow: `0 1px 1px ${novaIpeColors.neutral.white}`
                        }}
                    >
                        {formattedPrice}
                    </p>

                    {/* Endereço */}
                    <div className="flex items-start gap-1.5 mb-4">
                        <MapPin
                            className="w-4 h-4 mt-0.5 flex-shrink-0"
                            style={{ color: novaIpeColors.neutral.warmGray }}
                        />
                        <p
                            className="text-sm line-clamp-1"
                            style={{ color: novaIpeColors.neutral.warmGray }}
                        >
                            {address}
                        </p>
                    </div>

                    {/* Características do imóvel */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                            <BedDouble className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">{bedrooms}</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Bath className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">{bathrooms}</span>
                        </div>

                        {parkingSpots !== undefined && (
                            <div className="flex items-center gap-1">
                                <Car className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-700">{parkingSpots}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-1">
                            <Ruler className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">{area}m²</span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Efeito de borda premium no hover */}
            <motion.div
                className="absolute inset-0 pointer-events-none rounded-xl opacity-0 group-hover:opacity-100"
                style={{
                    border: `1px solid ${novaIpeColors.primary.ipe}30`
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Efeito de gradiente no hover */}
            <motion.div
                className="absolute left-0 top-0 bottom-0 w-full h-[3px] opacity-0 group-hover:opacity-100"
                style={{
                    background: novaIpeGradients.primary
                }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    );
};

export default PremiumPropertyCard;
