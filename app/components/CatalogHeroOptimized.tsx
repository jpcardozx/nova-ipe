/**
 * Hero otimizado para catálogo - VERSÃO SIMPLIFICADA
 * Foco em apresentação clara e filtros visuais (sem search input)
 * UI/UX melhorada para mobile-first
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Home, 
    Key, 
    MapPin, 
    Filter,
    Grid3x3,
    List,
    TrendingUp,
    Building2,
    Sparkles
} from 'lucide-react';

interface CatalogHeroProps {
    totalProperties: number;
    onSearch?: (query: string) => void;
    onFilterToggle?: () => void;
    viewMode?: 'grid' | 'list';
    onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export default function CatalogHero({ 
    totalProperties, 
    onSearch, 
    onFilterToggle,
    viewMode = 'grid',
    onViewModeChange 
}: CatalogHeroProps) {
    const [scrollY, setScrollY] = useState(0);
    const [activeAction, setActiveAction] = useState<'venda' | 'aluguel' | null>(null);
    const [showStats, setShowStats] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Animação de entrada das estatísticas
        const timer = setTimeout(() => setShowStats(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const quickActions = [
        {
            id: 'venda',
            label: 'Comprar',
            icon: Home,
            color: 'from-amber-500 to-orange-600',
            hoverColor: 'hover:from-amber-600 hover:to-orange-700',
            count: Math.floor(totalProperties * 0.7),
            description: 'Imóveis à venda'
        },
        {
            id: 'aluguel', 
            label: 'Alugar',
            icon: Key,
            color: 'from-blue-500 to-indigo-600',
            hoverColor: 'hover:from-blue-600 hover:to-indigo-700',
            count: Math.floor(totalProperties * 0.3),
            description: 'Imóveis para locação'
        }
    ];

    return (
        <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 overflow-hidden mt-16 md:mt-20"
        >
            {/* Background dinâmico otimizado */}
            <div 
                className="absolute inset-0 opacity-10"
                style={{
                    transform: `translateY(${scrollY * 0.15}px)`,
                    background: 'radial-gradient(circle at 30% 20%, rgba(245,158,11,0.15), transparent 60%), radial-gradient(circle at 70% 80%, rgba(59,130,246,0.1), transparent 60%)'
                }}
            />

            {/* Pattern overlay sutil */}
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />

            {/* Container principal */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
                
                {/* Header redesenhado - mais limpo e moderno */}
                <div className="mb-8 lg:mb-10">
                    
                    {/* Badges informativos */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <AnimatePresence>
                            {showStats && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 }}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-400/30 backdrop-blur-sm"
                                    >
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                                        <span className="text-green-100 text-sm font-semibold">
                                            {totalProperties} imóveis
                                        </span>
                                    </motion.div>
                                    
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.2 }}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/15 rounded-full border border-amber-400/25 backdrop-blur-sm"
                                    >
                                        <MapPin className="w-4 h-4 text-amber-300" />
                                        <span className="text-amber-100 text-sm font-semibold">Guararema, SP</span>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.3 }}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/15 rounded-full border border-blue-400/25 backdrop-blur-sm"
                                    >
                                        <Sparkles className="w-4 h-4 text-blue-300" />
                                        <span className="text-blue-100 text-sm font-semibold">Atualizado hoje</span>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                    
                    {/* Título e subtítulo aprimorados */}
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div className="flex-1">
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight"
                            >
                                <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-orange-300 bg-clip-text text-transparent drop-shadow-lg">
                                    Catálogo Completo
                                </span>
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-gray-200 text-lg lg:text-xl max-w-2xl"
                            >
                                Explore nossa seleção exclusiva de imóveis em Guararema
                            </motion.p>
                        </div>

                        {/* Controles de visualização - redesenhados */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-row items-center gap-3"
                        >
                            <button
                                onClick={onFilterToggle}
                                className="group flex items-center justify-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-white/15 to-white/10 hover:from-white/25 hover:to-white/20 backdrop-blur-md border border-white/25 rounded-xl transition-all duration-300 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                            >
                                <Filter className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                                <span className="hidden sm:inline">Filtrar</span>
                            </button>
                            
                            <div className="flex bg-white/10 backdrop-blur-md rounded-xl p-1.5 border border-white/20 shadow-lg">
                                <button
                                    onClick={() => onViewModeChange?.('grid')}
                                    className={`p-3 rounded-lg transition-all duration-300 ${
                                        viewMode === 'grid' 
                                            ? 'bg-white/25 text-white shadow-md scale-105' 
                                            : 'text-white/60 hover:text-white hover:bg-white/10 active:text-white'
                                    }`}
                                    title="Visualização em grade"
                                >
                                    <Grid3x3 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => onViewModeChange?.('list')}
                                    className={`p-3 rounded-lg transition-all duration-300 ${
                                        viewMode === 'list' 
                                            ? 'bg-white/25 text-white shadow-md scale-105' 
                                            : 'text-white/60 hover:text-white hover:bg-white/10 active:text-white'
                                    }`}
                                    title="Visualização em lista"
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Cards de categorias - redesenhados sem search */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6"
                >
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        const isActive = activeAction === action.id;
                        
                        return (
                            <motion.button
                                key={action.id}
                                onClick={() => setActiveAction(action.id === activeAction ? null : action.id as 'venda' | 'aluguel')}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.4 + (index * 0.1) }}
                                whileHover={{ scale: 1.03, y: -4 }}
                                whileTap={{ scale: 0.97 }}
                                className={`
                                    group relative overflow-hidden p-6 lg:p-8 rounded-2xl border-2 transition-all duration-300
                                    ${isActive 
                                        ? 'bg-white/20 border-white/40 shadow-2xl' 
                                        : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30'
                                    }
                                    backdrop-blur-md
                                `}
                            >
                                {/* Glow effect no hover */}
                                <div className={`
                                    absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                    bg-gradient-to-r ${action.color}
                                `} style={{ filter: 'blur(40px)', transform: 'scale(0.8)' }} />
                                
                                {/* Conteúdo */}
                                <div className="relative flex items-center gap-4 lg:gap-5">
                                    {/* Ícone com animação */}
                                    <motion.div 
                                        className={`
                                            p-4 lg:p-5 rounded-2xl bg-gradient-to-br ${action.color} ${action.hoverColor}
                                            shadow-lg group-hover:shadow-2xl transition-all duration-300
                                        `}
                                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                                    </motion.div>
                                    
                                    {/* Texto */}
                                    <div className="text-left flex-1">
                                        <div className="text-white font-bold text-xl lg:text-2xl mb-1 group-hover:text-amber-200 transition-colors">
                                            {action.label}
                                        </div>
                                        <div className="text-white/80 text-sm lg:text-base font-medium">
                                            {action.count} {action.description}
                                        </div>
                                    </div>

                                    {/* Indicador de ativo */}
                                    {isActive && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
                                        />
                                    )}
                                </div>

                                {/* Badge de trending */}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                                        <TrendingUp className="w-3 h-3 text-white" />
                                        <span className="text-xs text-white font-semibold">Popular</span>
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </motion.div>
            </div>
        </motion.section>
    );
}