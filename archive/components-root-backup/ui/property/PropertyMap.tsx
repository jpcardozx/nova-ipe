'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    MapPin,
    School,
    ShoppingBag,
    Beer,
    Stethoscope,
    Bus,
    Layers,
    Search,
    Navigation,
    Bike,
    Car,
    Building,
    Trees as Park,
    Store,
    Coffee
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export type NearbyPlace = {
    type: 'school' | 'shopping' | 'restaurant' | 'hospital' | 'transportation' | 'other' | 'park' | 'gym' | 'bank' | 'supermarket' | 'pharmacy' | 'coffee';
    name: string;
    distance: string; // e.g., "500m" ou "2km"
    description?: string;
    walkTime?: string; // tempo de caminhada (e.g., "5 min")
    carTime?: string; // tempo de carro (e.g., "2 min")
    rating?: number; // 1-5
};

export type PropertyMapProps = {
    address: string;
    location: {
        lat: number;
        lng: number;
    };
    nearbyPlaces?: NearbyPlace[];
    zoom?: number;
    className?: string;
    showDistance?: boolean;
    initialCategory?: 'all' | NearbyPlace['type'];
    mapType?: 'roadmap' | 'satellite' | 'hybrid'; // tipo de mapa do Google Maps
    animateEntrance?: boolean;
    showRatings?: boolean;
};

// Função utilitária para obter o ícone correspondente ao tipo de estabelecimento
const getPlaceIcon = (type: NearbyPlace['type']) => {
    switch (type) {
        case 'school':
            return <School strokeWidth={1.5} />;
        case 'shopping':
            return <ShoppingBag strokeWidth={1.5} />;
        case 'restaurant':
            return <Beer strokeWidth={1.5} />;
        case 'hospital':
            return <Stethoscope strokeWidth={1.5} />;
        case 'transportation':
            return <Bus strokeWidth={1.5} />;
        case 'park':
            return <Park strokeWidth={1.5} />;
        case 'supermarket':
            return <Store strokeWidth={1.5} />;
        case 'coffee':
            return <Coffee strokeWidth={1.5} />;
        case 'bank':
            return <Building strokeWidth={1.5} />;
        default:
            return <MapPin strokeWidth={1.5} />;
    }
};

// Função utilitária para obter a cor correspondente ao tipo de estabelecimento
const getPlaceColor = (type: NearbyPlace['type']) => {
    switch (type) {
        case 'school':
            return 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100';
        case 'shopping':
            return 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100';
        case 'restaurant':
            return 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100';
        case 'hospital':
            return 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100';
        case 'transportation':
            return 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100';
        case 'park':
            return 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100';
        case 'supermarket':
            return 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100';
        case 'coffee':
            return 'bg-brown-50 text-amber-700 border-amber-100 hover:bg-amber-100';
        case 'bank':
            return 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100';
        default:
            return 'bg-neutral-50 text-neutral-600 border-neutral-100 hover:bg-neutral-100';
    }
};

// Função para formatar tipo para exibição
const formatPlaceType = (type: NearbyPlace['type'] | 'all') => {
    const typeNames: Record<NearbyPlace['type'] | 'all', string> = {
        all: 'Todos',
        school: 'Escolas',
        shopping: 'Comércio',
        restaurant: 'Restaurantes',
        hospital: 'Saúde',
        transportation: 'Transporte',
        park: 'Parques',
        gym: 'Academias',
        bank: 'Bancos',
        supermarket: 'Supermercados',
        pharmacy: 'Farmácias',
        coffee: 'Cafeterias',
        other: 'Outros'
    };

    return typeNames[type] || type;
};

export function PropertyMap({
    address,
    location,
    nearbyPlaces = [],
    zoom = 15,
    className,
    showDistance = true,
    initialCategory = 'all',
    mapType = 'roadmap',
    animateEntrance = true,
    showRatings = true,
}: PropertyMapProps) {
    const [activeCategory, setActiveCategory] = useState<NearbyPlace['type'] | 'all'>(initialCategory);
    const [hoveredPlace, setHoveredPlace] = useState<number | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const mapRef = useRef(null);

    // Simular carregamento do mapa
    useEffect(() => {
        const timer = setTimeout(() => {
            setMapLoaded(true);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    // Categorias únicas presentes nos locais próximos
    const categories = Array.from(
        new Set(['all', ...nearbyPlaces.map((place) => place.type)])
    ) as Array<NearbyPlace['type'] | 'all'>;

    // Filtra os locais com base na categoria selecionada
    const filteredPlaces = activeCategory === 'all'
        ? nearbyPlaces
        : nearbyPlaces.filter((place) => place.type === activeCategory);

    // Gera a URL para o iframe do Google Maps
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(address)}&zoom=${zoom}&maptype=${mapType}`;

    // Animações
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
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

    // Componente para exibir as estrelas de avaliação
    const RatingStars = ({ rating }: { rating: number }) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        return (
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => {
                    if (i < fullStars) {
                        return <span key={i} className="text-amber-400 text-xs">★</span>;
                    } else if (i === fullStars && hasHalfStar) {
                        return <span key={i} className="text-amber-400 text-xs">✭</span>;
                    } else {
                        return <span key={i} className="text-neutral-300 text-xs">★</span>;
                    }
                })}
                <span className="text-xs text-neutral-500 ml-1">{rating.toFixed(1)}</span>
            </div>
        );
    };

    return (
        <div className={cn("w-full", className)}>
            <div className="mb-10">
                <h2 className="text-3xl font-bold mb-3 text-neutral-900">Localização</h2>

                <div className="flex items-center mb-6">
                    <MapPin size={20} className="text-primary-500 mr-2 flex-shrink-0" />
                    <div>
                        <p className="text-lg text-neutral-700">{address}</p>
                        <div className="flex items-center gap-4 mt-2">
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary-500 hover:text-primary-600 flex items-center"
                            >
                                <Search size={14} className="mr-1" />
                                Ver no Google Maps
                            </a>

                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary-500 hover:text-primary-600 flex items-center"
                            >
                                <Navigation size={14} className="mr-1" />
                                Como chegar
                            </a>
                        </div>
                    </div>
                </div>

                {/* Mapa */}
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl shadow-md">
                    {/* Mapa simulado durante o carregamento */}
                    <AnimatePresence>
                        {!mapLoaded && (
                            <motion.div
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-neutral-100 flex items-center justify-center z-10"
                            >
                                <div className="text-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                        className="mx-auto mb-3 w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
                                    />
                                    <p className="text-sm text-neutral-600">Carregando mapa...</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Em um ambiente de produção real, use um mapa interativo como Google Maps, Mapbox, etc. */}
                    <div
                        ref={mapRef}
                        className={cn(
                            "absolute inset-0 bg-neutral-100 transition-opacity duration-500",
                            mapLoaded ? "opacity-100" : "opacity-0"
                        )}
                    >
                        <div className="absolute inset-0 bg-cover bg-center" style={{
                            backgroundImage: `url('/images/map-placeholder.jpg')`,
                            opacity: 0.9
                        }} />

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                                <div className="absolute -top-12 -left-12 w-24 h-24 bg-primary-500/20 rounded-full animate-pulse" />
                                <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary-500/40 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                                <div className="w-8 h-8 bg-primary-500 rounded-full border-4 border-white shadow-lg relative z-10 flex items-center justify-center">
                                    <MapPin size={16} className="text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Em produção, você usaria algo como: */}
                        {/* <iframe
              title="Property Location"
              width="100%"
              height="100%"
              frameBorder="0"
              src={mapUrl}
              allowFullScreen
            ></iframe> */}
                    </div>

                    {/* Botões de controle de mapa */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                        <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center hover:bg-neutral-50">
                            <Layers size={16} className="text-neutral-700" />
                        </button>
                    </div>
                </div>

                {/* Informações adicionais de localização */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-neutral-50 rounded-lg p-5 border border-neutral-100">
                        <h3 className="text-lg font-medium mb-3">Informações Adicionais</h3>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center mr-3 flex-shrink-0">
                                    <Navigation size={16} className="text-primary-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Coordenadas</p>
                                    <p className="text-neutral-600 text-sm">Latitude: {location.lat.toFixed(6)}, Longitude: {location.lng.toFixed(6)}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center mr-3 flex-shrink-0">
                                    <Car size={16} className="text-primary-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Acesso</p>
                                    <p className="text-neutral-600 text-sm">Fácil acesso para veículos e transporte público</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center mr-3 flex-shrink-0">
                                    <Building size={16} className="text-primary-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Bairro</p>
                                    <p className="text-neutral-600 text-sm">Região de alto desenvolvimento</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-50 rounded-lg p-5 border border-neutral-100">
                        <h3 className="text-lg font-medium mb-3">Como Chegar</h3>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center mr-3 flex-shrink-0">
                                    <Car size={16} className="text-primary-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">De carro</p>
                                    <p className="text-neutral-600 text-sm">15 minutos do centro da cidade</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center mr-3 flex-shrink-0">
                                    <Bus size={16} className="text-primary-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Transporte público</p>
                                    <p className="text-neutral-600 text-sm">Linhas de ônibus 101, 202 e 303 disponíveis a 200m</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center mr-3 flex-shrink-0">
                                    <Bike size={16} className="text-primary-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Ciclovia próxima</p>
                                    <p className="text-neutral-600 text-sm">Acesso à ciclovia municipal a 500m</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {nearbyPlaces.length > 0 && (
                <div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold mb-2 text-neutral-900">Proximidades</h2>
                            <p className="text-neutral-600">Descubra o que há ao redor deste imóvel</p>
                        </div>

                        {/* Filtros por categoria */}
                        <div className="flex flex-wrap gap-2 max-w-full overflow-x-auto pb-1">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={cn(
                                        "px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-all",
                                        activeCategory === category
                                            ? "bg-primary-500 text-white shadow-sm"
                                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                    )}
                                >
                                    {formatPlaceType(category)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        variants={animateEntrance ? containerVariants : {}}
                        initial={animateEntrance ? "hidden" : undefined}
                        animate={animateEntrance ? "visible" : undefined}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {filteredPlaces.map((place, index) => (
                            <motion.div
                                key={index}
                                variants={animateEntrance ? itemVariants : {}}
                                onMouseEnter={() => setHoveredPlace(index)}
                                onMouseLeave={() => setHoveredPlace(null)}
                                className={cn(
                                    "p-4 rounded-xl border flex items-start transition-all",
                                    "shadow-sm hover:shadow-md",
                                    getPlaceColor(place.type),
                                    hoveredPlace === index && "scale-[1.02]"
                                )}
                            >
                                <div className="mr-4 mt-1 bg-white/80 w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
                                    {getPlaceIcon(place.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-medium text-lg leading-tight">{place.name}</h3>
                                        {showDistance && (
                                            <span className="bg-white/70 backdrop-blur-sm text-xs font-medium py-1 px-2 rounded-full shadow-sm">
                                                {place.distance}
                                            </span>
                                        )}
                                    </div>

                                    {showRatings && place.rating && (
                                        <div className="mt-1">
                                            <RatingStars rating={place.rating} />
                                        </div>
                                    )}

                                    {place.description && (
                                        <p className="text-sm mt-1 text-neutral-600">{place.description}</p>
                                    )}

                                    {(place.walkTime || place.carTime) && (
                                        <div className="flex gap-3 mt-2">
                                            {place.walkTime && (
                                                <div className="flex items-center text-xs text-neutral-600">
                                                    <span className="mr-1">🚶</span> {place.walkTime}
                                                </div>
                                            )}
                                            {place.carTime && (
                                                <div className="flex items-center text-xs text-neutral-600">
                                                    <span className="mr-1">🚗</span> {place.carTime}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {filteredPlaces.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-neutral-50 rounded-lg border border-neutral-200">
                            <p className="text-neutral-500 text-lg">Não há locais da categoria selecionada nas proximidades.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default PropertyMap; 