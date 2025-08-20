'use client';

import React, { useState } from 'react';
import { Phone, MessageCircle, Calendar, Share2, Heart } from 'lucide-react';

interface PropertyContactProps {
    phoneNumber?: string;
    whatsappNumber?: string;
    price?: number;
    propertyId?: string;
    propertyTitle?: string;
}

export default function PropertyContact({
    phoneNumber,
    whatsappNumber,
    price,
    propertyId,
    propertyTitle
}: PropertyContactProps) {
    const [isFavorited, setIsFavorited] = useState(false);

    const handleWhatsAppContact = () => {
        if (!whatsappNumber) return;

        const message = encodeURIComponent(
            `Olá! Tenho interesse no imóvel: ${propertyTitle || 'Imóvel'} (ID: ${propertyId || 'N/A'})`
        );
        const url = `https://wa.me/55${whatsappNumber.replace(/\D/g, '')}?text=${message}`;
        window.open(url, '_blank');
    };

    const handlePhoneCall = () => {
        if (!phoneNumber) return;
        window.location.href = `tel:${phoneNumber}`;
    };

    const handleScheduleVisit = () => {
        // Implementar agendamento de visita
        console.log('Agendar visita');
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: propertyTitle || 'Imóvel',
                    url: window.location.href
                });
            } catch (error) {
                console.log('Compartilhamento cancelado');
            }
        } else {
            // Fallback para navegadores que não suportam Web Share API
            navigator.clipboard.writeText(window.location.href);
            // Aqui você poderia mostrar um toast de confirmação
        }
    };

    const toggleFavorite = () => {
        setIsFavorited(!isFavorited);
        // Aqui você implementaria a lógica para salvar nos favoritos
    };

    return (
        <div className="sticky bottom-0 sm:relative bg-white border-t border-slate-200 sm:border sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg sm:shadow-md">
            {/* Preço (apenas mobile) */}
            {price && (
                <div className="sm:hidden mb-4">
                    <div className="text-2xl font-bold text-slate-900">
                        R$ {price.toLocaleString('pt-BR')}
                    </div>
                </div>
            )}

            <div className="space-y-3 sm:space-y-4">
                {/* Botões principais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {whatsappNumber && (
                        <button
                            onClick={handleWhatsAppContact}
                            className="flex items-center justify-center gap-2 sm:gap-3 w-full px-4 sm:px-6 py-3 sm:py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="text-sm sm:text-base">WhatsApp</span>
                        </button>
                    )}

                    {phoneNumber && (
                        <button
                            onClick={handlePhoneCall}
                            className="flex items-center justify-center gap-2 sm:gap-3 w-full px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="text-sm sm:text-base">Ligar</span>
                        </button>
                    )}
                </div>

                {/* Agendar visita */}
                <button
                    onClick={handleScheduleVisit}
                    className="flex items-center justify-center gap-2 sm:gap-3 w-full px-4 sm:px-6 py-3 sm:py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-base">Agendar Visita</span>
                </button>

                {/* Ações secundárias */}
                <div className="flex gap-2 sm:gap-3">
                    <button
                        onClick={toggleFavorite}
                        className={`flex items-center justify-center gap-2 flex-1 px-4 py-3 sm:py-4 border rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${isFavorited
                                ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        <Heart
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorited ? 'fill-current' : ''
                                }`}
                        />
                        <span className="text-sm sm:text-base hidden sm:inline">
                            {isFavorited ? 'Favoritado' : 'Favoritar'}
                        </span>
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex items-center justify-center gap-2 flex-1 px-4 py-3 sm:py-4 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-medium transition-all duration-300 hover:bg-slate-100 hover:scale-105 active:scale-95"
                    >
                        <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base hidden sm:inline">
                            Compartilhar
                        </span>
                    </button>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-slate-500 text-center">
                Entre em contato para mais informações sobre este imóvel
            </div>
        </div>
    );
}
