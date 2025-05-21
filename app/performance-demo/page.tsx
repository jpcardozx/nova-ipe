'use client';

/**
 * Performance Demo Page
 * 
 * Página de demonstração das otimizações de performance implementadas
 * Compara técnicas tradicionais com versões otimizadas
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThirdPartyScriptLoader } from '@/app/components/ThirdPartyScriptLoader';
import { DynamicComponentLoader } from '@/app/components/DynamicComponentLoader';
import OptimizedImageGallery from '@/app/components/OptimizedImageGallery';
import OptimizedImovelCard from '@/app/components/OptimizedImovelCard';
import ImovelCard from '@/components/ImovelCard';
import SanityImage from '@/components/SanityImage';
import WebVitalsMonitor from '@/app/components/WebVitalsMonitor';
import Image from 'next/image';

// Dados simulados
import type { ImovelClient, ImagemClient } from '@/src/types/imovel-client';

const DEMO_PROPERTY: ImovelClient = {
    _id: 'demo-property-1',
    titulo: 'Casa com Vista Panorâmica',
    slug: 'casa-com-vista-panoramica',
    preco: 1250000,
    bairro: 'Jardim Dulce',
    cidade: 'Guararema',
    dormitorios: 4,
    banheiros: 3,
    vagas: 2,
    areaUtil: 280,
    finalidade: 'Venda' as const,
    status: 'disponivel' as const,
    imagem: {
        url: 'https://cdn.sanity.io/images/jgnu3lns/production/eb1b274eeb5c379a880af885c0ff1f0d535e2228-1200x800.jpg',
        alt: 'Vista frontal da casa com jardim',
        asset: {
            url: 'https://cdn.sanity.io/images/jgnu3lns/production/eb1b274eeb5c379a880af885c0ff1f0d535e2228-1200x800.jpg'
        }
    },
    categoria: { _id: 'casa', titulo: 'Casa' }
};

// Array de imagens demo
const DEMO_IMAGES = [
    'https://cdn.sanity.io/images/jgnu3lns/production/eb1b274eeb5c379a880af885c0ff1f0d535e2228-1200x800.jpg',
    'https://cdn.sanity.io/images/jgnu3lns/production/543c6f764a9f5528a661a57930682f64dcc76343-1200x800.jpg',
    'https://cdn.sanity.io/images/jgnu3lns/production/a24fd4576ac6c809a9f842686c22c384e65c742f-1200x800.jpg',
];

// Componente pesado de exemplo
const HeavyComponent = () => {
    // Simulando componente pesado com computação
    useEffect(() => {
        // Operação cara simulada
        const start = performance.now();
        let result = 0;
        for (let i = 0; i < 2000000; i++) {
            result += Math.sqrt(i);
        }
        console.log(`HeavyComponent renderizado em ${(performance.now() - start).toFixed(2)}ms`);
    }, []);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Componente Pesado</h3>
            <p className="text-gray-700 mb-4">
                Este componente simula uma carga computacional pesada que pode bloquear o thread principal.
                Na versão otimizada, usamos carregamento dinâmico para evitar bloquear a renderização inicial.
            </p>
            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="p-4 bg-gray-100 rounded-md">
                        Item {i + 1}
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * Componente que monitora o tempo de renderização
 */
function RenderTimeMonitor({ id }: { id: string }) {
    const [renderTime, setRenderTime] = useState<number | null>(null);

    useEffect(() => {
        const element = document.getElementById(id);
        if (element) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                if (lastEntry) {
                    setRenderTime(lastEntry.duration);
                }
            });

            observer.observe({ entryTypes: ['measure'] });

            performance.mark(`${id}-start`);

            // Registrar quando o elemento estiver totalmente renderizado
            const checkRendered = () => {
                performance.mark(`${id}-end`);
                performance.measure(id, `${id}-start`, `${id}-end`);
            };

            // Usar setTimeout para garantir que a renderização foi concluída
            setTimeout(checkRendered, 100);

            return () => {
                observer.disconnect();
            };
        }
    }, [id]);

    return (
        <div className="text-sm text-gray-500 mt-2">
            {renderTime !== null ? (
                <span>Tempo de renderização: {renderTime.toFixed(2)}ms</span>
            ) : (
                <span>Medindo tempo de renderização...</span>
            )}
        </div>
    );
}

/**
 * Página principal de demonstração de performance
 */
export default function PerformanceDemoPage() {
    return (
        <>
            {/* Monitoramento de métricas */}
            <WebVitalsMonitor />

            <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Demonstração de Otimização de Performance
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Esta página demonstra as várias técnicas de otimização implementadas no site da Nova Ipê.
                        Compare as versões tradicionais com as versões otimizadas.
                    </p>

                    <div className="mt-8">
                        <Link href="/performance-analytics" className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-6 py-3 rounded-md font-medium transition-colors">
                            Ver Painel de Analytics de Performance
                        </Link>
                    </div>
                </header>

                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Otimização de Imagens</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md" id="traditional-image">
                            <h3 className="text-xl font-bold mb-4">Abordagem Tradicional</h3>
                            <div className="relative h-64 mb-4">
                                <Image
                                    src={DEMO_IMAGES[0]}
                                    alt="Casa com vista panorâmica"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover rounded-md"
                                />
                            </div>
                            <p className="text-gray-700 mb-2">
                                Carregamento padrão de imagem sem otimizações avançadas.
                            </p>
                            <RenderTimeMonitor id="traditional-image" />
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md" id="optimized-image">
                            <h3 className="text-xl font-bold mb-4">Abordagem Otimizada</h3>
                            <div className="h-64 mb-4">
                                <OptimizedImageGallery
                                    images={DEMO_IMAGES}
                                    alt="Casa com vista panorâmica"
                                    className="w-full h-full rounded-md"
                                    showControls={true}
                                />
                            </div>
                            <p className="text-gray-700 mb-2">
                                Carregamento otimizado com placeholders, preload e transições suaves.
                            </p>
                            <RenderTimeMonitor id="optimized-image" />
                        </div>
                    </div>
                </section>

                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Carregamento de Componentes</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md" id="traditional-component">
                            <h3 className="text-xl font-bold mb-4">Carregamento Tradicional</h3>
                            <HeavyComponent />
                            <RenderTimeMonitor id="traditional-component" />
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md" id="dynamic-component">
                            <h3 className="text-xl font-bold mb-4">Carregamento Dinâmico</h3>
                            <DynamicComponentLoader
                                componentName="HeavyComponent"
                                importFunc={() => Promise.resolve({ default: HeavyComponent })}
                                loadImmediately={false}
                                minHeight="300px"
                            />
                            <RenderTimeMonitor id="dynamic-component" />
                        </div>
                    </div>
                </section>

                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Cards de Imóveis</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md" id="traditional-card">
                            <h3 className="text-xl font-bold mb-4">Card Tradicional</h3>
                            <ImovelCard
                                imovel={DEMO_PROPERTY}
                            />
                            <RenderTimeMonitor id="traditional-card" />
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md" id="optimized-card">
                            <h3 className="text-xl font-bold mb-4">Card Otimizado</h3>
                            <OptimizedImovelCard
                                imovel={DEMO_PROPERTY}
                                imagensAdicionais={DEMO_IMAGES.map(url => ({ url }))}
                                showGallery={true}
                            />
                            <RenderTimeMonitor id="optimized-card" />
                        </div>
                    </div>
                </section>

                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Carregamento de Scripts</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-4">Scripts Tradicionais</h3>
                            <p className="text-gray-700 mb-4">
                                Carregamento de scripts sem priorização ou estratégias específicas.
                            </p>
                            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                                {`<script src="https://analytics.example.com/script.js"></script>
<script src="https://maps.example.com/api.js"></script>
<script src="https://chat.example.com/widget.js"></script>`}
                            </pre>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-4">Scripts Otimizados</h3>
                            <p className="text-gray-700 mb-4">
                                Carregamento progressivo com prioridades baseadas na importância.
                            </p>
                            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                                {`<ThirdPartyScriptLoader scripts={[
  {
    id: 'maps-api',
    src: 'https://maps.example.com/api.js',
    priority: 'high'
  },
  {
    id: 'analytics',
    src: 'https://analytics.example.com/script.js',
    priority: 'medium',
    strategy: 'lazyOnload'
  },
  {
    id: 'chat-widget',
    src: 'https://chat.example.com/widget.js',
    priority: 'low',
    strategy: 'worker'
  }
]} />`}
                            </pre>

                            {/* Carrega os scripts demonstrativos não-bloqueantes */}
                            <ThirdPartyScriptLoader scripts={[
                                {
                                    id: 'demo-script-1',
                                    src: 'https://polyfill.io/v3/polyfill.min.js',
                                    priority: 'high',
                                }
                            ]} />
                        </div>
                    </div>
                </section>

                <section className="bg-emerald-50 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-emerald-800 mb-4">
                        Resumo das Otimizações
                    </h2>
                    <ul className="list-disc pl-6 text-emerald-700 space-y-2">
                        <li><strong>CSS Crítico</strong> - Renderização rápida do conteúdo acima da dobra</li>
                        <li><strong>Carregamento Progressivo</strong> - JavaScript e recursos carregados por prioridade</li>
                        <li><strong>Otimização de Imagens</strong> - Placeholders, dimensões fixas, formatos modernos</li>
                        <li><strong>Métricas de Performance</strong> - Rastreamento e análise de Web Vitals</li>
                        <li><strong>Preconexões</strong> - Conexões antecipadas para domínios externos</li>
                        <li><strong>Chunking</strong> - Bundle splitting para reduzir o tamanho inicial de JavaScript</li>
                    </ul>

                    <div className="mt-8">
                        <Link href="/PERFORMANCE-GUIDE.md" className="text-emerald-700 font-medium hover:text-emerald-800">
                            Ver Guia Completo de Performance →
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
