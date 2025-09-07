'use client';

import React, { useState } from 'react';
import { Phone, MessageCircle, Calendar, Share2, Heart, User, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

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
            navigator.clipboard.writeText(window.location.href);
        }
    };

    const toggleFavorite = () => {
        setIsFavorited(!isFavorited);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm sticky top-4"
        >
            {/* Header com preço e corretor */}
            <div className="p-6 border-b border-slate-100">
                {price && (
                    <div className="mb-4">
                        <p className="text-sm text-slate-600 mb-1">Preço do imóvel</p>
                        <h3 className="text-2xl font-bold text-slate-900">
                            R$ {price.toLocaleString('pt-BR')}
                        </h3>
                    </div>
                )}
                
                {/* Corretor info */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">Nova Ipê Imóveis</p>
                        <p className="text-sm text-slate-600">Corretor especializado</p>
                    </div>
                </div>
            </div>

            {/* CTAs principais */}
            <div className="p-6 space-y-4">
                {/* WhatsApp - Primary CTA */}
                {whatsappNumber && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleWhatsAppContact}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-3 shadow-lg shadow-green-600/25"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span>Conversar no WhatsApp</span>
                    </motion.button>
                )}

                {/* Telefone - Secondary CTA */}
                {phoneNumber && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePhoneCall}
                        className="w-full bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300 py-4 px-6 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-3"
                    >
                        <Phone className="w-5 h-5" />
                        <span>Ligar agora</span>
                    </motion.button>
                )}

                {/* Agendar Visita */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleScheduleVisit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-3 shadow-lg shadow-blue-600/25"
                >
                    <Calendar className="w-5 h-5" />
                    <span>Agendar Visita</span>
                </motion.button>

                {/* Actions secundárias */}
                <div className="flex gap-3 pt-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleFavorite}
                        className={`flex-1 p-3 rounded-xl border-2 transition-colors duration-200 flex items-center justify-center gap-2 ${
                            isFavorited 
                                ? 'bg-red-50 border-red-200 text-red-700' 
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                        <span className="hidden sm:inline text-sm font-medium">
                            {isFavorited ? 'Salvo' : 'Salvar'}
                        </span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleShare}
                        className="flex-1 p-3 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <Share2 className="w-5 h-5" />
                        <span className="hidden sm:inline text-sm font-medium">Compartilhar</span>
                    </motion.button>
                </div>
            </div>

            {/* Footer info */}
            <div className="px-6 pb-6">
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 rounded-lg p-3">
                    <Clock className="w-4 h-4" />
                    <span>Resposta em até 30 minutos</span>
                </div>
            </div>
        </motion.div>
    );
}