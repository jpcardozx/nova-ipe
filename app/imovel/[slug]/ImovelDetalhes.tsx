"use client";

import React, { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatarMoeda } from '@/lib/utils';
import type { ImovelClient as ImovelDataType } from '@/src/types/imovel-client';
import Button from '@/components/ui/button';
import { PropertyCardUnified } from '@/app/components/ui/property/PropertyCardUnified';
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
    Eye,
    Heart,
    ArrowLeft,
    Star,
    Shield,
    TrendingUp,
    Building2,
    MessageSquare,
    Send,
    ChevronLeft,
    ChevronRight,
    X,
    Maximize2,
    Grid3X3
} from 'lucide-react';

interface ImovelDetalhesProps {
    imovel: ImovelDataType;
    relacionados?: ImovelDataType[];
    preco?: number;
}

const ImovelDetalhes: FC<ImovelDetalhesProps> = ({ imovel, relacionados = [], preco }) => {
    const [imagemAtiva, setImagemAtiva] = useState(0);
    const [isFavorito, setIsFavorito] = useState(false);
    const [modalGaleriaAberto, setModalGaleriaAberto] = useState(false);

    // Log para debug
    console.log('DEBUG ImovelDetalhes - props recebidos:', {
        imovelExists: !!imovel,
        temRelacionados: relacionados?.length > 0
    });

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

    // Garantir imagem padrão
    const imagemPrincipal = imovel.imagem?.imagemUrl || '/images/og-image-2025.jpg';
    const imagensGaleria = imovel.galeria?.filter(img => img.imagemUrl) || [];
    const todasImagens = [
        { imagemUrl: imagemPrincipal, alt: imovel.titulo || 'Imóvel' },
        ...imagensGaleria
    ];

    const precoFinal = preco ?? imovel.preco ?? 0;
    const tipoPropriedade = imovel.finalidade?.toLowerCase() === 'venda' ? 'sale' : 'rent';

    // Navegação por teclado no modal
    React.useEffect(() => {
        if (!modalGaleriaAberto) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    setModalGaleriaAberto(false);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    setImagemAtiva(imagemAtiva > 0 ? imagemAtiva - 1 : todasImagens.length - 1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    setImagemAtiva(imagemAtiva < todasImagens.length - 1 ? imagemAtiva + 1 : 0);
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [modalGaleriaAberto, imagemAtiva, todasImagens.length]);

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
                        {/* Galeria de Imagens Aprimorada */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                            <div className="relative h-96 lg:h-[500px] group">
                                <Image
                                    src={todasImagens[imagemAtiva]?.imagemUrl || imagemPrincipal}
                                    alt={todasImagens[imagemAtiva]?.alt || imovel.titulo || 'Imóvel'}
                                    fill
                                    className="object-cover"
                                    priority
                                />

                                {/* Controles de navegação */}
                                {todasImagens.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setImagemAtiva(imagemAtiva > 0 ? imagemAtiva - 1 : todasImagens.length - 1)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={() => setImagemAtiva(imagemAtiva < todasImagens.length - 1 ? imagemAtiva + 1 : 0)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </>
                                )}

                                {/* Botões de ação */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    {todasImagens.length > 1 && (
                                        <button
                                            onClick={() => setModalGaleriaAberto(true)}
                                            className="bg-black/20 hover:bg-black/40 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
                                            title="Ver todas as fotos"
                                        >
                                            <Grid3X3 className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setModalGaleriaAberto(true)}
                                        className="bg-black/20 hover:bg-black/40 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
                                        title="Ampliar imagem"
                                    >
                                        <Maximize2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Badges sobre a imagem */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {imovel.destaque && (
                                        <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 text-sm font-bold rounded-full shadow-lg flex items-center gap-1">
                                            <Star className="w-3 h-3" />
                                            DESTAQUE
                                        </span>
                                    )}
                                    <span className={`px-3 py-1 text-sm font-bold rounded-full shadow-lg ${tipoPropriedade === 'sale'
                                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                        }`}>
                                        {tipoPropriedade === 'sale' ? 'VENDA' : 'ALUGUEL'}
                                    </span>
                                </div>

                                {/* Indicador de posição da imagem */}
                                {todasImagens.length > 1 && (
                                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                                        {imagemAtiva + 1} / {todasImagens.length}
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails com scroll horizontal aprimorado */}
                            {todasImagens.length > 1 && (
                                <div className="p-4 bg-slate-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-600">
                                            Galeria ({todasImagens.length} {todasImagens.length === 1 ? 'foto' : 'fotos'})
                                        </span>
                                        <button
                                            onClick={() => setModalGaleriaAberto(true)}
                                            className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Ver todas
                                        </button>
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {todasImagens.map((img, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setImagemAtiva(index)}
                                                className={`relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${imagemAtiva === index
                                                        ? 'ring-2 ring-amber-500 scale-105'
                                                        : 'hover:ring-2 hover:ring-amber-300'
                                                    }`}
                                            >
                                                <Image
                                                    src={img.imagemUrl}
                                                    alt={img.alt || `Imagem ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                                {imagemAtiva === index && (
                                                    <div className="absolute inset-0 bg-amber-500/20" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
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

                            {/* Características */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {imovel.areaUtil && (
                                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                                        <Square className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                                        <div className="font-semibold">{imovel.areaUtil} m²</div>
                                        <div className="text-sm text-slate-500">Área útil</div>
                                    </div>
                                )}

                                {imovel.dormitorios && (
                                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                                        <Bed className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                                        <div className="font-semibold">{imovel.dormitorios}</div>
                                        <div className="text-sm text-slate-500">
                                            {imovel.dormitorios === 1 ? 'Quarto' : 'Quartos'}
                                        </div>
                                    </div>
                                )}

                                {imovel.banheiros && (
                                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                                        <Bath className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                                        <div className="font-semibold">{imovel.banheiros}</div>
                                        <div className="text-sm text-slate-500">
                                            {imovel.banheiros === 1 ? 'Banheiro' : 'Banheiros'}
                                        </div>
                                    </div>
                                )}

                                {imovel.vagas && (
                                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                                        <Car className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                                        <div className="font-semibold">{imovel.vagas}</div>
                                        <div className="text-sm text-slate-500">
                                            {imovel.vagas === 1 ? 'Vaga' : 'Vagas'}
                                        </div>
                                    </div>
                                )}
                            </div>

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
                                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2">
                                    <Phone className="w-5 h-5" />
                                    Ligar agora
                                </button>

                                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    WhatsApp
                                </button>

                                <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center justify-center gap-2">
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

            {/* Modal de Galeria em Tela Cheia */}
            {modalGaleriaAberto && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
                    <div className="flex flex-col h-full">
                        {/* Header do Modal */}
                        <div className="flex items-center justify-between p-4 text-white">
                            <div>
                                <h2 className="text-lg font-semibold">{imovel.titulo}</h2>
                                <p className="text-sm text-white/70">
                                    {imagemAtiva + 1} de {todasImagens.length} fotos
                                </p>
                            </div>
                            <button
                                onClick={() => setModalGaleriaAberto(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Imagem Principal do Modal */}
                        <div className="flex-1 relative">
                            <Image
                                src={todasImagens[imagemAtiva]?.imagemUrl || imagemPrincipal}
                                alt={todasImagens[imagemAtiva]?.alt || imovel.titulo || 'Imóvel'}
                                fill
                                className="object-contain"
                                priority
                            />

                            {/* Controles de navegação */}
                            {todasImagens.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setImagemAtiva(imagemAtiva > 0 ? imagemAtiva - 1 : todasImagens.length - 1)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                                    >
                                        <ChevronLeft className="w-8 h-8" />
                                    </button>
                                    <button
                                        onClick={() => setImagemAtiva(imagemAtiva < todasImagens.length - 1 ? imagemAtiva + 1 : 0)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                                    >
                                        <ChevronRight className="w-8 h-8" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails no Modal */}
                        {todasImagens.length > 1 && (
                            <div className="p-4 bg-black/50">
                                <div className="flex gap-2 overflow-x-auto justify-center">
                                    {todasImagens.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setImagemAtiva(index)}
                                            className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${imagemAtiva === index
                                                    ? 'ring-2 ring-amber-400 scale-110'
                                                    : 'hover:ring-2 hover:ring-white/50 opacity-70 hover:opacity-100'
                                                }`}
                                        >
                                            <Image
                                                src={img.imagemUrl}
                                                alt={img.alt || `Imagem ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImovelDetalhes;
export { ImovelDetalhes };
