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
        <div className="relative sticky bottom-0 sm:relative">
            {/* Enhanced glassmorphism background */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/90 backdrop-blur-xl sm:rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/40 via-transparent to-slate-100/30 sm:rounded-2xl"></div>

            {/* Sophisticated border system */}
            <div className="absolute inset-0 border-t border-slate-200/80 sm:border sm:border-slate-200/60 sm:rounded-2xl"></div>
            <div className="absolute inset-0 sm:border sm:border-white/40 sm:rounded-2xl"></div>

            {/* Subtle top highlight for mobile */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent sm:hidden"></div>

            {/* Premium shadow effects */}
            <div className="absolute inset-x-0 -bottom-2 h-8 bg-gradient-to-r from-transparent via-slate-500/10 to-transparent blur-lg sm:rounded-2xl"></div>

            <div className="relative p-5 sm:p-7 lg:p-9">
                {/* Enhanced mobile price display */}
                {price && (
                    <div className="sm:hidden mb-5">
                        <div className="relative">
                            <div className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                                R$ {price.toLocaleString('pt-BR')}
                            </div>
                            {/* Price shadow effect */}
                            <div className="absolute inset-0 text-3xl font-bold text-slate-700 opacity-0 group-hover:opacity-20 blur-sm">
                                R$ {price.toLocaleString('pt-BR')}
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4 sm:space-y-5">
                    {/* Enhanced primary action buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        {whatsappNumber && (
                            <button
                                onClick={handleWhatsAppContact}
                                className="group relative overflow-hidden"
                            >
                                {/* WhatsApp green gradient with depth */}
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 rounded-2xl"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-green-400/30 via-transparent to-green-800/50 rounded-2xl"></div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/30 via-transparent to-green-800/40 rounded-2xl group-hover:from-emerald-300/40 group-hover:to-green-700/50 transition-all duration-300"></div>

                                {/* Shine animation */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-2xl translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out"></div>

                                <div className="relative flex items-center justify-center gap-3 sm:gap-4 px-5 sm:px-7 py-4 sm:py-5 text-white font-bold rounded-2xl group-hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-green-500/30 group-hover:shadow-2xl group-hover:shadow-green-500/40">
                                    <div className="relative">
                                        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" />
                                        <MessageCircle className="absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 text-green-200 opacity-0 group-hover:opacity-50 transition-all duration-300 blur-sm scale-125" />
                                    </div>
                                    <span className="text-sm sm:text-base tracking-wide">WhatsApp</span>
                                </div>
                            </button>
                        )}

                        {phoneNumber && (
                            <button
                                onClick={handlePhoneCall}
                                className="group relative overflow-hidden"
                            >
                                {/* Blue gradient with sophistication */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-2xl"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-400/30 via-transparent to-blue-800/50 rounded-2xl"></div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/30 via-transparent to-blue-800/40 rounded-2xl group-hover:from-cyan-300/40 group-hover:to-blue-700/50 transition-all duration-300"></div>

                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-2xl translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out"></div>

                                <div className="relative flex items-center justify-center gap-3 sm:gap-4 px-5 sm:px-7 py-4 sm:py-5 text-white font-bold rounded-2xl group-hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-blue-500/30 group-hover:shadow-2xl group-hover:shadow-blue-500/40">
                                    <div className="relative">
                                        <Phone className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" />
                                        <Phone className="absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 text-blue-200 opacity-0 group-hover:opacity-50 transition-all duration-300 blur-sm scale-125" />
                                    </div>
                                    <span className="text-sm sm:text-base tracking-wide">Ligar</span>
                                </div>
                            </button>
                        )}
                    </div>

                    {/* Enhanced schedule visit button */}
                    <button
                        onClick={handleScheduleVisit}
                        className="group relative overflow-hidden w-full"
                    >
                        {/* Orange gradient with premium styling */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 rounded-2xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-orange-400/30 via-transparent to-orange-800/50 rounded-2xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/30 via-transparent to-orange-800/40 rounded-2xl group-hover:from-yellow-300/40 group-hover:to-orange-700/50 transition-all duration-300"></div>

                        {/* Shine animation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-2xl translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out"></div>

                        <div className="relative flex items-center justify-center gap-3 sm:gap-4 px-5 sm:px-7 py-4 sm:py-5 text-white font-bold rounded-2xl group-hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-orange-500/30 group-hover:shadow-2xl group-hover:shadow-orange-500/40">
                            <div className="relative">
                                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" />
                                <Calendar className="absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 text-orange-200 opacity-0 group-hover:opacity-50 transition-all duration-300 blur-sm scale-125" />
                            </div>
                            <span className="text-sm sm:text-base tracking-wide">Agendar Visita</span>
                        </div>
                    </button>

                    {/* Enhanced secondary actions */}
                    <div className="flex gap-3 sm:gap-4">
                        <button
                            onClick={toggleFavorite}
                            className="group relative overflow-hidden flex-1"
                        >
                            {/* Dynamic background based on favorite state */}
                            <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${isFavorited
                                ? 'bg-gradient-to-r from-red-50 via-rose-50 to-red-50'
                                : 'bg-gradient-to-r from-slate-50 via-white to-slate-50'
                                }`}></div>
                            <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${isFavorited
                                ? 'bg-gradient-to-b from-red-100/40 to-rose-200/30 group-hover:from-red-200/50 group-hover:to-rose-300/40'
                                : 'bg-gradient-to-b from-slate-100/40 to-slate-200/30 group-hover:from-slate-200/50 group-hover:to-slate-300/40'
                                }`}></div>

                            {/* Enhanced border */}
                            <div className={`absolute inset-0 border-2 rounded-2xl transition-all duration-300 ${isFavorited
                                ? 'border-red-200/60 group-hover:border-red-300/80'
                                : 'border-slate-200/60 group-hover:border-slate-300/80'
                                }`}></div>

                            <div className="relative flex items-center justify-center gap-2 sm:gap-3 px-4 py-4 sm:py-5 font-semibold rounded-2xl group-hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                                <div className="relative">
                                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:scale-110 ${isFavorited
                                        ? 'text-red-600 fill-current'
                                        : 'text-slate-700 group-hover:text-red-500'
                                        }`} />
                                    {isFavorited && (
                                        <Heart className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 text-red-400 fill-current opacity-0 group-hover:opacity-60 transition-all duration-300 scale-125 blur-sm" />
                                    )}
                                </div>
                                <span className={`text-sm sm:text-base hidden sm:inline transition-colors duration-300 ${isFavorited
                                    ? 'text-red-700'
                                    : 'text-slate-700 group-hover:text-red-600'
                                    }`}>
                                    {isFavorited ? 'Favoritado' : 'Favoritar'}
                                </span>
                            </div>
                        </button>

                        <button
                            onClick={handleShare}
                            className="group relative overflow-hidden flex-1"
                        >
                            {/* Subtle glass background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-2xl"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-100/40 to-slate-200/30 rounded-2xl group-hover:from-slate-200/50 group-hover:to-slate-300/40 transition-all duration-300"></div>

                            {/* Border system */}
                            <div className="absolute inset-0 border-2 border-slate-200/60 rounded-2xl group-hover:border-slate-300/80 transition-all duration-300"></div>

                            <div className="relative flex items-center justify-center gap-2 sm:gap-3 px-4 py-4 sm:py-5 text-slate-700 font-semibold rounded-2xl group-hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                                <div className="relative">
                                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                                    <Share2 className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 text-slate-500 opacity-0 group-hover:opacity-30 transition-all duration-300 blur-sm scale-125" />
                                </div>
                                <span className="text-sm sm:text-base hidden sm:inline">
                                    Compartilhar
                                </span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Enhanced disclaimer */}
                <div className="mt-6 sm:mt-8 text-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/40 to-transparent h-px top-1/2 -translate-y-1/2"></div>
                        <p className="relative bg-white px-4 text-xs sm:text-sm text-slate-500 font-medium">
                            Entre em contato para mais informações sobre este imóvel
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
