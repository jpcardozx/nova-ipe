'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    MapPin,
    ChevronDown,
    ChevronUp,
    Star,
    Shield,
    Zap
} from 'lucide-react';
import { cn, formatarArea } from '@/lib/utils';
import Button from '@/components/ui/button';

// Tipos unificados
export interface FeatureUnified {
    icon?: React.ReactNode;
    name: string;
    value?: string | number;
    description?: string;
    highlight?: boolean;
    category?: 'basic' | 'comfort' | 'luxury' | 'security';
}

export interface PropertyFeaturesUnifiedProps {
    // Características básicas
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
    suites?: number;
    livingRooms?: number;
    kitchens?: number;
    serviceArea?: boolean;

    // Features customizadas
    features?: FeatureUnified[];
    amenities?: string[];

    // Configurações de exibição
    className?: string;
    variant?: 'default' | 'compact' | 'detailed' | 'grid';
    showCategories?: boolean;
    showAmenityCount?: number;
    animateEntrance?: boolean;
    highlightedFeatures?: string[];

    // Funcionalidades avançadas
    allowExpansion?: boolean;
    showComparison?: boolean;
    showTooltips?: boolean;
}

// Ícones padrão para amenidades
const AMENITY_ICONS: Record<string, React.ReactNode> = {
    // Lazer
    'Piscina': <Waves className="w-5 h-5" />,
    'Jardim': <Trees className="w-5 h-5" />,
    'Churrasqueira': <UtensilsCrossed className="w-5 h-5" />,
    'Playground': <Home className="w-5 h-5" />,
    'Quadra': <Home className="w-5 h-5" />,
    'Salão de Festas': <Coffee className="w-5 h-5" />,

    // Conforto
    'Wi-Fi': <Wifi className="w-5 h-5" />,
    'Ar Condicionado': <Sun className="w-5 h-5" />,
    'Aquecimento': <Zap className="w-5 h-5" />,
    'Mobiliado': <Sofa className="w-5 h-5" />,

    // Exercício
    'Academia': <Dumbbell className="w-5 h-5" />,
    'Sauna': <Star className="w-5 h-5" />,
    'Spa': <Star className="w-5 h-5" />,

    // Segurança
    'Portaria 24h': <Shield className="w-5 h-5" />,
    'Segurança': <Lock className="w-5 h-5" />,
    'Circuito Fechado': <Shield className="w-5 h-5" />,
    'Controle de Acesso': <Lock className="w-5 h-5" />,

    // Pets
    'Pet Friendly': <Dog className="w-5 h-5" />,
    'Pet Place': <Dog className="w-5 h-5" />,

    // Padrão
    'default': <Check className="w-5 h-5" />
};

// Categorias de amenidades
const AMENITY_CATEGORIES = {
    basic: ['Garagem', 'Área de Serviço', 'Cozinha'],
    comfort: ['Wi-Fi', 'Ar Condicionado', 'Aquecimento', 'Mobiliado'],
    luxury: ['Piscina', 'Academia', 'Sauna', 'Spa', 'Churrasqueira'],
    security: ['Portaria 24h', 'Segurança', 'Circuito Fechado', 'Controle de Acesso']
};

/**
 * Cria características padrão baseadas nos dados básicos do imóvel
 */
export function createStandardFeaturesUnified(props: {
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
    suites?: number;
    livingRooms?: number;
}): FeatureUnified[] {
    const features: FeatureUnified[] = [];

    if (props.area) {
        features.push({
            icon: <Maximize2 className="w-5 h-5" />,
            name: 'Área Total',
            value: formatarArea(props.area),
            category: 'basic',
            highlight: true
        });
    }

    if (props.bedrooms) {
        features.push({
            icon: <BedDouble className="w-5 h-5" />,
            name: props.bedrooms === 1 ? 'Quarto' : 'Quartos',
            value: props.bedrooms,
            category: 'basic',
            highlight: true
        });
    }

    if (props.bathrooms) {
        features.push({
            icon: <Bath className="w-5 h-5" />,
            name: props.bathrooms === 1 ? 'Banheiro' : 'Banheiros',
            value: props.bathrooms,
            category: 'basic'
        });
    }

    if (props.parkingSpots) {
        features.push({
            icon: <CarFront className="w-5 h-5" />,
            name: props.parkingSpots === 1 ? 'Vaga' : 'Vagas',
            value: props.parkingSpots,
            category: 'basic'
        });
    }

    if (props.suites) {
        features.push({
            icon: <BedDouble className="w-5 h-5" />,
            name: props.suites === 1 ? 'Suíte' : 'Suítes',
            value: props.suites,
            category: 'comfort'
        });
    }

    if (props.livingRooms) {
        features.push({
            icon: <Sofa className="w-5 h-5" />,
            name: props.livingRooms === 1 ? 'Sala' : 'Salas',
            value: props.livingRooms,
            category: 'basic'
        });
    }

    return features;
}

/**
 * PropertyFeaturesUnified - Componente unificado para exibir características de propriedades
 */
export default function PropertyFeaturesUnified({
    area,
    bedrooms,
    bathrooms,
    parkingSpots,
    suites,
    livingRooms,
    kitchens,
    serviceArea,
    features = [],
    amenities = [],
    className,
    variant = 'default',
    showCategories = false,
    showAmenityCount = 6,
    animateEntrance = true,
    highlightedFeatures = [],
    allowExpansion = true,
    showComparison = false,
    showTooltips = false
}: PropertyFeaturesUnifiedProps) {
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['basic']));

    // Combinar características padrão com customizadas
    const standardFeatures = useMemo(() =>
        createStandardFeaturesUnified({
            area,
            bedrooms,
            bathrooms,
            parkingSpots,
            suites,
            livingRooms
        }), [area, bedrooms, bathrooms, parkingSpots, suites, livingRooms]
    );

    const allFeatures = useMemo(() => [
        ...standardFeatures,
        ...features
    ], [standardFeatures, features]);

    // Agrupar características por categoria
    const featuresByCategory = useMemo(() => {
        const grouped: Record<string, FeatureUnified[]> = {
            basic: [],
            comfort: [],
            luxury: [],
            security: []
        };

        allFeatures.forEach(feature => {
            const category = feature.category || 'basic';
            if (!grouped[category]) grouped[category] = [];
            grouped[category].push(feature);
        });

        return grouped;
    }, [allFeatures]);

    // Amenidades visíveis
    const visibleAmenities = showAllAmenities
        ? amenities
        : amenities.slice(0, showAmenityCount);

    const hasMoreAmenities = amenities.length > showAmenityCount;

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    const categoryTitles = {
        basic: 'Características Principais',
        comfort: 'Conforto',
        luxury: 'Lazer e Luxo',
        security: 'Segurança'
    };

    const categoryIcons = {
        basic: <Home className="w-5 h-5" />,
        comfort: <Star className="w-5 h-5" />,
        luxury: <Sun className="w-5 h-5" />,
        security: <Shield className="w-5 h-5" />
    };

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
        visible: { opacity: 1, y: 0 }
    };

    const variantClasses = {
        default: 'space-y-6',
        compact: 'space-y-4',
        detailed: 'space-y-8',
        grid: 'grid grid-cols-1 md:grid-cols-2 gap-6'
    };

    return (
        <motion.div
            className={cn(variantClasses[variant], className)}
            variants={animateEntrance ? containerVariants : undefined}
            initial={animateEntrance ? "hidden" : undefined}
            animate={animateEntrance ? "visible" : undefined}
        >
            {/* Características organizadas por categoria */}
            {showCategories ? (
                Object.entries(featuresByCategory).map(([categoryKey, categoryFeatures]) => {
                    if (categoryFeatures.length === 0) return null;

                    const isExpanded = expandedCategories.has(categoryKey);

                    return (
                        <motion.div
                            key={categoryKey}
                            className="bg-white rounded-lg border border-stone-200 overflow-hidden"
                            variants={animateEntrance ? itemVariants : undefined}
                        >
                            <button
                                onClick={() => toggleCategory(categoryKey)}
                                className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    {categoryIcons[categoryKey as keyof typeof categoryIcons]}
                                    <h3 className="font-semibold text-stone-900">
                                        {categoryTitles[categoryKey as keyof typeof categoryTitles]}
                                    </h3>
                                    <span className="text-sm text-stone-500">
                                        ({categoryFeatures.length})
                                    </span>
                                </div>
                                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {categoryFeatures.map((feature, index) => (
                                                <FeatureItem
                                                    key={`${categoryKey}-${index}`}
                                                    feature={feature}
                                                    isHighlighted={highlightedFeatures.includes(feature.name)}
                                                    showTooltip={showTooltips}
                                                    variant={variant}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })
            ) : (
                /* Exibição tradicional sem categorias */
                <motion.div
                    className="bg-white rounded-lg p-6 border border-stone-200"
                    variants={animateEntrance ? itemVariants : undefined}
                >
                    <h3 className="text-lg font-semibold text-stone-900 mb-4">
                        Características
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {allFeatures.map((feature, index) => (
                            <FeatureItem
                                key={index}
                                feature={feature}
                                isHighlighted={highlightedFeatures.includes(feature.name)}
                                showTooltip={showTooltips}
                                variant={variant}
                            />
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Amenidades */}
            {amenities.length > 0 && (
                <motion.div
                    className="bg-white rounded-lg p-6 border border-stone-200"
                    variants={animateEntrance ? itemVariants : undefined}
                >
                    <h3 className="text-lg font-semibold text-stone-900 mb-4">
                        Amenidades
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {visibleAmenities.map((amenity, index) => (
                            <motion.div
                                key={index}
                                className="flex items-center space-x-3 p-3 bg-stone-50 rounded-lg"
                                variants={animateEntrance ? itemVariants : undefined}
                            >
                                {AMENITY_ICONS[amenity] || AMENITY_ICONS.default}
                                <span className="text-sm font-medium text-stone-700">
                                    {amenity}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {hasMoreAmenities && allowExpansion && (
                        <div className="mt-4 text-center">
                            <Button
                                variant="ghost"
                                onClick={() => setShowAllAmenities(!showAllAmenities)}
                                className="text-primary-600 hover:text-primary-700"
                            >
                                {showAllAmenities ? (
                                    <>
                                        <ChevronUp className="w-4 h-4 mr-2" />
                                        Mostrar menos
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="w-4 h-4 mr-2" />
                                        Ver mais {amenities.length - showAmenityCount} amenidades
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}

/**
 * Componente para exibir uma característica individual
 */
function FeatureItem({
    feature,
    isHighlighted,
    showTooltip,
    variant
}: {
    feature: FeatureUnified;
    isHighlighted: boolean;
    showTooltip: boolean;
    variant: string;
}) {
    return (
        <div
            className={cn(
                "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                isHighlighted ? "bg-primary-50 border border-primary-200" : "bg-stone-50",
                variant === 'compact' && "p-2",
                showTooltip && "relative group cursor-help"
            )}
            title={showTooltip ? feature.description : undefined}
        >
            {feature.icon && (
                <div className={cn(
                    "flex-shrink-0",
                    isHighlighted ? "text-primary-600" : "text-stone-600"
                )}>
                    {feature.icon}
                </div>
            )}

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <span className={cn(
                        "font-medium truncate",
                        variant === 'compact' ? "text-sm" : "text-base",
                        isHighlighted ? "text-primary-900" : "text-stone-900"
                    )}>
                        {feature.name}
                    </span>

                    {feature.value && (
                        <span className={cn(
                            "font-bold ml-2 flex-shrink-0",
                            variant === 'compact' ? "text-sm" : "text-base",
                            isHighlighted ? "text-primary-700" : "text-stone-700"
                        )}>
                            {feature.value}
                        </span>
                    )}
                </div>

                {feature.description && variant === 'detailed' && (
                    <p className="text-xs text-stone-500 mt-1 truncate">
                        {feature.description}
                    </p>
                )}
            </div>

            {/* Tooltip */}
            {showTooltip && feature.description && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-stone-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                    {feature.description}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-900"></div>
                </div>
            )}
        </div>
    );
}

// Exports para compatibilidade
export type { FeatureUnified as Feature };
export { createStandardFeaturesUnified as createStandardFeatures };
