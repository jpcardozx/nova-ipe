'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
    BadgeCheck,
    MapPin,
    Building2,
    BedDouble as Bed,
    Bath,
    Car
} from 'lucide-react';

interface PropertyCardBadge {
    text: string;
    color: 'amber' | 'green' | 'sky' | 'blue';
}

interface PropertyDetails {
    id: string;
    title: string;
    slug: string;
    location: string;
    city: string;
    price: number;
    propertyType: 'sale' | 'rent';
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
    mainImage: {
        url: string;
        alt: string;
    };
    isPremium?: boolean;
    isNew?: boolean;
}

interface EnhancedPropertyCardProps {
    property: PropertyDetails;
    index?: number; // Para animações escalonadas
    variant?: 'default' | 'featured' | 'masonry' | 'carousel' | 'highlight';
}

export default function EnhancedPropertyCard({ property, index = 0, variant = 'default' }: EnhancedPropertyCardProps) {
    const getBadges = (): PropertyCardBadge[] => {
        const badges: PropertyCardBadge[] = [];

        if (property.isPremium) {
            badges.push({ text: 'Premium', color: 'amber' });
        }

        if (property.isNew) {
            badges.push({ text: 'Novo', color: 'green' });
        }

        if (property.propertyType === 'sale') {
            badges.push({ text: 'À Venda', color: 'blue' });
        } else if (property.propertyType === 'rent') {
            badges.push({ text: 'Para Alugar', color: 'sky' });
        }

        return badges;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0
        }).format(price);
    };

    const cardVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                delay: index * 0.1,
                duration: 0.5,
                ease: 'easeOut'
            }
        },
        hover: {
            y: -5,
            transition: { duration: 0.2 }
        }
    };

    const imageVariants = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.5 }
        }
    };

    const overlayVariants = {
        hover: {
            opacity: 0.3,
            transition: { duration: 0.3 }
        }
    };

    const badgeColorClasses = {
        amber: 'bg-amber-500 text-white',
        green: 'bg-green-500 text-white',
        sky: 'bg-sky-500 text-white',
        blue: 'bg-blue-500 text-white'
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="initial"
            whileInView="animate"
            whileHover="hover"
            viewport={{ once: true }}
            className={`group bg-white rounded-2xl shadow-lg overflow-hidden transition-shadow ${variant === 'featured'
                ? 'border-2 border-amber-200 shadow-amber-100'
                : 'border border-stone-200 hover:shadow-xl'
                }`}
        >
            {/* Imagem com Overlay e Badges */}
            <div className="relative h-64 overflow-hidden">
                {property.mainImage?.url && (
                    <>
                        <motion.div variants={imageVariants} className="absolute inset-0">
                            <Image
                                src={property.mainImage.url}
                                alt={property.mainImage.alt || property.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority={index < 3}
                            />
                        </motion.div>
                        <motion.div
                            variants={overlayVariants}
                            className="absolute inset-0 bg-black opacity-0"
                        />
                    </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 right-4 flex flex-wrap justify-between gap-2 z-10">
                    <div className="flex gap-2">
                        {getBadges().map((badge, i) => (
                            <div
                                key={i}
                                className={`${badgeColorClasses[badge.color]} px-3 py-1 rounded-full text-sm font-medium shadow-md backdrop-blur-sm bg-opacity-90`}
                            >
                                {badge.text}
                            </div>
                        ))}
                    </div>
                    {variant === 'featured' && (
                        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                            <BadgeCheck className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-900">Destaque</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-stone-900 mb-2 line-clamp-2 group-hover:text-amber-800 transition-colors">
                    {property.title}
                </h3>
                <div className="flex items-center gap-2 text-stone-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <p className="text-sm">{property.location}, {property.city}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <div className="text-amber-800 font-bold text-lg">
                        {formatPrice(property.price)}
                        {property.propertyType === 'rent' && (
                            <span className="text-sm font-normal text-stone-500">/mês</span>
                        )}
                    </div>
                    {property.area && (
                        <div className="flex items-center gap-1.5 text-stone-600">
                            <Building2 className="w-4 h-4" />
                            <span className="text-sm">{property.area} m²</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between text-stone-500 border-t border-stone-100 pt-4 mt-4">
                    {property.bedrooms && (
                        <div className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            <span className="text-sm">{property.bedrooms}</span>
                        </div>
                    )}
                    {property.bathrooms && (
                        <div className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            <span className="text-sm">{property.bathrooms}</span>
                        </div>
                    )}
                    {property.parkingSpots && (
                        <div className="flex items-center gap-1">
                            <Car className="w-4 h-4" />
                            <span className="text-sm">{property.parkingSpots}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
