'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Script from 'next/script';
import { ClientOnly } from './ClientComponents';
import dynamic from 'next/dynamic';
import { safeDynamicImport } from '../utils/dynamic-import-fix';
import { OrganizationSchema, WebsiteSchema, LocalBusinessSchema } from './StructuredData';
import OfflineSupportProvider from '../providers/OfflineSupportProvider';
// Removed LucidePreloader to improve performance

// Importações dinâmicas para reduzir bundle inicial com tratamento de erros aprimorado
const WebVitalsMonitor = dynamic(
    () => safeDynamicImport(import('./WebVitalsMonitor'), 'WebVitalsMonitor'),
    { ssr: false }
);

// Optimized performance monitoring - single debugger in development
const WebVitalsDebuggerWrapper = process.env.NODE_ENV === 'development'
    ? dynamic(() => safeDynamicImport(import('./WebVitalsDebuggerWrapper'), 'WebVitalsDebuggerWrapper'), { ssr: false })
    : null;

// Use WebVitals component instead of ClientWebVitals
const WebVitals = dynamic(
    () => safeDynamicImport(import('./WebVitals'), 'WebVitals'),
    { ssr: false }
);

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
        }        // Executa a função otimizadora conforme a prontidão do documento
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            optimizeInitialRender();
        } else {
            document.addEventListener('DOMContentLoaded', optimizeInitialRender, { once: true });
        }

        // Single fallback for load event
        window.addEventListener('load', optimizeInitialRender, { once: true });

        // Cleanup
        return () => {
            document.removeEventListener('DOMContentLoaded', optimizeInitialRender);
            window.removeEventListener('load', optimizeInitialRender);
        };
    }, []);

    return (<OfflineSupportProvider>
        {/* Removed LucidePreloader to improve performance */}

        {/* Fix hydration issues with visibility */}
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
        </Suspense>

        {/* Script de fallback para garantir página visível em caso de erro */}
        <script
            dangerouslySetInnerHTML={{
                __html: `
                            // Garantir que página fica visível mesmo com erros
                            (function() {
                                document.documentElement.removeAttribute('data-loading-state');
                                document.documentElement.setAttribute('data-loaded', 'true');
                                document.body.style.opacity = '1';
                                document.body.style.visibility = 'visible';
                            })();
                        `
            }} />

        <Suspense fallback={null}>
            <WebVitals />
            {/* Adicionamos uma div vazia para auxiliar no debugging */}
            <div id="web-vitals-mount-point" style={{ display: 'none' }} data-debug="true" />
        </Suspense>            {/* Optimized Web Vitals Monitor */}
        {process.env.NODE_ENV === 'production' ? (
            <Suspense fallback={null}>
                <WebVitalsMonitor />
            </Suspense>
        ) : (
            WebVitalsDebuggerWrapper && (
                <Suspense fallback={null}>
                    <WebVitalsDebuggerWrapper />
                </Suspense>
            )
        )}
    </OfflineSupportProvider>
    );
}
