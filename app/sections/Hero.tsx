"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Home, Bed, Bath, Car, MessageCircle, Search, Star, Shield, Users, Award } from 'lucide-react';
import Link from 'next/link';

// Skeleton otimizado
const HeroSkeleton = () => (
    <section className="relative min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
                <div className="space-y-6">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="space-y-4">
                        <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
                        <div className="h-12 w-4/5 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="flex gap-4">
                        <div className="h-12 w-32 bg-gray-200 rounded animate-pulse" />
                        <div className="h-12 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
                <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
        </div>
    </section>
);

const ModernHero: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [activeProperty, setActiveProperty] = useState(0);

    useEffect(() => {
        setIsMounted(true);

        // Auto-rotate featured properties
        const interval = setInterval(() => {
            setActiveProperty(prev => (prev + 1) % featuredProperties.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Featured properties data
    const featuredProperties = [
        {
            id: 1,
            title: "Casa Moderna - Jardim São Bento",
            location: "Guararema, SP",
            price: "R$ 850.000",
            image: "/images/luxury-home.jpg",
            type: "Casa",
            area: "280m²",
            bedrooms: 4,
            bathrooms: 3,
            garage: 2
        },
        {
            id: 2,
            title: "Condomínio Fechado Premium",
            location: "Centro, Guararema",
            price: "R$ 1.200.000",
            image: "/casaEx.jpg",
            type: "Casa",
            area: "350m²",
            bedrooms: 5,
            bathrooms: 4,
            garage: 3
        },
        {
            id: 3,
            title: "Apartamento Vista Panorâmica",
            location: "Vila Dulce, Guararema",
            price: "R$ 650.000",
            image: "/houses.jpg",
            type: "Apartamento",
            area: "120m²",
            bedrooms: 3,
            bathrooms: 2,
            garage: 2
        }
    ];

    const stats = [
        { label: "Imóveis Vendidos", value: "1.200+", icon: Home },
        { label: "Clientes Satisfeitos", value: "98%", icon: Star },
        { label: "Anos de Experiência", value: "15+", icon: Award },
        { label: "Volume Negociado", value: "R$ 850M", icon: Shield }
    ];

    if (!isMounted) {
        return <HeroSkeleton />;
    }

    return (
        <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-emerald-100/50 to-transparent" />
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-blue-100/50 to-transparent" />
            </div>

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-12">
                <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[85vh]">
                    {/* Left Column - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        {/* Trust Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-medium"
                        >
                            <Shield className="w-4 h-4" />
                            Imobiliária Confiável desde 2009
                        </motion.div>

                        {/* Main Headline */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Encontre o
                                <span className="block text-emerald-600">imóvel perfeito</span>
                                em Guararema
                            </h1>
                        </motion.div>

                        {/* Value Proposition */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg text-gray-600 leading-relaxed max-w-xl"
                        >
                            Mais de 15 anos conectando pessoas aos melhores imóveis da região.
                            Especialistas em compra, venda e locação com transparência total e resultados garantidos.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link href="/comprar">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:bg-emerald-700 transition-all duration-200"
                                >
                                    <Search className="w-5 h-5" />
                                    Buscar Imóveis
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>

                            <motion.a
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                href="https://wa.me/5511981845016?text=Olá! Gostaria de saber mais sobre os imóveis disponíveis."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center gap-3 px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-emerald-600 hover:text-emerald-600 transition-all duration-200"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Falar com Especialista
                            </motion.a>
                        </motion.div>

                        {/* Trust Indicators - Horizontal Layout */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-gray-100"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
                                    className="text-center"
                                >
                                    <stat.icon className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Property Showcase */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Featured Property Card */}
                        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                            {/* Property Image */}
                            <div className="relative h-64 lg:h-80">
                                <Image
                                    src={featuredProperties[activeProperty].image}
                                    alt={featuredProperties[activeProperty].title}
                                    fill
                                    className="object-cover transition-all duration-700"
                                    priority
                                    quality={90}
                                />

                                {/* Property Type Badge */}
                                <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {featuredProperties[activeProperty].type}
                                </div>

                                {/* Price Tag */}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-full text-sm font-bold">
                                    {featuredProperties[activeProperty].price}
                                </div>

                                {/* Property Navigation */}
                                <div className="absolute bottom-4 left-4 flex gap-2">
                                    {featuredProperties.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveProperty(index)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeProperty ? 'bg-white w-6' : 'bg-white/50'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Property Details */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {featuredProperties[activeProperty].title}
                                </h3>

                                <div className="flex items-center gap-2 text-gray-600 mb-4">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">{featuredProperties[activeProperty].location}</span>
                                </div>

                                {/* Property Features - Horizontal Layout */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <Bed className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{featuredProperties[activeProperty].bedrooms} quartos</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Bath className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{featuredProperties[activeProperty].bathrooms} banheiros</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Car className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{featuredProperties[activeProperty].garage} vagas</span>
                                    </div>
                                </div>

                                {/* Property CTA */}
                                <Link href={`/imovel/${featuredProperties[activeProperty].id}`}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                                    >
                                        Ver Detalhes Completos
                                    </motion.button>
                                </Link>
                            </div>
                        </div>

                        {/* Quick Action Cards - Horizontal Layout */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="flex gap-4 mt-6 justify-center"
                        >
                            <Link href="/comprar">
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 cursor-pointer min-w-[120px]"
                                >
                                    <div className="text-center">
                                        <Home className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                                        <p className="text-sm font-semibold text-gray-900">Comprar</p>
                                        <p className="text-xs text-gray-600">450+ imóveis</p>
                                    </div>
                                </motion.div>
                            </Link>

                            <Link href="/alugar">
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 cursor-pointer min-w-[120px]"
                                >
                                    <div className="text-center">
                                        <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                        <p className="text-sm font-semibold text-gray-900">Alugar</p>
                                        <p className="text-xs text-gray-600">280+ imóveis</p>
                                    </div>
                                </motion.div>
                            </Link>

                            <Link href="/vender">
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 cursor-pointer min-w-[120px]"
                                >
                                    <div className="text-center">
                                        <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                        <p className="text-sm font-semibold text-gray-900">Vender</p>
                                        <p className="text-xs text-gray-600">Avaliação grátis</p>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Quick Search Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="relative bg-gray-50 border-t border-gray-200"
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Busca Rápida por Categoria
                        </h3>
                        <p className="text-gray-600">
                            Encontre exatamente o que procura com nossa busca especializada
                        </p>
                    </div>

                    {/* Quick Search Filters - Horizontal Layout */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {[
                            { name: 'Casas', link: '/comprar?tipo=casa', count: '180+' },
                            { name: 'Apartamentos', link: '/comprar?tipo=apartamento', count: '95+' },
                            { name: 'Terrenos', link: '/comprar?tipo=terreno', count: '120+' },
                            { name: 'Comerciais', link: '/comprar?tipo=comercial', count: '55+' }
                        ].map((category, index) => (
                            <Link key={category.name} href={category.link}>
                                <motion.div
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-emerald-600 hover:shadow-lg transition-all duration-200 cursor-pointer"
                                >
                                    <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                                    <p className="text-sm text-gray-600">{category.count} disponíveis</p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default ModernHero;