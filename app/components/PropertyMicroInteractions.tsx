'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Heart, Share, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

// Micro-interação para hover nos cards
export const CardHoverOverlay = ({
    isVisible,
    onViewDetails,
    onToggleFavorite,
    onShare,
    isFavorited = false
}: {
    isVisible: boolean;
    onViewDetails?: () => void;
    onToggleFavorite?: () => void;
    onShare?: () => void;
    isFavorited?: boolean;
}) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-2xl pointer-events-none"
    >
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onViewDetails}
                className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl text-sm font-medium text-stone-900 hover:bg-white transition-colors"
            >
                <Eye size={14} />
                Ver detalhes
                <ArrowRight size={14} />
            </motion.button>

            <div className="flex items-center gap-2">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onToggleFavorite}
                    className={cn(
                        "p-2 backdrop-blur-sm rounded-full transition-colors",
                        isFavorited
                            ? "bg-red-500/90 text-white"
                            : "bg-white/90 text-stone-600 hover:bg-white"
                    )}
                >
                    <Heart size={16} className={isFavorited ? "fill-current" : ""} />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onShare}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-stone-600 hover:bg-white transition-colors"
                >
                    <Share size={16} />
                </motion.button>
            </div>
        </div>
    </motion.div>
);

// Animação de valorização para propriedades em destaque
export const AppreciationAnimation = ({ show }: { show: boolean }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{
            opacity: show ? 1 : 0,
            scale: show ? 1 : 0.8,
            y: show ? 0 : 10
        }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-green-500/90 backdrop-blur-sm rounded-full text-xs font-medium text-white"
    >
        <TrendingUp size={12} />
        <span>Alta valorização</span>
    </motion.div>
);

// Indicador de visualizações recentes
export const RecentViewsIndicator = ({
    count,
    show
}: {
    count: number;
    show: boolean;
}) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{
            opacity: show ? 1 : 0,
            x: show ? 0 : -10
        }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-blue-500/90 backdrop-blur-sm rounded-full text-xs font-medium text-white"
    >
        <Eye size={12} />
        <span>{count} visualizações hoje</span>
    </motion.div>
);

// Pulso sutil para novos imóveis
export const NewPropertyPulse = ({ children }: { children: React.ReactNode }) => (
    <motion.div
        animate={{
            boxShadow: [
                "0 0 0 0 rgba(59, 130, 246, 0.4)",
                "0 0 0 8px rgba(59, 130, 246, 0)",
                "0 0 0 0 rgba(59, 130, 246, 0)"
            ]
        }}
        transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
        }}
        className="rounded-2xl"
    >
        {children}
    </motion.div>
);

// Efeito de magnetismo para CTAs
export const MagneticButton = ({
    children,
    className,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    [key: string]: any;
}) => (
    <motion.button
        whileHover={{
            scale: 1.05,
            transition: { type: "spring", stiffness: 400, damping: 10 }
        }}
        whileTap={{ scale: 0.95 }}
        className={cn(
            "relative overflow-hidden transition-all duration-300",
            className
        )}
        {...props}
    >
        <motion.div
            className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity"
            initial={false}
            animate={{ opacity: 0 }}
            whileHover={{ opacity: 0.1 }}
        />
        {children}
    </motion.button>
);

// Componente de estatísticas animadas
export const AnimatedStats = ({
    value,
    label,
    icon: Icon,
    delay = 0
}: {
    value: string | number;
    label: string;
    icon: React.ElementType;
    delay?: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="text-center"
    >
        <motion.div
            whileHover={{ rotate: 5 }}
            className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full mb-2"
        >
            <Icon size={20} />
        </motion.div>
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 10,
                delay: delay + 0.2
            }}
            className="text-2xl font-bold mb-1"
        >
            {value}
        </motion.div>
        <div className="text-sm opacity-75">{label}</div>
    </motion.div>
);

export default {
    CardHoverOverlay,
    AppreciationAnimation,
    RecentViewsIndicator,
    NewPropertyPulse,
    MagneticButton,
    AnimatedStats
};
