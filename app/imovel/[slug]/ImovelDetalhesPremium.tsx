"use client";

import React, { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatarMoeda } from '@/lib/utils';
import type { ImovelClient as ImovelDataType } from '@/src/types/imovel-client';
import PropertyCardPremium from '@/app/components/PropertyCardPremium';
import { transformToUnifiedProperty, transformToUnifiedPropertyList, toPropertyCardPremiumProps } from '@/lib/unified-property-transformer';
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
    Send,
    Home,
    Ruler,
    Check,
    AlertTriangle,
    DollarSign,
    Eye,
    Clock,
    Award,
    Users,
    FileText,
    Mail,
    ChevronRight
} from 'lucide-react';

interface ImovelDetalhesProps {
    imovel: ImovelDataType;
    relacionados?: ImovelDataType[];
    preco?: number;
}

const ImovelDetalhesPremium: FC<ImovelDetalhesProps> = ({ imovel, relacionados = [], preco }) => {
    const [imagemAtiva, setImagemAtiva] = useState(0);
    const [isFavorito, setIsFavorito] = useState(false);
    const [showContactForm, setShowContactForm] = useState(false);

    // Transform para o formato unificado
    const unifiedProperty = React.useMemo(() => {
        try {
            return transformToUnifiedProperty(imovel)
        } catch (error) {
            console.error('Erro ao transformar propriedade:', error)
            return null
        }
    }, [imovel])

    const unifiedRelated = React.useMemo(() => {
        return transformToUnifiedPropertyList(relacionados)
    }, [relacionados])

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
        if (unifiedProperty && analyticsEnabled) {
            trackPropertyView({
                property_id: unifiedProperty.id,
                property_type: unifiedProperty.propertyType,
                price: unifiedProperty.price,
                location: unifiedProperty.location
            });

            trackPropertyViewConversion(unifiedProperty.id, unifiedProperty.price);
        }
    }, [unifiedProperty, analyticsEnabled, trackPropertyView, trackPropertyViewConversion]);

    // Handle WhatsApp click
    const handleWhatsAppClick = () => {
        if (analyticsEnabled && unifiedProperty) {
            trackWhatsAppConversion(unifiedProperty.id, 'property_inquiry');
            trackButtonClick('whatsapp_contact', window.location.pathname);
        }

        const message = encodeURIComponent(
            `Olá! Tenho interesse no imóvel "${unifiedProperty?.title}" - ${window.location.href}`
        );
        window.open(`https://wa.me/5511981845016?text=${message}`, '_blank');
    };

    // Handle phone click
    const handlePhoneClick = () => {
        if (analyticsEnabled && unifiedProperty) {
            trackPhoneConversion(unifiedProperty.id);
            trackButtonClick('phone_contact', window.location.pathname);
        }
        window.location.href = 'tel:+5511981845016';
    };

    // Verificação de segurança
    if (!unifiedProperty) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-700 mb-2">Imóvel não encontrado</h2>
                    <p className="text-slate-500 mb-6">O imóvel que você está procurando não está mais disponível ou ocorreu um erro no carregamento.</p>
                    <Link
                        href="/catalogo"
                        className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao catálogo
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30">
            {/* Header com navegação melhorada */}
            <div className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/catalogo"
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-all duration-200 group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Voltar aos imóveis</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsFavorito(!isFavorito)}
                                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-all duration-200"
                            >
                                <Heart className={`w-5 h-5 transition-colors ${isFavorito ? 'text-red-500 fill-red-500' : 'text-slate-600'}`} />
                                <span className="text-sm font-medium">
                                    {isFavorito ? 'Favoritado' : 'Favoritar'}
                                </span>
                            </button>

                            <button
                                onClick={() => {
                                    navigator.share?.({
                                        title: unifiedProperty.title,
                                        text: unifiedProperty.description,
                                        url: window.location.href
                                    }).catch(() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        // Aqui poderia mostrar um toast de sucesso
                                    });
                                }}
                                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
                            >
                                <Share2 className="w-5 h-5" />
                                <span className="text-sm font-medium">Compartilhar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Coluna Principal */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Galeria de Imagens */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <GaleriaImovel
                                imagemPrincipal={unifiedProperty.mainImage?.url || '/placeholder-house.jpg'}
                                galeria={(unifiedProperty.gallery || []).map(img => ({ imagemUrl: img.url, alt: img.alt }))}
                                titulo={unifiedProperty.title}
                            />
                        </div>

                        {/* Informações Principais */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            {/* Badges de Status */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                {unifiedProperty.isPremium && (
                                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                                        <Star className="w-4 h-4" />
                                        PREMIUM
                                    </span>
                                )}
                                {unifiedProperty.isHighlight && (
                                    <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        DESTAQUE
                                    </span>
                                )}
                                {unifiedProperty.isNew && (
                                    <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg">
                                        NOVO
                                    </span>
                                )}
                                <span className={`px-4 py-2 text-sm font-bold rounded-full shadow-lg ${unifiedProperty.propertyType === 'sale'
                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                    }`}>
                                    {unifiedProperty.propertyType === 'sale' ? 'VENDA' : 'ALUGUEL'}
                                </span>
                                {unifiedProperty.documentationOk && (
                                    <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        DOCS OK
                                    </span>
                                )}
                                {unifiedProperty.acceptsFinancing && (
                                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        FINANCIA
                                    </span>
                                )}
                            </div>

                            {/* Título e Localização */}
                            <div className="mb-6">
                                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3 leading-tight">
                                    {unifiedProperty.title}
                                </h1>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <MapPin className="w-5 h-5 text-amber-500" />
                                    <span className="text-lg">{unifiedProperty.location}</span>
                                </div>
                            </div>

                            {/* Preço Destacado */}
                            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 mb-8 border border-amber-200">
                                <div className="text-4xl lg:text-5xl font-bold text-amber-700 mb-2">
                                    {formatarMoeda(unifiedProperty.price)}
                                    {unifiedProperty.propertyType === 'rent' && (
                                        <span className="text-lg text-slate-600 font-normal ml-2">/mês</span>
                                    )}
                                </div>
                                {unifiedProperty.propertyType === 'rent' && (
                                    <p className="text-sm text-amber-800">
                                        * Valor pode variar conforme negociação
                                    </p>
                                )}
                            </div>

                            {/* Características em Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {unifiedProperty.area && (
                                    <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-amber-300 transition-all duration-200 hover:shadow-md">
                                        <Ruler className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                                        <div className="font-bold text-2xl text-slate-900">{unifiedProperty.area}</div>
                                        <div className="text-sm text-slate-600 font-medium">m² úteis</div>
                                    </div>
                                )}

                                {unifiedProperty.bedrooms !== undefined && unifiedProperty.bedrooms > 0 && (
                                    <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-amber-300 transition-all duration-200 hover:shadow-md">
                                        <Bed className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                                        <div className="font-bold text-2xl text-slate-900">{unifiedProperty.bedrooms}</div>
                                        <div className="text-sm text-slate-600 font-medium">
                                            {unifiedProperty.bedrooms === 1 ? 'Dormitório' : 'Dormitórios'}
                                        </div>
                                    </div>
                                )}

                                {unifiedProperty.bathrooms !== undefined && unifiedProperty.bathrooms > 0 && (
                                    <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-amber-300 transition-all duration-200 hover:shadow-md">
                                        <Bath className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                                        <div className="font-bold text-2xl text-slate-900">{unifiedProperty.bathrooms}</div>
                                        <div className="text-sm text-slate-600 font-medium">
                                            {unifiedProperty.bathrooms === 1 ? 'Banheiro' : 'Banheiros'}
                                        </div>
                                    </div>
                                )}

                                {unifiedProperty.parkingSpots !== undefined && unifiedProperty.parkingSpots > 0 && (
                                    <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-amber-300 transition-all duration-200 hover:shadow-md">
                                        <Car className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                                        <div className="font-bold text-2xl text-slate-900">{unifiedProperty.parkingSpots}</div>
                                        <div className="text-sm text-slate-600 font-medium">
                                            {unifiedProperty.parkingSpots === 1 ? 'Vaga' : 'Vagas'}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Características Principais */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {unifiedProperty.bedrooms && (
                                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <Bed className="w-6 h-6 text-amber-600" />
                                        <div>
                                            <div className="text-sm text-slate-600 font-medium">Quartos</div>
                                            <div className="font-bold text-slate-900 text-lg">{unifiedProperty.bedrooms}</div>
                                        </div>
                                    </div>
                                )}
                                {unifiedProperty.bathrooms && (
                                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <Bath className="w-6 h-6 text-blue-600" />
                                        <div>
                                            <div className="text-sm text-slate-600 font-medium">Banheiros</div>
                                            <div className="font-bold text-slate-900 text-lg">{unifiedProperty.bathrooms}</div>
                                        </div>
                                    </div>
                                )}
                                {unifiedProperty.parkingSpots && (
                                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <Car className="w-6 h-6 text-green-600" />
                                        <div>
                                            <div className="text-sm text-slate-600 font-medium">Vagas</div>
                                            <div className="font-bold text-slate-900 text-lg">{unifiedProperty.parkingSpots}</div>
                                        </div>
                                    </div>
                                )}
                                {unifiedProperty.area && (
                                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <Ruler className="w-6 h-6 text-purple-600" />
                                        <div>
                                            <div className="text-sm text-slate-600 font-medium">Área Útil</div>
                                            <div className="font-bold text-slate-900 text-lg">{unifiedProperty.area}m²</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Informações do Tipo de Imóvel */}
                            {(unifiedProperty.propertyTypeDetail || unifiedProperty.purpose) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    {unifiedProperty.propertyTypeDetail && (
                                        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                                            <Building2 className="w-6 h-6 text-amber-600" />
                                            <div>
                                                <div className="text-sm text-amber-800 font-medium">Tipo de Imóvel</div>
                                                <div className="font-semibold text-amber-900">{unifiedProperty.propertyTypeDetail}</div>
                                            </div>
                                        </div>
                                    )}
                                    {unifiedProperty.purpose && (
                                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                            <Star className="w-6 h-6 text-blue-600" />
                                            <div>
                                                <div className="text-sm text-blue-800 font-medium">Finalidade</div>
                                                <div className="font-semibold text-blue-900">{unifiedProperty.purpose}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Descrição */}
                            {unifiedProperty.description && (
                                <div className="mb-8">
                                    <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                        <FileText className="w-6 h-6 text-amber-500" />
                                        Sobre este imóvel
                                    </h2>
                                    <div className="prose prose-slate max-w-none">
                                        <p className="text-slate-700 leading-relaxed text-lg">
                                            {unifiedProperty.description}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Características Especiais */}
                            {unifiedProperty.features && unifiedProperty.features.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                        <Check className="w-6 h-6 text-green-500" />
                                        Características
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {unifiedProperty.features.map((feature: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-colors">
                                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                <span className="text-slate-700 font-medium">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recursos Especiais */}
                            {(unifiedProperty.hasGarden || unifiedProperty.hasPool) && (
                                <div className="mb-8">
                                    <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                        <Star className="w-6 h-6 text-purple-500" />
                                        Recursos Especiais
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {unifiedProperty.hasGarden && (
                                            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                                                <div className="w-6 h-6 text-green-600">🌳</div>
                                                <div>
                                                    <div className="font-semibold text-green-900">Jardim</div>
                                                    <div className="text-sm text-green-700">Área verde privativa</div>
                                                </div>
                                            </div>
                                        )}
                                        {unifiedProperty.hasPool && (
                                            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                                <div className="w-6 h-6 text-blue-600">🏊</div>
                                                <div>
                                                    <div className="font-semibold text-blue-900">Piscina</div>
                                                    <div className="text-sm text-blue-700">Área de lazer aquática</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Data de Publicação */}
                            {unifiedProperty.publishedDate && (
                                <div className="border-t pt-6">
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <Calendar className="w-5 h-5" />
                                        <div>
                                            <div className="text-sm">Publicado em</div>
                                            <div className="font-medium text-slate-700">
                                                {new Date(unifiedProperty.publishedDate).toLocaleDateString('pt-BR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar de Contato */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Card de Contato Principal */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Phone className="w-6 h-6 text-amber-500" />
                                    Entre em Contato
                                </h3>

                                <div className="space-y-4">
                                    <button
                                        onClick={handleWhatsAppClick}
                                        className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                        Conversar no WhatsApp
                                    </button>

                                    <button
                                        onClick={handlePhoneClick}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    >
                                        <Phone className="w-5 h-5" />
                                        Ligar Agora
                                    </button>

                                    <Link
                                        href="/visita"
                                        className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        Agendar Visita
                                    </Link>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <div className="text-center text-sm text-slate-600">
                                        <p className="mb-2">Central de Atendimento</p>
                                        <p className="font-semibold text-slate-900">(11) 98184-5016</p>
                                        <p className="text-xs mt-2">Segunda à Sexta: 8h30 - 18h</p>
                                        <p className="text-xs">Sábado: 9h - 13h</p>
                                    </div>
                                </div>
                            </div>

                            {/* Indicadores de Confiança */}
                            <div className="bg-gradient-to-br from-slate-50 to-amber-50 rounded-2xl p-6 border border-amber-200">
                                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-amber-500" />
                                    Por que escolher a Ipê?
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Award className="w-5 h-5 text-amber-500" />
                                        <span className="text-sm text-slate-700">15+ anos de experiência</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-amber-500" />
                                        <span className="text-sm text-slate-700">500+ famílias atendidas</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-amber-500" />
                                        <span className="text-sm text-slate-700">Documentação garantida</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-amber-500" />
                                        <span className="text-sm text-slate-700">Atendimento personalizado</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Imóveis Relacionados */}
                {unifiedRelated.length > 0 && (
                    <div className="mt-16">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Imóveis Similares</h2>
                            <p className="text-slate-600">Outras opções que podem interessar você</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {unifiedRelated.slice(0, 6).map((property) => {
                                const cardProps = toPropertyCardPremiumProps(property)
                                return (
                                    <PropertyCardPremium
                                        key={property.id}
                                        {...cardProps}
                                        variant="default"
                                    />
                                )
                            })}
                        </div>

                        <div className="text-center mt-8">
                            <Link
                                href="/catalogo"
                                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200"
                            >
                                Ver Mais Imóveis
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImovelDetalhesPremium;
