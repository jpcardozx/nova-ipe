'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Script from 'next/script';
import { ClientOnly } from './ClientComponents';
import ClientWebVitals from './ClientWebVitals';
import dynamic from 'next/dynamic';
import { OrganizationSchema, WebsiteSchema, LocalBusinessSchema } from './StructuredData';
import HydrationLoadingFix from './HydrationLoadingFix';
import HydrationGuard from './HydrationGuard';
import DataPrefetcher from './DataPrefetcher';
import FontOptimizer from './FontOptimizer';
import OfflineSupportProvider from '../providers/OfflineSupportProvider';

// Importações dinâmicas para reduzir bundle inicial
const WebVitalsMonitor = dynamic(() => import('./WebVitalsMonitor'), { ssr: false });
const JavaScriptOptimizer = dynamic(() => import('./JavaScriptOptimizer'), { ssr: false });

// Componentes não-críticos com carregamento dinâmico
const ClientPerformanceMonitor = dynamic(() => import('./ClientPerformanceMonitor'), {
    ssr: false,
    loading: () => <div className="perf-monitor-placeholder" />
});

const WebVitalsDebuggerWrapper = dynamic(() => import('./WebVitalsDebuggerWrapper'), { ssr: false });
const PerformanceDiagnostics = dynamic(() => import('./PerformanceDiagnostics'), { ssr: false });
const LoadingStateManager = dynamic(() => import('./LoadingStateManager'), { ssr: false });
const PerformanceAnalytics = dynamic(() => import('./PerformanceAnalytics'), { ssr: false });

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Don't run this effect during server-side rendering
        if (typeof window === 'undefined') return;

        // Executa imediatamente para garantir visibilidade rápida e melhorar LCP
        function optimizeInitialRender() {
            // Marca a página como carregada para estilos apropriados
            setIsLoaded(true);            // Adiciona classe para visibilidade do conteúdo - não manipulamos o
            // data-loading-state aqui para evitar erros de hydration
            document.body.classList.add('body-visible');

            // Atualiza atributo para sincronizar com estilos de carregamento
            document.documentElement.setAttribute('data-loaded', 'true');

            // Ativa o carregamento progressivo de recursos
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    // Registra performance observer para LCP
                    if ('PerformanceObserver' in window) {
                        const lcpObserver = new PerformanceObserver((entryList) => {
                            const entries = entryList.getEntries();
                            const lastEntry = entries[entries.length - 1];

                            // Marca elemento LCP para otimização
                            const lcpElement = lastEntry &&
                                document.querySelector(`[data-optimize-lcp="true"]`) as HTMLElement;

                            if (lcpElement) {
                                lcpElement.setAttribute('data-lcp-loaded', 'true');
                            }
                        });

                        // Observa LCP
                        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                    }
                }, { timeout: 1000 });
            }
        }

        // Executa a função otimizadora conforme a prontidão do documento
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            optimizeInitialRender();
        } else {
            document.addEventListener('DOMContentLoaded', optimizeInitialRender);
        }

        // Fallbacks progressivos
        window.addEventListener('load', optimizeInitialRender);
        const timer1 = setTimeout(optimizeInitialRender, 800);
        const timer2 = setTimeout(optimizeInitialRender, 2000);

        // Último recurso - força visibilidade após 3 segundos
        const timer3 = setTimeout(optimizeInitialRender, 3000);

        // Cleanup
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            document.removeEventListener('DOMContentLoaded', optimizeInitialRender);
            window.removeEventListener('load', optimizeInitialRender);
        };
    }, []); return (
        <OfflineSupportProvider>
            {/* Fix hydration issues with visibility */}
            <HydrationLoadingFix />
            <HydrationGuard />
            {/* Script otimizado para WhatsApp via Next.js Script */}
            <Script
                id="whatsapp-optimizer"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            (function() {
              if(/WhatsApp/.test(navigator.userAgent) || document.referrer.includes('whatsapp')) {
                document.body.classList.add('from-whatsapp');
              }
            })();
          `
                }}
            />

            {/* Structured Data for SEO and Social Sharing */}
            <ClientOnly>
                <Suspense fallback={null}>
                    {/* Individual structured data components for better SEO */}
                    <OrganizationSchema />
                    <WebsiteSchema />
                    <LocalBusinessSchema />
                </Suspense>
            </ClientOnly>

            {/* Main content */}
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
                </div>
            }>
                {children}
            </Suspense>            {/* Gerenciador de estado de carregamento */}
            <LoadingStateManager />

            {/* Data prefetcher para otimização de performance */}
            <ClientOnly>
                <DataPrefetcher prefetchHome={true} prefetchListings={true} />
            </ClientOnly>

            {/* Font optimization */}
            <FontOptimizer />

            {/* Delay WebVitals loading */}
            <Suspense fallback={null}>
                <ClientWebVitals />
            </Suspense>{/* Web Vitals Monitor in Production */}
            {process.env.NODE_ENV === 'production' ? (
                <>
                    <Suspense fallback={null}>
                        <WebVitalsMonitor />
                    </Suspense>
                    <JavaScriptOptimizer priority={true} />
                </>
            ) : (
                <>
                    {/* Performance Debugging Tools - Development Only */}
                    <WebVitalsDebuggerWrapper />
                    <Suspense fallback={null}>
                        <ClientPerformanceMonitor />
                    </Suspense>
                    <PerformanceDiagnostics />
                </>
            )}            {/* Ferramentas de diagnóstico que podem ser habilitadas via URL com ?debug=performance */}
            <Suspense fallback={null}>
                <PerformanceDiagnostics />
            </Suspense>

            {/* Performance analytics tool - accessible via Ctrl+Alt+P or ?debug=performance */}
            <Suspense fallback={null}>
                <PerformanceAnalytics />
            </Suspense>
        </OfflineSupportProvider>
    );
}
