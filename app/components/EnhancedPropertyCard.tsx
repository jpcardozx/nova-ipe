"use client"

import Link from 'next/link'
import {
    MapPin, Bed, Bath, ArrowRight, Building2, Car, Sparkles,
    TreePine, Waves, Eye, Heart, Share2, Phone
} from 'lucide-react'
import type { ImovelClient } from '../../src/types/imovel-client'

interface EnhancedPropertyCardProps {
    imovel: ImovelClient
    priority?: boolean
    showFavorite?: boolean
    showShare?: boolean
    className?: string
}

export default function EnhancedPropertyCard({
    imovel,
    priority = false,
    showFavorite = false,
    showShare = false,
    className = ""
}: EnhancedPropertyCardProps) {

    // Helper functions
    const formatPrice = (price: number | undefined) => {
        if (!price) return 'Consulte-nos'

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price)
    }

    const getImageUrl = () => {
        // Prioridade: galeria[0] > imagem > fallback
        if (imovel.galeria?.[0]?.imagemUrl) {
            return imovel.galeria[0].imagemUrl
        }
        if (imovel.imagem?.imagemUrl) {
            return imovel.imagem.imagemUrl
        }
        return null
    }

    const getLocation = () => {
        // Melhor tratamento de localização
        if (imovel.bairro && imovel.cidade) {
            return `${imovel.bairro}, ${imovel.cidade}`
        }
        if (imovel.cidade) {
            return imovel.cidade
        }
        if (imovel.bairro) {
            return imovel.bairro
        }
        if (imovel.endereco) {
            return imovel.endereco
        }
        return 'Guararema, SP' // Fallback padrão
    }

    const getTitle = () => {
        return imovel.titulo || `${imovel.tipoImovel || 'Imóvel'} em ${getLocation().split(',')[0]}`
    }

    const getFeatures = () => {
        const features = []

        if (imovel.dormitorios) {
            features.push({
                icon: Bed,
                value: imovel.dormitorios,
                label: imovel.dormitorios === 1 ? 'quarto' : 'quartos'
            })
        }

        if (imovel.banheiros) {
            features.push({
                icon: Bath,
                value: imovel.banheiros,
                label: imovel.banheiros === 1 ? 'banheiro' : 'banheiros'
            })
        }

        if (imovel.vagas) {
            features.push({
                icon: Car,
                value: imovel.vagas,
                label: imovel.vagas === 1 ? 'vaga' : 'vagas'
            })
        }

        return features
    }

    const getSpecialFeatures = () => {
        const features = []

        if (imovel.possuiJardim) {
            features.push({ icon: TreePine, label: 'Jardim', color: 'text-emerald-600 bg-emerald-50' })
        }

        if (imovel.possuiPiscina) {
            features.push({ icon: Waves, label: 'Piscina', color: 'text-blue-600 bg-blue-50' })
        }

        if (imovel.destaque) {
            features.push({ icon: Sparkles, label: 'Destaque', color: 'text-amber-600 bg-amber-50' })
        }

        return features
    }

    const getStatusInfo = () => {
        if (imovel.status === 'reservado') {
            return { label: 'Reservado', style: 'bg-amber-500 text-white' }
        }
        if (imovel.status === 'vendido') {
            return { label: 'Vendido', style: 'bg-red-500 text-white' }
        }
        return { label: 'Disponível', style: 'bg-emerald-500 text-white' }
    }

    const handleContact = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const message = encodeURIComponent(
            `Olá! Tenho interesse no imóvel "${getTitle()}" em ${getLocation()}. Pode me dar mais informações?`
        )
        window.open(`https://wa.me/5511981845016?text=${message}`, '_blank')
    }

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        // Implementar lógica de favorito
        console.log('Favoritar:', imovel._id)
    }

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (navigator.share) {
            navigator.share({
                title: getTitle(),
                text: `Confira este imóvel em ${getLocation()}`,
                url: `${window.location.origin}/imovel/${imovel._id}`
            })
        } else {
            // Fallback: copiar link
            navigator.clipboard.writeText(`${window.location.origin}/imovel/${imovel._id}`)
            // Mostrar feedback visual
        }
    }

    const imageUrl = getImageUrl()
    const location = getLocation()
    const title = getTitle()
    const features = getFeatures()
    const specialFeatures = getSpecialFeatures()
    const statusInfo = getStatusInfo()

    return (
        <Link
            href={`/imovel/${imovel._id}`}
            className={`group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-amber-300 transform hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-400 ${className}`}
            aria-label={`Ver detalhes: ${title}`}
        >
            {/* Image Container */}
            <div className="relative h-56 sm:h-64 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={imovel.imagem?.alt || title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading={priority ? 'eager' : 'lazy'}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50 flex items-center justify-center">
                        <div className="text-center">
                            <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-3" />
                            <span className="text-sm text-slate-500 font-medium">
                                {imovel.tipoImovel || 'Imóvel'}
                            </span>
                            <div className="text-xs text-slate-400 mt-1">Fotos em breve</div>
                        </div>
                    </div>
                )}

                {/* Overlay gradiente sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3 z-10">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${statusInfo.style}`}>
                        {statusInfo.label}
                    </span>
                </div>

                {/* Badges especiais */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                    {imovel.emAlta && (
                        <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                            🔥 Em Alta
                        </span>
                    )}
                    {imovel.destaque && (
                        <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                            ⭐ Destaque
                        </span>
                    )}
                </div>

                {/* Action buttons - só aparecem no hover */}
                <div className="absolute bottom-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    {showFavorite && (
                        <button
                            onClick={handleFavorite}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                            aria-label="Adicionar aos favoritos"
                        >
                            <Heart className="w-4 h-4 text-slate-600 hover:text-red-500" />
                        </button>
                    )}
                    {showShare && (
                        <button
                            onClick={handleShare}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                            aria-label="Compartilhar imóvel"
                        >
                            <Share2 className="w-4 h-4 text-slate-600 hover:text-blue-500" />
                        </button>
                    )}
                </div>

                {/* Preço no canto inferior esquerdo */}
                <div className="absolute bottom-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-white/95 backdrop-blur-sm border border-amber-200 px-3 py-2 rounded-xl shadow-lg">
                        <div className="text-lg font-bold text-slate-800">
                            {formatPrice(imovel.preco)}
                        </div>
                        {imovel.finalidade && (
                            <div className="text-xs text-slate-600">
                                {imovel.finalidade}
                                {imovel.aceitaFinanciamento && (
                                    <span className="ml-1 text-emerald-600 font-medium">• Financia</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-5 sm:p-6">
                {/* Preço principal */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-2xl font-bold text-slate-900">
                            {formatPrice(imovel.preco)}
                        </div>
                        <div className="text-sm text-slate-600">
                            {imovel.finalidade || 'Venda'}
                            {imovel.aceitaFinanciamento && (
                                <span className="ml-2 text-emerald-600 font-medium">• Aceita financiamento</span>
                            )}
                        </div>
                    </div>

                    {/* Tipo do imóvel */}
                    <div className="text-right">
                        <div className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                            {imovel.tipoImovel || 'Imóvel'}
                        </div>
                    </div>
                </div>

                {/* Título */}
                <h3 className="font-bold text-slate-900 text-lg sm:text-xl mb-3 line-clamp-2 leading-tight group-hover:text-amber-600 transition-colors duration-200">
                    {title}
                </h3>

                {/* Localização */}
                <div className="flex items-center gap-2 text-slate-600 mb-4">
                    <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span className="font-medium text-sm">{location}</span>
                    {imovel.estado && (
                        <span className="text-xs text-slate-500">• {imovel.estado}</span>
                    )}
                </div>

                {/* Características principais */}
                {features.length > 0 && (
                    <div className="flex items-center gap-6 mb-4 text-slate-700">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <div key={index} className="flex items-center gap-1.5">
                                    <Icon className="w-4 h-4 text-amber-600" />
                                    <span className="font-semibold">{feature.value}</span>
                                    <span className="text-sm">{feature.label}</span>
                                </div>
                            )
                        })}

                        {imovel.areaUtil && (
                            <div className="flex items-center gap-1.5">
                                <div className="w-4 h-4 border-2 border-amber-600 rounded-sm flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-sm"></div>
                                </div>
                                <span className="font-semibold">{imovel.areaUtil}</span>
                                <span className="text-sm">m²</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Características especiais */}
                {specialFeatures.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {specialFeatures.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <span
                                    key={index}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${feature.color}`}
                                >
                                    <Icon className="w-3 h-3" />
                                    {feature.label}
                                </span>
                            )
                        })}
                    </div>
                )}

                {/* CTA Section */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                    {/* Botão principal */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-600 font-semibold">
                            <Eye className="w-4 h-4" />
                            <span>Ver detalhes completos</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                    </div>

                    {/* Botão de contato */}
                    <button
                        onClick={handleContact}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                        aria-label={`Entrar em contato sobre ${title}`}
                    >
                        <Phone className="w-4 h-4" />
                        <span>Falar no WhatsApp</span>
                    </button>
                </div>
            </div>
        </Link>
    )
}
