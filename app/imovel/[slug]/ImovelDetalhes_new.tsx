"use client";

import React, { FC, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
    Phone, 
    Calendar, 
    UserCheck, 
    Share2, 
    MapPin, 
    Bed, 
    Bath, 
    Car, 
    Ruler, 
    Heart, 
    ChevronLeft, 
    ChevronRight, 
    Expand, 
    X, 
    Mail, 
    ArrowLeft,
    Star,
    Clock,
    Check,
    Camera,
    Play,
    Copy,
    Facebook,
    Twitter,
    Instagram,
    MessageCircle,
    Home,
    Building2,
    TreePine,
    Store
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { formatarMoeda } from '@/lib/utils';
import type { ImovelClient as ImovelDataType } from '../../../src/types/imovel-client';

interface ImovelDetalhesProps {
    imovel: ImovelDataType;
    relacionados?: ImovelDataType[];
    preco?: number;
}

// Enhanced Property Detail Component
const ImovelDetalhes: FC<ImovelDetalhesProps> = ({ imovel, relacionados = [], preco }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const heroRef = useRef<HTMLDivElement>(null);
    const isHeroInView = useInView(heroRef, { once: true });

    // Verify property data
    if (!imovel || !imovel._id) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Home className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Imóvel não encontrado</h2>
                    <p className="text-gray-600 mb-6">O imóvel que você está procurando não existe ou foi removido.</p>
                    <Link
                        href="/catalogo"
                        className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao catálogo
                    </Link>
                </div>
            </div>
        );
    }

    // Prepare gallery images
    const images = [
        imovel.imagem?.imagemUrl && { url: imovel.imagem.imagemUrl, alt: imovel.imagem.alt || imovel.titulo },
        ...(imovel.galeria || []).map(img => ({
            url: img.imagemUrl,
            alt: img.alt || imovel.titulo
        }))
    ].filter(Boolean) as { url: string; alt: string }[];

    // Property features
    const features = [
        { icon: Bed, label: 'Quartos', value: imovel.dormitorios },
        { icon: Bath, label: 'Banheiros', value: imovel.banheiros },
        { icon: Car, label: 'Vagas', value: imovel.vagas },
        { icon: Ruler, label: 'Área', value: imovel.areaUtil ? `${imovel.areaUtil}m²` : null }
    ].filter(feature => feature.value);

    // Property type icon mapping
    const getPropertyTypeIcon = (tipo: string) => {
        const lowerTipo = tipo?.toLowerCase() || '';
        if (lowerTipo.includes('casa')) return Home;
        if (lowerTipo.includes('apartamento')) return Building2;
        if (lowerTipo.includes('terreno') || lowerTipo.includes('chácara')) return TreePine;
        if (lowerTipo.includes('comercial')) return Store;
        return Home;
    };

    const PropertyTypeIcon = getPropertyTypeIcon(imovel.tipoImovel || '');

    // Scroll handler
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Sticky Navigation Bar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled 
                        ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200' 
                        : 'bg-transparent'
                }`}
            >
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/catalogo"
                            className="flex items-center gap-2 text-gray-700 hover:text-amber-600 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Voltar ao catálogo</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`p-2 rounded-full transition-all duration-200 ${
                                    isFavorite 
                                        ? 'bg-red-100 text-red-600' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                            </button>

                            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section with Image Gallery */}
            <motion.section
                ref={heroRef}
                initial="hidden"
                animate={isHeroInView ? "visible" : "hidden"}
                variants={staggerContainer}
                className="relative pt-20"
            >
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Image Gallery */}
                        <motion.div variants={fadeInUp} className="space-y-4">
                            {/* Main Image */}
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 group">
                                {images.length > 0 ? (
                                    <Image
                                        src={images[currentImageIndex]?.url || '/images/og-image-2025.jpg'}
                                        alt={images[currentImageIndex]?.alt || imovel.titulo || 'Imóvel'}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        priority
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Camera className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}

                                {/* Image Controls */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg transition-all"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg transition-all"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}

                                {/* Expand Gallery Button */}
                                <button
                                    onClick={() => setIsGalleryOpen(true)}
                                    className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg transition-all flex items-center gap-2"
                                >
                                    <Camera className="w-4 h-4" />
                                    <span className="text-sm font-medium">{images.length} fotos</span>
                                </button>

                                {/* Property Type Badge */}
                                <div className="absolute top-4 left-4">
                                    <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
                                        <PropertyTypeIcon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{imovel.tipoImovel}</span>
                                    </div>
                                </div>

                                {/* Featured Badge */}
                                {imovel.destaque && (
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-amber-500 text-white px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="text-sm font-medium">Destaque</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Gallery */}
                            {images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {images.slice(0, 6).map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 relative w-20 h-16 rounded-lg overflow-hidden transition-all ${
                                                index === currentImageIndex 
                                                    ? 'ring-2 ring-amber-500 ring-offset-2' 
                                                    : 'opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <Image
                                                src={image.url}
                                                alt={image.alt}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                    {images.length > 6 && (
                                        <button
                                            onClick={() => setIsGalleryOpen(true)}
                                            className="flex-shrink-0 w-20 h-16 bg-gray-900/80 rounded-lg flex items-center justify-center text-white text-xs font-medium"
                                        >
                                            +{images.length - 6}
                                        </button>
                                    )}
                                </div>
                            )}
                        </motion.div>

                        {/* Property Information */}
                        <motion.div variants={fadeInUp} className="space-y-6">
                            {/* Header */}
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{imovel.titulo}</h1>
                                <div className="flex items-center gap-2 text-gray-600 mb-4">
                                    <MapPin className="w-5 h-5" />
                                    <span>{imovel.endereco || `${imovel.bairro}, ${imovel.cidade}`}</span>
                                </div>
                                
                                <div className="flex items-end gap-4">
                                    <div className="text-4xl font-bold text-amber-600">
                                        {formatarMoeda(preco ?? imovel.preco ?? 0)}
                                    </div>
                                    {imovel.finalidade === 'Aluguel' && (
                                        <span className="text-lg text-gray-500 mb-1">/mês</span>
                                    )}
                                </div>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        variants={scaleIn}
                                        className="bg-white rounded-xl border border-gray-200 p-4 text-center group hover:shadow-lg transition-all duration-200"
                                    >
                                        <feature.icon className="w-6 h-6 text-amber-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                        <div className="text-2xl font-bold text-gray-900">{feature.value}</div>
                                        <div className="text-sm text-gray-600">{feature.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Contact Section */}
                            <motion.div variants={fadeInUp} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interessado neste imóvel?</h3>
                                <div className="space-y-3">
                                    <a
                                        href={`https://wa.me/5521990051961?text=Olá! Tenho interesse no imóvel: ${imovel.titulo}`}
                                        className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        WhatsApp
                                    </a>
                                    <button className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-6 py-3 rounded-xl transition-colors font-medium w-full">
                                        <Phone className="w-5 h-5" />
                                        Ligar agora
                                    </button>
                                    <button className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-6 py-3 rounded-xl transition-colors font-medium w-full">
                                        <Mail className="w-5 h-5" />
                                        Enviar e-mail
                                    </button>
                                </div>
                            </motion.div>

                            {/* Property Info */}
                            <motion.div variants={fadeInUp} className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">Publicado em</span>
                                        <span className="font-medium">
                                            {imovel.dataPublicacao ? new Date(imovel.dataPublicacao).toLocaleDateString('pt-BR') : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <UserCheck className="w-4 h-4 text-green-500" />
                                        <span className="text-gray-600">Verificado</span>
                                    </div>
                                    {imovel.aceitaFinanciamento && (
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-green-500" />
                                            <span className="text-gray-600">Aceita financiamento</span>
                                        </div>
                                    )}
                                    {imovel.documentacaoOk && (
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-green-500" />
                                            <span className="text-gray-600">Documentação em ordem</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Description Section */}
            {imovel.descricao && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="py-16"
                >
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Descrição</h2>
                            <div className="bg-white rounded-2xl border border-gray-200 p-8">
                                <div className={`text-gray-700 leading-relaxed ${!showFullDescription && imovel.descricao.length > 300 ? 'line-clamp-4' : ''}`}>
                                    {imovel.descricao}
                                </div>
                                {imovel.descricao.length > 300 && (
                                    <button
                                        onClick={() => setShowFullDescription(!showFullDescription)}
                                        className="mt-4 text-amber-600 hover:text-amber-700 font-medium transition-colors"
                                    >
                                        {showFullDescription ? 'Ver menos' : 'Ver mais'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.section>
            )}

            {/* Features & Amenities */}
            {imovel.caracteristicas && imovel.caracteristicas.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="py-16 bg-gray-50"
                >
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Características</h2>
                            <div className="bg-white rounded-2xl border border-gray-200 p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {imovel.caracteristicas.map((caracteristica, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span className="text-gray-700">{caracteristica}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>
            )}

            {/* Related Properties */}
            {relacionados.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="py-16"
                >
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Imóveis similares</h2>
                                <Link
                                    href="/catalogo"
                                    className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                                >
                                    Ver todos
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relacionados.slice(0, 3).map((related) => (
                                    <Link key={related._id} href={`/imovel/${related.slug}`}>
                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="relative aspect-[4/3]">
                                                {related.imagem?.imagemUrl ? (
                                                    <Image
                                                        src={related.imagem.imagemUrl}
                                                        alt={related.titulo || 'Imóvel relacionado'}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full bg-gray-200">
                                                        <Home className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6">
                                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{related.titulo}</h3>
                                                <p className="text-gray-600 text-sm mb-4">{related.bairro}, {related.cidade}</p>
                                                <div className="text-xl font-bold text-amber-600">
                                                    {formatarMoeda(related.preco || 0)}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>
            )}

            {/* Gallery Modal */}
            <AnimatePresence>
                {isGalleryOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsGalleryOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative max-w-4xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsGalleryOpen(false)}
                                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>
                            
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                                {images[currentImageIndex] && (
                                    <Image
                                        src={images[currentImageIndex].url}
                                        alt={images[currentImageIndex].alt}
                                        fill
                                        className="object-contain"
                                    />
                                )}
                            </div>

                            {images.length > 1 && (
                                <div className="flex justify-center mt-4 gap-2">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-3 h-3 rounded-full transition-all ${
                                                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImovelDetalhes;
export { ImovelDetalhes };
