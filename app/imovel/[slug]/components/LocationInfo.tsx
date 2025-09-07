'use client';

import React from 'react';
import { MapPin, Navigation, Clock, Car, Train, Plane, ShoppingBag, GraduationCap, Heart, Coffee } from 'lucide-react';

interface LocationInfoProps {
    city?: string;
    location?: string;
    address?: string;
}

export default function LocationInfo({
    city,
    location,
    address
}: LocationInfoProps) {
    // Informações específicas sobre Guararema (pode ser dinamizado futuramente)
    const isGuararema = city?.toLowerCase().includes('guararema') ||
        location?.toLowerCase().includes('guararema');

    const locationHighlights = isGuararema ? [
        {
            icon: Navigation,
            title: 'Acesso Rodoviário',
            description: 'Próximo à Via Dutra, fácil acesso à São Paulo e interior',
            highlight: true
        },
        {
            icon: Clock,
            title: 'Tempo para SP',
            description: 'Aproximadamente 1h até a capital paulista',
            highlight: false
        },
        {
            icon: Car,
            title: 'Transporte',
            description: 'Acesso por rodovias estaduais e federais',
            highlight: false
        },
        {
            icon: Coffee,
            title: 'Qualidade de Vida',
            description: 'Cidade do interior com tranquilidade e natureza',
            highlight: true
        }
    ] : [
        {
            icon: MapPin,
            title: 'Localização',
            description: location || 'Região bem localizada',
            highlight: true
        },
        {
            icon: Navigation,
            title: 'Acesso',
            description: 'Boa conectividade com principais vias',
            highlight: false
        }
    ];

    const nearbyServices = isGuararema ? [
        { icon: ShoppingBag, name: 'Comércio Local', distance: 'Centro da cidade' },
        { icon: GraduationCap, name: 'Escolas', distance: 'Diversas opções' },
        { icon: Heart, name: 'Hospital', distance: 'Santa Casa de Guararema' },
        { icon: Train, name: 'Estação Ferroviária', distance: 'Centro histórico' }
    ] : [];

    if (!location && !city && nearbyServices.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Localização e Região
            </h3>

            {/* Localização Principal */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-900 mb-1">
                            {location || city || 'Localização'}
                        </h4>
                        {address && (
                            <p className="text-sm text-blue-700">{address}</p>
                        )}
                        <p className="text-sm text-blue-600 mt-1">
                            {isGuararema ?
                                'Guararema - SP, a cidade que preserva história e oferece qualidade de vida' :
                                'Região com boa infraestrutura e acessibilidade'
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Destaques da Localização */}
            {locationHighlights.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-medium text-slate-800 mb-3">Destaques da Região</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {locationHighlights.map((highlight, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border ${highlight.highlight
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-slate-50 border-slate-200'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <highlight.icon className={`w-4 h-4 mt-0.5 ${highlight.highlight ? 'text-green-600' : 'text-slate-600'
                                        }`} />
                                    <div>
                                        <h5 className={`font-medium text-sm ${highlight.highlight ? 'text-green-800' : 'text-slate-800'
                                            }`}>
                                            {highlight.title}
                                        </h5>
                                        <p className={`text-xs mt-1 ${highlight.highlight ? 'text-green-700' : 'text-slate-600'
                                            }`}>
                                            {highlight.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Serviços Próximos */}
            {nearbyServices.length > 0 && (
                <div>
                    <h4 className="font-medium text-slate-800 mb-3">Serviços e Comodidades</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {nearbyServices.map((service, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                                <service.icon className="w-4 h-4 text-slate-500" />
                                <div className="flex-1">
                                    <span className="text-sm font-medium text-slate-800">{service.name}</span>
                                    <p className="text-xs text-slate-600">{service.distance}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
