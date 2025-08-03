'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useTransform, useScroll, useMotionValueEvent } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Eye,
    Heart,
    Share,
    MapPin,
    Tag,
    Twitter,
    Facebook,
    Mail,
    Copy,
    Maximize2,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/button';
import { PropertyType } from './types';

export interface PropertyHeroProps {
    title: string;
    location: string;
    city?: string;
    state?: string;
    price: number;
    propertyType: PropertyType;
    images: Array<{
        url: string;
        alt: string;
        blurDataUrl?: string;
    }>;
    referenceCode?: string;
    status?: 'available' | 'sold' | 'rented' | 'pending';
    className?: string;
    onAddToFavorites?: () => void;
    onShare?: () => void;
    onScheduleVisit?: () => void;
    isFavorite?: boolean;
}

export function PropertyHero({
    title,
    location,
    city,
    state,
    price,
    propertyType,
    images,
    referenceCode,
    status = 'available',
    className,
    onAddToFavorites,
    onShare,
    onScheduleVisit,
    isFavorite = false,
}: PropertyHeroProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [favorite, setFavorite] = useState(isFavorite);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [galleryImageIndex, setGalleryImageIndex] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(Array(images.length).fill(false));
    const [copied, setCopied] = useState(false);    // Scroll parallax effect
    const { scrollY } = useScroll({ layoutEffect: false });
    const heroOffset = useTransform(scrollY, [0, 300], [0, 100]);

    // Marcar imagem como carregada
    const handleImageLoaded = (index: number) => {
        const newLoadedImages = [...imagesLoaded];
        newLoadedImages[index] = true;
        setImagesLoaded(newLoadedImages);
    };

    const formatPrice = (value: number) => {
        return propertyType === 'rent'
            ? `R$ ${value.toLocaleString('pt-BR')}/mês`
            : `R$ ${value.toLocaleString('pt-BR')}`;
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const handleFavoriteClick = () => {
        setFavorite(!favorite);
        if (onAddToFavorites) {
            onAddToFavorites();
        }
    }; const handleShareClick = () => {
        // SSR-safe navigator check
        if (typeof window !== 'undefined' && 'share' in navigator) {
            (navigator as any).share({
                title: title,
                text: `Confira este imóvel: ${title}`,
                url: window.location.href,
            }).catch(() => setShowShareMenu(!showShareMenu));
        } else {
            setShowShareMenu(!showShareMenu);
        }

        if (onShare) {
            onShare();
        }
    }; const copyLinkToClipboard = () => {
        // SSR-safe navigator and clipboard check
        if (typeof window !== 'undefined' && 'clipboard' in navigator) {
            (navigator as any).clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            setShowShareMenu(false);
        }
    }; const shareViaEmail = () => {
        if (typeof window !== 'undefined') {
            window.location.href = `mailto:?subject=Confira este imóvel: ${title}&body=Achei este imóvel que pode te interessar: ${window.location.href}`;
            setShowShareMenu(false);
        }
    };

    const shareOnFacebook = () => {
        if (typeof window !== 'undefined') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`);
            setShowShareMenu(false);
        }
    };

    const shareOnTwitter = () => {
        if (typeof window !== 'undefined') {
            window.open(`https://twitter.com/intent/tweet?text=Confira este imóvel: ${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`);
            setShowShareMenu(false);
        }
    }; const openFullGallery = (index: number = currentImageIndex) => {
        setGalleryImageIndex(index);
        setShowGalleryModal(true);
        if (typeof window !== 'undefined') {
            document.body.style.overflow = 'hidden'; // Prevenir rolagem do background
        }
    };

    const closeGallery = () => {
        setShowGalleryModal(false);
        if (typeof window !== 'undefined') {
            document.body.style.overflow = ''; // Restaurar rolagem do background
        }
    };    // Fechar galeria ao pressionar Esc
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeGallery();
            } else if (event.key === 'ArrowRight' && showGalleryModal) {
                setGalleryImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
            } else if (event.key === 'ArrowLeft' && showGalleryModal) {
                setGalleryImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showGalleryModal, images.length]);

    return (
        <div className={cn('w-full bg-white', className)}>
            <div className="container px-4 py-6 mx-auto md:py-10">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Galeria de imagens */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        <div
                            className="relative rounded-xl overflow-hidden shadow-xl"
                            style={{ height: "min(70vh, 600px)" }}
                        >
                            {/* Parallax effect na imagem */}
                            <motion.div
                                className="absolute inset-0 h-[110%]"
                                style={{ y: heroOffset }}
                            >
                                <AnimatePresence initial={false} mode="wait">
                                    <motion.div
                                        key={currentImageIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
                                        className="absolute inset-0"
                                    >
                                        {/* Blur placeholder */}
                                        {images[currentImageIndex].blurDataUrl && !imagesLoaded[currentImageIndex] && (
                                            <div
                                                className="absolute inset-0 bg-cover bg-center blur-lg scale-105"
                                                style={{ backgroundImage: `url(${images[currentImageIndex].blurDataUrl})` }}
                                            />
                                        )}

                                        <Image
                                            src={images[currentImageIndex].url}
                                            alt={images[currentImageIndex].alt}
                                            fill
                                            className={cn(
                                                "object-cover transition-opacity duration-500",
                                                imagesLoaded[currentImageIndex] ? "opacity-100" : "opacity-0"
                                            )}
                                            onLoad={() => handleImageLoaded(currentImageIndex)}
                                            sizes="(max-width: 1024px) 100vw, 60vw"
                                            priority={currentImageIndex === 0}
                                        />

                                        {/* Overlay de gradiente para melhor contraste dos controles */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>

                            {/* Status Tag */}
                            <div className="absolute top-4 left-4 z-10">
                                <span className={cn(
                                    "px-4 py-2 text-sm font-medium text-white rounded-full shadow-md backdrop-blur-sm",
                                    status === 'available' && propertyType === 'sale' && "bg-primary-500",
                                    status === 'available' && propertyType === 'rent' && "bg-accent-blue-500",
                                    status === 'sold' && "bg-neutral-700",
                                    status === 'rented' && "bg-accent-emerald-500",
                                    status === 'pending' && "bg-accent-red-500"
                                )}>
                                    {status === 'available' && propertyType === 'sale' && "À venda"}
                                    {status === 'available' && propertyType === 'rent' && "Para alugar"}
                                    {status === 'sold' && "Vendido"}
                                    {status === 'rented' && "Alugado"}
                                    {status === 'pending' && "Reservado"}
                                </span>
                            </div>

                            {/* Controles da galeria */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all z-10 border border-white/30"
                                        aria-label="Imagem anterior"
                                    >
                                        <ChevronLeft className="h-5 w-5 text-neutral-800" />
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all z-10 border border-white/30"
                                        aria-label="Próxima imagem"
                                    >
                                        <ChevronRight className="h-5 w-5 text-neutral-800" />
                                    </button>
                                </>
                            )}

                            {/* Botão de zoom/galeria completa */}
                            <button
                                onClick={() => openFullGallery()}
                                className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all z-10 border border-white/30"
                                aria-label="Visualizar galeria completa"
                            >
                                <Maximize2 className="h-5 w-5 text-neutral-800" />
                            </button>

                            {/* Contador de imagens */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm z-10 flex items-center gap-3 border border-white/10">
                                <span className="font-medium">{currentImageIndex + 1} de {images.length}</span>
                            </div>
                        </div>

                        {/* Miniaturas */}
                        {images.length > 1 && (
                            <div className="flex mt-4 gap-3 overflow-x-auto pb-2 max-w-full no-scrollbar snap-x">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={cn(
                                            "relative h-20 w-28 rounded-md overflow-hidden flex-shrink-0 cursor-pointer transition-all snap-start",
                                            "hover:opacity-100 border",
                                            currentImageIndex === index
                                                ? "ring-2 ring-primary-500 border-primary-500 opacity-100"
                                                : "opacity-70 hover:opacity-90 border-neutral-200"
                                        )}
                                    >
                                        <Image
                                            src={image.url}
                                            alt={`Miniatura ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 25vw, 112px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Informações do imóvel */}
                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
                        {/* Cabeçalho */}
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-neutral-100">
                            <h1 className="text-3xl font-bold text-neutral-900 mb-3 md:text-4xl leading-tight">
                                {title}
                            </h1>

                            <div className="flex items-center text-neutral-600 mb-4">
                                <MapPin size={18} className="mr-2 flex-shrink-0 text-primary-500" />
                                <span className="text-lg">{location}{city && `, ${city}`}{state && ` - ${state}`}</span>
                            </div>

                            <div className="flex items-center mb-4">
                                {referenceCode && (
                                    <div className="flex items-center text-sm text-neutral-500 mr-4 bg-neutral-50 px-3 py-1 rounded-full">
                                        <Tag size={14} className="mr-1 text-neutral-400" />
                                        <span>Ref: {referenceCode}</span>
                                    </div>
                                )}
                            </div>

                            {/* Status badge */}
                            {status !== 'available' && (
                                <div className="mb-4">
                                    <span className={cn(
                                        "inline-block px-4 py-1.5 text-white rounded-md text-sm font-medium",
                                        status === 'sold' && "bg-neutral-700",
                                        status === 'rented' && "bg-accent-emerald-600",
                                        status === 'pending' && "bg-accent-red-500"
                                    )}>
                                        {status === 'sold' && "Este imóvel já foi vendido"}
                                        {status === 'rented' && "Este imóvel já está alugado"}
                                        {status === 'pending' && "Este imóvel está reservado"}
                                    </span>
                                </div>
                            )}

                            {/* Preço */}
                            <div className="bg-gradient-to-r from-primary-500/10 to-primary-600/5 p-5 rounded-lg mb-6">
                                <span className="text-sm text-neutral-600 block mb-1">
                                    {propertyType === 'rent' ? 'Valor do aluguel' : 'Valor do imóvel'}
                                </span>
                                <div className="text-3xl font-bold text-primary-600">
                                    {formatPrice(price)}
                                </div>
                                {propertyType === 'rent' && (
                                    <div className="text-sm text-neutral-500 mt-2">
                                        *Não inclui IPTU e condomínio
                                    </div>
                                )}
                            </div>

                            {/* Ações */}                            <div className="flex flex-wrap gap-3">                                <Button
                                variant="default"
                                size="lg"
                                className="flex-1 md:flex-none"
                                onClick={onScheduleVisit}
                                disabled={status !== 'available'}
                            >
                                <Eye size={18} />
                                Agendar visita
                            </Button>                                <Button
                                variant={favorite ? "default" : "outline"}
                                size="lg"
                                onClick={handleFavoriteClick}
                            >
                                    <Heart
                                        size={18}
                                        className={favorite ? "fill-white" : ""}
                                    />
                                    {favorite ? "Salvo" : "Salvar"}
                                </Button>                                <div className="relative">
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        onClick={handleShareClick}
                                    >
                                        <Share size={18} />
                                        Compartilhar
                                    </Button>

                                    {/* Menu de compartilhamento */}
                                    <AnimatePresence>
                                        {showShareMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute top-full right-0 mt-2 p-2 bg-white rounded-lg shadow-lg border border-neutral-200 z-50 min-w-[220px]"
                                            >
                                                <div className="space-y-1">
                                                    <button
                                                        onClick={copyLinkToClipboard}
                                                        className="flex items-center w-full px-3 py-2 hover:bg-neutral-50 rounded-md text-left transition-colors"
                                                    >
                                                        <Copy size={16} className="mr-2 text-neutral-500" />
                                                        <span>{copied ? "Link copiado!" : "Copiar link"}</span>
                                                    </button>
                                                    <button
                                                        onClick={shareViaEmail}
                                                        className="flex items-center w-full px-3 py-2 hover:bg-neutral-50 rounded-md text-left transition-colors"
                                                    >
                                                        <Mail size={16} className="mr-2 text-neutral-500" />
                                                        <span>Email</span>
                                                    </button>
                                                    <button
                                                        onClick={shareOnFacebook}
                                                        className="flex items-center w-full px-3 py-2 hover:bg-neutral-50 rounded-md text-left transition-colors"
                                                    >
                                                        <Facebook size={16} className="mr-2 text-neutral-500" />
                                                        <span>Facebook</span>
                                                    </button>
                                                    <button
                                                        onClick={shareOnTwitter}
                                                        className="flex items-center w-full px-3 py-2 hover:bg-neutral-50 rounded-md text-left transition-colors"
                                                    >
                                                        <Twitter size={16} className="mr-2 text-neutral-500" />
                                                        <span>Twitter</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>                        {/* CTA de contato */}
                        <div className="mt-6">
                            <div className="p-6 bg-white rounded-xl border border-primary-100 shadow-sm">
                                <h3 className="font-semibold text-lg mb-3">Interessado neste imóvel?</h3>
                                <p className="text-neutral-700 mb-5">
                                    Converse com nossos especialistas para tirar dúvidas, agendar visita e conhecer todas as condições.                                </p>                                <Button
                                        variant={status === 'available' ? "default" : "secondary"}
                                        size="lg"
                                        className="w-full"
                                        disabled={status !== 'available'}
                                    >
                                    {status === 'available' ? 'Falar com nosso corretor' : 'Receber imóveis similares'}
                                </Button>
                                <div className="text-sm text-center mt-4 text-neutral-500">
                                    Atendimento personalizado em até 2 horas
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de galeria de imagens */}
            <AnimatePresence>
                {showGalleryModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
                    >
                        <button
                            onClick={closeGallery}
                            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                            aria-label="Fechar galeria"
                        >
                            <X size={24} />
                        </button>

                        <div className="relative w-full h-full max-w-6xl max-h-screen mx-auto flex flex-col">
                            {/* Imagem principal */}
                            <div className="relative flex-grow flex items-center justify-center overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={galleryImageIndex}
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative w-full h-full flex items-center justify-center p-8"
                                    >
                                        <div className="relative w-full max-w-5xl max-h-[80vh]">
                                            <Image
                                                src={images[galleryImageIndex].url}
                                                alt={images[galleryImageIndex].alt}
                                                className="object-contain mx-auto max-h-[80vh] w-auto h-auto"
                                                width={1200}
                                                height={800}
                                                priority={true}
                                            />
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Controles da galeria */}
                                <button
                                    onClick={() => setGalleryImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                                    aria-label="Imagem anterior"
                                >
                                    <ChevronLeft className="h-6 w-6 text-white" />
                                </button>
                                <button
                                    onClick={() => setGalleryImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                                    aria-label="Próxima imagem"
                                >
                                    <ChevronRight className="h-6 w-6 text-white" />
                                </button>

                                {/* Contador/status */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white">
                                    {galleryImageIndex + 1} de {images.length}
                                </div>
                            </div>

                            {/* Miniaturas */}
                            <div className="h-20 bg-black/50 backdrop-blur-sm">
                                <div className="container h-full overflow-x-auto flex items-center gap-2 px-4">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setGalleryImageIndex(index)}
                                            className={cn(
                                                "relative h-14 w-20 rounded overflow-hidden transition-all",
                                                galleryImageIndex === index
                                                    ? "ring-2 ring-primary-500 opacity-100"
                                                    : "opacity-60 hover:opacity-100"
                                            )}
                                        >
                                            <Image
                                                src={image.url}
                                                alt={`Miniatura ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default PropertyHero;
