'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

interface LogoProps {
    width?: number;
    height?: number;
    className?: string;
    linkClassName?: string;
    priority?: boolean;
    variant?: 'default' | 'light' | 'dark';
    loading?: 'eager' | 'lazy';
    href?: string;
}

const aspectRatios = {
    default: 3.33, // 10:3 ratio
    wide: 3,       // 3:1 ratio
    square: 1.5    // 3:2 ratio
};

/**
 * Componente de Logo aprimorado
 * 
 * Características:
 * - Suporte a temas claro/escuro automático
 * - Diversos aspect ratios configuráveis
 * - Loading configurável (lazy/eager)
 * - Links personalizáveis
 * - Otimizado para Core Web Vitals
 */
export default function Logo({
    width = 160,
    height,
    className = '',
    linkClassName = '',
    priority = false,
    variant = 'default',
    loading = 'eager',
    href = '/'
}: LogoProps) {
    const { theme, systemTheme } = useTheme();
    const [logoSrc, setLogoSrc] = useState('/images/logo-ipe.png');
    const [mounted, setMounted] = useState(false);

    // Calculamos a altura com base no aspect ratio escolhido
    const calculatedHeight = height || Math.round(width / aspectRatios.default);

    // Efeito para determinar o logo correto com base no tema
    useEffect(() => {
        setMounted(true);

        // Só alteramos o logo após a montagem do componente para evitar hidratação incorreta
        const currentTheme = theme === 'system' ? systemTheme : theme;

        if (variant === 'light') {
            setLogoSrc('/images/logo-ipe-light.png');
        } else if (variant === 'dark') {
            setLogoSrc('/images/logo-ipe-dark.png');
        } else if (currentTheme === 'dark' && process.env.FEATURE_DARK_MODE === 'true') {
            setLogoSrc('/images/logo-ipe-dark.png');
        } else {
            setLogoSrc('/images/logo-ipe.png');
        }
    }, [theme, systemTheme, variant]);

    // Determina se deve usar prioridade alta para carregamento
    const shouldPrioritize = priority || loading === 'eager';

    return (
        <Link
            href={href}
            className={`transition-opacity duration-300 ${linkClassName} opacity-100`}
            aria-label="Ir para página inicial"
        >
            <div className={`relative overflow-hidden ${className}`}>
                <Image
                    src={logoSrc}
                    alt="Ipê Imóveis"
                    width={width}
                    height={calculatedHeight}
                    className="object-contain transition-opacity duration-300"
                    priority={shouldPrioritize}
                    loading={loading}
                    quality={90}
                    onLoad={() => {
                        // Registra o carregamento da logo para métricas de performance
                        if (typeof window !== 'undefined' && 'performance' in window) {
                            performance.mark('logo-loaded');
                        }
                    }}
                />
            </div>
        </Link>
    );
}
