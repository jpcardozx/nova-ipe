"use client";

import React, { FC, useState, useEffect, useMemo } from 'react';
import { Phone, Calendar, UserCheck, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatarMoeda, cn } from '@/lib/utils';
import WhatsAppShare from '@/app/components/WhatsAppShare';
import SocialShareButtons from '@/app/components/SocialShareButtons';
import PropertyMetadata from '@/app/components/PropertyMetadata';
import type { ImovelClient as ImovelDataType } from '../../../src/types/imovel-client';
import { motion } from 'framer-motion';

/**
 * Componente de Card CTA para ações no imóvel
 */
interface CardCTAImovelProps {
    titulo?: string;
    finalidade?: 'Venda' | 'Aluguel' | 'Temporada';
    destaque?: boolean;
    full?: boolean;
    tipoCTA?: 'whatsapp' | 'agendar';
    linkPersonalizado?: string;
    onAgendar?: () => void;
    imovel: any; // Adicione o tipo correto do imóvel aqui, se necessário
    relacionados?: any[]; // Adicione o tipo correto para os imóveis relacionados, se necessário
    preco?: number; // Adicione o tipo correto para o preço, se necessário
}

const CardCTAImovel: FC<CardCTAImovelProps> = ({
    preco,
    titulo,
    finalidade = 'Venda',
    destaque = false,
    full = false,
    tipoCTA = 'whatsapp',
    linkPersonalizado,
    onAgendar,
}) => {    // Texto e ícone do CTA
    const labelCTA = useMemo(
        () => (tipoCTA === 'agendar' ? 'Reservar visita estratégica' : 'Análise de investimento'),
        [tipoCTA]
    );
    const iconCTA = tipoCTA === 'agendar' ? (
        <Calendar className="w-5 h-5" />
    ) : (
        <Phone className="w-5 h-5" />
    );

    // Preço formatado
    const precoFormatado = preco != null ? formatarMoeda(preco) : 'Sob consulta';    // URL para whatsapp
    const safeTitle = encodeURIComponent(titulo ?? '');
    const defaultLink = `https://wa.me/5511981845016?text=Olá! Gostaria de uma análise financeira detalhada sobre este imóvel (${finalidade}): ${safeTitle} - Meu interesse é investir para obter retorno financeiro.`;
    const ctaUrl = linkPersonalizado?.trim() || defaultLink;

    return (
        <aside
            className={cn(
                'relative bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl ring-1 ring-stone-200 p-8 space-y-6',
                destaque && 'border-t-4 border-amber-500',
                full && 'w-full'
            )}
        >
            {/* Badge de destaque */}
            {destaque && (
                <div className="absolute top-4 right-4 bg-amber-500/20 text-amber-600 px-3 py-0.5 text-xs font-semibold rounded-full">
                    Em destaque
                </div>
            )}

            {/* Valor */}
            <div className="space-y-1">
                <p className="text-sm text-stone-500">Valor de referência</p>
                <p className="text-3xl font-bold text-amber-600 tracking-tight">
                    {precoFormatado}
                </p>
            </div>

            {/* CTA Button */}
            <Link
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                    'flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full text-white font-medium transition shadow-md',
                    tipoCTA === 'agendar'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-[#0D1F2D] hover:bg-[#162B42]'
                )}
                aria-label={labelCTA}
                onClick={(e: React.MouseEvent) => tipoCTA === 'agendar' && onAgendar && (e.preventDefault(), onAgendar())}
            >
                {iconCTA}
                <span>{labelCTA}</span>
            </Link>

            {/* Compartilhamento Social */}
            <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-600 flex items-center gap-1 mb-3">
                    <Share2 className="w-4 h-4" />
                    Compartilhar este imóvel
                </h3>
                <WhatsAppShare
                    title={titulo}
                    message={`Olá! Encontrei este imóvel na Nova Ipê Imobiliária e achei que você poderia se interessar: ${titulo}`}
                    buttonText="WhatsApp"
                    showLabel={true}
                    fullWidth={true}
                    size="md"
                />

                <div className="mt-3">
                    <SocialShareButtons
                        title={titulo}
                        description={`Confira este imóvel: ${titulo}`}
                        showLabel={false}
                        compact={true}
                        platforms={['facebook', 'twitter', 'linkedin']}
                    />
                </div>
            </div>

            {/* Verificação */}
            <div className="flex items-center gap-2 text-xs text-stone-500">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span>Imóvel verificado pela Nova Ipê</span>
            </div>

            {/* Nota adicional */}
            <p className="text-xs italic text-stone-400 border-t border-stone-200 pt-3">
                Atendimento rápido. Indicamos imóveis similares conforme seu perfil.
            </p>
        </aside>
    );
};

/**
 * Componente principal da página de imóvel
 */
interface ImovelDetalhesProps {
    imovel: ImovelDataType;
    relacionados?: ImovelDataType[]; // Changed from imoveisRelacionados to relacionados
    preco?: number; // Added preco prop
}

const ImovelDetalhes: FC<ImovelDetalhesProps> = ({ imovel, relacionados = [], preco }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!imovel) {
        return <div className="text-center py-20">Imóvel não encontrado</div>;
    }    // Dados do imóvel para PropertyMetadata
    const propertyData = {
        id: imovel._id || '',
        title: imovel.titulo || 'Imóvel Nova Ipê', // Fornecemos um valor padrão para não ter undefined
        description: imovel.descricao,
        price: typeof imovel.preco === 'number' ? imovel.preco :
            parseFloat(String(imovel.preco || 0)),
        address: imovel.endereco,
        city: imovel.cidade || 'Guararema', // Valor padrão
        location: imovel.bairro || imovel.cidade || 'Guararema', // Valor padrão
        propertyType: (imovel.finalidade?.toLowerCase() === 'venda' ? 'sale' : 'rent') as 'sale' | 'rent',
        bedrooms: imovel.dormitorios ? Number(imovel.dormitorios) : undefined,
        bathrooms: imovel.banheiros ? Number(imovel.banheiros) : undefined,
        area: imovel.areaUtil ? Number(imovel.areaUtil) : undefined,
        features: imovel.caracteristicas || [],
        mainImage: {
            url: imovel.imagem?.imagemUrl || '/images/og-image-2025.jpg',
            alt: imovel.imagem?.alt || imovel.titulo || 'Imóvel Nova Ipê' // Garantindo que alt nunca é undefined
        },
        images: imovel.galeria?.map((img: any) => ({
            url: img.imagemUrl || '',
            alt: img.alt || imovel.titulo || 'Imóvel Nova Ipê' // Garantindo que alt nunca é undefined
        })) || [],
        slug: imovel.slug
    };

    return (
        <>
            {/* Metadata no cliente para otimizar compartilhamento em aplicativos */}
            {isClient && <PropertyMetadata property={propertyData} />}

            <main className="bg-gray-50 pb-24">
                {/* Hero com galeria principal */}
                <section className="relative pt-20 pb-10">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Título e localização */}
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{imovel.titulo}</h1>
                                    <p className="text-gray-600 mt-2">{imovel.bairro}, {imovel.cidade}</p>
                                </div>

                                {/* Imagem principal com overlay de compartilhamento */}
                                <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-gray-200 border border-gray-200">                                    {imovel.imagem?.imagemUrl && (
                                    <Image
                                        src={imovel.imagem.imagemUrl}
                                        alt={imovel.imagem.alt || imovel.titulo || 'Imóvel Nova Ipê'}
                                        className="object-cover"
                                        fill
                                        priority
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                                    />
                                )}

                                    {/* Overlay para compartilhamento rápido */}
                                    <div className="absolute right-4 bottom-4 flex gap-2">
                                        <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg" aria-label="Compartilhar">
                                            <SocialShareButtons
                                                showLabel={false}
                                                compact={true}
                                                platforms={['whatsapp']}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Características principais */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-white rounded-xl shadow-sm">
                                    {imovel.dormitorios && (
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-semibold">{imovel.dormitorios}</span>
                                            <span className="text-xs text-gray-500">Dormitórios</span>
                                        </div>
                                    )}

                                    {imovel.banheiros && (
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-semibold">{imovel.banheiros}</span>
                                            <span className="text-xs text-gray-500">Banheiros</span>
                                        </div>
                                    )}

                                    {imovel.vagas && (
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-semibold">{imovel.vagas}</span>
                                            <span className="text-xs text-gray-500">Vagas</span>
                                        </div>
                                    )}

                                    {imovel.areaUtil && (
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-semibold">{imovel.areaUtil}m²</span>
                                            <span className="text-xs text-gray-500">Área útil</span>
                                        </div>
                                    )}
                                </div>

                                {/* Descrição */}
                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <h2 className="text-xl font-semibold mb-4">Sobre este imóvel</h2>
                                    <div className="prose prose-stone max-w-none">
                                        {imovel.descricao}
                                    </div>
                                </div>                                {/* Características */}
                                {imovel.caracteristicas && imovel.caracteristicas.length > 0 && (
                                    <div className="bg-white p-6 rounded-xl shadow-sm">
                                        <h2 className="text-xl font-semibold mb-4">Características</h2>
                                        <ul className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
                                            {imovel.caracteristicas.map((caracteristica: string, idx: number) => (
                                                <li key={idx} className="flex items-center text-gray-700">
                                                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                                                    {caracteristica}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Alternativa para compatibilidade com dados antigos */}
                                {!imovel.caracteristicas && imovel.descricao && (
                                    <div className="bg-white p-6 rounded-xl shadow-sm">
                                        <h2 className="text-xl font-semibold mb-4">Características</h2>
                                        <p className="text-gray-700">Consulte a descrição para mais detalhes sobre este imóvel.</p>
                                    </div>
                                )}

                                {/* Compartilhamento na parte inferior */}
                                <div className="bg-white p-6 rounded-xl shadow-sm">
                                    <h2 className="text-xl font-semibold mb-4">Compartilhar este imóvel</h2>
                                    <SocialShareButtons
                                        title={imovel.titulo}
                                        description={`Confira este imóvel: ${imovel.titulo} em ${imovel.cidade}. Disponível na Nova Ipê Imobiliária.`}
                                        imageUrl={imovel.imagem?.imagemUrl}
                                        showLabel={true}
                                        className="mb-2"
                                    />
                                </div>
                            </div>

                            {/* Coluna lateral */}
                            <div>
                                <CardCTAImovel
                                    titulo={imovel.titulo}
                                    finalidade={imovel.finalidade as 'Venda' | 'Aluguel' | 'Temporada'}
                                    preco={Number(imovel.preco)}
                                    destaque={imovel.destaque || false}
                                    imovel={imovel}
                                    full={true}
                                />
                            </div>
                        </div>
                    </div>
                </section>                {/* Imóveis relacionados */}
                {relacionados && relacionados.length > 0 && (
                    <section className="mt-16">
                        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl font-bold mb-6">Imóveis relacionados</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Cards de imóveis relacionados */}
                                {relacionados.map((imovelRelacionado) => (
                                    <div key={imovelRelacionado._id} className="bg-white rounded-xl shadow-sm p-4">
                                        <h3 className="font-medium">{imovelRelacionado.titulo}</h3>
                                        <p className="text-sm text-gray-500">{imovelRelacionado.bairro}, {imovelRelacionado.cidade}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </>
    );
};

export default ImovelDetalhes;

// This file has been renamed to ImovelDetalhes.tsx. Please use that file instead.
