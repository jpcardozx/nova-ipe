'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Key,
    Shield,
    Clock,
    Star,
    ArrowRight,
    MapPin,
    Heart,
    Users,
    Sparkles,
    Home as HomeIcon,
    CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import PropertyCardUnified from '@/app/components/ui/property/PropertyCardUnified';
import { getImoveisDestaqueAluguel } from '@/lib/queries';
import { loadImage } from '@/lib/enhanced-image-loader';
import { extractSlugString } from '@/app/PropertyTypeFix';
import type { ImovelClient } from '@/src/types/imovel-client';
import type { PropertyCardUnifiedProps as PropertyCardProps } from '@/app/components/ui/property/PropertyCardUnified';
import type { PropertyType } from '@/app/components/ui/property/types';

// Animações específicas para aluguéis - mais fluidas e acolhedoras
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

const benefitVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

// Stats específicos para aluguéis
const RentalStats: React.FC = () => {
    const [stats, setStats] = useState({
        totalRentals: 0,
        averageTime: 0,
        satisfaction: 0
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setStats({
                totalRentals: 147,
                averageTime: 15,
                satisfaction: 98
            });
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="grid grid-cols-3 gap-4 mb-8">
            <motion.div
                className="text-center"
                variants={benefitVariants}
            >
                <div className="text-2xl font-bold text-emerald-700 mb-1">
                    {stats.totalRentals}+
                </div>
                <div className="text-sm text-stone-600">Aluguéis Realizados</div>
            </motion.div>

            <motion.div
                className="text-center"
                variants={benefitVariants}
            >
                <div className="text-2xl font-bold text-emerald-700 mb-1">
                    {stats.averageTime} dias
                </div>
                <div className="text-sm text-stone-600">Tempo Médio</div>
            </motion.div>

            <motion.div
                className="text-center"
                variants={benefitVariants}
            >
                <div className="text-2xl font-bold text-emerald-700 mb-1">
                    {stats.satisfaction}%
                </div>
                <div className="text-sm text-stone-600">Satisfação</div>
            </motion.div>
        </div>
    );
};

// Benefícios únicos para aluguéis
const RentalBenefits: React.FC = () => {
    const benefits = [
        {
            icon: Shield,
            title: "Garantia Legal",
            description: "Contratos seguros e assessoria jurídica completa"
        },
        {
            icon: Clock,
            title: "Agilidade",
            description: "Processo rápido, do interesse à entrega das chaves"
        },
        {
            icon: Users,
            title: "Suporte Contínuo",
            description: "Acompanhamento durante todo o período de locação"
        },
        {
            icon: CheckCircle,
            title: "Sem Complicações",
            description: "Documentação simplificada e transparente"
        }
    ];

    return (
        <div className="space-y-4">
            {benefits.map((benefit, index) => (
                <motion.div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300"
                    variants={benefitVariants}
                    whileHover={{ x: 5 }}
                >
                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <benefit.icon className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-stone-800 mb-1">{benefit.title}</h4>
                        <p className="text-sm text-stone-600 leading-relaxed">{benefit.description}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

// Componente principal
const StrategicRentalsSection: React.FC = () => {
    const [properties, setProperties] = useState<PropertyCardProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProperties = useCallback(async () => {
        try {
            setLoading(true);
            const rawProperties = await getImoveisDestaqueAluguel();

            if (!rawProperties?.length) {
                throw new Error('Nenhum imóvel para aluguel encontrado');
            } const formattedProperties: PropertyCardProps[] = await Promise.all(
                rawProperties.slice(0, 6).map(async (property: ImovelClient) => {
                    let imageUrl = '';

                    try {                        // Carrega a imagem principal usando a estrutura correta
                        if (property.imagem?.imagemUrl) {
                            const processedImage = await loadImage(property.imagem.imagemUrl);
                            imageUrl = processedImage.url || property.imagem.imagemUrl;
                        }
                    } catch (error) {
                        console.warn('Erro ao carregar imagem:', error);
                        imageUrl = '/images/default-property.jpg';
                    }

                    return {
                        id: property._id,
                        title: property.titulo || `${property.tipoImovel} em ${property.bairro}`,
                        slug: property.slug,
                        price: property.preco || 0,
                        location: `${property.bairro}, ${property.cidade}`,
                        bedrooms: property.dormitorios || 0,
                        bathrooms: property.banheiros || 0,
                        area: property.areaUtil || 0,
                        propertyType: 'rent' as PropertyType,
                        mainImage: {
                            url: imageUrl,
                            alt: property.titulo || `${property.tipoImovel} em ${property.bairro}`,
                            imagemUrl: imageUrl
                        },
                        isHighlight: property.destaque || false,
                        referenceCode: property._id
                    };
                })
            );

            setProperties(formattedProperties);
        } catch (error) {
            console.error('Erro ao carregar imóveis para aluguel:', error);
            setError('Erro ao carregar propriedades');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProperties();
    }, [loadProperties]);

    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
                <div className="container mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="h-8 bg-emerald-200 rounded-lg w-96 mx-auto mb-4"></div>
                        <div className="h-4 bg-emerald-100 rounded w-64 mx-auto mb-12"></div>
                        <div className="grid lg:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-20 bg-white/50 rounded-xl"></div>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-80 bg-white/70 rounded-2xl"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
                <div className="container mx-auto px-4 text-center">
                    <div className="text-stone-600">
                        Erro ao carregar propriedades para aluguel
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-48 h-48 bg-teal-200 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-200 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                className="container mx-auto px-4 relative z-10"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    variants={headerVariants}
                >
                    <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                        <Key className="w-4 h-4 text-emerald-700" />
                        <span className="text-sm font-medium text-emerald-700">Aluguéis Estratégicos</span>
                        <Sparkles className="w-4 h-4 text-emerald-700" />
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-bold text-stone-800 mb-6">
                        Seu Novo Lar em{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                            Guararema
                        </span>
                    </h2>

                    <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
                        Encontre o imóvel perfeito para alugar com segurança, agilidade
                        e todo suporte que sua família merece
                    </p>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column - Benefits & Stats */}
                    <motion.div
                        className="lg:col-span-5 space-y-8"
                        variants={containerVariants}
                    >
                        {/* Stats */}
                        <motion.div variants={benefitVariants}>
                            <RentalStats />
                        </motion.div>

                        {/* Benefits */}
                        <motion.div variants={benefitVariants}>
                            <h3 className="text-2xl font-bold text-stone-800 mb-6 flex items-center">
                                <Heart className="w-6 h-6 text-emerald-600 mr-3" />
                                Por que Escolher Nossos Aluguéis?
                            </h3>
                            <RentalBenefits />
                        </motion.div>

                        {/* CTA */}
                        <motion.div variants={benefitVariants}>
                            <Link
                                href="/imoveis?tipo=aluguel"
                                className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 group"
                            >
                                <span>Ver Todos os Aluguéis</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Properties Grid */}
                    <motion.div
                        className="lg:col-span-7"
                        variants={containerVariants}
                    >
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            variants={containerVariants}
                        >
                            <AnimatePresence>
                                {properties.slice(0, 4).map((property, index) => (
                                    <motion.div
                                        key={property.id}
                                        variants={cardVariants}
                                        className={cn(
                                            "group",
                                            index === 0 && "md:col-span-2" // Primeiro card ocupa duas colunas
                                        )}
                                    >
                                        <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                                            {/* Rental Badge */}
                                            <div className="absolute top-4 left-4 z-10 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                                Para Alugar
                                            </div>                                            <PropertyCardUnified
                                                {...property}
                                                className="border-0 shadow-none rounded-2xl"
                                            />

                                            {/* Hover Overlay */}                                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center p-6">
                                                <Link
                                                    href={`/imovel/${property.slug}`}
                                                    className="bg-white text-emerald-700 px-6 py-2 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center space-x-2"
                                                >
                                                    <span>Ver Detalhes</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Additional Properties Preview */}
                        {properties.length > 4 && (
                            <motion.div
                                className="mt-8 text-center"
                                variants={benefitVariants}
                            >
                                <div className="text-sm text-stone-600 mb-4">
                                    + {properties.length - 4} imóveis disponíveis para aluguel
                                </div>
                                <Link
                                    href="/imoveis?tipo=aluguel"
                                    className="inline-flex items-center space-x-2 text-emerald-700 hover:text-emerald-800 font-semibold group"
                                >
                                    <span>Ver todos os aluguéis</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default StrategicRentalsSection;
