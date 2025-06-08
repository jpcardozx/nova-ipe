'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useState, useRef } from 'react';
import {
    ArrowRight,
    Sparkles,
    TrendingUp,
    MapPin,
    Eye,
    Heart,
    Share2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import EnhancedPropertyCard from '../ui/property/EnhancedPropertyCard';
import { PropertySectionLayout } from './PropertySectionLayout';

interface PropertySectionProps {
    id: string;
    title: string;
    description: string;
    properties: any[];
    viewAllLink: string;
    viewAllText: string;
    badge?: string;
    propertyType?: 'sale' | 'rent';
    variant?: 'default' | 'featured' | 'masonry' | 'carousel' | 'highlight';
    className?: string;
}

export default function PropertySection({
    id,
    title,
    description,
    properties,
    viewAllLink,
    viewAllText,
    badge,
    propertyType = 'sale',
    variant = 'default',
    className
}: PropertySectionProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const constraintsRef = useRef(null);

    if (!properties?.length) return null;

    // Enhanced animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 60,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    };

    // Render different layouts based on variant
    const renderContent = () => {
        switch (variant) {
            case 'masonry':
                return renderMasonryLayout();
            case 'carousel':
                return renderCarouselLayout();
            case 'highlight':
                return renderHighlightLayout();
            case 'featured':
                return renderFeaturedLayout();
            default:
                return renderDefaultLayout();
        }
    };

    const renderDefaultLayout = () => (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
            {properties.slice(0, 6).map((property, index) => (
                <motion.div
                    key={property.id}
                    variants={cardVariants}
                    className="group relative"
                    onHoverStart={() => setHoveredCard(index)}
                    onHoverEnd={() => setHoveredCard(null)}
                >
                    {/* Decorative background glow on hover */}
                    <motion.div
                        className="absolute -inset-4 bg-gradient-to-r from-amber-100 to-amber-50 rounded-3xl opacity-0 blur-xl"
                        animate={{
                            opacity: hoveredCard === index ? 0.6 : 0,
                            scale: hoveredCard === index ? 1.02 : 1
                        }}
                        transition={{ duration: 0.3 }}
                    />

                    <Link href={`/imovel/${property.slug}`} className="block relative z-10">
                        <EnhancedPropertyCard
                            property={{ ...property, propertyType }}
                            index={index}
                            variant={variant}
                        />
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );

    const renderFeaturedLayout = () => (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
            {/* Hero Property */}
            <motion.div
                variants={cardVariants}
                className="lg:col-span-7 group relative"
            >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 aspect-[16/10]">
                    <img
                        src={properties[0]?.mainImage?.url}
                        alt={properties[0]?.mainImage?.alt}
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:opacity-90 transition-opacity duration-500"
                    />

                    {/* Floating Badge */}
                    <div className="absolute top-6 left-6">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30"
                        >
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span className="text-white text-sm font-medium">Destaque</span>
                        </motion.div>
                    </div>

                    {/* Property Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <h3 className="text-2xl font-bold text-white mb-2">{properties[0]?.title}</h3>
                            <div className="flex items-center gap-2 text-white/80 mb-4">
                                <MapPin className="w-4 h-4" />
                                <span>{properties[0]?.location}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold text-amber-300">
                                    R$ {properties[0]?.price?.toLocaleString('pt-BR')}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-full font-medium hover:bg-amber-50 transition-colors"
                                >
                                    Ver Detalhes
                                    <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Secondary Properties */}
            <motion.div
                variants={cardVariants}
                className="lg:col-span-5 space-y-6"
            >
                {properties.slice(1, 4).map((property, index) => (
                    <motion.div
                        key={property.id}
                        variants={cardVariants}
                        className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-amber-300 transition-all duration-300 hover:shadow-xl"
                    >
                        <Link href={`/imovel/${property.slug}`} className="flex gap-4 p-4">
                            <div className="relative w-24 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                <img
                                    src={property?.mainImage?.url}
                                    alt={property?.mainImage?.alt}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-900 truncate group-hover:text-amber-700 transition-colors">
                                    {property.title}
                                </h4>
                                <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                                    <MapPin className="w-3 h-3" />
                                    {property.location}
                                </p>
                                <div className="text-lg font-bold text-amber-700 mt-2">
                                    R$ {property.price?.toLocaleString('pt-BR')}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );

    const renderMasonryLayout = () => (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
        >
            {properties.slice(0, 9).map((property, index) => {
                const isLarge = index % 4 === 0;
                return (
                    <motion.div
                        key={property.id}
                        variants={cardVariants}
                        className={`break-inside-avoid ${isLarge ? 'mb-8' : 'mb-6'}`}
                        style={{
                            height: isLarge ? 'auto' : `${280 + (index % 3) * 40}px`
                        }}
                    >
                        <Link href={`/imovel/${property.slug}`} className="block group">
                            <div className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2">
                                <div className={`relative ${isLarge ? 'aspect-[4/5]' : 'aspect-[4/3]'} overflow-hidden`}>
                                    <img
                                        src={property?.mainImage?.url}
                                        alt={property?.mainImage?.alt}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Quick actions */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileHover={{ opacity: 1, y: 0 }}
                                        className="absolute top-4 right-4 flex gap-2"
                                    >
                                        <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
                                            <Heart className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                </div>

                                <div className="p-6">
                                    <h3 className="font-semibold text-slate-900 text-lg mb-2 group-hover:text-amber-700 transition-colors">
                                        {property.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm flex items-center gap-1 mb-3">
                                        <MapPin className="w-3 h-3" />
                                        {property.location}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="text-xl font-bold text-amber-700">
                                            R$ {property.price?.toLocaleString('pt-BR')}
                                        </div>
                                        {isLarge && (
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                className="flex items-center gap-1 text-sm text-amber-600 font-medium"
                                            >
                                                Ver mais
                                                <ArrowRight className="w-4 h-4" />
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                );
            })}
        </motion.div>
    );

    const renderCarouselLayout = () => (
        <div className="relative">
            <motion.div
                ref={constraintsRef}
                className="overflow-hidden rounded-3xl"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <motion.div
                    drag="x"
                    dragConstraints={constraintsRef}
                    className="flex gap-8 cursor-grab active:cursor-grabbing"
                    style={{ x: `${-currentSlide * 100}%` }}
                >
                    {properties.map((property, index) => (
                        <motion.div
                            key={property.id}
                            className="min-w-full md:min-w-[50%] lg:min-w-[33.333%] px-4"
                            whileHover={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <Link href={`/imovel/${property.slug}`}>
                                <div className="relative group">
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                                        <img
                                            src={property?.mainImage?.url}
                                            alt={property?.mainImage?.alt}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    <div className="absolute bottom-4 left-4 right-4">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-white/50"
                                        >
                                            <h3 className="font-semibold text-slate-900 mb-1">{property.title}</h3>
                                            <p className="text-sm text-slate-600 mb-2">{property.location}</p>
                                            <div className="text-lg font-bold text-amber-700">
                                                R$ {property.price?.toLocaleString('pt-BR')}
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Carousel Controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
                <button
                    onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                    disabled={currentSlide === 0}
                    className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                    {Array.from({ length: Math.ceil(properties.length / 3) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? 'bg-amber-600' : 'bg-slate-300'
                                }`}
                        />
                    ))}
                </div>

                <button
                    onClick={() => setCurrentSlide(Math.min(Math.ceil(properties.length / 3) - 1, currentSlide + 1))}
                    disabled={currentSlide >= Math.ceil(properties.length / 3) - 1}
                    className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    const renderHighlightLayout = () => (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(251 191 36) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main highlight */}
                <motion.div
                    variants={cardVariants}
                    className="lg:col-span-2"
                >
                    <Link href={`/imovel/${properties[0]?.slug}`}>
                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 p-8 aspect-[16/9]">
                            <div className="absolute inset-0">
                                <img
                                    src={properties[0]?.mainImage?.url}
                                    alt={properties[0]?.mainImage?.alt}
                                    className="w-full h-full object-cover mix-blend-overlay opacity-30 group-hover:opacity-40 transition-opacity duration-500"
                                />
                            </div>

                            <div className="relative h-full flex flex-col justify-between">
                                <div className="flex items-start justify-between">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex items-center gap-3 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full"
                                    >
                                        <TrendingUp className="w-5 h-5 text-white" />
                                        <span className="text-white font-medium">Oportunidade Especial</span>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5, type: "spring" }}
                                        className="flex gap-2"
                                    >
                                        <button className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
                                            <Heart className="w-5 h-5" />
                                        </button>
                                    </motion.div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <h3 className="text-3xl font-bold text-white mb-3">{properties[0]?.title}</h3>
                                    <p className="text-white/90 mb-6 text-lg">{properties[0]?.location}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="text-4xl font-bold text-white">
                                            R$ {properties[0]?.price?.toLocaleString('pt-BR')}
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05, x: 5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-3 px-8 py-4 bg-white text-amber-700 rounded-full font-bold text-lg hover:bg-amber-50 transition-colors shadow-lg"
                                        >
                                            Explorar
                                            <ArrowRight className="w-6 h-6" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Secondary properties */}
                <motion.div
                    variants={cardVariants}
                    className="space-y-6"
                >
                    {properties.slice(1, 4).map((property, index) => (
                        <motion.div
                            key={property.id}
                            variants={cardVariants}
                            whileHover={{ x: 8, scale: 1.02 }}
                            className="group"
                        >
                            <Link href={`/imovel/${property.slug}`}>
                                <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300">
                                    <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                        <img
                                            src={property?.mainImage?.url}
                                            alt={property?.mainImage?.alt}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-slate-900 text-sm truncate group-hover:text-amber-700 transition-colors">
                                            {property.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1">{property.location}</p>
                                        <div className="text-sm font-bold text-amber-700 mt-2">
                                            R$ {property.price?.toLocaleString('pt-BR')}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );

    return (
        <PropertySectionLayout
            id={id}
            title={title}
            description={description}
            className={className}
            badge={badge}
        >
            {renderContent()}

            {/* Enhanced Call-to-Action */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="mt-16 text-center"
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block"
                >
                    <Link
                        href={viewAllLink}
                        className="group relative inline-flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        {/* Animated background */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-800"
                            initial={{ x: '100%' }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                        />

                        <span className="relative z-10">{viewAllText}</span>
                        <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="relative z-10"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </motion.div>

                        {/* Sparkle effect */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            initial={{ scale: 0, rotate: 0 }}
                            whileHover={{ scale: 1, rotate: 180 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Sparkles className="w-6 h-6 text-amber-200 opacity-60" />
                        </motion.div>
                    </Link>
                </motion.div>
            </motion.div>
        </PropertySectionLayout>
    );
}
