'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Bell, Info, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface EnhancedNotificationBannerProps {
    message: string;
    link?: string;
    linkText?: string;
    variant?: 'info' | 'promotional' | 'announcement' | 'success' | 'alert';
    autoHideAfter?: number; // em milissegundos
    dismissible?: boolean;
    storageKey?: string; // para persistir o fechamento
    position?: 'top' | 'bottom';
    onDismiss?: () => void;
}

export default function EnhancedNotificationBanner({
    message,
    link,
    linkText,
    variant = 'info',
    autoHideAfter,
    dismissible = true,
    storageKey,
    position = 'top',
    onDismiss
}: EnhancedNotificationBannerProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Verificar se o banner já foi fechado anteriormente
        if (storageKey && typeof window !== 'undefined') {
            try {
                const wasDismissed = window.localStorage.getItem(storageKey) === 'dismissed';
                if (wasDismissed) {
                    return;
                }
            } catch (error) {
                console.error('Error accessing localStorage:', error);
            }
        }

        // Mostrar o banner após um curto delay para melhorar a experiência de carregamento
        const showTimer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        // Auto-ocultar se configurado
        let hideTimer: NodeJS.Timeout | undefined;
        if (autoHideAfter && autoHideAfter > 0) {
            hideTimer = setTimeout(() => {
                handleDismiss();
            }, autoHideAfter);
        }

        return () => {
            clearTimeout(showTimer);
            if (hideTimer) clearTimeout(hideTimer);
        };
    }, [autoHideAfter, storageKey]);

    const handleDismiss = () => {
        setIsVisible(false);

        // Persistir a decisão se necessário
        if (storageKey && typeof window !== 'undefined') {
            try {
                window.localStorage.setItem(storageKey, 'dismissed');
            } catch (error) {
                console.error('Error saving to localStorage:', error);
            }
        }

        // Callback personalizado
        if (onDismiss) {
            onDismiss();
        }
    };

    // Configurações baseadas na variante
    const variantConfig = {
        info: {
            bg: 'bg-gradient-to-r from-blue-600 to-blue-500',
            icon: <Info className="w-4 h-4" />,
            textColor: 'text-white',
            buttonHover: 'hover:bg-blue-700',
        },
        promotional: {
            bg: 'bg-gradient-to-r from-amber-700 to-amber-600',
            icon: <Bell className="w-4 h-4" />,
            textColor: 'text-white',
            buttonHover: 'hover:bg-amber-800',
        },
        announcement: {
            bg: 'bg-gradient-to-r from-indigo-600 to-purple-600',
            icon: <Bell className="w-4 h-4" />,
            textColor: 'text-white',
            buttonHover: 'hover:bg-indigo-700',
        },
        success: {
            bg: 'bg-gradient-to-r from-emerald-600 to-emerald-500',
            icon: <CheckCircle className="w-4 h-4" />,
            textColor: 'text-white',
            buttonHover: 'hover:bg-emerald-700',
        },
        alert: {
            bg: 'bg-gradient-to-r from-red-600 to-orange-600',
            icon: <AlertTriangle className="w-4 h-4" />,
            textColor: 'text-white',
            buttonHover: 'hover:bg-red-700',
        },
    };

    const config = variantConfig[variant];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
                    transition={{ duration: 0.3 }} className={cn(
                        config.bg,
                        "py-2.5 px-4 shadow-md",
                        position === 'top' ? 'relative z-40' : 'fixed bottom-0 left-0 right-0 z-50'
                    )}
                >
                    <div className="container mx-auto flex flex-wrap items-center justify-center md:justify-between gap-x-4 gap-y-2">
                        <div className="flex items-center gap-2">
                            <span className={cn("flex-shrink-0", config.textColor)}>
                                {config.icon}
                            </span>
                            <p className={cn("text-sm font-medium", config.textColor)}>{message}</p>
                        </div>

                        {link && linkText && (
                            <div className="flex items-center gap-1">
                                <Link
                                    href={link}
                                    className={cn(
                                        "text-sm font-bold flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full transition-colors hover:bg-white/20",
                                        config.textColor
                                    )}
                                >
                                    {linkText}
                                    <ExternalLink className="w-3 h-3" />
                                </Link>
                            </div>
                        )}
                    </div>

                    {dismissible && (
                        <button
                            className={cn(
                                "absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity",
                                config.textColor
                            )}
                            onClick={handleDismiss}
                            aria-label="Fechar notificação"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

