"use client";

import React, { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatarMoeda } from '@/lib/utils';
import type { ImovelClient as ImovelDataType } from '@/src/types/imovel-client';
import { PropertyCardUnified } from '@/app/components/ui/property/PropertyCardUnified';
import { useAnalytics } from '@/app/hooks/useAnalytics';
import { GaleriaImovel } from '@/app/components/ui/GaleriaImovel';
import {
    Phone,
    Calendar,
    UserCheck,
    Share2,
    MapPin,
    Bed,
    Bath,
    Car,
    Square,
    Heart,
    ArrowLeft,
    Star,
    Shield,
    TrendingUp,
    Building2,
    MessageSquare,
    Send
} from 'lucide-react';

interface ImovelDetalhesProps {
    imovel: ImovelDataType;
    relacionados?: ImovelDataType[];
    preco?: number;
}

const ImovelDetalhesNew: FC<ImovelDetalhesProps> = ({ imovel, relacionados = [], preco }) => {
    const [imagemAtiva, setImagemAtiva] = useState(0);
    const [isFavorito, setIsFavorito] = useState(false);

    // Analytics hook
    const {
        trackPropertyView,
        trackPropertyViewConversion,
        trackWhatsAppConversion,
        trackPhoneConversion,
        trackButtonClick,
        isEnabled: analyticsEnabled
    } = useAnalytics();

    // Track property view on component mount
    useEffect(() => {
        if (imovel && analyticsEnabled) {
            // Track general property view
            trackPropertyView({
                property_id: imovel._id,
                property_type: imovel.finalidade?.toLowerCase() === 'venda' ? 'sale' : 'rent',
                price: preco || imovel.preco,
                location: `${imovel.bairro || ''}, ${imovel.cidade || ''}`.trim()
            });

            // Track micro-conversion for property view
            trackPropertyViewConversion(imovel._id, preco || imovel.preco);
        }
    }, [imovel, preco, analyticsEnabled, trackPropertyView, trackPropertyViewConversion]);

    // Handle WhatsApp click
    const handleWhatsAppClick = () => {
        if (analyticsEnabled) {
            trackWhatsAppConversion(imovel._id, 'property_inquiry');
            trackButtonClick('whatsapp_contact', window.location.pathname);
        }
    };

    // Handle phone click
    const handlePhoneClick = () => {
        if (analyticsEnabled) {
            trackPhoneConversion(imovel._id);
            trackButtonClick('phone_contact', window.location.pathname);
        }
    };

    // Handle visit scheduling
    const handleVisitClick = () => {
        if (analyticsEnabled) {
            trackButtonClick('schedule_visit', window.location.pathname);
        }
    };

    // Verificação de segurança
    if (!imovel || !imovel._id) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-700 mb-2">Imóvel não encontrado</h2>
                    <p className="text-slate-500 mb-6">O imóvel que você está procurando não está mais disponível.</p>
                    <Link
                        href="/catalogo"
                        className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        Ver outros imóveis
                    </Link>
                </div>
            </div>
        );
    }

    // Preparar dados das imagens
    const imagemPrincipal = imovel.imagem?.imagemUrl || '/images/og-image-2025.jpg';
    const imagensGaleria = imovel.galeria?.filter(img => img.imagemUrl) || [];
    const todasImagens = [
        { imagemUrl: imagemPrincipal, alt: imovel.titulo || 'Imóvel' },
        ...imagensGaleria
    ];

    // Debug detalhado para verificar galeria
    console.log('🖼️ Debug Galeria Detalhado:', {
        imovelId: imovel._id,
        titulo: imovel.titulo,
        imagemPrincipal,
        imagemPrincipalObjeto: imovel.imagem,
        galeriaRaw: imovel.galeria,
        galeriaFiltrada: imagensGaleria,
        galeriaLength: imagensGaleria.length,
        todasImagensLength: todasImagens.length,
        primeiraImagemGaleria: imagensGaleria[0],
        todasImagens: todasImagens.map(img => ({ url: img.imagemUrl, alt: img.alt }))
    });

    const precoFinal = preco ?? imovel.preco ?? 0;
    const tipoPropriedade = imovel.finalidade?.toLowerCase() === 'venda' ? 'sale' : 'rent';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
            {/* Header com botão voltar */}
            <div className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/catalogo"
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Voltar aos imóveis</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsFavorito(!isFavorito)}
                                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
                            >
                                <Heart className={`w-5 h-5 ${isFavorito ? 'text-red-500 fill-red-500' : 'text-slate-600'}`} />
                                <span className="text-sm font-medium">
                                    {isFavorito ? 'Favoritado' : 'Favoritar'}
                                </span>
                            </button>

                            <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors">
                                <Share2 className="w-5 h-5" />
                                <span className="text-sm font-medium">Compartilhar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Coluna Principal - Imagens e Detalhes */}
                    <div className="lg:col-span-2">
                        {/* Galeria de Imagens Melhorada */}
                        <div className="mb-8">
                            <GaleriaImovel
                                imagemPrincipal={imagemPrincipal}
                                galeria={imagensGaleria.map(img => ({
                                    imagemUrl: img.imagemUrl || '',
                                    alt: img.alt
                                }))}
                                titulo={imovel.titulo || 'Imóvel'}
                            />
                        </div>

                        {/* Badges de Status */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            {imovel.destaque && (
                                <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                                    <Star className="w-4 h-4" />
                                    DESTAQUE
                                </span>
                            )}
                            <span className={`px-4 py-2 text-sm font-bold rounded-full shadow-lg ${tipoPropriedade === 'sale'
                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                }`}>
                                {tipoPropriedade === 'sale' ? 'VENDA' : 'ALUGUEL'}
                            </span>
                            {imovel.documentacaoOk && (
                                <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    DOCS OK
                                </span>
                            )}
                            {imovel.aceitaFinanciamento && (
                                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    FINANCIA
                                </span>
                            )}
                        </div>

                        {/* Detalhes do Imóvel */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">{imovel.titulo}</h1>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <MapPin className="w-5 h-5" />
                                    <span>{imovel.endereco}</span>
                                </div>
                            </div>

                            <div className="text-4xl font-bold text-amber-600 mb-6">
                                {formatarMoeda(precoFinal)}
                                {tipoPropriedade === 'rent' && <span className="text-lg text-slate-500 font-normal">/mês</span>}
                            </div>

                            {/* Características Melhoradas */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {/* Área */}
                                {imovel.areaUtil && (
                                    <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-amber-300 transition-colors">
                                        <Square className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                                        <div className="font-bold text-xl text-slate-900">{imovel.areaUtil}</div>
                                        <div className="text-sm text-slate-600 font-medium">m² úteis</div>
                                    </div>
                                )}

                                {/* Dormitórios */}
                                {imovel.dormitorios !== undefined && imovel.dormitorios > 0 && (
                                    <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-amber-300 transition-colors">
                                        <Bed className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                                        <div className="font-bold text-xl text-slate-900">{imovel.dormitorios}</div>
                                        <div className="text-sm text-slate-600 font-medium">
                                            {imovel.dormitorios === 1 ? 'Dormitório' : 'Dormitórios'}
                                        </div>
                                    </div>
                                )}

                                {/* Banheiros */}
                                {imovel.banheiros !== undefined && imovel.banheiros > 0 && (
                                    <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-amber-300 transition-colors">
                                        <Bath className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                                        <div className="font-bold text-xl text-slate-900">{imovel.banheiros}</div>
                                        <div className="text-sm text-slate-600 font-medium">
                                            {imovel.banheiros === 1 ? 'Banheiro' : 'Banheiros'}
                                        </div>
                                    </div>
                                )}

                                {/* Vagas */}
                                {imovel.vagas !== undefined && imovel.vagas > 0 && (
                                    <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-amber-300 transition-colors">
                                        <Car className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                                        <div className="font-bold text-xl text-slate-900">{imovel.vagas}</div>
                                        <div className="text-sm text-slate-600 font-medium">
                                            {imovel.vagas === 1 ? 'Vaga' : 'Vagas'}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Informações Adicionais */}
                            {(imovel.tipoImovel || imovel.finalidade) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    {imovel.tipoImovel && (
                                        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                                            <Building2 className="w-5 h-5 text-amber-600" />
                                            <div>
                                                <div className="text-sm text-amber-800 font-medium">Tipo de Imóvel</div>
                                                <div className="font-semibold text-amber-900">{imovel.tipoImovel}</div>
                                            </div>
                                        </div>
                                    )}
                                    {imovel.finalidade && (
                                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                            <Star className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <div className="text-sm text-blue-800 font-medium">Finalidade</div>
                                                <div className="font-semibold text-blue-900">{imovel.finalidade}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Descrição */}
                            {imovel.descricao && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold text-slate-900 mb-4">Descrição</h2>
                                    <p className="text-slate-700 leading-relaxed">{imovel.descricao}</p>
                                </div>
                            )}

                            {/* Características Lista */}
                            {imovel.caracteristicas && imovel.caracteristicas.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold text-slate-900 mb-4">Características</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {imovel.caracteristicas.map((caracteristica: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                                                <UserCheck className="w-5 h-5 text-green-500" />
                                                <span className="text-slate-700">{caracteristica}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Informações adicionais */}
                            <div className="border-t pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {imovel.dataPublicacao && (
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-slate-500" />
                                            <div>
                                                <div className="text-sm text-slate-500">Publicado em</div>
                                                <div className="font-medium">{new Date(imovel.dataPublicacao).toLocaleDateString('pt-BR')}</div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-green-500" />
                                        <div>
                                            <div className="text-sm text-slate-500">Status</div>
                                            <div className="font-medium text-green-600">Verificado pela Nova Ipê</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Contato e Ações */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">Interessado?</h3>
                                <p className="text-slate-600">Entre em contato conosco para mais informações</p>
                            </div>

                            <div className="space-y-4">
                                <a
                                    href="tel:+5511981845016"
                                    onClick={handlePhoneClick}
                                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Phone className="w-5 h-5" />
                                    Ligar agora
                                </a>

                                <a
                                    href={`https://wa.me/5511981845016?text=Olá! Tenho interesse no imóvel: ${encodeURIComponent(imovel.titulo || 'Imóvel')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={handleWhatsAppClick}
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    WhatsApp
                                </a>

                                <button
                                    onClick={handleVisitClick}
                                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Calendar className="w-5 h-5" />
                                    Agendar visita
                                </button>

                                <button className="w-full border-2 border-slate-200 text-slate-700 py-3 px-6 rounded-lg font-semibold hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-2">
                                    <Send className="w-5 h-5" />
                                    Enviar proposta
                                </button>
                            </div>

                            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-5 h-5 text-amber-600" />
                                    <span className="font-semibold text-amber-800">Consultoria Especializada</span>
                                </div>
                                <p className="text-sm text-amber-700">
                                    Oferecemos análise completa de valorização e potencial de investimento.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Imóveis Relacionados */}
                {relacionados.length > 0 && (
                    <div className="mt-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Imóveis Similares</h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                Explore outras opções que podem interessar você na mesma região ou categoria
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relacionados.slice(0, 6).map((rel) => (
                                <PropertyCardUnified
                                    key={rel._id}
                                    id={rel._id}
                                    title={rel.titulo || ''}
                                    slug={rel.slug || ''}
                                    location={rel.endereco || ''}
                                    city={rel.cidade || ''}
                                    price={rel.preco || 0}
                                    propertyType={rel.finalidade?.toLowerCase() === 'venda' ? 'sale' : 'rent'}
                                    area={rel.areaUtil || undefined}
                                    bedrooms={rel.dormitorios || undefined}
                                    bathrooms={rel.banheiros || undefined}
                                    parkingSpots={rel.vagas || undefined}
                                    mainImage={{
                                        url: rel.imagem?.imagemUrl || rel.galeria?.[0]?.imagemUrl || '',
                                        alt: rel.titulo || '',
                                        sanityImage: rel.imagem
                                    }}
                                    isHighlight={rel.destaque || false}
                                    className="transform hover:scale-105 transition-all duration-300"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImovelDetalhesNew;
