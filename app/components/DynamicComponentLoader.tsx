'use client';

/**
 * DynamicComponentLoader.tsx
 * 
 * Componente para carregamento dinâmico otimizado de outros componentes
 * Implementa padrões avançados como lazy loading, skeleton screens,
 * e thresholds inteligentes para melhorar a experiência do usuário
 * 
 * @version 1.0.0
 * @date 18/05/2025
 */

import React, { ReactNode, Suspense, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

interface DynamicLoaderProps {
    // Nome ou identificador do componente (para rastreamento)
    componentName: string;

    // Função para importar o componente dinâmico
    importFunc: () => Promise<{
        default: React.ComponentType<any>;
    }>;

    // Props para passar para o componente dinamicamente carregado
    componentProps?: Record<string, any>;

    // Componente de carregamento personalizado
    loadingComponent?: React.ReactNode;

    // Distância em px para pré-carregar antes de entrar na viewport
    preloadDistance?: number;

    // Se deve ser pré-renderizado no servidor ou apenas no cliente
    ssr?: boolean;

    // Classe CSS adicional para o wrapper
    className?: string;

    // Estilo adicional para o wrapper
    style?: React.CSSProperties;

    // Se deve ter prioridade alta (carrega mais cedo)
    priority?: boolean;

    // Se deve ser carregado imediatamente (sem observação)
    loadImmediately?: boolean;

    // Altura mínima para o skeleton
    minHeight?: number | string;

    // Métrica para rastreamento de performance do componente
    trackMetric?: boolean;
}

/**
 * Componente de Skeleton padrão que mantém o layout estável
 */
const DefaultSkeleton = ({ style, className }: { style?: React.CSSProperties, className?: string }) => (
    <div
        className={cn(
            "animate-pulse rounded-md bg-stone-100/60",
            className
        )}
        style={{
            minHeight: '100px',
            width: '100%',
            ...style
        }}
        aria-hidden="true"
    />
);

/**
 * Componente principal para carregamento dinâmico otimizado
 */
export function DynamicComponentLoader({
    componentName,
    importFunc,
    componentProps = {},
    loadingComponent,
    preloadDistance = 300,
    ssr = false,
    className,
    style,
    priority = false,
    loadImmediately = false,
    minHeight,
    trackMetric = true,
}: DynamicLoaderProps) {
    // Referência para interseção com viewport
    const [ref, inView] = useInView({
        triggerOnce: true,
        rootMargin: `${preloadDistance}px 0px`,
        skip: loadImmediately, // Ignora observador se carregamento imediato
    });

    // Estado do carregamento
    const [isLoading, setIsLoading] = useState(true);
    const [loadStartTime, setLoadStartTime] = useState<number | null>(null);

    // Determina se deve iniciar o carregamento
    const shouldLoad = loadImmediately || priority || inView;

    // Carrega o componente dinamicamente apenas quando necessário
    const DynamicComponent = dynamic(
        () => {
            // Inicia temporizador para métricas
            if (trackMetric && !loadStartTime) {
                setLoadStartTime(performance.now());
            }

            return importFunc()
                .then((mod) => {
                    // Registra métrica após carregamento bem-sucedido
                    if (trackMetric && loadStartTime) {
                        const loadTime = performance.now() - loadStartTime;

                        // Envia para endpoint de métricas
                        if ('sendBeacon' in navigator) {
                            const payload = {
                                component: componentName,
                                loadTime,
                                timestamp: Date.now(),
                            };

                            navigator.sendBeacon('/api/component-metrics', JSON.stringify(payload));
                        }

                        // Log para desenvolvimento
                        if (process.env.NODE_ENV !== 'production') {
                            console.log(`[Dynamic] Loaded ${componentName} in ${Math.round(loadTime)}ms`);
                        }
                    }

                    // Marca como carregado
                    setIsLoading(false);

                    // Retorna o componente real
                    return mod.default || mod;
                });
        },
        {
            loading: () => <>{loadingComponent || <DefaultSkeleton style={{ minHeight }} className={className} />}</>,
            ssr,
        }
    );

    // Se não deve carregar ainda, mostra o esqueleto
    if (!shouldLoad) {
        return (
            <div ref={ref} className={className} style={style}>
                {loadingComponent || <DefaultSkeleton style={{ minHeight }} className={className} />}
            </div>
        );
    }

    // Renderiza o componente carregado dinamicamente com props
    return <DynamicComponent {...componentProps} />;
}

/**
 * HOC (High Order Component) para facilitar o uso do carregamento dinâmico
 * @example const LazyComponent = withDynamicLoading(() => import('./HeavyComponent'));
 */
export function withDynamicLoading(
    importFunc: () => Promise<{
        default: React.ComponentType<any>;
    }>,
    options: Partial<Omit<DynamicLoaderProps, 'importFunc' | 'componentProps'>> = {}
) {
    return function DynamicWrapper(props: Record<string, any>) {
        return (
            <DynamicComponentLoader
                importFunc={importFunc}
                componentProps={props}
                componentName={options.componentName || 'DynamicComponent'}
                loadingComponent={options.loadingComponent}
                preloadDistance={options.preloadDistance}
                ssr={options.ssr}
                className={options.className}
                style={options.style}
                priority={options.priority}
                loadImmediately={options.loadImmediately}
                minHeight={options.minHeight}
                trackMetric={options.trackMetric}
            />
        );
    };
}

// Exporta como padrão para uso simples
export default DynamicComponentLoader;
