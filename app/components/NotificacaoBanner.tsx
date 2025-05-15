'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface NotificacaoBannerProps {
    text: string;
    linkText?: string;
    linkHref?: string;
    variant?: 'default' | 'warning' | 'success';
    autoHideAfter?: number; // em milissegundos
    dismissible?: boolean;
    storageKey?: string; // para persistir o fechamento
}

export default function NotificacaoBanner({
    text,
    linkText,
    linkHref,
    variant = 'default',
    autoHideAfter,
    dismissible = true,
    storageKey,
}: NotificacaoBannerProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Verificar se o banner já foi fechado anteriormente
        if (storageKey) {
            const wasDismissed = localStorage.getItem(storageKey) === 'dismissed';
            if (wasDismissed) {
                return;
            }
        }

        // Mostrar o banner após um curto delay (melhora a experiência de carregamento)
        const showTimer = setTimeout(() => {
            setIsVisible(true);
        }, 500);

        // Auto-ocultar se configurado
        let hideTimer: NodeJS.Timeout | undefined;
        if (autoHideAfter && autoHideAfter > 0) {
            hideTimer = setTimeout(() => {
                setIsVisible(false);
            }, autoHideAfter);
        }

        return () => {
            clearTimeout(showTimer);
            if (hideTimer) clearTimeout(hideTimer);
        };
    }, [autoHideAfter, storageKey]);

    const dismissBanner = () => {
        setIsVisible(false);

        // Persistir a decisão se necessário
        if (storageKey) {
            localStorage.setItem(storageKey, 'dismissed');
        }
    };

    // Estilos baseados na variante
    const variantStyles = {
        default: 'bg-amber-500 text-white',
        warning: 'bg-orange-600 text-white',
        success: 'bg-green-600 text-white',
    };

    if (!isVisible) return null;

    return (
        <div className={`py-3 px-4 ${variantStyles[variant]} text-center relative`}>
            <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <p className="text-sm font-medium">{text}</p>

                {linkText && linkHref && (
                    <a
                        href={linkHref}
                        className="text-sm font-bold underline underline-offset-2 hover:no-underline"
                    >
                        {linkText}
                    </a>
                )}
            </div>

            {dismissible && (
                <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/90 hover:text-white"
                    onClick={dismissBanner}
                    aria-label="Fechar notificação"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
