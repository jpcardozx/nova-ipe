'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Search, Award, Home, Users, Shield, TrendingUp, Clock, Star, CheckCircle2, ArrowRight } from 'lucide-react';

const InstitutionalHero = () => {
    const [searchType, setSearchType] = useState('comprar');
    const [location, setLocation] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    const { scrollY } = useScroll();
    const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
    const contentOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const achievements = [
        {
            icon: Award,
            number: '15',
            label: 'Anos de Tradição',
            sublabel: 'No mercado imobiliário'
        },
        {
            icon: Home,
            number: '500+',
            label: 'Imóveis Negociados',
            sublabel: 'Com sucesso garantido'
        },
        {
            icon: Users,
            number: '+95%',
            label: 'Satisfação',
            sublabel: 'Dos nossos clientes'
        },
        {
            icon: Shield,
            number: 'CRECI',
            label: 'Certificação',
            sublabel: 'Corretores credenciados'
        }
    ];

    const differentials = [
        { icon: Star, text: 'Atendimento Personalizado' },
        { icon: Shield, text: 'Segurança Jurídica Total' },
        { icon: TrendingUp, text: 'Avaliação de Mercado' },
        { icon: Clock, text: 'Agilidade no Processo' }
    ]; return (
        <section className="relative min-h-screen overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('/images/hero-bg.jpg')`,
                    }}
                />

                {/* Elegant Overlay with Depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-stone-900/85 via-stone-800/75 to-amber-900/80" />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-transparent to-amber-800/20" />

                {/* Subtle texture overlay */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `url('/images/wood-pattern.png')`,
                        backgroundSize: '200px 200px',
                        backgroundRepeat: 'repeat',
                        mixBlendMode: 'multiply'
                    }}
                />
            </div>

            {/* Main Content */}
            <motion.div
                style={{ opacity: contentOpacity }}
                className="relative z-20 container mx-auto px-6 pt-32 pb-20"
            >
                <div className="max-w-7xl mx-auto">

                    {/* Header Section */}
                    <div className="text-center mb-16">                        <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                        transition={{ duration: 0.8 }}
                        className="mb-6"
                    >
                        <span className="inline-block px-4 py-2 bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 text-amber-200 text-sm font-semibold rounded-full mb-4">
                            Ipê Imobiliária - Tradição e Confiança
                        </span>
                    </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                        >
                            Encontre o Imóvel{' '}
                            <span className="text-amber-400 relative">
                                Ideal
                                <div className="absolute bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full opacity-70" />
                            </span>
                            <br />
                            para Sua Família
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-xl text-gray-200 mb-4 max-w-3xl mx-auto leading-relaxed"
                        >
                            Há mais de duas décadas conectando pessoas aos seus sonhos imobiliários
                            com segurança, transparência e resultados excepcionais.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-wrap justify-center items-center gap-6 text-gray-300"
                        >
                            {differentials.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <item.icon className="h-4 w-4 text-amber-400" />
                                    <span className="text-sm font-medium">{item.text}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Search Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="mb-16"
                    >                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 max-w-5xl mx-auto">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-stone-900 mb-2">
                                    Encontre Seu Próximo Imóvel
                                </h2>
                                <p className="text-stone-600">
                                    Use nossa busca avançada para descobrir oportunidades selecionadas
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Search Type Toggle */}
                                <div className="flex justify-center">
                                    <div className="flex bg-stone-100 rounded-xl p-1">
                                        {['comprar', 'alugar'].map((type) => (
                                            <motion.button
                                                key={type}
                                                onClick={() => setSearchType(type)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${searchType === type
                                                    ? 'bg-white text-amber-700 shadow-md'
                                                    : 'text-stone-600 hover:text-stone-900'
                                                    }`}
                                            >
                                                {type === 'comprar' ? 'Comprar' : 'Alugar'}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Search Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 h-5 w-5" />
                                        <input
                                            type="text"
                                            placeholder="Localização"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                        />
                                    </div>

                                    <select
                                        value={propertyType}
                                        onChange={(e) => setPropertyType(e.target.value)}
                                        className="px-4 py-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                    >
                                        <option value="">Tipo</option>
                                        <option value="apartamento">Apartamento</option>
                                        <option value="casa">Casa</option>
                                        <option value="studio">Studio</option>
                                        <option value="cobertura">Cobertura</option>
                                        <option value="terreno">Terreno</option>
                                        <option value="comercial">Comercial</option>
                                    </select>

                                    <select
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                        className="px-4 py-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                    >
                                        <option value="">Faixa de Preço</option>
                                        <option value="ate-300k">Até R$ 300.000</option>
                                        <option value="300k-500k">R$ 300.000 - R$ 500.000</option>
                                        <option value="500k-1m">R$ 500.000 - R$ 1.000.000</option>
                                        <option value="1m-2m">R$ 1.000.000 - R$ 2.000.000</option>
                                        <option value="acima-2m">Acima de R$ 2.000.000</option>
                                    </select>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                    >
                                        <Search className="h-5 w-5" />
                                        Buscar
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Achievement Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                    >
                        {achievements.map((achievement, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }} whileHover={{ scale: 1.05, y: -5 }}
                                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center shadow-xl border border-white/20 hover:shadow-2xl hover:bg-white/15 transition-all duration-300 group"
                            >                                <div className="mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 backdrop-blur-sm border border-amber-400/30 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:from-amber-400/30 group-hover:to-yellow-400/30 transition-all">
                                        <achievement.icon className="h-6 w-6 text-amber-400" />
                                    </div>
                                </div>

                                <div className="text-3xl font-bold text-white mb-2">
                                    {achievement.number}
                                </div>

                                <div className="text-amber-200 font-semibold mb-1">
                                    {achievement.label}
                                </div>

                                <div className="text-sm text-gray-300">
                                    {achievement.sublabel}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                        transition={{ duration: 0.8, delay: 1.4 }}
                        className="text-center"
                    >                        <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-md rounded-2xl p-8 border border-amber-400/30">
                            <h3 className="text-2xl font-bold text-white mb-4">
                                Pronto para Encontrar Seu Novo Lar?
                            </h3>
                            <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
                                Nossa equipe especializada está pronta para ajudá-lo em cada etapa
                                do processo, desde a busca até a assinatura do contrato.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href="https://wa.me/5511981845016?text=Olá! Gostaria de conhecer os imóveis disponíveis."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515" />
                                    </svg>
                                    Falar com Especialista
                                </motion.a>

                                <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href="#propriedades"
                                    className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm border-2 border-amber-400/50 text-white hover:bg-white/30 px-8 py-4 rounded-xl font-semibold transition-all"
                                >
                                    Ver Imóveis Disponíveis
                                    <ArrowRight className="w-5 h-5" />
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.6 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
            >
                <div className="flex flex-col items-center text-stone-500 cursor-pointer group">
                    <span className="text-sm mb-3 group-hover:text-stone-700 transition-colors">
                        Explore Nossos Imóveis
                    </span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-6 h-10 border-2 border-stone-300 rounded-full flex justify-center group-hover:border-stone-400 transition-colors"
                    >
                        <motion.div
                            animate={{ y: [0, 12, 0], opacity: [1, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1 h-3 bg-gradient-to-b from-amber-500 to-transparent rounded-full mt-2"
                        />
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default InstitutionalHero;
