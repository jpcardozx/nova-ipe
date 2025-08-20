'use client';

import { useEffect } from 'react';

// Interface para métricas
interface Metric {
    name: string;
    value: number;
    delta: number;
    id: string;
    rating: 'good' | 'needs-improvement' | 'poor';
}

// Configuração dos thresholds de Web Vitals
const THRESHOLDS = {
    CLS: { good: 0.1, needsImprovement: 0.25 },
    FID: { good: 100, needsImprovement: 300 },
    FCP: { good: 1800, needsImprovement: 3000 },
    LCP: { good: 2500, needsImprovement: 4000 },
    TTFB: { good: 800, needsImprovement: 1800 }
};

function sendToAnalytics(metric: Metric) {
    // Determinar performance tier
    const threshold = THRESHOLDS[metric.name as keyof typeof THRESHOLDS];
    let tier: 'good' | 'needs-improvement' | 'poor' = 'poor';

    if (threshold) {
        if (metric.value <= threshold.good) {
            tier = 'good';
        } else if (metric.value <= threshold.needsImprovement) {
            tier = 'needs-improvement';
        }
    }

    // Console log para debug durante desenvolvimento
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Web Vitals] ${metric.name}:`, {
            value: metric.value,
            tier,
            delta: metric.delta,
            id: metric.id,
            rating: metric.rating
        });
    }

    // Enviar para analytics (Google Analytics 4)
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value)
        });
    }
}

export default function WebVitalsOptimizer() {
    useEffect(() => {
        // Otimizações de performance críticas
        const performanceOptimizations = () => {
            // 1. Resource Hints para domínios externos
            const resourceHints = [
                { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
                { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
                { rel: 'dns-prefetch', href: '//cdn.sanity.io' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
            ];

            resourceHints.forEach(hint => {
                if (!document.querySelector(`link[href="${hint.href}"]`)) {
                    const link = document.createElement('link');
                    link.rel = hint.rel;
                    link.href = hint.href;
                    if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;
                    document.head.appendChild(link);
                }
            });

            // 2. Preload de recursos críticos
            const criticalResources = [
                { href: '/images/ipeLogoWritten.png', as: 'image' },
                { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' }
            ];

            criticalResources.forEach(resource => {
                if (!document.querySelector(`link[href="${resource.href}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.href = resource.href;
                    link.as = resource.as;
                    if (resource.type) {
                        link.type = resource.type;
                        link.crossOrigin = 'anonymous';
                    }
                    document.head.appendChild(link);
                }
            });

            // 3. Lazy loading de imagens não críticas
            const images = document.querySelectorAll('img[data-src]');
            if ('IntersectionObserver' in window && images.length > 0) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target as HTMLImageElement;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.classList.remove('lazy');
                                imageObserver.unobserve(img);
                            }
                        }
                    });
                }, {
                    rootMargin: '50px 0px'
                });

                images.forEach(img => imageObserver.observe(img));
            }

            // 4. Prefetch de rotas importantes
            const importantRoutes = ['/catalogo', '/contato', '/sobre'];
            if ('requestIdleCallback' in window) {
                const callback = () => {
                    importantRoutes.forEach(route => {
                        if (!document.querySelector(`link[href="${route}"]`)) {
                            const link = document.createElement('link');
                            link.rel = 'prefetch';
                            link.href = route;
                            document.head.appendChild(link);
                        }
                    });
                };
                window.requestIdleCallback(callback as IdleRequestCallback);
            }
        };

        // 5. Otimizações de CLS
        const clsOptimizations = () => {
            // Definir dimensões explícitas para elementos que podem causar layout shift
            const images = document.querySelectorAll('img:not([width]):not([height])');
            images.forEach(img => {
                const htmlImg = img as HTMLImageElement;
                const aspectRatio = htmlImg.getAttribute('data-aspect-ratio');
                if (aspectRatio && htmlImg.style) {
                    htmlImg.style.aspectRatio = aspectRatio;
                }
            });

            // Reservar espaço para fontes web
            const fontFaceObserver = new Promise<void>(resolve => {
                if (document.fonts && document.fonts.ready) {
                    document.fonts.ready.then(() => resolve());
                } else {
                    setTimeout(() => resolve(), 3000); // Fallback
                }
            });

            fontFaceObserver.then(() => {
                document.documentElement.classList.add('fonts-loaded');
            });
        };

        // 6. Performance observer para Core Web Vitals
        const observeWebVitals = () => {
            if ('PerformanceObserver' in window) {
                try {
                    // Observar LCP
                    const lcpObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        if (lastEntry) {
                            console.log('[Performance] LCP:', lastEntry.startTime);
                            // Enviar para analytics se disponível
                            if ((window as any).gtag) {
                                (window as any).gtag('event', 'LCP', {
                                    event_category: 'Web Vitals',
                                    value: Math.round(lastEntry.startTime)
                                });
                            }
                        }
                    });
                    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

                    // Observar CLS
                    const clsObserver = new PerformanceObserver((list) => {
                        let clsValue = 0;
                        list.getEntries().forEach((entry) => {
                            if ('value' in entry && !('hadRecentInput' in entry && entry.hadRecentInput)) {
                                clsValue += entry.value as number;
                            }
                        });
                        if (clsValue > 0) {
                            console.log('[Performance] CLS:', clsValue);
                            if ((window as any).gtag) {
                                (window as any).gtag('event', 'CLS', {
                                    event_category: 'Web Vitals',
                                    value: Math.round(clsValue * 1000)
                                });
                            }
                        }
                    });
                    clsObserver.observe({ type: 'layout-shift', buffered: true });

                    // Observar FCP
                    const fcpObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        entries.forEach(entry => {
                            if (entry.name === 'first-contentful-paint') {
                                console.log('[Performance] FCP:', entry.startTime);
                                if ((window as any).gtag) {
                                    (window as any).gtag('event', 'FCP', {
                                        event_category: 'Web Vitals',
                                        value: Math.round(entry.startTime)
                                    });
                                }
                            }
                        });
                    });
                    fcpObserver.observe({ type: 'paint', buffered: true });

                } catch (error) {
                    console.warn('[Performance] Observer error:', error);
                }
            }
        };

        // Executar otimizações
        if (document.readyState === 'complete') {
            performanceOptimizations();
            clsOptimizations();
            observeWebVitals();
        } else {
            const handleLoad = () => {
                performanceOptimizations();
                clsOptimizations();
                observeWebVitals();
            };
            window.addEventListener('load', handleLoad);

            // Cleanup
            return () => {
                window.removeEventListener('load', handleLoad);
            };
        }
    }, []);

    return null; // Este componente não renderiza nada
}

// Type definitions simplificadas para compatibilidade