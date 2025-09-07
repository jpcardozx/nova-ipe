'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, MapPin, CreditCard, FileText, Shield, Calendar, TrendingUp, Eye, EyeOff, Hash, Copy, Clock, Phone, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PropertyDetailsProps {
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

export default function PropertyDetails({
    acceptsFinancing,
    documentationOk,
    features = [],
    propertyTypeDetail,
    publishedDate,
    hasGarden,
    hasPool,
    address,
    codigo
}: PropertyDetailsProps) {
    const [showCodigo, setShowCodigo] = useState(false);
    const [copied, setCopied] = useState(false);
    
    const copyToClipboard = async () => {
        if (codigo) {
            await navigator.clipboard.writeText(codigo);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    
    const additionalFeatures = [];

    if (hasGarden) additionalFeatures.push('Jardim');
    if (hasPool) additionalFeatures.push('Piscina');

    const allFeatures = [...features, ...additionalFeatures].filter(Boolean);

    const detailsInfo = [
        {
            icon: CreditCard,
            label: 'Aceita Financiamento',
            value: acceptsFinancing,
            show: acceptsFinancing !== undefined
        },
        {
            icon: FileText,
            label: 'Documentação',
            value: documentationOk,
            show: documentationOk !== undefined
        },
        {
            icon: Calendar,
            label: 'Publicado em',
            value: publishedDate ? new Date(publishedDate).toLocaleDateString('pt-BR') : null,
            show: !!publishedDate,
            isDate: true
        }
    ].filter(detail => detail.show);

    if (detailsInfo.length === 0 && allFeatures.length === 0 && !address && !propertyTypeDetail && !codigo) {
        return null;
    }

    return (
        <div className="space-y-4">
            {/* Informações Detalhadas - Versão compacta para sidebar */}
            {(detailsInfo.length > 0 || address || propertyTypeDetail) && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4">
                    <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        Detalhes
                    </h3>

                    <div className="space-y-3">
                        {propertyTypeDetail && (
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-slate-500" />
                                <div>
                                    <span className="text-xs text-slate-500">Tipo</span>
                                    <p className="text-sm font-medium text-slate-900">{propertyTypeDetail}</p>
                                </div>
                            </div>
                        )}

                        {detailsInfo.map((detail, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <detail.icon className="w-4 h-4 text-slate-500" />
                                <div className="flex-1">
                                    <span className="text-xs text-slate-500">{detail.label}</span>
                                    <div className="flex items-center gap-1">
                                        {detail.isDate ? (
                                            <p className="text-sm font-medium text-slate-900">{detail.value}</p>
                                        ) : (
                                            <>
                                                {detail.value ? (
                                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                                ) : (
                                                    <XCircle className="w-3 h-3 text-red-600" />
                                                )}
                                                <p className={`text-sm font-medium ${detail.value ? 'text-green-700' : 'text-red-700'}`}>
                                                    {detail.value ? 'Sim' : 'Não'}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Código Interno - Versão compacta */}
            {codigo && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4">
                    <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Hash className="w-4 h-4 text-amber-600" />
                        Código do Imóvel
                    </h3>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-slate-500" />
                            <div className="flex-1">
                                <span className="text-xs text-slate-500">Código Interno</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className={`font-mono text-sm font-medium text-slate-900 ${showCodigo ? '' : 'blur-sm select-none'}`}>
                                        {showCodigo ? codigo : codigo.replace(/./g, '•')}
                                    </p>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setShowCodigo(!showCodigo)}
                                            className="p-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-all duration-200"
                                            title={showCodigo ? "Ocultar código" : "Revelar código"}
                                        >
                                            {showCodigo ? (
                                                <EyeOff className="w-3 h-3 text-amber-700" />
                                            ) : (
                                                <Eye className="w-3 h-3 text-amber-700" />
                                            )}
                                        </button>

                                        {/* Copy Button compacto */}
                                        <AnimatePresence>
                                            {showCodigo && (
                                                <motion.button
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ duration: 0.15 }}
                                                    onClick={copyToClipboard}
                                                    className="p-1.5 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-all duration-200"
                                                    title="Copiar código"
                                                >
                                                    {copied ? (
                                                        <CheckCircle className="w-3 h-3 text-green-700" />
                                                    ) : (
                                                        <Copy className="w-3 h-3 text-green-700" />
                                                    )}
                                                </motion.button>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA de Agendamento compacto */}
                    <AnimatePresence>
                        {showCodigo && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-semibold text-blue-900">Agende sua Visita</span>
                                    </div>
                                    
                                    <p className="text-xs text-blue-800 mb-3 leading-relaxed">
                                        Use o código <span className="font-mono font-bold bg-blue-100 px-1 rounded text-blue-900">{codigo}</span> para agendar
                                    </p>

                                    <div className="grid grid-cols-2 gap-2">
                                        <a
                                            href="tel:+5511981845016"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-semibold text-center transition-colors duration-200 flex items-center justify-center gap-1"
                                        >
                                            <Phone className="w-3 h-3" />
                                            <span>Ligar</span>
                                        </a>
                                        <a
                                            href={`https://wa.me/5511981845016?text=Olá! Gostaria de agendar uma visita para o imóvel com código ${codigo}. Quando posso visitar?`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs font-semibold text-center transition-colors duration-200 flex items-center justify-center gap-1"
                                        >
                                            <MessageCircle className="w-3 h-3" />
                                            <span>WhatsApp</span>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Características - Versão compacta */}
            {allFeatures.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4">
                    <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Características
                    </h3>

                    <div className="space-y-2">
                        {allFeatures.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-100">
                                <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                                <span className="text-sm font-medium text-green-800">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
