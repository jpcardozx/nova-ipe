'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    BedDouble,
    Bath,
    CarFront,
    Maximize2,
    Trees,
    Wifi,
    UtensilsCrossed,
    Waves,
    Dog,
    Dumbbell,
    Lock,
    Home,
    Coffee,
    Check,
    Sofa,
    Ruler,
    CalendarClock,
    Sun,
    MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Feature {
    icon?: React.ReactNode;
    name: string;
    value?: string | number;
    description?: string;
    highlight?: boolean;
}

export interface PropertyFeaturesProps {
    features: Feature[];
    amenities?: string[];
    className?: string;
    iconClassName?: string;
    showAmenityCount?: number; // Número de amenidades a mostrar inicialmente
    animateEntrance?: boolean;
    highlightedFeatures?: string[]; // Lista de nomes de features para destacar
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
    'Piscina': <Waves size={22} />,
    'Jardim': <Trees size={22} />,
    'Wi-Fi': <Wifi size={22} />,
    'Academia': <Dumbbell size={22} />,
    'Churrasqueira': <UtensilsCrossed size={22} />,
    'Pet friendly': <Dog size={22} />,
    'Segurança 24h': <Lock size={22} />,
    'Área gourmet': <Coffee size={22} />,
    'Móveis planejados': <Sofa size={22} />,
    'Varanda': <Sun size={22} />,
};

export function PropertyFeatures({
    features,
    amenities = [],
    className,
    iconClassName,
    showAmenityCount = 6,
    animateEntrance = true,
    highlightedFeatures = [],
}: PropertyFeaturesProps) {
    const [showAllAmenities, setShowAllAmenities] = React.useState(false);
    const displayedAmenities = showAllAmenities ? amenities : amenities.slice(0, showAmenityCount);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    };

    // Detalhes principais do imóvel (quartos, banheiros, etc.)
    const renderFeature = (feature: Feature, index: number) => {
        const isHighlighted = feature.highlight || highlightedFeatures.includes(feature.name);

        const FeatureComponent = animateEntrance ? motion.div : 'div';
        const featureProps = animateEntrance ? {
            variants: itemVariants,
            initial: "hidden",
            animate: "visible",
            custom: index
        } : {};

        return (
            <FeatureComponent
                key={index}
                {...featureProps}
                className={cn(
                    "flex flex-col items-center p-5 rounded-xl transition-all overflow-hidden",
                    "border shadow-sm",
                    isHighlighted
                        ? "bg-gradient-to-br from-primary-50 to-white border-primary-200"
                        : "bg-white hover:bg-neutral-50 border-neutral-100"
                )}
            >
                <div className={cn(
                    "w-14 h-14 flex items-center justify-center rounded-full mb-4",
                    isHighlighted
                        ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white"
                        : "bg-neutral-100 text-neutral-600",
                    iconClassName
                )}>
                    {feature.icon}
                </div>
                <div className="text-center">
                    <span className={cn(
                        "block text-2xl font-bold mb-1",
                        isHighlighted ? "text-primary-600" : "text-neutral-900"
                    )}>
                        {feature.value !== undefined ? feature.value : '-'}
                    </span>
                    <span className="text-sm font-medium text-neutral-600">{feature.name}</span>
                    {feature.description && (
                        <p className="text-xs text-neutral-500 mt-2">{feature.description}</p>
                    )}
                </div>
            </FeatureComponent>
        );
    };

    // Comodidades do imóvel (piscina, academia, etc.)
    const renderAmenity = (amenity: string, index: number) => {
        const icon = AMENITY_ICONS[amenity] || <Check size={22} />;

        const AmenityComponent = animateEntrance ? motion.div : 'div';
        const amenityProps = animateEntrance ? {
            variants: itemVariants,
            initial: "hidden",
            animate: "visible",
            custom: index
        } : {};

        return (
            <AmenityComponent
                key={index}
                {...amenityProps}
                className="flex items-center p-4 bg-white rounded-xl border border-neutral-100 shadow-sm hover:shadow transition-shadow group"
            >
                <div className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-full bg-primary-50 text-primary-500 mr-4 group-hover:bg-primary-100 transition-colors",
                    iconClassName
                )}>
                    {icon}
                </div>
                <span className="text-neutral-800 font-medium">{amenity}</span>
            </AmenityComponent>
        );
    };

    const FeaturesContainer = animateEntrance ? motion.div : 'div';
    const featuresContainerProps = animateEntrance ? {
        variants: containerVariants,
        initial: "hidden",
        animate: "visible"
    } : {};

    const AmenitiesContainer = animateEntrance ? motion.div : 'div';
    const amenitiesContainerProps = animateEntrance ? {
        variants: containerVariants,
        initial: "hidden",
        animate: "visible"
    } : {};

    return (
        <div className={cn("w-full", className)}>
            {features.length > 0 && (
                <div className="mb-12">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-2 text-neutral-900">Características</h2>
                            <p className="text-neutral-600">Detalhes principais do imóvel</p>
                        </div>
                    </div>

                    <FeaturesContainer
                        {...featuresContainerProps}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
                    >
                        {features.map(renderFeature)}
                    </FeaturesContainer>
                </div>
            )}

            {amenities.length > 0 && (
                <div>
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-2 text-neutral-900">Comodidades</h2>
                            <p className="text-neutral-600">O que este imóvel oferece</p>
                        </div>
                    </div>

                    <AmenitiesContainer
                        {...amenitiesContainerProps}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {displayedAmenities.map(renderAmenity)}
                    </AmenitiesContainer>

                    {/* Botão para mostrar mais/menos */}
                    {amenities.length > showAmenityCount && (
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => setShowAllAmenities(!showAllAmenities)}
                                className="px-6 py-2 border border-neutral-300 rounded-full text-neutral-700 hover:bg-neutral-50 font-medium inline-flex items-center transition-colors"
                            >
                                {showAllAmenities ? 'Mostrar menos' : `Ver todas as ${amenities.length} comodidades`}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Helpers para criar características padronizadas
export const createStandardFeatures = ({
    area,
    terrainArea,
    bedrooms,
    bathrooms,
    parkingSpots,
    constructionYear,
    floors,
    distanceToCenter,
}: {
    area?: number;
    terrainArea?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
    constructionYear?: number;
    floors?: number;
    distanceToCenter?: number;
}): Feature[] => {
    const features: Feature[] = [];

    if (area !== undefined) {
        features.push({
            icon: <Maximize2 size={24} />,
            name: 'Área construída',
            value: `${area}m²`,
            highlight: true
        });
    }

    if (terrainArea !== undefined) {
        features.push({
            icon: <Ruler size={24} />,
            name: 'Área do terreno',
            value: `${terrainArea}m²`,
        });
    }

    if (bedrooms !== undefined) {
        features.push({
            icon: <BedDouble size={24} />,
            name: bedrooms === 1 ? 'Quarto' : 'Quartos',
            value: bedrooms,
            highlight: true
        });
    }

    if (bathrooms !== undefined) {
        features.push({
            icon: <Bath size={24} />,
            name: bathrooms === 1 ? 'Banheiro' : 'Banheiros',
            value: bathrooms,
            highlight: true
        });
    }

    if (parkingSpots !== undefined) {
        features.push({
            icon: <CarFront size={24} />,
            name: parkingSpots === 1 ? 'Vaga' : 'Vagas',
            value: parkingSpots
        });
    }

    if (constructionYear !== undefined) {
        features.push({
            icon: <CalendarClock size={24} />,
            name: 'Ano de construção',
            value: constructionYear
        });
    }

    if (floors !== undefined) {
        features.push({
            icon: <Home size={24} />,
            name: floors === 1 ? 'Pavimento' : 'Pavimentos',
            value: floors
        });
    }

    if (distanceToCenter !== undefined) {
        features.push({
            icon: <MapPin size={24} />,
            name: 'Dist. ao Centro',
            value: `${distanceToCenter}km`
        });
    }

    return features;
};

export default PropertyFeatures; 