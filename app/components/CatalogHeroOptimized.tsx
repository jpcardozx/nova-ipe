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
    Building2
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
            label: 'Comprar Imóvel',
            icon: Home,
            color: 'from-slate-700 to-slate-800',
            description: 'Encontre sua casa ideal'
        },
        {
            id: 'aluguel', 
            label: 'Alugar Imóvel',
            icon: Key,
            color: 'from-blue-700 to-blue-800',
            description: 'Opções de locação'
        }
    ];

    return (
        <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 overflow-hidden mt-16 md:mt-20"
        >
            {/* Background dinâmico otimizado - mais sutil */}
            <div 
                className="absolute inset-0 opacity-[0.08]"
                style={{
                    transform: `translateY(${scrollY * 0.1}px)`,
                    background: 'radial-gradient(circle at 25% 25%, rgba(245,158,11,0.12), transparent 50%), radial-gradient(circle at 75% 75%, rgba(59,130,246,0.08), transparent 50%)'
                }}
            />

            {/* Pattern overlay sutil */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 20h20v20H0V20zm10 0h20v20H10V20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />

            {/* Container principal - reduzido em 20% */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                
                {/* Header redesenhado - compacto e profissional */}
                <div className="mb-5 lg:mb-7">
                    
                    {/* Badges informativos - design profissional */}
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                        <AnimatePresence>
                            {showStats && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white/8 rounded-md border border-white/15 backdrop-blur-sm"
                                    >
                                        <Building2 className="w-3.5 h-3.5 text-white/70" strokeWidth={2} />
                                        <span className="text-white/90 text-xs sm:text-sm font-medium">
                                            {totalProperties} Imóveis
                                        </span>
                                    </motion.div>
                                    
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.05 }}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white/8 rounded-md border border-white/15 backdrop-blur-sm"
                                    >
                                        <MapPin className="w-3.5 h-3.5 text-white/70" strokeWidth={2} />
                                        <span className="text-white/90 text-xs sm:text-sm font-medium">Guararema, SP</span>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                    
                    {/* Título e subtítulo profissionais */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 lg:gap-8">
                        <div className="flex-1 space-y-2">
                            <motion.h1 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight"
                            >
                                Nossos Imóveis
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.05 }}
                                className="text-white/70 text-sm sm:text-base lg:text-lg max-w-2xl font-light"
                            >
                                Encontre o imóvel ideal em Guararema e região
                            </motion.p>
                        </div>

                        {/* Controles de visualização - design limpo */}
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="flex flex-row items-center gap-2 sm:gap-3"
                        >
                            <button
                                onClick={onFilterToggle}
                                className="group flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 hover:border-white/30 rounded-lg transition-all duration-200 text-white font-medium shadow-sm hover:shadow-md"
                            >
                                <Filter className="w-4 h-4" strokeWidth={2} />
                                <span className="hidden sm:inline text-sm">Filtros</span>
                            </button>
                            
                            <div className="flex bg-white/8 backdrop-blur-sm rounded-lg p-1 border border-white/15">
                                <button
                                    onClick={() => onViewModeChange?.('grid')}
                                    className={`p-2.5 rounded-md transition-all duration-200 ${
                                        viewMode === 'grid' 
                                            ? 'bg-white/20 text-white' 
                                            : 'text-white/50 hover:text-white hover:bg-white/10'
                                    }`}
                                    title="Visualizar em grade"
                                    aria-label="Visualizar em grade"
                                >
                                    <Grid3x3 className="w-4 h-4" strokeWidth={2} />
                                </button>
                                <button
                                    onClick={() => onViewModeChange?.('list')}
                                    className={`p-2.5 rounded-md transition-all duration-200 ${
                                        viewMode === 'list' 
                                            ? 'bg-white/20 text-white' 
                                            : 'text-white/50 hover:text-white hover:bg-white/8'
                                    }`}
                                    title="Visualizar em lista"
                                    aria-label="Visualizar em lista"
                                >
                                    <List className="w-4 h-4" strokeWidth={2} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Cards de ação - design profissional e minimalista */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.16 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                >
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        const isActive = activeAction === action.id;
                        
                        return (
                            <motion.button
                                key={action.id}
                                onClick={() => setActiveAction(action.id === activeAction ? null : action.id as 'venda' | 'aluguel')}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 + (index * 0.05) }}
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.99 }}
                                className={`
                                    group relative overflow-hidden p-5 sm:p-6 rounded-lg border transition-all duration-200
                                    ${isActive 
                                        ? 'bg-white/10 border-white/25 shadow-lg ring-1 ring-white/20' 
                                        : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
                                    }
                                    backdrop-blur-sm
                                `}
                            >
                                {/* Conteúdo limpo */}
                                <div className="relative flex items-center gap-4">
                                    {/* Ícone minimalista */}
                                    <div className={`
                                        p-3 rounded-lg bg-gradient-to-br ${action.color}
                                        shadow-sm transition-all duration-200 group-hover:shadow-md
                                    `}>
                                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                                    </div>
                                    
                                    {/* Texto profissional */}
                                    <div className="text-left flex-1 min-w-0">
                                        <div className="text-white font-semibold text-base sm:text-lg mb-1 truncate">
                                            {action.label}
                                        </div>
                                        <div className="text-white/60 text-xs sm:text-sm font-medium">
                                            {action.description}
                                        </div>
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