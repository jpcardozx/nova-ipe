'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface EnhancedLoadingSkeletonProps {
    height?: string;
    title?: string;
    type?: 'hero' | 'section' | 'properties' | 'form' | 'analysis';
    showProgress?: boolean;
}

const EnhancedLoadingSkeleton: React.FC<EnhancedLoadingSkeletonProps> = ({
    height = "400px",
    title = "Carregando...",
    type = "section",
    showProgress = true
}) => {
    const getSkeletonContent = () => {
        switch (type) {
            case 'hero':
                return (
                    <div className="space-y-6">
                        <div className="h-16 bg-gradient-to-r from-amber-200 via-orange-200 to-amber-200 rounded-2xl animate-pulse" />
                        <div className="h-8 bg-neutral-200 rounded-xl animate-pulse w-3/4" />
                        <div className="h-8 bg-neutral-200 rounded-xl animate-pulse w-1/2" />
                        <div className="flex gap-4 mt-8">
                            <div className="h-12 bg-amber-200 rounded-full animate-pulse w-40" />
                            <div className="h-12 bg-neutral-200 rounded-full animate-pulse w-40" />
                        </div>
                    </div>
                );

            case 'properties':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                                <div className="h-48 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200" />
                                <div className="p-6 space-y-4">
                                    <div className="h-6 bg-neutral-200 rounded w-3/4" />
                                    <div className="h-4 bg-neutral-200 rounded w-1/2" />
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="h-8 bg-neutral-100 rounded" />
                                        <div className="h-8 bg-neutral-100 rounded" />
                                        <div className="h-8 bg-neutral-100 rounded" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="h-8 bg-neutral-200 rounded w-1/3" />
                                        <div className="h-10 bg-amber-200 rounded w-1/3" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'analysis':
                return (
                    <div className="space-y-8">
                        <div className="text-center space-y-4">
                            <div className="h-12 bg-gradient-to-r from-amber-200 via-orange-200 to-amber-200 rounded-2xl animate-pulse w-2/3 mx-auto" />
                            <div className="h-6 bg-neutral-200 rounded w-1/2 mx-auto animate-pulse" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                                    <div className="h-16 bg-amber-200 rounded-xl mb-4" />
                                    <div className="h-6 bg-neutral-200 rounded mb-2" />
                                    <div className="h-4 bg-neutral-200 rounded w-3/4" />
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'form':
                return (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="h-8 bg-neutral-200 rounded w-1/2 mx-auto animate-pulse" />
                        <div className="space-y-4">
                            <div className="h-12 bg-neutral-200 rounded animate-pulse" />
                            <div className="h-12 bg-neutral-200 rounded animate-pulse" />
                            <div className="h-32 bg-neutral-200 rounded animate-pulse" />
                            <div className="h-12 bg-amber-200 rounded animate-pulse w-1/3 mx-auto" />
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="space-y-6">
                        <div className="h-8 bg-gradient-to-r from-amber-200 via-orange-200 to-amber-200 rounded-xl animate-pulse w-2/3 mx-auto" />
                        <div className="space-y-4">
                            <div className="h-4 bg-neutral-200 rounded animate-pulse" />
                            <div className="h-4 bg-neutral-200 rounded animate-pulse w-5/6" />
                            <div className="h-4 bg-neutral-200 rounded animate-pulse w-4/5" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-32 bg-neutral-200 rounded-xl animate-pulse" />
                            <div className="h-32 bg-neutral-200 rounded-xl animate-pulse" />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div
            className="w-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-50 to-amber-50/30 rounded-2xl border border-neutral-100 relative overflow-hidden"
            style={{ minHeight: height }}
        >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer" />

            {/* Content */}
            <div className="relative z-10 w-full p-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-full text-amber-800 font-medium mb-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full"
                        />
                        <span>{title}</span>
                    </div>

                    {showProgress && (
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3, ease: "easeInOut" }}
                            className="h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full mx-auto max-w-xs"
                        />
                    )}
                </motion.div>

                {/* Skeleton Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {getSkeletonContent()}
                </motion.div>
            </div>

            {/* Performance indicators */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-neutral-500"
            >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Otimizado para performance</span>
            </motion.div>
        </div>
    );
};

export default EnhancedLoadingSkeleton;
