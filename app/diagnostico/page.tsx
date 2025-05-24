/**
 * Página de Ferramentas de Diagnóstico
 * 
 * Central para acessar as ferramentas de diagnóstico da aplicação
 */

import Link from 'next/link';

export default function DiagnosticoTools() {
    return (
        <div className="min-h-screen bg-neutral-50 p-8 flex flex-col items-center">
            <main className="max-w-3xl w-full flex-1 bg-white shadow-md rounded-xl p-8 border border-neutral-200">
                <h1 className="text-3xl font-bold text-primary-700 mb-6">
                    Ferramentas de Diagnóstico
                </h1>

                <p className="text-neutral-600 mb-10">
                    Utilize estas ferramentas para diagnosticar e resolver problemas de performance,
                    compatibilidade e PWA na aplicação.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 hover:border-primary-300 transition-colors">
                        <h2 className="text-xl font-semibold mb-3 text-primary-700">Diagnóstico de PWA</h2>
                        <p className="text-neutral-600 mb-4">
                            Verifica o status do service worker, manifest.json e capacidades de instalação.
                        </p>
                        <Link
                            href="/pwa-diagnostico"
                            className="inline-block px-5 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 transition-colors"
                        >
                            Acessar ferramenta
                        </Link>
                    </div>

                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 hover:border-primary-300 transition-colors">
                        <h2 className="text-xl font-semibold mb-3 text-primary-700">Diagnóstico de MIME Types</h2>
                        <p className="text-neutral-600 mb-4">
                            Verifica se os MIME types estão configurados corretamente para JavaScript, CSS e outros recursos.
                        </p>
                        <Link
                            href="/mime-diagnostico"
                            className="inline-block px-5 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 transition-colors"
                        >
                            Acessar ferramenta
                        </Link>
                    </div>

                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 hover:border-primary-300 transition-colors">
                        <h2 className="text-xl font-semibold mb-3 text-primary-700">Modo Offline</h2>
                        <p className="text-neutral-600 mb-4">
                            Testa o funcionamento da aplicação em modo offline com o Service Worker.
                        </p>
                        <Link
                            href="/offline"
                            className="inline-block px-5 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 transition-colors"
                        >
                            Acessar ferramenta
                        </Link>
                    </div>

                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 hover:border-primary-300 transition-colors">
                        <h2 className="text-xl font-semibold mb-3 text-primary-700">Performance Analytics</h2>
                        <p className="text-neutral-600 mb-4">
                            Analisa métricas de Core Web Vitals e performance da aplicação.
                        </p>
                        <Link
                            href="/performance-analytics"
                            className="inline-block px-5 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 transition-colors"
                        >
                            Acessar ferramenta
                        </Link>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-neutral-200">
                    <Link href="/" className="text-primary-600 hover:text-primary-800 transition-colors">
                        &larr; Voltar para a página inicial
                    </Link>
                </div>
            </main>
        </div>
    );
}
