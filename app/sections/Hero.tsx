"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ElegantHero: React.FC = () => {
    return (
        <section className="relative min-h-screen bg-white">
            {/* Grid sutil no background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />

            {/* Container principal com max-width controlado */}
            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center min-h-screen py-20 lg:py-0">

                    {/* Conteúdo - Esquerda */}
                    <motion.div
                        className="flex-1 lg:pr-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Pequeno destaque */}
                        <div className="inline-block mb-6">
                            <p className="text-sm font-medium text-gray-600 tracking-wide uppercase">
                                Desde 2009 em Guararema
                            </p>
                        </div>

                        {/* Título principal - tipografia elegante */}
                        <h1 className="text-5xl lg:text-6xl font-light leading-none mb-6">
                            <span className="font-semibold">Imóveis</span> que
                            <br />
                            definem <span className="font-semibold">estilo</span>
                        </h1>

                        {/* Descrição refinada */}
                        <p className="text-lg text-gray-600 leading-relaxed mb-12 max-w-md">
                            Curadoria especializada de propriedades excepcionais.
                            Conectamos você ao imóvel ideal com discrição e excelência.
                        </p>

                        {/* CTAs minimalistas */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/portfolio">
                                <button className="group flex items-center justify-center px-8 py-4 bg-black text-white font-medium hover:bg-gray-900 transition-colors">
                                    Ver Portfólio
                                    <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>

                            <Link href="/consultoria">
                                <button className="px-8 py-4 border border-gray-300 text-gray-700 font-medium hover:border-gray-400 transition-colors">
                                    Consultoria Personalizada
                                </button>
                            </Link>
                        </div>

                        {/* Indicadores discretos */}
                        <div className="flex gap-12 mt-16">
                            <div>
                                <p className="text-3xl font-light">1.200+</p>
                                <p className="text-sm text-gray-600">Negócios realizados</p>
                            </div>
                            <div>
                                <p className="text-3xl font-light">R$ 850M</p>
                                <p className="text-sm text-gray-600">Em transações</p>
                            </div>
                            <div>
                                <p className="text-3xl font-light">98%</p>
                                <p className="text-sm text-gray-600">Satisfação</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Imagem principal - Direita */}
                    <motion.div
                        className="flex-1 relative"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="relative aspect-[4/5] max-w-lg mx-auto">
                            {/* Frame elegante */}
                            <div className="absolute inset-0 border border-gray-200" />

                            {/* Imagem principal */}
                            <div className="absolute inset-4">
                                <Image
                                    src="/images/luxury-home.jpg"
                                    alt="Propriedade em destaque"
                                    fill
                                    className="object-cover"
                                    priority
                                    quality={90}
                                />
                            </div>

                            {/* Card de destaque sobreposto */}
                            <motion.div
                                className="absolute bottom-8 left-8 right-8 bg-white p-6 shadow-lg"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <p className="text-sm text-gray-500 mb-1">Em destaque</p>
                                <h3 className="text-lg font-semibold mb-2">Residência Alto Padrão - Jardim Dulce</h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    450m² | 4 suítes | Vista panorâmica
                                </p>
                                <Link href="/imovel/jardim-dulce-001" className="text-sm font-medium underline">
                                    Ver detalhes
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Seção inferior - Preview de propriedades */}
            <motion.div
                className="border-t border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-light">Propriedades selecionadas</h2>
                        <Link href="/portfolio" className="text-sm font-medium hover:underline">
                            Ver todas →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                className="group cursor-pointer"
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="aspect-[4/3] bg-gray-100 mb-4 overflow-hidden">
                                    <div className="w-full h-full bg-gray-200 group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <h3 className="font-medium mb-1">Casa Contemporânea</h3>
                                <p className="text-sm text-gray-600 mb-1">Centro Histórico</p>
                                <p className="text-sm font-medium">R$ 1.250.000</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default ElegantHero;