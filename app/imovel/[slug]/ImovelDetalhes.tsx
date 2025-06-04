"use client";

import React, { FC, useState, useEffect } from 'react';
import { Phone, Calendar, UserCheck, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatarMoeda } from '@/lib/utils';
import WhatsAppShare from '@/app/components/WhatsAppShare';
import SocialShareButtons from '@/app/components/SocialShareButtons';
import PropertyMetadata from '@/app/components/PropertyMetadata';
import { PortableText } from '@portabletext/react';
import { ImageResponse } from 'next/og';
import { urlFor } from '@/src/lib/sanity'; // Potential actual export from sanity.imageHelper.ts
import type { ImovelClient as ImovelDataType } from '@/src/types/imovel-client';
import { Button } from '@/app/components/ui/button';

interface ImovelDetalhesProps {
    imovel: ImovelDataType;
    relacionados?: ImovelDataType[];
    preco?: number;
}

// Validação robusta do componente
const ImovelDetalhes: FC<ImovelDetalhesProps> = ({ imovel, relacionados = [], preco }) => {
    // Adiciona um log detalhado para depurar o objeto imovel
    console.log('DEBUG ImovelDetalhes - props recebidos:', {
        imovelExists: !!imovel,
        imovelStructure: imovel ? {
            _id: imovel._id,
            titulo: imovel.titulo,
            imagem: {
                exists: !!imovel.imagem,
                imagemUrl: imovel.imagem?.imagemUrl,
                alt: imovel.imagem?.alt
            },
            temRelacionados: relacionados?.length > 0
        } : null
    });

    // Verificação de segurança para garantir que temos os dados necessários
    // e evitar o erro de "imóvel indisponível"
    if (!imovel || !imovel._id) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center text-gray-500">
                    Imóvel não encontrado.
                </div>
            </div>
        );
    }

    // Garantir que imovel.imagem está definido para evitar erros
    if (!imovel.imagem) {
        imovel = {
            ...imovel,
            imagem: {
                imagemUrl: '', // Provide a default or placeholder URL
                alt: 'Imagem não disponível',
                asset: {
                    _type: 'sanity.imageAsset',
                    _ref: ''
                }
            }
        };
    }

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row md:space-x-4">                <div className="flex-1">
                {/* Uso robusto do componente Image com fallback e tratamento de erro */}
                {(imovel.imagem?.imagemUrl) ? (
                    <Image
                        src={imovel.imagem?.imagemUrl || '/images/og-image-2025.jpg'}
                        alt={imovel.imagem?.alt || imovel.titulo || 'Imóvel Nova Ipê'}
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-lg"
                        priority
                        // @ts-ignore - Next.js Image onError prop
                        onError={({ currentTarget }) => {
                            // Fallback para imagem padrão em caso de erro
                            currentTarget.onerror = null; // Evita loops infinitos
                            currentTarget.src = '/images/og-image-2025.jpg';
                        }}
                    />
                ) : (
                    <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Imagem não disponível</p>
                    </div>
                )}
            </div>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">{imovel.titulo}</h1>
                    <p className="text-xl text-green-600 font-semibold">
                        {formatarMoeda(preco ?? imovel.preco ?? 0)}
                    </p>
                    <div className="flex space-x-2 my-4">
                        <WhatsAppShare
                            title={imovel.titulo}
                            message={`Olá! Tenho interesse no imóvel: ${imovel.titulo}`}
                            buttonText="WhatsApp"
                            showLabel={true}
                            fullWidth={false}
                            size="md"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center">
                            <Calendar className="w-5 h-5 mr-2" />
                            <span>{imovel.dataPublicacao ? new Date(imovel.dataPublicacao).toLocaleDateString() : ''}</span>
                        </div>
                        <div className="flex items-center">
                            <UserCheck className="w-5 h-5 mr-2" />
                            <span>Imóvel verificado pela Nova Ipê</span>
                        </div>
                        <div className="flex items-center">
                            <Share2 className="w-5 h-5 mr-2" />
                            <SocialShareButtons
                                title={imovel.titulo}
                                description={`Confira este imóvel: ${imovel.titulo}`}
                                imageUrl={imovel.imagem?.imagemUrl}
                                showLabel={false}
                                compact={true}
                                platforms={['facebook', 'twitter', 'linkedin']}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <h2 className="text-xl font-semibold">Descrição</h2>
                <p className="mt-2">{imovel.descricao}</p>
            </div>
            <div className="mt-4">
                <h2 className="text-xl font-semibold">Características</h2>
                <ul className="list-disc list-inside mt-2">
                    {(imovel.caracteristicas || []).map((caracteristica: string, idx: number) => (
                        <li key={idx}>{caracteristica}</li>
                    ))}
                </ul>
            </div>
            <div className="mt-4">
                <h2 className="text-xl font-semibold">Localização</h2>
                <p className="mt-2">{imovel.endereco}</p>
            </div>
            <PropertyMetadata property={{
                id: imovel._id || imovel.id || '',
                title: imovel.titulo || '',
                description: imovel.descricao || imovel.metaDescription || '',
                price: typeof imovel.preco === 'number' ? imovel.preco : imovel.preco ? parseFloat(String(imovel.preco)) : 0,
                address: imovel.endereco || '',
                city: imovel.cidade || '',
                location: imovel.bairro || imovel.cidade || '',
                propertyType: imovel.finalidade?.toLowerCase() === 'venda' ? 'sale' : 'rent',
                bedrooms: typeof imovel.dormitorios === 'number' ? imovel.dormitorios : imovel.dormitorios ? parseInt(String(imovel.dormitorios), 10) : undefined,
                bathrooms: typeof imovel.banheiros === 'number' ? imovel.banheiros : imovel.banheiros ? parseInt(String(imovel.banheiros), 10) : undefined,
                area: typeof imovel.areaUtil === 'number' ? imovel.areaUtil : imovel.areaUtil ? parseFloat(String(imovel.areaUtil)) : undefined,
                features: imovel.caracteristicas || [],
                mainImage: {
                    url: imovel.imagem?.imagemUrl || '/images/og-image-2025.jpg',
                    alt: imovel.imagem?.alt || imovel.titulo || 'Imóvel Nova Ipê'
                },
                images: imovel.galeria?.map((img) => ({
                    url: img.imagemUrl || '',
                    alt: img.alt || imovel.titulo || 'Imóvel Nova Ipê'
                })),
                latitude: undefined, // Add if available
                longitude: undefined, // Add if available
                slug: imovel.slug || '',
            }} />
            {relacionados.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Imóveis relacionados</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relacionados.map((rel) => (
                            <div key={rel._id} className="bg-white rounded-xl shadow-sm p-4">
                                <h3 className="font-medium">{rel.titulo}</h3>
                                <p className="text-sm text-gray-500">{rel.bairro}, {rel.cidade}</p>
                            </div>
                        ))}
                    </div>
                </div>)}
        </div>
    );
};

// Export default primeiro para garantir que seja detectado corretamente
export default ImovelDetalhes;

// Export nomeado como backup
export { ImovelDetalhes };

// Verificação de runtime para debug
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('✅ ImovelDetalhes exportado com sucesso:', typeof ImovelDetalhes);
}
