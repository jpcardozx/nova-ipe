'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

interface LazyLoaderProps {
    children: ReactNode;
    threshold?: number;
    rootMargin?: string;
    placeholder?: ReactNode;
    forceLoad?: boolean;
    className?: string;
}

/**
 * Componente que realiza carregamento lazy de conteúdo pesado
 * Só carrega o conteúdo quando o componente estiver próximo da visualização
 */
export default function LazyLoader({
    children,
    threshold = 0.1,
    rootMargin = '200px',
    placeholder = null,
    forceLoad = false,
    className = '',
}: LazyLoaderProps) {
    // Verifica se o componente está visível na viewport
    const { ref, inView } = useInView({
        threshold,
        rootMargin,
        triggerOnce: true // Carrega apenas uma vez
    });

    // Estado para controlar se o conteúdo deve ser carregado
    const [shouldLoad, setShouldLoad] = useState(false);

    // Estado para detectar se estamos em uma conexão de internet lenta
    const [isSlowConnection, setIsSlowConnection] = useState(false);

    // Verifica conexão e decide se carrega o conteúdo
    useEffect(() => {
        // Detecta conexões lentas
        const detectConnectionSpeed = () => {
            if ('connection' in navigator && navigator.connection) {
                const connection = navigator.connection as any;
                if (connection.saveData ||
                    ['slow-2g', '2g', '3g'].includes(connection.effectiveType)) {
                    setIsSlowConnection(true);
                }
            }
        };

        detectConnectionSpeed();

        // Decide se deve carregar o conteúdo
        if (inView || forceLoad || window.innerWidth < 768 || isSlowConnection) {
            setShouldLoad(true);
        }

        // Em dispositivos móveis, carrega após um breve período mesmo sem scroll
        const timeoutId = setTimeout(() => {
            setShouldLoad(true);
        }, 2500);

        return () => clearTimeout(timeoutId);
    }, [inView, forceLoad, isSlowConnection]);

    return (
        <div ref={ref} className={className}>
            {shouldLoad ? children : placeholder}
        </div>
    );
}
