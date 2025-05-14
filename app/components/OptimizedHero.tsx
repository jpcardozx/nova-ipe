'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Trees, Mountain, Building } from 'lucide-react';

interface GuararemaSpot {
    name: string;
    type: string;
    description: string;
    avgPrice: string;
    properties: number;
}

const guararemaSpots: Record<string, GuararemaSpot> = {
    centro: {
        name: 'Centro Histórico',
        type: 'Patrimônio e comércio',
        description: 'Casarões preservados, comércio tradicional',
        avgPrice: 'R$ 650 mil',
        properties: 89
    },
    'jardim-dulce': {
        name: 'Jardim Dulce',
        type: 'Residencial familiar',
        description: 'Bairro planejado, escolas próximas',
        avgPrice: 'R$ 520 mil',
        properties: 124
    },
    freguesia: {
        name: 'Freguesia',
        type: 'Natureza preservada',
        description: 'Chácaras, sítios, contato com a natureza',
        avgPrice: 'R$ 890 mil',
        properties: 67
    }
};

export default function DistinctiveHero() {
    const [selectedArea, setSelectedArea] = useState<string>('centro');
    const currentSpot = guararemaSpots[selectedArea];

    return (
        <section className="min-h-screen bg-white relative overflow-hidden">
            {/* Background com mapa estilizado de Guararema */}
            <div className="absolute inset-0 opacity-[0.03]">
                <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
                    <path
                        d="M300,200 Q400,150 500,200 T700,200 Q800,250 850,350 T800,500 Q700,600 500,550 T300,500 Q200,400 300,200"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                    <circle cx="500" cy="400" r="8" fill="currentColor" />
                    <text x="520" y="405" className="text-sm">Centro</text>
                </svg>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
                {/* Header com identidade Ipê */}
                <div className="flex items-center justify-between mb-16">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <Trees className="w-5 h-5 text-amber-700" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Ipê Imóveis</h3>
                            <p className="text-xs text-gray-600">Raízes em Guararema desde 2009</p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6 text-sm">
                        <span className="text-gray-600">15 anos • 1.200+ negócios • CRECI 12.345</span>
                    </div>
                </div>

                {/* Conteúdo principal */}
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5">
                        <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-2">
                            Conheça
                            <span className="block text-amber-600 font-normal mt-2">
                                Guararema
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            por quem nasceu, cresceu e fez história aqui
                        </p>

                        {/* Seletor de área */}
                        <div className="mb-8">
                            <p className="text-sm font-medium text-gray-700 mb-3">
                                Explore por região:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(guararemaSpots).map(([key, spot]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedArea(key)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedArea === key
                                            ? 'bg-amber-600 text-white'
                                            : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                                            }`}
                                    >
                                        {spot.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Informações da área selecionada */}
                        <div className="bg-amber-50/50 border border-amber-200/50 rounded-lg p-6 mb-8">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-1">
                                        {currentSpot.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">{currentSpot.type}</p>
                                </div>
                                <Building className="w-5 h-5 text-amber-600" />
                            </div>

                            <p className="text-gray-700 mb-4">
                                {currentSpot.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-2xl font-light text-amber-700">
                                        {currentSpot.properties}
                                    </p>
                                    <p className="text-sm text-gray-600">imóveis disponíveis</p>
                                </div>
                                <div>
                                    <p className="text-lg font-light text-gray-900">
                                        {currentSpot.avgPrice}
                                    </p>
                                    <p className="text-sm text-gray-600">valor médio</p>
                                </div>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href={`/buscar?bairro=${selectedArea}`} className="flex-1">
                                <button className="w-full px-6 py-3 bg-amber-600 text-white font-medium 
                                 hover:bg-amber-700 transition-colors rounded-sm
                                 flex items-center justify-center group">
                                    Ver imóveis no {currentSpot.name}
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <Link href="/consultoria" className="flex-1">
                                <button className="w-full px-6 py-3 bg-white text-amber-700 font-medium 
                                 border-2 border-amber-600 hover:bg-amber-50 
                                 transition-colors rounded-sm">
                                    Consultoria gratuita
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Visual direita */}
                    <div className="lg:col-span-7 relative">
                        <div className="relative aspect-[4/3] lg:aspect-[16/10] rounded-lg overflow-hidden">
                            <Image
                                src={`/images/areas/${selectedArea}.jpg`}
                                alt={`Vista de ${currentSpot.name}, Guararema`}
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Overlay com gradiente sutil */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                            {/* Quote local */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <blockquote className="text-white">
                                    <p className="text-lg lg:text-xl font-light mb-2">
                                        "Guararema é o equilíbrio perfeito entre a tranquilidade
                                        do interior e a proximidade com a capital"
                                    </p>
                                    <cite className="text-sm opacity-90">
                                        — José Carlos, morador há 25 anos
                                    </cite>
                                </blockquote>
                            </div>
                        </div>

                        {/* Elemento decorativo Ipê */}
                        <div className="absolute -top-8 -right-8 w-32 h-32 opacity-10">
                            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600">
                                <circle cx="50" cy="30" r="25" fill="currentColor" />
                                <rect x="45" y="30" width="10" height="40" fill="currentColor" />
                                <circle cx="35" cy="25" r="15" fill="currentColor" />
                                <circle cx="65" cy="25" r="15" fill="currentColor" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Rodapé do hero */}
                <div className="mt-16 pt-8 border-t border-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <Mountain className="w-5 h-5 text-amber-600" />
                                <span className="text-sm text-gray-700">
                                    Vista para a Serra do Mar
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Trees className="w-5 h-5 text-amber-600" />
                                <span className="text-sm text-gray-700">
                                    70% de área verde preservada
                                </span>
                            </div>
                        </div>

                        <Link href="/sobre-guararema">
                            <span className="text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors">
                                Descubra mais sobre Guararema →
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}