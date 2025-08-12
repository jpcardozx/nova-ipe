'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, ChevronLeft, ChevronRight, MapPin, Bed, Bath, Car, Square, ArrowRight } from 'lucide-react';
import { formatarMoeda } from '@/lib/utils';
import type { ImovelClient } from '@/src/types/imovel-client';

interface ImoveisEmAltaProps {
    hotProperties: ImovelClient[];
}

export function ImoveisEmAlta({ hotProperties }: ImoveisEmAltaProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!hotProperties || hotProperties.length === 0) {
        return null;
    }

    const nextSlide = () => {
        setCurrentIndex((prev) =>
            prev >= hotProperties.length - 1 ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev <= 0 ? hotProperties.length - 1 : prev - 1
        );
    };

    return (
        <section className="relative -mt-20 z-20 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header da Seção */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full shadow-xl mb-4">
                        <Flame className="w-5 h-5 animate-pulse" />
                        <span className="font-bold text-lg">IMÓVEIS EM ALTA</span>
                        <Flame className="w-5 h-5 animate-pulse" />
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                        Oportunidades que não podem esperar
                    </h2>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Imóveis com alta procura e excelente potencial de valorização
                    </p>
                </div>

                {/* Slider de Imóveis */}
                <div className="relative">
                    {/* Container do Slider */}
                    <div className="overflow-hidden rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {hotProperties.map((property, index) => (
                                <div key={property._id} className="w-full flex-shrink-0">
                                    <div className="grid lg:grid-cols-2 gap-0 h-96 lg:h-80">
                                        {/* Imagem */}
                                        <div className="relative overflow-hidden">
                                            <Image
                                                src={property.imagem?.imagemUrl || '/images/placeholder.jpg'}
                                                alt={property.titulo || 'Imóvel em alta'}
                                                fill
                                                className="object-cover transition-transform duration-700 hover:scale-110"
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                            />

                                            {/* Badge "EM ALTA" */}
                                            <div className="absolute top-4 left-4">
                                                <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg">
                                                    <Flame className="w-4 h-4 animate-pulse" />
                                                    <span className="font-bold text-sm">EM ALTA</span>
                                                </div>
                                            </div>

                                            {/* Finalidade */}
                                            <div className="absolute top-4 right-4">
                                                <span className={`px-3 py-1 text-sm font-bold rounded-full ${property.finalidade === 'Venda'
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-blue-500 text-white'
                                                    }`}>
                                                    {property.finalidade?.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Detalhes */}
                                        <div className="p-8 flex flex-col justify-center bg-white/95 backdrop-blur-sm">
                                            <div className="mb-4">
                                                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                                                    {property.titulo}
                                                </h3>
                                                <div className="flex items-center gap-2 text-slate-600 mb-4">
                                                    <MapPin className="w-5 h-5" />
                                                    <span>{property.endereco || `${property.bairro}, ${property.cidade}`}</span>
                                                </div>

                                                <div className="text-3xl lg:text-4xl font-bold text-amber-600 mb-6">
                                                    {formatarMoeda(property.preco || 0)}
                                                    {property.finalidade === 'Aluguel' &&
                                                        <span className="text-lg text-slate-500 font-normal">/mês</span>
                                                    }
                                                </div>
                                            </div>

                                            {/* Características */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                                {property.dormitorios && (
                                                    <div className="text-center">
                                                        <Bed className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                                                        <div className="font-semibold text-slate-900">{property.dormitorios}</div>
                                                        <div className="text-xs text-slate-500">Quartos</div>
                                                    </div>
                                                )}
                                                {property.banheiros && (
                                                    <div className="text-center">
                                                        <Bath className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                                                        <div className="font-semibold text-slate-900">{property.banheiros}</div>
                                                        <div className="text-xs text-slate-500">Banheiros</div>
                                                    </div>
                                                )}
                                                {property.areaUtil && (
                                                    <div className="text-center">
                                                        <Square className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                                                        <div className="font-semibold text-slate-900">{property.areaUtil}m²</div>
                                                        <div className="text-xs text-slate-500">Área</div>
                                                    </div>
                                                )}
                                                {property.vagas && (
                                                    <div className="text-center">
                                                        <Car className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                                                        <div className="font-semibold text-slate-900">{property.vagas}</div>
                                                        <div className="text-xs text-slate-500">Vagas</div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* CTA */}
                                            <Link
                                                href={`/imovel/${property.slug}`}
                                                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
                                            >
                                                Ver Detalhes
                                                <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navegação */}
                    {hotProperties.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-colors border border-white/30"
                                aria-label="Imóvel anterior"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-colors border border-white/30"
                                aria-label="Próximo imóvel"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Indicadores */}
                    {hotProperties.length > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            {hotProperties.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                            ? 'bg-white scale-125'
                                            : 'bg-white/50 hover:bg-white/75'
                                        }`}
                                    aria-label={`Ir para imóvel ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Call to Action Global */}
                <div className="text-center mt-8">
                    <Link
                        href="/catalogo?emAlta=true"
                        className="inline-flex items-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg border border-white/30 transition-all duration-300 hover:scale-105"
                    >
                        <Flame className="w-6 h-6" />
                        Ver Todos os Imóveis em Alta
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
