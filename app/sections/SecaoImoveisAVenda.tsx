'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Compass,
    MapPin,
    ArrowUpRight,
    Loader2,
    AlertTriangle,
    Star,
    ChevronLeft,
    ChevronRight,
    Home as HomeIcon // Renomeado para evitar conflito
} from 'lucide-react'

import { cn, formatarMoeda, formatarArea, formatarQuantidade } from '@/lib/utils'
import type { ImovelClient } from '@/types/imovel-client'
// Correção do caminho de importação para o SanityImage
import SanityImage from '../components/SanityImage'

const CACHE_KEY = 'destaques-premium'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

export default function SecaoImoveisAVenda() {
    const [imoveis, setImoveis] = useState<ImovelClient[]>([])
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [activeIndex, setActiveIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const { ref: inViewRef, inView } = useInView({ triggerOnce: true, rootMargin: '400px' })

    useEffect(() => {
        if (!inView) return

        const loadData = async () => {
            setStatus('loading')
            try {
                const cached = sessionStorage.getItem(CACHE_KEY)
                if (cached) {
                    const { data, timestamp } = JSON.parse(cached)
                    if (Date.now() - timestamp < CACHE_DURATION) {
                        setImoveis(data)
                        setStatus('success')
                        return
                    }
                }

                const res = await fetch('/api/destaques')

                // Verificação de status HTTP 
                if (!res.ok) {
                    console.error(`Erro na API: ${res.status} ${res.statusText}`);
                    throw new Error(`API respondeu com status ${res.status}`);
                }

                const data = await res.json()

                // Verifica se data é um array
                if (!Array.isArray(data)) {
                    console.warn('API retornou dados em formato inválido:', data);
                    throw new Error('Formato de dados inválido');
                }

                // Se o array estiver vazio, apenas continue com array vazio
                setImoveis(data)
                // Alterado: sempre define como success, independente se o array estiver vazio
                setStatus('success')
                sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
            } catch (err) {
                console.error('Erro ao buscar destaques:', err)
                setStatus('error')
            }
        }

        loadData()
    }, [inView])

    const handleNext = () => {
        if (isTransitioning || imoveis.length <= 1) return
        setIsTransitioning(true)
        setActiveIndex((prev) => (prev + 1) % imoveis.length)
        setTimeout(() => setIsTransitioning(false), 800)
    }

    const handlePrev = () => {
        if (isTransitioning || imoveis.length <= 1) return
        setIsTransitioning(true)
        setActiveIndex((prev) => (prev - 1 + imoveis.length) % imoveis.length)
        setTimeout(() => setIsTransitioning(false), 800)
    }

    const handleSelect = (index: number) => {
        if (index === activeIndex || isTransitioning) return
        setIsTransitioning(true)
        setActiveIndex(index)
        setTimeout(() => setIsTransitioning(false), 800)

        if (scrollAreaRef.current) {
            const scrollElement = scrollAreaRef.current
            const targetElement = scrollElement.children[index] as HTMLElement
            if (targetElement) {
                const offset = targetElement.offsetLeft
                const center = offset - scrollElement.offsetWidth / 2 + targetElement.offsetWidth / 2
                scrollElement.scrollTo({ left: center, behavior: 'smooth' })
            }
        }
    }

    const active = imoveis[activeIndex]

    const getFeatures = (imovel: ImovelClient): { label: string; value: string; icon: string }[] => [
        {
            label: 'Dormitórios',
            value: imovel.dormitorios ? formatarQuantidade(imovel.dormitorios, 'quarto') : '—',
            icon: '🛏️',
        },
        {
            label: 'Banheiros',
            value: imovel.banheiros ? formatarQuantidade(imovel.banheiros, 'banheiro') : '—',
            icon: '🛁',
        },
        {
            label: 'Área construída',
            value: imovel.areaUtil ? formatarArea(imovel.areaUtil) : '—',
            icon: '📐',
        },
        {
            label: 'Garagem',
            value: imovel.vagas ? formatarQuantidade(imovel.vagas, 'vaga') : '—',
            icon: '🚗',
        },
    ]

    // Função segura para formatar moeda que lida com undefined
    const formatarPreco = (preco?: number) => {
        if (preco === undefined) return 'Consulte';
        return formatarMoeda(preco);
    };

    return (
        <section
            ref={inViewRef}
            className="relative min-h-[90vh] flex flex-col bg-gradient-to-b from-stone-100 via-white to-stone-50 overflow-hidden"
        >
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

            <div className="container mx-auto px-4 py-16">
                <div className="flex-1 w-full">
                    {status === 'loading' && <LoadingState />}
                    {status === 'error' && <ErrorState />}

                    {status === 'success' && imoveis.length > 0 && active && (
                        <>
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-stone-800 mb-2">Imóveis em Destaque</h2>
                                <p className="text-stone-600">
                                    Selecionamos as melhores oportunidades disponíveis no mercado.
                                </p>
                            </div>

                            {/* Imóvel principal */}
                            <div className="mb-10">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={active._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100">
                                            <div className="flex flex-col md:flex-row">
                                                {/* Seção da imagem */}
                                                <div className="md:w-1/2">
                                                    <div className="aspect-[4/3] relative">
                                                        <SanityImage
                                                            image={active.imagem}
                                                            alt={active.titulo || "Imóvel em destaque"}
                                                            fill={true}
                                                            priority={true}
                                                        />
                                                        {active.destaque && (
                                                            <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                                                                Destaque
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Seção das informações */}
                                                <div className="md:w-1/2 p-6">
                                                    <h3 className="text-xl font-bold text-stone-800 mb-2">
                                                        {active.titulo}
                                                    </h3>
                                                    <div className="flex items-center text-stone-500 text-sm mb-3">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        <span>{active.bairro ? `${active.bairro}, ` : ''}{active.cidade}</span>
                                                    </div>
                                                    <div className="text-2xl font-bold text-amber-700 mb-4">
                                                        {formatarPreco(active.preco)}
                                                    </div>

                                                    {active.descricao && (
                                                        <p className="text-stone-600 mb-4 line-clamp-3">
                                                            {active.descricao}
                                                        </p>
                                                    )}

                                                    {/* Características */}
                                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                                        {getFeatures(active).map((feature, idx) => (
                                                            <div key={idx} className="flex items-start">
                                                                <span className="text-amber-700 mr-2">{feature.icon}</span>
                                                                <div>
                                                                    <p className="text-xs text-stone-500">{feature.label}</p>
                                                                    <p className="font-medium">{feature.value}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <Link
                                                        href={`/imoveis/${active.finalidade?.toLowerCase() || 'comprar'}/${active.slug}`}
                                                        className="w-full md:w-auto inline-flex justify-center items-center px-6 py-3 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition-colors"
                                                    >
                                                        Ver detalhes
                                                        <ArrowUpRight className="w-4 h-4 ml-2" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Navegação e thumbnails - só mostra se tiver mais de 1 imóvel */}
                            {imoveis.length > 1 && (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-medium text-stone-800">
                                            Mais imóveis em destaque
                                        </h3>

                                        <div className="flex space-x-2">
                                            <button
                                                onClick={handlePrev}
                                                className="p-2 bg-white rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50"
                                                aria-label="Anterior"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                className="p-2 bg-white rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50"
                                                aria-label="Próximo"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Miniaturas */}
                                    <div
                                        ref={scrollAreaRef}
                                        className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin"
                                    >
                                        {imoveis.map((imovel, index) => (
                                            <div
                                                key={imovel._id}
                                                className="flex-shrink-0 w-64 cursor-pointer"
                                                onClick={() => handleSelect(index)}
                                            >
                                                <div className={cn(
                                                    "bg-white rounded-lg shadow-sm overflow-hidden border transition-all",
                                                    index === activeIndex
                                                        ? "border-amber-500 ring-2 ring-amber-200"
                                                        : "border-stone-100 hover:border-amber-200"
                                                )}>
                                                    <div className="aspect-[3/2] relative">
                                                        <SanityImage
                                                            image={imovel.imagem}
                                                            alt={imovel.titulo || "Imóvel"}
                                                            fill={true}
                                                        />
                                                    </div>
                                                    <div className="p-3">
                                                        <div className="text-amber-700 font-medium mb-1">
                                                            {formatarPreco(imovel.preco)}
                                                        </div>
                                                        <div className="flex items-center text-stone-500 text-xs">
                                                            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                                                            <span className="truncate">
                                                                {imovel.bairro || imovel.cidade}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {status === 'success' && imoveis.length === 0 && (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-20">
                            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-6">
                                <HomeIcon className="w-10 h-10 text-amber-300" />
                            </div>
                            <h3 className="text-xl font-medium text-stone-800 mb-2">Novos imóveis em breve</h3>
                            <p className="text-stone-500 max-w-md text-center mb-6">
                                Estamos selecionando novas oportunidades para nosso catálogo. Volte em breve para conferir.
                            </p>
                            <Link
                                href="/imoveis"
                                className="inline-flex items-center px-6 py-3 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition-colors"
                            >
                                Ver todo o catálogo
                                <ArrowUpRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-20">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-6">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            </div>
            <h3 className="text-xl font-medium text-stone-800 mb-2">Carregando imóveis em destaque</h3>
            <p className="text-stone-500 max-w-md text-center">
                Estamos selecionando os melhores imóveis do nosso portfólio premium para você.
            </p>
        </div>
    )
}

function ErrorState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-20">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-medium text-stone-800 mb-2">Erro ao carregar destaques</h3>
            <p className="text-stone-500 max-w-md text-center mb-6">
                Por favor, tente novamente em alguns instantes.
            </p>
            <Link
                href="/imovel/[slug]/ImovelClient"
                className="inline-flex items-center px-6 py-3 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition-colors"
            >
                Ver catálogo completo
            </Link>
        </div>
    )
}