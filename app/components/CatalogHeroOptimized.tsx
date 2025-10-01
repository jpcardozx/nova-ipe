/**
 * Hero otimizado para catálogo - foco em usabilidade e performance
 * Interface compacta com ações rápidas de venda/aluguel
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Home, 
    Key, 
    MapPin, 
    Filter,
    Grid3x3,
    List,
    Search,
    TrendingUp
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

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const quickActions = [
        {
            id: 'venda',
            label: 'Comprar',
            icon: Home,
            color: 'from-amber-500 to-orange-600',
            count: Math.floor(totalProperties * 0.7)
        },
        {
            id: 'aluguel', 
            label: 'Alugar',
            icon: Key,
            color: 'from-blue-500 to-indigo-600',
            count: Math.floor(totalProperties * 0.3)
        }
    ];

    return (
        <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 overflow-hidden mt-16 md:mt-20"
        >
            {/* Background otimizado */}
            <div 
                className="absolute inset-0 opacity-20"
                style={{
                    transform: `translateY(${scrollY * 0.2}px)`,
                    background: 'radial-gradient(circle at 30% 20%, rgba(245,158,11,0.1), transparent 50%)'
                }}
            />

            {/* Container responsivo */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                
                {/* Header compacto */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-8">
                    
                    {/* Info principal */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/15 rounded-lg border border-green-500/25">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-green-200 text-sm font-medium">
                                    {totalProperties} imóveis disponíveis
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-amber-400">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm font-medium">Guararema, SP</span>
                            </div>
                        </div>
                        
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 leading-tight">
                            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                                Catálogo de Imóveis
                            </span>
                        </h1>
                        <p className="text-gray-300 text-base lg:text-lg mb-6">
                            Encontre o imóvel ideal em Guararema
                        </p>
                    </div>

                    {/* Controles de visualização */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button
                            onClick={onFilterToggle}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl transition-all text-white font-medium"
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filtros</span>
                        </button>
                        
                        <div className="flex bg-white/10 rounded-lg p-1">
                            <button
                                onClick={() => onViewModeChange?.('grid')}
                                className={`p-2 rounded-md transition-all ${
                                    viewMode === 'grid' 
                                        ? 'bg-white/20 text-white' 
                                        : 'text-white/60 hover:text-white'
                                }`}
                            >
                                <Grid3x3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onViewModeChange?.('list')}
                                className={`p-2 rounded-md transition-all ${
                                    viewMode === 'list' 
                                        ? 'bg-white/20 text-white' 
                                        : 'text-white/60 hover:text-white'
                                }`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ações rápidas de venda/aluguel */}
                <div className="mt-8 lg:mt-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            const isActive = activeAction === action.id;
                            
                            return (
                                <motion.button
                                    key={action.id}
                                    onClick={() => setActiveAction(action.id === activeAction ? null : action.id as 'venda' | 'aluguel')}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`
                                        relative p-5 lg:p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300
                                        ${isActive 
                                            ? 'bg-white/20 border-white/30 shadow-xl' 
                                            : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/25'
                                        }
                                    `}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        <div className={`
                                            p-3 rounded-xl bg-gradient-to-r ${action.color} self-start
                                        `}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-left flex-1">
                                            <div className="text-white font-semibold text-base lg:text-lg mb-1">
                                                {action.label}
                                            </div>
                                            <div className="text-white/70 text-sm">
                                                {action.count} imóveis
                                            </div>
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}

                        {/* Card de insights */}
                        <motion.div
                            whileHover={{ scale: 1.02, y: -2 }}
                            className="p-5 lg:p-6 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-green-500/15 backdrop-blur-sm border border-emerald-500/25"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="p-3 rounded-xl bg-emerald-500 self-start">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-left flex-1">
                                    <div className="text-white font-semibold text-base lg:text-lg mb-1">
                                        +12% a.a.
                                    </div>
                                    <div className="text-white/70 text-sm">
                                        Valorização média
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Campo de busca mobile */}
                        <div className="lg:hidden col-span-1 sm:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                                <input
                                    type="text"
                                    placeholder="Buscar por bairro, tipo de imóvel..."
                                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white/15 transition-all"
                                    onChange={(e) => onSearch?.(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}