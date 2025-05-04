'use client';

import { useState, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import {
    motion, AnimatePresence, useMotionValue,
    useTransform, useSpring
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    MapPin, ArrowRight, Sparkles, BedDouble, Bath,
    Car, Ruler, ChevronLeft, ChevronRight, Heart, Share2
} from 'lucide-react';
import { cn, formatarMoeda, formatarArea } from '@/lib/utils';
import SanityImage from '@components/SanityImage';

// Tipos
type Imovel = any; // Use o tipo real do seu projeto

// Função utilitária para gerenciar favoritos
function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);

    // Carrega favoritos do localStorage na montagem do componente
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedFavorites = localStorage.getItem('imoveis-favoritos');
                if (savedFavorites) {
                    setFavorites(JSON.parse(savedFavorites));
                }
            } catch (error) {
                console.error('Erro ao carregar favoritos:', error);
            }
        }
    }, []);

    // Persiste favoritos no localStorage quando mudarem
    useEffect(() => {
        if (typeof window !== 'undefined' && favorites.length > 0) {
            localStorage.setItem('imoveis-favoritos', JSON.stringify(favorites));
        }
    }, [favorites]);

    // Verifica se um imóvel está nos favoritos
    const isFavorite = (id: string) => favorites.includes(id);

    // Adiciona/remove um imóvel dos favoritos
    const toggleFavorite = (id: string) => {
        setFavorites(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    return { favorites, isFavorite, toggleFavorite };
}

// Badge componente
const Badge = ({
    color = "amber-600",
    children,
    className
}: {
    color?: string;
    children: React.ReactNode;
    className?: string
}) => (
    <div
        className={cn(
            `bg-${color} text-white px-2.5 py-1 rounded-full 
      text-xs font-medium inline-flex items-center gap-1 shadow-sm`,
            className
        )}
    >
        {children}
    </div>
);

// Característica do imóvel
const Feature = ({
    icon,
    label,
    value
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number
}) => (
    <div className="flex items-center gap-2.5">
        <div className="p-1.5 bg-stone-100 rounded-md text-stone-700">
            {icon}
        </div>
        <div>
            <span className="block text-xs text-stone-500">{label}</span>
            <span className="font-medium text-stone-800">{value}</span>
        </div>
    </div>
);

// Botão de navegação
const NavButton = ({
    direction = 'next',
    onClick,
    disabled = false
}: {
    direction?: 'prev' | 'next';
    onClick: () => void;
    disabled?: boolean
}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
            "p-3 rounded-full bg-white shadow-lg border border-stone-100",
            "transition-all duration-300 ease-out",
            "flex items-center justify-center",
            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-amber-50 hover:border-amber-200",
            "focus:outline-none focus:ring-2 focus:ring-amber-500/50",
        )}
        aria-label={direction === 'next' ? 'Próximo imóvel' : 'Imóvel anterior'}
    >
        {direction === 'next'
            ? <ChevronRight className="w-5 h-5 text-stone-700" />
            : <ChevronLeft className="w-5 h-5 text-stone-700" />}
    </button>
);

// Card de imóvel para o carrossel
const ImovelMiniCard = ({
    imovel,
    isActive,
    onClick,
    isFavorite,
    onFavoriteToggle
}: {
    imovel: Imovel;
    isActive: boolean;
    onClick: () => void;
    isFavorite: boolean;
    onFavoriteToggle: () => void;
}) => {
    const borderColor = isActive ? 'border-amber-500' : 'border-stone-200';
    const scale = isActive ? 'scale-[1.03]' : 'scale-100 hover:scale-[1.02]';

    return (
        <motion.div
            className={cn(
                "overflow-hidden rounded-xl cursor-pointer transition-all duration-300",
                "border-2 shadow-sm bg-white",
                borderColor, scale
            )}
            onClick={onClick}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="relative aspect-[5/4]">
                <SanityImage
                    image={imovel.imagem}
                    alt={imovel.titulo || "Imóvel"}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className={cn(
                        "object-cover transition-all duration-500"
                    )}
                    aspectRatio="5/4"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <div className="absolute top-2 left-2">
                    <Badge color="amber-600">
                        <Sparkles className="w-3 h-3" /> Destaque
                    </Badge>
                </div>

                <button
                    className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full"
                    onClick={(e) => {
                        e.stopPropagation();
                        onFavoriteToggle();
                    }}
                >
                    <Heart
                        className={cn(
                            "w-4 h-4 transition-colors",
                            isFavorite ? "fill-red-500 text-red-500" : "text-stone-700"
                        )}
                    />
                </button>

                <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-amber-700 truncate">
                                {formatarMoeda(imovel.preco)}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-stone-600">
                                {imovel.dormitorios && (
                                    <span className="flex items-center">
                                        <BedDouble className="w-3 h-3 mr-1" />
                                        {imovel.dormitorios}
                                    </span>
                                )}
                                {imovel.banheiros && (
                                    <span className="flex items-center">
                                        <Bath className="w-3 h-3 mr-1" />
                                        {imovel.banheiros}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Componente para o herói (imóvel em destaque)
const ImovelHero = ({
    imovel,
    isFavorite,
    onFavoriteToggle,
    onShare
}: {
    imovel: Imovel;
    isFavorite: boolean;
    onFavoriteToggle: () => void;
    onShare?: () => void;
}) => {
    // Valores para animação 3D
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [2, -2]);
    const rotateY = useTransform(x, [-100, 100], [-2, 2]);

    // Suaviza a animação
    const springConfig = { damping: 20, stiffness: 150 };
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);

    return (
        <motion.div
            className="bg-white rounded-2xl overflow-hidden shadow-xl border border-stone-100"
            style={{ perspective: 1000 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                x.set(e.clientX - (rect.left + rect.width / 2));
                y.set(e.clientY - (rect.top + rect.height / 2));
            }}
            onMouseLeave={() => {
                x.set(0);
                y.set(0);
            }}
        >
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2"
                style={{
                    rotateX: springRotateX,
                    rotateY: springRotateY,
                    transformStyle: "preserve-3d"
                }}
            >
                {/* Coluna da imagem */}
                <div className="relative h-72 md:h-auto">
                    <SanityImage
                        image={imovel.imagem}
                        alt={imovel.titulo || "Imóvel em destaque"}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                        className="object-cover"
                    />

                    {/* Badges e ações */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        <Badge>
                            <Sparkles className="w-4 h-4" /> Destaque da semana
                        </Badge>

                        {imovel.status === 'novo' && (
                            <Badge color="rose-600">Lançamento</Badge>
                        )}
                    </div>

                    <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                            onClick={onFavoriteToggle}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition"
                            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        >
                            <Heart className={cn(
                                "w-5 h-5 transition",
                                isFavorite ? "fill-red-500 text-red-500" : "text-stone-700"
                            )} />
                        </button>

                        {onShare && (
                            <button
                                onClick={onShare}
                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition"
                                aria-label="Compartilhar"
                            >
                                <Share2 className="w-5 h-5 text-stone-700" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Coluna das informações */}
                <div className="p-6 md:p-8 flex flex-col">
                    <div className="mb-4">
                        <div className="flex items-center text-amber-600 text-sm font-medium mb-1">
                            <Badge color="amber-600" className="mr-2">Venda</Badge>
                            {imovel.categoria?.titulo && (
                                <span>{imovel.categoria.titulo}</span>
                            )}
                        </div>

                        <h2 className="text-2xl font-serif font-medium text-stone-900 mb-2 leading-tight">
                            {imovel.titulo || `Imóvel para Venda`}
                        </h2>

                        <div className="flex items-center text-stone-600 mb-4">
                            <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-amber-600" />
                            <span className="text-sm">
                                {[imovel.endereco, imovel.bairro, imovel.cidade]
                                    .filter(Boolean)
                                    .join(", ")}
                            </span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="text-sm text-stone-500 mb-1">Valor</div>
                        <div className="text-3xl font-bold text-amber-700">
                            {formatarMoeda(imovel.preco)}
                        </div>
                    </div>

                    {/* Características */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {imovel.areaUtil && (
                            <Feature
                                icon={<Ruler className="w-4 h-4" />}
                                label="Área total"
                                value={formatarArea(imovel.areaUtil)}
                            />
                        )}

                        {imovel.dormitorios && (
                            <Feature
                                icon={<BedDouble className="w-4 h-4" />}
                                label="Dormitórios"
                                value={imovel.dormitorios}
                            />
                        )}

                        {imovel.banheiros && (
                            <Feature
                                icon={<Bath className="w-4 h-4" />}
                                label="Banheiros"
                                value={imovel.banheiros}
                            />
                        )}

                        {imovel.vagas && (
                            <Feature
                                icon={<Car className="w-4 h-4" />}
                                label="Vagas"
                                value={imovel.vagas}
                            />
                        )}
                    </div>

                    {/* Descrição breve */}
                    {imovel.descricao && (
                        <div className="mb-6">
                            <p className="text-stone-700 line-clamp-3">
                                {imovel.descricao}
                            </p>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="mt-auto">
                        <Link
                            href={`/imovel/${imovel.slug || imovel._id}`}
                            className="group flex justify-between items-center w-full bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-xl transition-all duration-300 ease-out"
                        >
                            <span className="font-medium">Ver todos os detalhes</span>
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Componente principal
export default function ImoveisDestaqueSection() {
    // Estados
    const [imoveis, setImoveis] = useState<Imovel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Gerenciamento de favoritos
    const { isFavorite, toggleFavorite } = useFavorites();

    // Detecção de visibilidade na tela
    const { ref, inView } = useInView({
        triggerOnce: true,
        rootMargin: '200px',
    });

    // Carregar dados ao entrar na viewport
    useEffect(() => {
        if (inView && isLoading) {
            fetchImoveis();
        }
    }, [inView, isLoading]);

    // Buscar imóveis da API
    const fetchImoveis = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/destaques');

            if (!response.ok) {
                throw new Error(`Erro ao buscar imóveis: ${response.status}`);
            }

            const data = await response.json();

            // Filtrar imóveis para venda e disponíveis
            const imoveisVenda = data.filter((imovel: Imovel) =>
                imovel.finalidade === 'Venda' &&
                (!imovel.status || imovel.status === 'disponivel')
            );

            setImoveis(imoveisVenda);
            setIsLoading(false);
        } catch (err: any) {
            console.error('Erro ao buscar imóveis:', err);
            setError(err.message);
            setIsLoading(false);
        }
    };

    // Navegação entre imóveis
    const nextImovel = () => {
        if (imoveis.length > 0) {
            setActiveIndex(prev => (prev + 1) % imoveis.length);
        }
    };

    const prevImovel = () => {
        if (imoveis.length > 0) {
            setActiveIndex(prev => (prev - 1 + imoveis.length) % imoveis.length);
        }
    };

    // Compartilhar imóvel
    const shareImovel = async (imovel: Imovel) => {
        const url = `${window.location.origin}/imovel/${imovel.slug || imovel._id}`;
        const title = imovel.titulo || 'Imóvel para Venda';

        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: `Confira este imóvel: ${title}`,
                    url
                });
            } catch (error) {
                console.error('Erro ao compartilhar:', error);
            }
        } else {
            // Fallback: copiar para área de transferência
            navigator.clipboard.writeText(url);
            // Você pode adicionar um toast/notification aqui
        }
    };

    // Estado de carregamento
    if (isLoading) {
        return (
            <div ref={ref} className="py-16 flex items-center justify-center">
                <div className="space-y-4 text-center">
                    <div className="inline-block w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-stone-600">Buscando imóveis exclusivos para você...</p>
                </div>
            </div>
        );
    }

    // Estado de erro
    if (error) {
        return (
            <div ref={ref} className="py-16">
                <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-lg">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-stone-900 mb-2">Não foi possível carregar os imóveis</h3>
                    <p className="text-stone-600 mb-4">Ocorreu um erro inesperado. Por favor, tente novamente.</p>
                    <button
                        onClick={fetchImoveis}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    // Estado vazio (sem imóveis)
    if (imoveis.length === 0) {
        return (
            <div ref={ref} className="py-16">
                <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-lg">
                    <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-stone-900 mb-2">Nenhum imóvel em destaque</h3>
                    <p className="text-stone-600 mb-4">No momento não temos imóveis em destaque disponíveis. Por favor, volte mais tarde.</p>
                    <Link
                        href="/imoveis"
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition inline-block"
                    >
                        Ver todos os imóveis
                    </Link>
                </div>
            </div>
        );
    }

    // Imóvel atual em destaque
    const imovelDestaque = imoveis[activeIndex];

    // Renderização do componente principal
    return (
        <section ref={ref} className="py-20 relative bg-stone-50">
            {/* Background decorativo sutil */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/texture-elegant.png')]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Cabeçalho da seção */}
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-3 relative inline-block">
                        <span className="absolute -top-6 -left-4 text-4xl text-amber-400 opacity-50">"</span>
                        Imóveis Premium em Destaque
                        <span className="absolute -bottom-6 -right-4 text-4xl text-amber-400 opacity-50">"</span>
                    </h2>
                    <p className="text-stone-600 mt-4 max-w-2xl mx-auto">
                        Selecionamos cuidadosamente as propriedades mais impressionantes do nosso portfólio
                        para oferecer o que há de melhor em localização, arquitetura e investimento.
                    </p>
                </div>

                {/* Conteúdo principal */}
                <div className="mb-12">
                    <AnimatePresence mode="wait">
                        <ImovelHero
                            key={imovelDestaque._id}
                            imovel={imovelDestaque}
                            isFavorite={isFavorite(imovelDestaque._id)}
                            onFavoriteToggle={() => toggleFavorite(imovelDestaque._id)}
                            onShare={() => shareImovel(imovelDestaque)}
                        />
                    </AnimatePresence>
                </div>

                {/* Navegação entre imóveis */}
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-serif text-stone-800">
                        Mais opções exclusivas para você
                    </h3>

                    {imoveis.length > 1 && (
                        <div className="flex space-x-2">
                            <NavButton
                                direction="prev"
                                onClick={prevImovel}
                                disabled={imoveis.length <= 1}
                            />
                            <NavButton
                                direction="next"
                                onClick={nextImovel}
                                disabled={imoveis.length <= 1}
                            />
                        </div>
                    )}
                </div>

                {/* Miniaturas de imóveis */}
                {imoveis.length > 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-12">
                        {imoveis.map((imovel, index) => (
                            <ImovelMiniCard
                                key={imovel._id}
                                imovel={imovel}
                                isActive={index === activeIndex}
                                onClick={() => setActiveIndex(index)}
                                isFavorite={isFavorite(imovel._id)}
                                onFavoriteToggle={() => toggleFavorite(imovel._id)}
                            />
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
}