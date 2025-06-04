'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Car, Train, Bus, School, Coffee, ShoppingBag, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NearbyPlace {
    type: 'restaurant' | 'shop' | 'school' | 'hospital' | 'park' | 'transport' | 'other';
    name: string;
    distance: string; // Ex: "500m" ou "2.5km"
    walkingTime?: string; // Ex: "5 min"
    drivingTime?: string; // Ex: "2 min"
}

export interface PropertyMapProps {
    address: string;
    city: string;
    state?: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
    staticMapUrl?: string;
    nearbyPlaces?: NearbyPlace[];
    className?: string;
}

export function PropertyMap({
    address,
    city,
    state,
    zipCode,
    latitude,
    longitude,
    staticMapUrl,
    nearbyPlaces = [],
    className,
}: PropertyMapProps) {
    // Formatação do endereço completo
    const fullAddress = [address, city, state, zipCode].filter(Boolean).join(', ');

    // Função para obter ícone com base no tipo do local
    const getPlaceIcon = (type: NearbyPlace['type']) => {
        switch (type) {
            case 'restaurant':
                return <Utensils size={18} />;
            case 'shop':
                return <ShoppingBag size={18} />;
            case 'school':
                return <School size={18} />;
            case 'hospital':
                return <MapPin size={18} />;
            case 'park':
                return <MapPin size={18} />;
            case 'transport':
                return <Bus size={18} />;
            default:
                return <MapPin size={18} />;
        }
    };

    // Fallback URL para mapa estático se não for fornecido
    const mapUrl = staticMapUrl || `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=800x400&markers=color:red%7C${latitude},${longitude}&key=YOUR_API_KEY`;

    // Animações
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className={cn("py-10", className)}>
            <motion.h2
                className="text-2xl font-bold text-neutral-900 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                Localização
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna do mapa */}
                <motion.div
                    className="lg:col-span-2"
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-lg">
                        {staticMapUrl ? (
                            <Image
                                src={mapUrl}
                                alt={`Mapa de localização: ${fullAddress}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 66vw"
                            />
                        ) : (
                            <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                                <div className="text-center p-8">
                                    <MapPin size={48} className="mx-auto mb-4 text-neutral-400" />
                                    <p className="text-neutral-600">Mapa não disponível</p>
                                </div>
                            </div>
                        )}

                        {/* Pin de localização */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-600">
                            <div className="relative">
                                <MapPin size={40} className="drop-shadow-md" />
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full bg-primary-600 shadow-md animate-ping opacity-75"></div>
                            </div>
                        </div>
                    </div>

                    {/* Endereço completo */}
                    <div className="mt-4 flex items-center bg-white p-4 rounded-lg border border-neutral-200 shadow-sm">
                        <MapPin size={20} className="text-primary-600 mr-3 flex-shrink-0" />
                        <p className="text-neutral-800">{fullAddress}</p>
                    </div>
                </motion.div>

                {/* Coluna de informações de proximidade */}                <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Proximidades</h3>

                        {nearbyPlaces.length > 0 ? (
                            <ul className="space-y-4">
                                {nearbyPlaces.map((place, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <div className="p-2 rounded-full bg-primary-50 text-primary-600 mr-3 mt-1">
                                            {getPlaceIcon(place.type)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-neutral-900">{place.name}</p>
                                            <div className="flex items-center text-sm text-neutral-600 mt-1">
                                                <Navigation size={14} className="mr-1" />
                                                <span>{place.distance}</span>

                                                {place.walkingTime && (
                                                    <span className="flex items-center ml-3">
                                                        <Car size={14} className="mr-1" />
                                                        {place.walkingTime}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-6 text-neutral-500">
                                <p>Informações de proximidade não disponíveis</p>
                            </div>
                        )}

                        {/* Informações de transporte */}
                        <div className="mt-6 pt-6 border-t border-neutral-200">
                            <h4 className="font-medium text-neutral-900 mb-3">Transporte</h4>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <div className="p-1.5 rounded-full bg-neutral-100 mr-3">
                                        <Bus size={16} className="text-neutral-700" />
                                    </div>
                                    <span className="text-sm text-neutral-700">Ponto de ônibus a 200m</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="p-1.5 rounded-full bg-neutral-100 mr-3">
                                        <Train size={16} className="text-neutral-700" />
                                    </div>
                                    <span className="text-sm text-neutral-700">Estação a 1.5km</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default PropertyMap; 