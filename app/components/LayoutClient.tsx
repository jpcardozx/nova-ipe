'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Script from 'next/script';
import { ClientOnly } from './ClientComponents';
import ClientWebVitals from './ClientWebVitals';
import ClientPerformanceMonitor from './ClientPerformanceMonitor';
import WebVitalsDebuggerWrapper from './WebVitalsDebuggerWrapper';
import { OrganizationSchema, WebsiteSchema, LocalBusinessSchema } from './StructuredData';
import PerformanceDiagnostics from './PerformanceDiagnostics';
import LoadingStateManager from './LoadingStateManager';
import HydrationLoadingFix from './HydrationLoadingFix';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Don't run this effect during server-side rendering
        if (typeof window === 'undefined') return;

        // Executar imediatamente para garantir visibilidade rápida
        function removeLoadingState() {
            setIsLoaded(true);

            // Instead of modifying attributes that would cause hydration mismatches,
            // we'll only apply styles after hydration is complete
            try {
                // Short timeout to ensure hydration is complete before applying styles
                setTimeout(() => {
                    if (document.body) {
                        document.body.style.visibility = 'visible';
                        document.body.style.opacity = '1';
                    }
                }, 50); // Increased timeout for better hydration
            } catch (err) {
                console.error('Error updating body visibility:', err);
            }
        }

        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            removeLoadingState();
        } else {
            document.addEventListener('DOMContentLoaded', removeLoadingState);
        }

        // Fallbacks progressivos
        window.addEventListener('load', removeLoadingState);
        const timer1 = setTimeout(removeLoadingState, 800);
        const timer2 = setTimeout(removeLoadingState, 2000);

        // Último recurso - força visibilidade após 3 segundos
        const timer3 = setTimeout(removeLoadingState, 3000);

        // Cleanup
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            document.removeEventListener('DOMContentLoaded', removeLoadingState);
            window.removeEventListener('load', removeLoadingState);
        };
    }, []); return (
        <>
            {/* Fix hydration issues with visibility */}
            <HydrationLoadingFix />
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

            {/* Gerenciador de estado de carregamento */}
            <LoadingStateManager />

            {/* Delay WebVitals loading */}
            <Suspense fallback={null}>
                <ClientWebVitals />
            </Suspense>

            {/* Only load monitoring tools in development */}
            {process.env.NODE_ENV !== 'production' ? (
                <>
                    {/* Performance Debugging Tools - Development Only */}
                    <WebVitalsDebuggerWrapper />
                    <Suspense fallback={null}>
                        <ClientPerformanceMonitor />
                    </Suspense>
                </>
            ) : null}

            {/* Ferramenta de diagnóstico que pode ser habilitada via URL com ?debug=performance */}
            <Suspense fallback={null}>
                <PerformanceDiagnostics />
            </Suspense>
        </>
    );
}
