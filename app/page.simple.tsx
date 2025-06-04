// Simple, working homepage - bypasses all Server Component serialization issues
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Award, Home, Users, Shield } from 'lucide-react';

export default function SimpleHomePage() {
    return (
        <div className="min-h-screen">
            {/* Professional Hero Section - Ipê Branding */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background with Ipê colors */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(/images/hero-bg.jpg)',
                        filter: 'brightness(0.7) contrast(1.1)'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-orange-800/70 to-yellow-700/60" />

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Imóveis Premium em{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
                                Guararema
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                            Sua referência em negócios imobiliários há mais de 25 anos.
                            Encontre o imóvel ideal com quem entende do mercado.
                        </p>

                        {/* Search Form */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-4xl mx-auto mb-12 border border-white/20">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <select className="px-4 py-3 rounded-lg bg-white/90 text-gray-800 border-0 focus:ring-2 focus:ring-amber-400">
                                    <option>Comprar</option>
                                    <option>Alugar</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Localização"
                                    className="px-4 py-3 rounded-lg bg-white/90 text-gray-800 border-0 focus:ring-2 focus:ring-amber-400"
                                />
                                <select className="px-4 py-3 rounded-lg bg-white/90 text-gray-800 border-0 focus:ring-2 focus:ring-amber-400">
                                    <option>Tipo de Imóvel</option>
                                    <option>Casa</option>
                                    <option>Apartamento</option>
                                    <option>Terreno</option>
                                </select>
                                <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2">
                                    <Search size={20} />
                                    Buscar
                                </button>
                            </div>
                        </div>

                        {/* Trust Indicators */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                            {[
                                { icon: Award, label: '25+', subtitle: 'Anos de Experiência' },
                                { icon: Home, label: '2.500+', subtitle: 'Imóveis Vendidos' },
                                { icon: Users, label: '98%', subtitle: 'Clientes Satisfeitos' },
                                { icon: Shield, label: 'CRECI', subtitle: 'Regularizado' }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                                        <item.icon className="mx-auto mb-2 text-amber-300" size={32} />
                                        <div className="text-2xl font-bold text-white">{item.label}</div>
                                        <div className="text-sm text-amber-200">{item.subtitle}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Property Highlights - Sale */}
            <section className="py-20 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Oportunidades Exclusivas de Compra
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Imóveis premium selecionados em Guararema - Investimentos com alta valorização
                        </p>
                    </div>

                    {/* Property Cards Placeholder */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                    <span className="text-gray-500">Imagem do Imóvel</span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Casa Premium {item}</h3>
                                    <p className="text-gray-600 mb-4">Guararema - SP</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-amber-600">R$ 890.000</span>
                                        <button className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                                            Ver Detalhes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Property Highlights - Rent */}
            <section className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Aluguéis Premium Selecionados
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Propriedades para locação com filtros inteligentes e qualidade superior
                        </p>
                    </div>

                    {/* Property Cards Placeholder */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                    <span className="text-gray-500">Imagem do Imóvel</span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Apartamento Premium {item}</h3>
                                    <p className="text-gray-600 mb-4">Guararema - SP</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-orange-600">R$ 3.500/mês</span>
                                        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                                            Ver Detalhes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">
                        Consultoria Imobiliária Especializada
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Solicite uma avaliação gratuita ou tire suas dúvidas com nossos especialistas.
                    </p>
                    <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all">
                        Solicitar Contato
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold mb-4">Ipê Imóveis</h3>
                    <p className="text-gray-400 mb-6">Sua referência em negócios imobiliários há mais de 25 anos</p>
                    <div className="flex justify-center space-x-6">
                        <span className="text-gray-400">CRECI: 12345-SP</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">(11) 99999-9999</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">contato@ipeimoveis.com.br</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
