'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Script from 'next/script';
import { ClientOnly } from './ClientComponents';
import dynamic from 'next/dynamic';
import { safeDynamicImport } from '../utils/dynamic-import-fix';
import { OrganizationSchema, WebsiteSchema, LocalBusinessSchema } from './StructuredData';
import OfflineSupportProvider from '../providers/OfflineSupportProvider';

// PERFORMANCE CRITICAL: Removemos LucidePreloader que estava causando overhead
// LucidePreloader foi identificado como gargalo de performance

// Importações dinâmicas otimizadas - apenas componentes essenciais
const WebVitalsMonitor = dynamic(
    () => safeDynamicImport(import('./WebVitalsMonitor'), 'WebVitalsMonitor'),
    { 
        ssr: false,
        loading: () => null // Remove placeholder para evitar layout shift
    }
);

// SOMENTE em desenvolvimento - carregamento condicional e otimizado
const ClientPerformanceMonitor = dynamic(
    () => safeDynamicImport(import('./ClientPerformanceMonitor'), 'ClientPerformanceMonitor'),
    { 
        ssr: false,
        loading: () => null // Remove placeholder para melhor performance
    }
);

export default function LayoutClientOptimized({ children }: { children: React.ReactNode }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Função otimizada para visibilidade imediata
        function optimizeInitialRender() {
            setIsLoaded(true);
            document.body.classList.add('body-visible');
            document.documentElement.setAttribute('data-loaded', 'true');
        }

        // Execução imediata sem timeouts desnecessários
        if (document.readyState === 'complete') {
            optimizeInitialRender();
        } else {
            document.addEventListener('DOMContentLoaded', optimizeInitialRender, { once: true });
            window.addEventListener('load', optimizeInitialRender, { once: true });
        }

        // Cleanup simplificado
        return () => {
            document.removeEventListener('DOMContentLoaded', optimizeInitialRender);
            window.removeEventListener('load', optimizeInitialRender);
        };
    }, []);

    return (
        <OfflineSupportProvider>
            {/* Script WhatsApp otimizado */}
            <Script
                id="whatsapp-optimizer"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        if(/WhatsApp/.test(navigator.userAgent)||document.referrer.includes('whatsapp')){
                            document.body.classList.add('from-whatsapp');
                        }
                    `
                }}
            />

            {/* Structured Data - carregamento otimizado */}
            <ClientOnly>
                <Suspense fallback={null}>
                    <OrganizationSchema />
                    <WebsiteSchema />
                    <LocalBusinessSchema />
                </Suspense>
            </ClientOnly>

            {/* Main content com fallback otimizado */}
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            }>
                {children}
            </Suspense>

            {/* Performance monitoring - apenas essencial */}
            {process.env.NODE_ENV === 'production' ? (
                <Suspense fallback={null}>
                    <WebVitalsMonitor />
                </Suspense>
            ) : (
                // Em desenvolvimento - apenas um monitor para evitar overhead
                <Suspense fallback={null}>
                    <ClientPerformanceMonitor />
                </Suspense>
            )}
        </OfflineSupportProvider>
    );
}

