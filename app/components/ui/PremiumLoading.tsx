'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Home, Building2, Search, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { designSystem } from '../../../lib/design-system';

interface PremiumLoadingProps {
    isLoading?: boolean;
    type?: 'page' | 'section' | 'overlay' | 'inline' | 'button';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    message?: string;
    showIcon?: boolean;
    icon?: 'default' | 'home' | 'building' | 'search' | 'heart';
    className?: string;
    children?: React.ReactNode;
}

const iconMap = {
    default: Loader2,
    home: Home,
    building: Building2,
    search: Search,
    heart: Heart,
};

const sizeClasses = {
    sm: {
        container: 'p-4',
        icon: 'w-6 h-6',
        text: 'text-sm',
        dots: 'w-1.5 h-1.5',
    },
    md: {
        container: 'p-8',
        icon: 'w-8 h-8',
        text: 'text-base',
        dots: 'w-2 h-2',
    },
    lg: {
        container: 'p-12',
        icon: 'w-12 h-12',
        text: 'text-lg',
        dots: 'w-3 h-3',
    },
    xl: {
        container: 'p-16',
        icon: 'w-16 h-16',
        text: 'text-xl',
        dots: 'w-4 h-4',
    },
};

export default function PremiumLoading({
    isLoading = true,
    type = 'section',
    size = 'md',
    message = 'Carregando...',
    showIcon = true,
    icon = 'default',
    className,
    children
}: PremiumLoadingProps) {
    const IconComponent = iconMap[icon];
    const sizeClass = sizeClasses[size];

    // Skeleton loader for inline type
    if (type === 'inline' && isLoading) {
        return (
            <div className={cn("animate-pulse", className)}>
                <div className="bg-neutral-200 rounded-lg w-full h-6"></div>
            </div>
        );
    }

    // Button loading state
    if (type === 'button' && isLoading) {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{message}</span>
            </div>
        );
    }

    // Main loading component
    const LoadingContent = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "flex flex-col items-center justify-center text-center",
                sizeClass.container,
                type === 'overlay' && "fixed inset-0 bg-white/90 backdrop-blur-sm z-50",
                type === 'page' && "min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30",
                type === 'section' && "w-full min-h-[200px]",
                className
            )}
        >
            {/* Main Loading Animation */}
            <div className="relative mb-6">
                {/* Outer rotating ring */}
                <motion.div
                    className="absolute inset-0 border-4 border-primary-200 rounded-full"
                    style={{ borderTopColor: 'transparent' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Inner pulsing circle */}
                <motion.div
                    className={cn(
                        "bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white",
                        sizeClass.icon === 'w-6 h-6' && 'w-12 h-12',
                        sizeClass.icon === 'w-8 h-8' && 'w-16 h-16',
                        sizeClass.icon === 'w-12 h-12' && 'w-24 h-24',
                        sizeClass.icon === 'w-16 h-16' && 'w-32 h-32'
                    )}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    {showIcon && (
                        <IconComponent 
                            className={cn(
                                sizeClass.icon,
                                icon === 'default' && 'animate-spin'
                            )} 
                        />
                    )}
                </motion.div>
            </div>

            {/* Loading Message */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
            >
                <h3 className={cn("font-semibold text-neutral-800", sizeClass.text)}>
                    {message}
                </h3>
                
                {/* Animated dots */}
                <div className="flex justify-center gap-1">
                    {[0, 1, 2].map((index) => (
                        <motion.div
                            key={index}
                            className={cn("bg-primary-500 rounded-full", sizeClass.dots)}
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: index * 0.2,
                            }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Progress indicator for longer loads */}
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
                className="mt-6 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full max-w-xs"
            />

            {/* Optional subtext */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-neutral-500 text-sm mt-4 max-w-md"
            >
                Preparando a melhor experiência para você...
            </motion.p>
        </motion.div>
    );

    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <LoadingContent key="loading" />
            ) : (
                children && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                )
            )}
        </AnimatePresence>
    );
}

// Skeleton components for specific use cases
export const PropertyCardSkeleton = () => (
    <div className="animate-pulse bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
        <div className="h-48 bg-neutral-200"></div>
        <div className="p-5 space-y-4">
            <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
            </div>
            <div className="flex gap-4">
                <div className="h-3 bg-neutral-200 rounded w-12"></div>
                <div className="h-3 bg-neutral-200 rounded w-12"></div>
                <div className="h-3 bg-neutral-200 rounded w-16"></div>
            </div>
            <div className="h-6 bg-neutral-200 rounded w-24"></div>
        </div>
    </div>
);

export const PropertyGridSkeleton = ({ count = 6 }: { count?: number }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
        ))}
    </div>
);