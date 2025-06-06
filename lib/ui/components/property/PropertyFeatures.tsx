'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    BedDouble,
    Bath,
    Car,
    Maximize2,
    Landmark,
    Home,
    Calendar,
    Sofa,
    Trees,
    Waves,
    Utensils,
    Wifi,
    ShieldCheck,
    Warehouse
} from 'lucide-react';
import { cn, formatarArea } from '@/lib/utils';

// Tipos de características
export interface PropertyFeature {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}

// Tipos de amenidades
export type AmenityType =
    | 'pool'
    | 'garden'
    | 'bbq'
    | 'gym'
    | 'security'
    | 'furnished'
    | 'wifi'
    | 'garage'
    | 'balcony'
    | 'view'
    | 'kitchen'
    | 'storage'
    | 'laundry'
    | 'petFriendly'
    | 'airConditioning'
    | 'heating';

interface PropertyAmenity {
    type: AmenityType;
    label: string;
    icon: React.ReactNode;
}

interface PropertyFeaturesProps {
    area?: number;
    buildArea?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
    constructionYear?: number;
    amenities?: AmenityType[];
    additionalFeatures?: PropertyFeature[];
    className?: string;
}

export function PropertyFeatures({
    area,
    buildArea,
    bedrooms,
    bathrooms,
    parkingSpots,
    constructionYear,
    amenities = [],
    additionalFeatures = [],
    className,
}: PropertyFeaturesProps) {
    // Mapeamento de amenidades para ícones e labels
    const amenityMap: Record<AmenityType, PropertyAmenity> = {
        pool: { type: 'pool', label: 'Piscina', icon: <Waves size={20} /> },
        garden: { type: 'garden', label: 'Jardim', icon: <Trees size={20} /> },
        bbq: { type: 'bbq', label: 'Churrasqueira', icon: <Utensils size={20} /> },
        gym: { type: 'gym', label: 'Academia', icon: <Landmark size={20} /> },
        security: { type: 'security', label: 'Segurança 24h', icon: <ShieldCheck size={20} /> },
        furnished: { type: 'furnished', label: 'Mobiliado', icon: <Sofa size={20} /> },
        wifi: { type: 'wifi', label: 'Wi-Fi', icon: <Wifi size={20} /> },
        garage: { type: 'garage', label: 'Garagem', icon: <Warehouse size={20} /> },
        balcony: { type: 'balcony', label: 'Sacada', icon: <Home size={20} /> },
        view: { type: 'view', label: 'Vista panorâmica', icon: <Maximize2 size={20} /> },
        kitchen: { type: 'kitchen', label: 'Cozinha equipada', icon: <Utensils size={20} /> },
        storage: { type: 'storage', label: 'Depósito', icon: <Warehouse size={20} /> },
        laundry: { type: 'laundry', label: 'Lavanderia', icon: <Home size={20} /> },
        petFriendly: { type: 'petFriendly', label: 'Aceita pets', icon: <Home size={20} /> },
        airConditioning: { type: 'airConditioning', label: 'Ar condicionado', icon: <Home size={20} /> },
        heating: { type: 'heating', label: 'Aquecimento', icon: <Home size={20} /> },
    };

    // Características principais
    const mainFeatures: PropertyFeature[] = [
        area && { icon: <Maximize2 size={20} />, label: 'Área total', value: formatarArea(area) },
        buildArea && { icon: <Home size={20} />, label: 'Área construída', value: formatarArea(buildArea) },
        bedrooms && { icon: <BedDouble size={20} />, label: 'Dormitórios', value: bedrooms },
        bathrooms && { icon: <Bath size={20} />, label: 'Banheiros', value: bathrooms },
        parkingSpots && { icon: <Car size={20} />, label: 'Vagas', value: parkingSpots },
        constructionYear && { icon: <Calendar size={20} />, label: 'Ano de construção', value: constructionYear },
    ].filter(Boolean) as PropertyFeature[];

    // Todas as características
    const allFeatures = [...mainFeatures, ...additionalFeatures];

    // Animações
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className={cn("py-10", className)}>
            {/* Características principais */}
            {allFeatures.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">Características</h2>

                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        {allFeatures.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                className="flex items-center gap-4 p-4 rounded-lg bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow"
                                variants={item}
                            >
                                <div className="p-3 rounded-full bg-primary-50 text-primary-600">
                                    {feature.icon}
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500">{feature.label}</p>
                                    <p className="text-base font-semibold text-neutral-900">{feature.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            )}

            {/* Amenidades */}
            {amenities.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">Comodidades</h2>

                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        {amenities.map((amenityType) => {
                            const amenity = amenityMap[amenityType];
                            return (
                                <motion.div
                                    key={amenityType}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors"
                                    variants={item}
                                >
                                    <div className="text-primary-600">
                                        {amenity.icon}
                                    </div>
                                    <span className="text-neutral-800">{amenity.label}</span>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default PropertyFeatures; 