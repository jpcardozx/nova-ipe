'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Home, Calendar, MapPin, Star, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dados mockados para demonstração (em produção viriam de API)
const MARKET_STATS = {
    sale: {
        totalProperties: 47,
        averagePrice: 850000,
        priceGrowth: 12.5,
        viewsToday: 234,
        hotNeighborhood: 'Centro',
        featuredCount: 8
    },
    rent: {
        totalProperties: 31,
        averagePrice: 2800,
        priceGrowth: 8.2,
        viewsToday: 156,
        hotNeighborhood: 'Jardim Esperança',
        featuredCount: 5
    }
};

// Componente de estatística individual
const StatItem = ({
    icon: Icon,
    value,
    label,
    trend,
    delay = 0,
    color = 'blue'
}: {
    icon: React.ElementType;
    value: string | number;
    label: string;
    trend?: number;
    delay?: number;
    color?: 'blue' | 'amber' | 'green' | 'purple';
}) => {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600 text-blue-100',
        amber: 'from-amber-500 to-orange-600 text-amber-100',
        green: 'from-green-500 to-emerald-600 text-green-100',
        purple: 'from-purple-500 to-violet-600 text-purple-100'
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.5,
                delay,
                type: "spring",
                stiffness: 100
            }}
            className="relative group"
        >
            <div className={cn(
                "relative p-4 rounded-2xl bg-gradient-to-br backdrop-blur-sm border border-white/20 overflow-hidden",
                colorClasses[color]
            )}>
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-2 right-2 w-16 h-16 border border-current rounded-full" />
                    <div className="absolute bottom-2 left-2 w-8 h-8 border border-current rounded-full" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <Icon size={20} className="opacity-90" />
                        {trend && (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: delay + 0.2 }}
                                className={cn(
                                    "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                                    trend > 0
                                        ? "bg-green-500/20 text-green-100"
                                        : "bg-red-500/20 text-red-100"
                                )}
                            >
                                <TrendingUp
                                    size={10}
                                    className={cn(
                                        "transform transition-transform",
                                        trend < 0 && "rotate-180"
                                    )}
                                />
                                <span>{Math.abs(trend)}%</span>
                            </motion.div>
                        )}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: delay + 0.1 }}
                        className="text-2xl font-bold mb-1 leading-none"
                    >
                        {value}
                    </motion.div>

                    <div className="text-sm opacity-75 leading-tight">
                        {label}
                    </div>
                </div>

                {/* Hover effect */}
                <motion.div
                    className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                />
            </div>
        </motion.div>
    );
};

// Componente principal de estatísticas do mercado
export function MarketStatsOverview({ type }: { type: 'sale' | 'rent' }) {
    const [stats, setStats] = useState(MARKET_STATS[type]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        // Simular atualização em tempo real
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                viewsToday: prev.viewsToday + Math.floor(Math.random() * 3)
            }));
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const formatPrice = (price: number) => {
        if (type === 'sale') {
            return price >= 1000000
                ? `R$ ${(price / 1000000).toFixed(1)}M`
                : `R$ ${(price / 1000).toFixed(0)}K`;
        }
        return `R$ ${price.toLocaleString()}`;
    };

    const colorScheme = type === 'sale' ? 'amber' : 'blue';

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6"
                >
                    <StatItem
                        icon={Home}
                        value={stats.totalProperties}
                        label="Propriedades"
                        color={colorScheme}
                        delay={0}
                    />

                    <StatItem
                        icon={TrendingUp}
                        value={formatPrice(stats.averagePrice)}
                        label="Preço médio"
                        trend={stats.priceGrowth}
                        color={colorScheme}
                        delay={0.1}
                    />

                    <StatItem
                        icon={Users}
                        value={stats.viewsToday}
                        label="Visualizações hoje"
                        color="green"
                        delay={0.2}
                    />

                    <StatItem
                        icon={MapPin}
                        value={stats.hotNeighborhood}
                        label="Bairro em alta"
                        color="purple"
                        delay={0.3}
                    />

                    <StatItem
                        icon={Star}
                        value={stats.featuredCount}
                        label="Em destaque"
                        color={colorScheme}
                        delay={0.4}
                    />

                    <StatItem
                        icon={Calendar}
                        value="Hoje"
                        label="Última atualização"
                        color="green"
                        delay={0.5}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Componente de alerta de mercado
export function MarketAlert({ type }: { type: 'sale' | 'rent' }) {
    const alerts = {
        sale: {
            message: "Mercado aquecido! 3 propriedades vendidas esta semana",
            type: "success" as const,
            icon: TrendingUp
        },
        rent: {
            message: "Demanda alta para aluguéis! Reserve sua visita",
            type: "info" as const,
            icon: Home
        }
    };

    const alert = alerts[type];
    const Icon = alert.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className={cn(
                "flex items-center gap-3 p-4 rounded-xl backdrop-blur-sm border mb-6",
                alert.type === 'success'
                    ? "bg-green-500/10 border-green-500/20 text-green-700"
                    : "bg-blue-500/10 border-blue-500/20 text-blue-700"
            )}
        >
            <Icon size={20} />
            <span className="font-medium">{alert.message}</span>
        </motion.div>
    );
}

export default {
    MarketStatsOverview,
    MarketAlert,
    StatItem
};
