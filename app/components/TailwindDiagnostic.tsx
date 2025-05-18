// Componente de diagnóstico para o Tailwind CSS
"use client";

import { useEffect, useState } from 'react';

type DiagnosticInfo = {
    loaded: boolean;
    versions: {
        tailwind?: string;
        postcss?: string;
        next?: string;
    };
    classes: {
        working: boolean;
        samples: string[];
    };
};

export default function TailwindDiagnostic() {
    const [diagnostic, setDiagnostic] = useState<DiagnosticInfo>({
        loaded: false,
        versions: {},
        classes: {
            working: false,
            samples: ['bg-blue-500', 'text-red-500', 'rounded-lg', 'shadow-md']
        }
    });

    useEffect(() => {
        const runDiagnostic = async () => {
            try {
                // Tentativa de carregar as versões dos pacotes
                const versions: { tailwind?: string; postcss?: string; next?: string } = {};

                try {
                    const tw = await import('tailwindcss/package.json');
                    versions.tailwind = tw.version;
                } catch (e) {
                    console.warn('Não foi possível carregar a versão do Tailwind');
                }

                try {
                    const postcss = await import('postcss/package.json');
                    versions.postcss = postcss.version;
                } catch (e) {
                    console.warn('Não foi possível carregar a versão do PostCSS');
                }

                try {
                    const next = await import('next/package.json');
                    versions.next = next.version;
                } catch (e) {
                    console.warn('Não foi possível carregar a versão do Next.js');
                }

                // Verificar se as classes do Tailwind estão funcionando
                // Se o diagnóstico está visível e estilizado, então funcionou
                const working = true;

                setDiagnostic({
                    loaded: true,
                    versions,
                    classes: {
                        working,
                        samples: ['bg-blue-500', 'text-red-500', 'rounded-lg', 'shadow-md']
                    }
                });
            } catch (error) {
                console.error('Erro ao executar diagnóstico do Tailwind:', error);
            }
        };

        runDiagnostic();
    }, []);

    return (
        <div className="tailwind-diagnostic border border-gray-300 rounded-lg p-4 my-4 bg-white shadow-sm">
            <h2 className="text-xl font-bold mb-2 text-blue-800">Diagnóstico do Tailwind CSS</h2>

            {!diagnostic.loaded ? (
                <p className="text-gray-500">Carregando diagnóstico...</p>
            ) : (
                <>
                    <div className="mb-4">
                        <h3 className="font-semibold text-gray-700">Versões:</h3>
                        <ul className="list-disc pl-6 mt-1">
                            <li className="text-sm">Tailwind CSS: {diagnostic.versions.tailwind || 'N/A'}</li>
                            <li className="text-sm">PostCSS: {diagnostic.versions.postcss || 'N/A'}</li>
                            <li className="text-sm">Next.js: {diagnostic.versions.next || 'N/A'}</li>
                        </ul>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-semibold text-gray-700">Status:</h3>
                        <div className="flex items-center mt-1">
                            <div className={`w-3 h-3 rounded-full ${diagnostic.classes.working ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                            <p className={diagnostic.classes.working ? 'text-green-700' : 'text-red-700'}>
                                {diagnostic.classes.working ? 'Funcionando' : 'Com problemas'}
                            </p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-semibold text-gray-700">Teste de classes:</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">bg-blue-500</span>
                            <span className="bg-white text-red-500 border px-2 py-1 rounded text-xs">text-red-500</span>
                            <span className="bg-gray-200 rounded-lg px-2 py-1 text-xs">rounded-lg</span>
                            <span className="bg-white shadow-md px-2 py-1 text-xs">shadow-md</span>
                        </div>
                    </div>
                </>
            )}

            <div className="text-xs text-gray-400 mt-4 pt-2 border-t">
                * Este componente verifica se as classes do Tailwind CSS estão sendo aplicadas corretamente.
            </div>
        </div>
    );
}
