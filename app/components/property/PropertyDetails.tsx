"use client"

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, Heart, Share2, MapPin, Bed, Bath, Ruler, Car,
    Calendar, Eye, Star, Sparkles, ChevronLeft, ChevronRight,
    Phone, MessageCircle, Mail, ExternalLink, Maximize2,
    Wifi, Droplets, Trees, Zap, Shield, Home, X, Play,
    Map, Camera, Video
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ImovelClient } from '@/src/types/imovel-client'

interface PropertyDetailsProps {
    property: ImovelClient
    relatedProperties?: ImovelClient[]
}

export default function PropertyDetails({ property, relatedProperties = [] }: PropertyDetailsProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showGallery, setShowGallery] = useState(false)
    const [isMapExpanded, setIsMapExpanded] = useState(false)
    const [isFavorited, setIsFavorited] = useState(false)
    const [activeTab, setActiveTab] = useState('details')
    const galleryRef = useRef<HTMLDivElement>(null)

    const allImages = [
        property.imagem?.imagemUrl,
        ...(property.galeria?.map(img => img.imagemUrl) || [])
    ].filter(Boolean)

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price)
    }

    const features = [
        { icon: Bed, label: 'Quartos', value: property.dormitorios },
        { icon: Bath, label: 'Banheiros', value: property.banheiros },
        { icon: Ruler, label: 'Área', value: property.areaUtil ? `${property.areaUtil}m²` : null },
        { icon: Car, label: 'Vagas', value: property.vagas },
    ].filter(feature => feature.value)

    const amenityIcons: Record<string, React.ComponentType<any>> = {
        'Piscina': Droplets,
        'Internet': Wifi,
        'Jardim': Trees,
        'Energia': Zap,
        'Segurança': Shield,
    }

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: property.titulo,
                    text: `Confira este imóvel: ${property.titulo}`,
                    url: window.location.href,
                })
            } catch (error) {
                console.log('Erro ao compartilhar:', error)
            }
        } else {
            // Fallback para copiar URL
            navigator.clipboard.writeText(window.location.href)
            // Mostrar toast de sucesso aqui
        }
    }

    const handleContact = (type: 'whatsapp' | 'phone' | 'email') => {
        switch (type) {
            case 'whatsapp':
                window.open(`https://wa.me/5511999999999?text=Olá! Tenho interesse no imóvel: ${property.titulo}`, '_blank')
                break
            case 'phone':
                window.location.href = 'tel:+5521990051961'
                break
            case 'email':
                window.location.href = `mailto:contato@novaiipe.com?subject=Interesse no imóvel: ${property.titulo}`
                break
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/catalogo"
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Voltar ao catálogo</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsFavorited(!isFavorited)}
                                className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    isFavorited ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
                            </button>

                            <button
                                onClick={handleShare}
                                className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <div className="relative">
                            <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden bg-gray-200">
                                {allImages.length > 0 && (
                                    <>
                                        <Image
                                            src={allImages[currentImageIndex] || '/images/placeholder-property.jpg'}
                                            alt={property.titulo || 'Imóvel'}
                                            fill
                                            className="object-cover"
                                            priority
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                                        />

                                        {/* Navigation buttons */}
                                        {allImages.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}

                                        {/* Image counter */}
                                        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                            {currentImageIndex + 1} / {allImages.length}
                                        </div>

                                        {/* Gallery button */}
                                        <button
                                            onClick={() => setShowGallery(true)}
                                            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                        >
                                            <Camera className="w-4 h-4" />
                                            Ver todas ({allImages.length})
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail strip */}
                            {allImages.length > 1 && (
                                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                    {allImages.slice(0, 8).map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={cn(
                                                "relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all",
                                                index === currentImageIndex ? "border-amber-500" : "border-transparent hover:border-gray-300"
                                            )}
                                        >
                                            <Image
                                                src={image || '/images/placeholder-property.jpg'}
                                                alt={`Imagem ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </button>
                                    ))}
                                    {allImages.length > 8 && (
                                        <button
                                            onClick={() => setShowGallery(true)}
                                            className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors flex-shrink-0"
                                        >
                                            <span className="text-xs font-medium">+{allImages.length - 8}</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Property Info */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {property.titulo}
                                    </h1>
                                    <div className="flex items-center text-gray-600 mb-4">
                                        <MapPin className="w-5 h-5 mr-2" />
                                        <span>{property.endereco || `${property.bairro}, ${property.cidade}`}</span>
                                    </div>
                                    <div className="text-3xl font-bold text-amber-600">
                                        {formatPrice(property.preco || 0)}
                                    </div>
                                </div>

                                {property.destaque && (
                                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                        <Star className="w-4 h-4" />
                                        Destaque
                                    </span>
                                )}
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {features.map((feature, index) => (
                                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                                        <feature.icon className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                                        <div className="font-semibold text-gray-900">{feature.value}</div>
                                        <div className="text-sm text-gray-600">{feature.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Tabs */}
                            <div className="border-b border-gray-200 mb-6">
                                <nav className="flex space-x-8">
                                    {[
                                        { id: 'details', label: 'Detalhes' },
                                        { id: 'amenities', label: 'Comodidades' },
                                        { id: 'location', label: 'Localização' },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                                                activeTab === tab.id
                                                    ? "border-amber-500 text-amber-600"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                            )}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div>
                                {activeTab === 'details' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Descrição</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            {property.descricao || 'Descrição não disponível para este imóvel.'}
                                        </p>

                                        {property.dataPublicacao && (
                                            <div className="flex items-center text-sm text-gray-600 pt-4 border-t border-gray-100">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                <span>Publicado em {new Date(property.dataPublicacao).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'amenities' && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comodidades</h3>
                                        {property.caracteristicas && property.caracteristicas.length > 0 ? (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {property.caracteristicas.map((amenity, index) => {
                                                    const Icon = amenityIcons[amenity] || Sparkles
                                                    return (
                                                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                            <Icon className="w-5 h-5 text-amber-600" />
                                                            <span className="text-gray-700">{amenity}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-gray-600">Nenhuma comodidade listada para este imóvel.</p>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'location' && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Localização</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <MapPin className="w-5 h-5 text-amber-600" />
                                                <span>{property.endereco || `${property.bairro}, ${property.cidade}`}</span>
                                            </div>

                                            {/* Map placeholder */}
                                            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <div className="text-center text-gray-600">
                                                    <Map className="w-12 h-12 mx-auto mb-2" />
                                                    <p>Mapa interativo em breve</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Related Properties */}
                        {relatedProperties.length > 0 && (
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">Imóveis similares</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {relatedProperties.slice(0, 4).map((related) => (
                                        <Link
                                            key={related._id}
                                            href={`/imovel/${related.slug}`}
                                            className="group block"
                                        >
                                            <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                                <div className="relative h-32">
                                                    <Image
                                                        src={related.imagem?.imagemUrl || '/images/placeholder-property.jpg'}
                                                        alt={related.titulo || 'Imóvel'}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                                                        {related.titulo}
                                                    </h4>
                                                    <p className="text-amber-600 font-bold">
                                                        {formatPrice(related.preco || 0)}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {related.bairro}, {related.cidade}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Card */}
                        <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Interessado neste imóvel?
                            </h3>

                            <div className="space-y-3">
                                <button
                                    onClick={() => handleContact('whatsapp')}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    WhatsApp
                                </button>

                                <button
                                    onClick={() => handleContact('phone')}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Phone className="w-5 h-5" />
                                    Ligar agora
                                </button>

                                <button
                                    onClick={() => handleContact('email')}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Mail className="w-5 h-5" />
                                    Enviar e-mail
                                </button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="text-center text-sm text-gray-600">
                                    <p>Nova Ipê Imóveis</p>
                                    <p className="font-medium text-gray-900">(11) 99999-9999</p>
                                    <p>contato@novaiipe.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Property Info Card */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Informações do Imóvel
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Código:</span>
                                    <span className="font-medium text-gray-900">{property._id}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tipo:</span>
                                    <span className="font-medium text-gray-900">{property.tipoImovel}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Finalidade:</span>
                                    <span className="font-medium text-gray-900">{property.finalidade}</span>
                                </div>

                                {property.areaUtil && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Área útil:</span>
                                        <span className="font-medium text-gray-900">{property.areaUtil}m²</span>
                                    </div>
                                )}
                                {property.areaUtil && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Área útil:</span>
                                        <span className="font-medium text-gray-900">{property.areaUtil}m²</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Modal */}
            <AnimatePresence>
                {showGallery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
                        onClick={() => setShowGallery(false)}
                    >
                        <button
                            onClick={() => setShowGallery(false)}
                            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition-colors z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center px-4">
                            <Image
                                src={allImages[currentImageIndex] || '/images/placeholder-property.jpg'}
                                alt={`Imagem ${currentImageIndex + 1}`}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                onClick={(e: React.MouseEvent<HTMLImageElement>) => e.stopPropagation()}
                            />

                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            prevImage()
                                        }}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-3 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <ChevronLeft className="w-8 h-8" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            nextImage()
                                        }}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-3 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <ChevronRight className="w-8 h-8" />
                                    </button>
                                </>
                            )}

                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg font-medium">
                                {currentImageIndex + 1} / {allImages.length}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
