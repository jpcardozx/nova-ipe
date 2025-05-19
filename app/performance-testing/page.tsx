import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamic imports for performance testing components
const PerformanceDiagnostic = dynamic(() => import('../components/PerformanceDiagnostic'), {
    ssr: false
});

const PerformanceVerification = dynamic(() => import('../components/PerformanceVerification'), {
    ssr: false
});

const CoreWebVitalsTracker = dynamic(() => import('../components/CoreWebVitalsTracker'), {
    ssr: false
});

export const metadata = {
    title: 'Verificação de Performance | Nova IPE',
    description: 'Painel de verificação das otimizações de performance do site Nova IPE',
};

/**
 * Página de teste e verificação de performance
 * 
 * Esta página permite visualizar e validar todas as otimizações implementadas
 * para resolver os problemas críticos de performance do site.
 */
export default function PerformanceTestingPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-20">
            <div className="max-w-6xl mx-auto px-6">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h1 className="text-3xl font-bold mb-2">Verificação de Performance</h1>
                    <p className="text-gray-600 mb-8">
                        Esta página permite avaliar e verificar as melhorias de performance implementadas
                        para resolver os problemas críticos do site Nova IPE.
                    </p>

                    {/* Current Metrics vs Baseline */}
                    <div className="mb-10">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Comparação de Métricas</h2>
                        <div className="mb-6">
                            <h3 className="font-medium mb-2">Problemas Originais:</h3>
                            <ul className="list-disc pl-6 text-gray-700 space-y-1">
                                <li>LCP (Largest Contentful Paint): <span className="text-red-600 font-medium">78056ms</span> (ideal: &lt;2500ms)</li>
                                <li>Thread main bloqueada: <span className="text-red-600 font-medium">57778ms</span></li>
                                <li>Recursos lentos: páginas "alugar" e "comprar" (~6860ms cada)</li>
                                <li>Pacote lucide-react causando bloqueio de renderização (4320ms)</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-medium mb-2">Otimizações Implementadas:</h3>
                            <ul className="list-disc pl-6 text-gray-700 space-y-1">
                                <li>Virtualização para renderização eficiente de listas de propriedades</li>
                                <li>Carregamento otimizado de ícones para resolver problemas com Lucide-React</li>
                                <li>Páginas ultra-otimizadas para alugar/comprar</li>
                                <li>CSS crítico para melhorar LCP</li>
                                <li>Web Workers para processamento pesado fora da thread principal</li>
                                <li>Imagens super otimizadas com carregamento progressivo</li>
                                <li>Carregador de módulos progressivo para imports dinâmicos</li>
                                <li>Prefetching de dados no servidor para melhorar tempo de resposta</li>
                                <li>Suspense boundaries estratégicos para melhor UX durante carregamento</li>
                                <li>Suporte offline/PWA para melhorar experiência em conexões instáveis</li>
                            </ul>
                        </div>
                    </div>

                    {/* Test Links */}
                    <div className="mb-10">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Links para Teste</h2>
                        <p className="text-gray-600 mb-4">
                            Acesse as páginas abaixo para verificar as melhorias de performance:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link href="/alugar" className="block p-4 bg-green-50 border border-green-100 rounded-lg hover:bg-green-100 transition-colors">
                                <h3 className="font-medium text-green-800 mb-1">Página Alugar Otimizada</h3>
                                <p className="text-sm text-green-700">
                                    Implementa virtualização, CSS crítico e prefetching de dados
                                </p>
                            </Link>

                            <Link href="/comprar" className="block p-4 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors">
                                <h3 className="font-medium text-blue-800 mb-1">Página Comprar Otimizada</h3>
                                <p className="text-sm text-blue-700">
                                    Implementa virtualização, CSS crítico e prefetching de dados
                                </p>
                            </Link>

                            <Link href="/offline" className="block p-4 bg-orange-50 border border-orange-100 rounded-lg hover:bg-orange-100 transition-colors">
                                <h3 className="font-medium text-orange-800 mb-1">Página Offline</h3>
                                <p className="text-sm text-orange-700">
                                    Página de fallback para experiência offline/PWA
                                </p>
                            </Link>

                            <Link href="/performance-testing?show-vitals-history=true" className="block p-4 bg-purple-50 border border-purple-100 rounded-lg hover:bg-purple-100 transition-colors">
                                <h3 className="font-medium text-purple-800 mb-1">Histórico de Web Vitals</h3>
                                <p className="text-sm text-purple-700">
                                    Exibe histórico de medições Web Vitals para análise de tendências
                                </p>
                            </Link>
                        </div>
                    </div>

                    {/* Monitoring Instructions */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Instruções para Monitoramento</h2>
                        <p className="text-gray-600 mb-4">
                            Use as seguintes URL parameters para habilitar recursos de diagnóstico:
                        </p>

                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>
                                <code className="bg-gray-100 px-2 py-1 rounded">?debug-performance=true</code>
                                <span className="ml-2">- Exibe métricas detalhadas de performance</span>
                            </li>
                            <li>
                                <code className="bg-gray-100 px-2 py-1 rounded">?show-vitals-history=true</code>
                                <span className="ml-2">- Exibe histórico de Core Web Vitals</span>
                            </li>
                            <li>
                                <code className="bg-gray-100 px-2 py-1 rounded">?validate-optimization=true</code>
                                <span className="ml-2">- Exibe comparação antes/depois das otimizações</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Monitoring Components */}
            <Suspense fallback={null}>
                <PerformanceDiagnostic />
            </Suspense>

            <Suspense fallback={null}>
                <PerformanceVerification />
            </Suspense>

            <Suspense fallback={null}>
                <CoreWebVitalsTracker />
            </Suspense>
        </div>
    );
}
