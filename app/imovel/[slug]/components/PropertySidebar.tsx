'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PropertyContact from './PropertyContact';
import PropertyDetails from './PropertyDetails';

interface PropertySidebarProps {
    // Props do PropertyContact
    phoneNumber?: string;
    whatsappNumber?: string;
    price?: number;
    propertyId?: string;
    propertyTitle?: string;

    // Props do PropertyDetails
    acceptsFinancing?: boolean;
    documentationOk?: boolean;
    features?: string[];
    propertyTypeDetail?: string;
    publishedDate?: string;
    hasGarden?: boolean;
    hasPool?: boolean;
    address?: string;
    codigo?: string;
}

export default function PropertySidebar({
    // PropertyContact props
    phoneNumber,
    whatsappNumber,
    price,
    propertyId,
    propertyTitle,

    // PropertyDetails props
    acceptsFinancing,
    documentationOk,
    features,
    propertyTypeDetail,
    publishedDate,
    hasGarden,
    hasPool,
    address,
    codigo
}: PropertySidebarProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="space-y-6"
        >
            {/* Grupo CTA e Detalhes - Conectados visualmente */}
            <div className="bg-gradient-to-b from-white to-slate-50/50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* CTA Principal */}
                <div className="p-6 bg-white border-b border-slate-100">
                    {price && (
                        <div className="mb-4">
                            <p className="text-sm text-slate-600 mb-1">Preço do imóvel</p>
                            <h3 className="text-2xl font-bold text-slate-900">
                                R$ {price.toLocaleString('pt-BR')}
                            </h3>
                        </div>
                    )}
                    {/* CTAs principais */}
                    <div className="space-y-3">
                        {/* WhatsApp - Primary CTA */}
                        {whatsappNumber && (
                            <motion.a
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                href={`https://wa.me/5511981845016, '')}?text=${encodeURIComponent(
                                    `Olá! Tenho interesse no imóvel: ${propertyTitle || 'Imóvel'} ${codigo ? `(Código: ${codigo})` : ''}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-3 shadow-lg shadow-green-600/25"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
                                </svg>
                                <span>Conversar no WhatsApp</span>
                            </motion.a>
                        )}

                        {/* Telefone - Secondary CTA */}
                        {phoneNumber && (
                            <motion.a
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                href={`tel:${phoneNumber}`}
                                className="w-full bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300 py-4 px-6 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>Ligar agora</span>
                            </motion.a>
                        )}
                    </div>
                </div>

                {/* Separador visual */}
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

                {/* Detalhes do Imóvel */}
                <div className="p-6 bg-slate-50/50">
                    <PropertyDetails
                        acceptsFinancing={acceptsFinancing}
                        documentationOk={documentationOk}
                        features={features}
                        propertyTypeDetail={propertyTypeDetail}
                        publishedDate={publishedDate}
                        hasGarden={hasGarden}
                        hasPool={hasPool}
                        address={address}
                        codigo={codigo}
                    />
                </div>
            </div>

            {/* Informações de resposta */}
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-blue-900">Resposta rápida garantida</p>
                        <p className="text-xs text-blue-700">Dentro do horário de atendimento, retornamos seu contato em até 30 minutos</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
