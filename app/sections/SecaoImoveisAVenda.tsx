'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import { getImovelEmDestaque } from '@/lib/sanity/fetchImoveis';
import type { ImovelExtended } from '@/src/types/imovel-extended';
import { ImovelData } from '@/src/types/imovel';
import { Compass, MapPin, ArrowUpRight, Loader2, AlertTriangle, Star } from 'lucide-react';
import { cn, formatarMoeda, formatarArea, formatarQuantidade } from '@/src/lib/utils';

// Configurações de cache e carregamento
const CACHE_KEY = 'destaques-premium';
const CACHE_DURATION = 5 * 60 * 1000;

// Definição de tipos
type FeatureType = 'dormitorios' | 'banheiros' | 'area' | 'vagas';

interface Feature {
    label: string;
    value: string;
    icon: string;
    key: FeatureType;
}

// Componente principal
export default function SecaoShowcaseImoveis() {
    // Estado e refs
    const [imoveis, setImoveis] = useState<ImovelExtended[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [highlightFeature, setHighlightFeature] = useState<FeatureType | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Interseção para carregamento sob demanda
    const { ref: inViewRef, inView } = useInView({
        triggerOnce: true,
        rootMargin: '400px 0px',
        threshold: 0.1,
    });

    // Efeito para carregar dados
    useEffect(() => {
        if (!inView) return;

        const fetchImoveis = async () => {
            setStatus('loading');

            try {
                // Tenta recuperar do cache
                if (typeof window !== 'undefined') {
                    try {
                        const cached = sessionStorage.getItem(CACHE_KEY);
                        if (cached) {
                            const { data, timestamp } = JSON.parse(cached);
                            if (Date.now() - timestamp < CACHE_DURATION) {
                                setImoveis(data);
                                setStatus('success');
                                return;
                            }
                        }
                    } catch (cacheError) {
                        console.warn('Erro ao acessar cache:', cacheError);
                    }
                }

                // Busca da API
                const data = await getImovelEmDestaque();

                if (data && data.length > 0) {
                    setImoveis(data);
                    setStatus('success');

                    // Atualiza cache
                    if (typeof window !== 'undefined') {
                        try {
                            sessionStorage.setItem(CACHE_KEY, JSON.stringify({
                                data,
                                timestamp: Date.now()
                            }));
                        } catch (storageError) {
                            console.warn('Erro ao armazenar cache:', storageError);
                        }
                    }
                } else {
                    setStatus('error');
                }
            } catch (error) {
                console.error('Erro ao carregar imóveis em destaque:', error);
                setStatus('error');
            }
        };

        fetchImoveis();
    }, [inView]);

    // Navega para o próximo imóvel
    const handleNextImovel = () => {
        if (isTransitioning || imoveis.length <= 1) return;

        setIsTransitioning(true);
        setActiveIndex((prev) => (prev + 1) % imoveis.length);

        // Reset da transição
        setTimeout(() => setIsTransitioning(false), 800);
    };

    // Navega para o imóvel anterior
    const handlePrevImovel = () => {
        if (isTransitioning || imoveis.length <= 1) return;

        setIsTransitioning(true);
        setActiveIndex((prev) => (prev - 1 + imoveis.length) % imoveis.length);

        // Reset da transição
        setTimeout(() => setIsTransitioning(false), 800);
    };

    // Seleciona um imóvel específico
    const handleSelectImovel = (index: number) => {
        if (index === activeIndex || isTransitioning) return;

        setIsTransitioning(true);
        setActiveIndex(index);

        // Reset da transição
        setTimeout(() => setIsTransitioning(false), 800);

        // Scroll para o imóvel selecionado na barra inferior
        if (scrollAreaRef.current) {
            const scrollElement = scrollAreaRef.current;
            const targetElement = scrollElement.children[index] as HTMLElement;

            if (targetElement) {
                const targetOffset = targetElement.offsetLeft;
                const targetCenter = targetOffset - (scrollElement.offsetWidth / 2) + (targetElement.offsetWidth / 2);

                scrollElement.scrollTo({
                    left: targetCenter,
                    behavior: 'smooth'
                });
            }
        }
    };

    // Obtém o imóvel ativo
    const activeImovel = imoveis[activeIndex];

    // Características para destaque com formatação adequada
    const getFeatures = (imovel: ImovelExtended): Feature[] => {
        return [
            {
                label: 'Dormitórios',
                value: imovel.dormitorios ? formatarQuantidade(imovel.dormitorios, 'quarto') : '—',
                icon: 'bed',
                key: 'dormitorios'
            },
            {
                label: 'Banheiros',
                value: imovel.banheiros ? formatarQuantidade(imovel.banheiros, 'banheiro') : '—',
                icon: 'bath',
                key: 'banheiros'
            },
            {
                label: 'Área construída',
                value: imovel.areaUtil ? formatarArea(imovel.areaUtil) : '—',
                icon: 'area',
                key: 'area'
            },
            {
                label: 'Garagem',
                value: imovel.vagas ? formatarQuantidade(imovel.vagas, 'vaga') : '—',
                icon: 'car',
                key: 'vagas'
            }
        ];
    };

    return (
        <section
            ref={inViewRef}
            className="relative min-h-[90vh] flex flex-col bg-gradient-to-b from-stone-100 via-white to-stone-50 overflow-hidden"
        >
            {/* Malha visual de fundo */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

            {/* Conteúdo principal */}
            <div className="flex-1 w-full">
                {status === 'loading' && <LoadingState />}
                {status === 'error' && <ErrorState />}

                {status === 'success' && activeImovel && (
                    <div className="h-full relative">
                        {/* Container principal - layout de showcase */}
                        <div className="container mx-auto px-4 lg:px-8 h-full py-16 md:py-20 lg:py-24">
                            <header className="mb-8 md:mb-10">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center mb-3"
                                >
                                    <span className="w-8 h-[1px] bg-amber-400 mr-3"></span>
                                    <span className="text-amber-700 text-sm font-medium tracking-wider uppercase">Seleção Premium</span>
                                </motion.div>

                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-tight text-stone-900"
                                >
                                    Imóveis <em className="font-serif not-italic text-amber-700">Exclusivos</em>
                                </motion.h2>
                            </header>

                            {/* Layout de showcase grid */}
                            <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 h-full">
                                {/* Coluna esquerda: imagem principal */}
                                <div className="lg:col-span-7 xl:col-span-8 h-[50vh] md:h-[55vh] lg:h-auto relative">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={`image-${activeImovel._id}`}
                                            initial={{ opacity: 0, scale: 1.05 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                            className="w-full h-full relative rounded-2xl overflow-hidden shadow-xl"
                                        >
                                            <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-stone-900/70" />

                                            <Image
                                                src={activeImovel.imagem?.asset.url || '/placeholder-property.jpg'}
                                                alt={activeImovel.titulo || 'Imóvel em destaque'}
                                                fill
                                                priority
                                                sizes="(max-width: 1024px) 100vw, 60vw"
                                                className="object-cover object-center"
                                            />

                                            {/* Badges sobre a imagem */}
                                            <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                                                {activeImovel.destaque && (
                                                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                                                        <Star className="w-3 h-3 mr-1" /> Destaque
                                                    </span>
                                                )}

                                                {activeImovel.categoria && (
                                                    <span className="bg-white/90 backdrop-blur-sm text-stone-800 px-3 py-1 rounded-full text-xs font-medium">
                                                        {activeImovel.categoria.titulo}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Localização sobre a imagem */}
                                            <div className="absolute bottom-4 left-4 z-20 flex items-center text-white">
                                                <MapPin className="w-4 h-4 mr-1.5 text-amber-300" />
                                                <span className="text-sm font-medium">
                                                    {activeImovel.bairro || 'Localização'}, {activeImovel.cidade || 'não especificada'}
                                                </span>
                                            </div>

                                            {/* Controles de navegação */}
                                            <div className="absolute right-4 bottom-4 z-20 flex gap-2">
                                                <button
                                                    onClick={handlePrevImovel}
                                                    disabled={isTransitioning || imoveis.length <= 1}
                                                    className={cn(
                                                        "w-10 h-10 flex items-center justify-center rounded-full",
                                                        "bg-white/20 backdrop-blur-sm text-white border border-white/30",
                                                        "transition-all hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50",
                                                        (isTransitioning || imoveis.length <= 1) && "opacity-50 cursor-not-allowed"
                                                    )}
                                                    aria-label="Imóvel anterior"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>

                                                <button
                                                    onClick={handleNextImovel}
                                                    disabled={isTransitioning || imoveis.length <= 1}
                                                    className={cn(
                                                        "w-10 h-10 flex items-center justify-center rounded-full",
                                                        "bg-white/20 backdrop-blur-sm text-white border border-white/30",
                                                        "transition-all hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50",
                                                        (isTransitioning || imoveis.length <= 1) && "opacity-50 cursor-not-allowed"
                                                    )}
                                                    aria-label="Próximo imóvel"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Coluna direita: detalhes do imóvel */}
                                <div className="lg:col-span-5 xl:col-span-4 pt-8 lg:pt-0 flex flex-col">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={`details-${activeImovel._id}`}
                                            initial={{ opacity: 0, x: 30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -30 }}
                                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                            className="flex-1 flex flex-col"
                                        >
                                            {/* Cabeçalho do imóvel */}
                                            <div className="mb-6">
                                                <h3 className="text-2xl md:text-3xl font-serif font-medium text-stone-900 mb-2">
                                                    {activeImovel.titulo}
                                                </h3>

                                                <p className="text-stone-500 mb-4">
                                                    {activeImovel.tipoImovel || 'Imóvel'} em {activeImovel.bairro || 'localização privilegiada'}
                                                </p>

                                                {activeImovel.preco && (
                                                    <div className="text-2xl font-semibold text-amber-700">
                                                        {formatarMoeda(activeImovel.preco, true)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Características em lista interativa */}
                                            <div className="mb-8">
                                                <h4 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">
                                                    Características
                                                </h4>

                                                <div className="grid grid-cols-2 gap-4">
                                                    {getFeatures(activeImovel).map((feature) => (
                                                        <motion.div
                                                            key={`feature-${feature.key}`}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.1 }}
                                                            onMouseEnter={() => setHighlightFeature(feature.key)}
                                                            onMouseLeave={() => setHighlightFeature(null)}
                                                            className={cn(
                                                                "flex items-center p-3 rounded-lg border transition-all",
                                                                highlightFeature === feature.key
                                                                    ? "border-amber-300 bg-amber-50"
                                                                    : "border-stone-200 hover:border-amber-200"
                                                            )}
                                                        >
                                                            <FeatureIcon type={feature.icon} highlighted={highlightFeature === feature.key} />
                                                            <div className="ml-3">
                                                                <div className="text-xs text-stone-500">{feature.label}</div>
                                                                <div className="font-medium text-stone-800">{feature.value}</div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Descrição curta */}
                                            {activeImovel.descricao && (
                                                <div className="mb-8">
                                                    <h4 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-2">
                                                        Sobre este imóvel
                                                    </h4>
                                                    <p className="text-stone-600 text-sm leading-relaxed line-clamp-4">
                                                        {activeImovel.descricao}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Benefícios adicionais */}
                                            <div className="flex flex-wrap gap-2 mb-8">
                                                {activeImovel.aceitaFinanciamento && (
                                                    <span className="text-xs font-medium px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
                                                        Aceita financiamento
                                                    </span>
                                                )}

                                                {activeImovel.finalidade && (
                                                    <span className="text-xs font-medium px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                                                        {activeImovel.finalidade}
                                                    </span>
                                                )}
                                            </div>

                                            {/* CTA */}
                                            <div className="mt-auto pt-4">
                                                <Link
                                                    href={`/imoveis/${activeImovel.slug?.current || activeImovel._id}`}
                                                    className={cn(
                                                        "group flex items-center justify-between w-full px-5 py-4 rounded-xl",
                                                        "bg-gradient-to-r from-amber-700 to-amber-600 text-white",
                                                        "shadow-lg shadow-amber-900/10 hover:shadow-amber-900/20",
                                                        "transition-all duration-300 hover:from-amber-800 hover:to-amber-700"
                                                    )}
                                                >
                                                    <span className="font-medium">Ver detalhes completos</span>
                                                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1">
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </span>
                                                </Link>

                                                <div className="flex justify-center mt-4">
                                                    <Link
                                                        href="/imoveis/comprar"
                                                        className="text-amber-700 text-sm font-medium hover:underline flex items-center"
                                                    >
                                                        <span>Ver todos os imóveis disponíveis</span>
                                                        <ArrowUpRight className="ml-1 w-3.5 h-3.5" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Barra inferior com miniaturas para navegação entre imóveis */}
                        {imoveis.length > 1 && (
                            <div className="border-t border-stone-200 bg-white py-4 mt-8">
                                <div className="container mx-auto px-4">
                                    <div
                                        ref={scrollAreaRef}
                                        className="flex overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent"
                                    >
                                        {imoveis.map((imovel, idx) => (
                                            <div
                                                key={imovel._id}
                                                className={cn(
                                                    "flex-shrink-0 mx-2 first:ml-0 last:mr-0 cursor-pointer transition-all",
                                                    "border-b-2",
                                                    idx === activeIndex ? "border-amber-500" : "border-transparent"
                                                )}
                                                onClick={() => handleSelectImovel(idx)}
                                            >
                                                <div className="px-4 py-2 flex items-center">
                                                    <div
                                                        className={cn(
                                                            "w-12 h-12 rounded-md overflow-hidden flex-shrink-0 mr-3 relative",
                                                            idx === activeIndex ? "ring-2 ring-amber-500" : ""
                                                        )}
                                                    >
                                                        <Image
                                                            src={imovel.imagem?.asset.url || '/placeholder-property.jpg'}
                                                            alt={imovel.titulo || 'Miniatura'}
                                                            fill
                                                            sizes="48px"
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="max-w-[150px]">
                                                        <h4 className={cn(
                                                            "line-clamp-1 font-medium",
                                                            idx === activeIndex ? "text-amber-700" : "text-stone-700"
                                                        )}>
                                                            {imovel.titulo}
                                                        </h4>
                                                        <p className="text-xs text-stone-500 line-clamp-1">
                                                            {imovel.bairro || 'Local'}, {imovel.cidade || ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

// Componente de ícone para características
function FeatureIcon({ type, highlighted }: { type: string; highlighted: boolean }) {
    const iconColor = highlighted ? 'text-amber-600' : 'text-stone-400';

    switch (type) {
        case 'bed':
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={iconColor}>
                    <path d="M3 21V7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 11H21V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            );
        case 'bath':
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={iconColor}>
                    <path d="M4 12H20C20.5523 12 21 12.4477 21 13V17C21 18.6569 19.6569 20 18 20H6C4.34315 20 3 18.6569 3 17V13C3 12.4477 3.44772 12 4 12Z" stroke="currentColor" strokeWidth="2" />
                    <path d="M6 12V5C6 4.44772 6.44772 4 7 4H9C9.55228 4 10 4.44772 10 5V12" stroke="currentColor" strokeWidth="2" />
                    <path d="M6 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M18 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            );
        case 'area':
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={iconColor}>
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
                    <path d="M9 21L9 9" stroke="currentColor" strokeWidth="2" />
                </svg>
            );
        case 'car':
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={iconColor}>
                    <path d="M5 11L7 5H17L19 11M5 11H19M5 11V16M19 11V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 15H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
                    <circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
                </svg>
            );
        default:
            return <Compass className={`w-5 h-5 ${iconColor}`} />;
    }
}

// Estado de carregamento
function LoadingState() {
    return (
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-6">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            </div>
            <h3 className="text-xl font-medium text-stone-800 mb-2">Carregando imóveis em destaque</h3>
            <p className="text-stone-500 max-w-md text-center">
                Estamos selecionando os melhores imóveis do nosso portfólio premium para você.
            </p>
        </div>
    );
}

// Estado de erro
function ErrorState() {
    return (
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-medium text-stone-800 mb-2">Não foi possível carregar os imóveis</h3>
            <p className="text-stone-500 max-w-md text-center mb-6">
                Estamos enfrentando dificuldades técnicas. Por favor, tente novamente em alguns instantes.
            </p>
            <Link
                href="/imoveis/comprar"
                className="inline-flex items-center px-6 py-3 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition-colors"
            >
                Ver catálogo completo
            </Link>
        </div>
    );
}