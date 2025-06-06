'use client';

/**
 * Progressive Module Loader
 * 
 * Este componente otimiza o carregamento progressivo de módulos pesados,
 * reduzindo o impacto inicial no carregamento da página e no LCP.
 * 
 * Utiliza uma estratégia avançada para:
 * 1. Priorizar o conteúdo acima da dobra (above-the-fold)
 * 2. Usar Intersection Observer para carregamento sob demanda
 * 3. Implementar timeouts de segurança para garantir a renderização
 * 4. Pré-carregar componentes quando o navegador estiver ocioso
 */

import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface ProgressiveModuleLoaderProps<T extends React.JSX.IntrinsicAttributes> {
    factory: () => Promise<{ default: React.ComponentType<T> }>;
    props: T;
    loading?: React.ReactNode;
    timeout?: number;
    priority?: boolean;
    preload?: boolean;
    rootMargin?: string;
    threshold?: number;
    id?: string;
}

/**
 * ProgressiveModuleLoader - Carrega módulos pesados de forma progressiva
 */
export default function ProgressiveModuleLoader<T extends React.JSX.IntrinsicAttributes>({
    factory,
    props,
    loading,
    timeout = 3000,
    priority = false,
    preload = false,
    rootMargin = '200px 0px',
    threshold = 0.1,
    id = '',
}: ProgressiveModuleLoaderProps<T>) {
    const [Module, setModule] = useState<React.ComponentType<T> | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const startTime = useRef<number>(0);

    // Intersection Observer para detectar quando o componente entra na viewport
    const { ref, inView } = useInView({
        threshold,
        rootMargin,
        triggerOnce: true,
        skip: priority // Pular observação se for prioritário
    });

    // Tempo de carregamento para diagnóstico
    const logLoadTime = () => {
        if (startTime.current && process.env.NODE_ENV === 'development') {
            const loadTime = performance.now() - startTime.current;
            console.log(`[Performance] Módulo carregado${id ? ` (${id})` : ''}: ${Math.round(loadTime)}ms`);
        }
    };

    // Função para carregar o módulo
    const loadModule = async () => {
        if (Module) return;

        try {
            startTime.current = performance.now(); const componentModule = await factory();
            setModule(() => componentModule.default);
            logLoadTime();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Erro ao carregar módulo'));
            console.error(`Erro ao carregar módulo${id ? ` (${id})` : ''}:`, err);
        }
    };

    useEffect(() => {
        // Carregar imediatamente se for prioritário
        if (priority) {
            loadModule();
            return;
        }

        // Carregar quando visível
        if (inView) {
            loadModule();
        }

        // Preload quando o navegador estiver ocioso
        if (preload && 'requestIdleCallback' in window) {
            const idleCallbackId = requestIdleCallback(() => {
                loadModule();
            }, { timeout: 2000 });

            return () => cancelIdleCallback(idleCallbackId);
        }

        // Fallback timeout de segurança
        const timeoutId = setTimeout(loadModule, timeout);
        return () => clearTimeout(timeoutId);
    }, [inView, priority, preload]);

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-md">
                <p className="font-medium">Erro ao carregar componente</p>
                <p className="text-sm">{error.message}</p>
            </div>
        );
    }

    if (!Module) {
        return <div ref={ref}>{loading || <DefaultLoading />}</div>;
    }

    return <Module {...props} />;
}

// Componente de carregamento padrão
const DefaultLoading = () => (
    <div className="animate-pulse p-4 flex items-center justify-center w-full">
        <div className="h-8 w-12 bg-slate-200 rounded"></div>
    </div>
);
