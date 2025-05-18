// app/test-tailwind/page.tsx - Atualizado 17/05/2025 para Tailwind v4
"use client";

import { useEffect, useState } from 'react';
import TailwindTest from '../components/TailwindTest';
import TailwindDiagnostic from '../components/TailwindDiagnostic';
import TailwindV4Test from '../components/TailwindV4Test';

export default function TestTailwind() {
    const [status, setStatus] = useState({
        tailwindVersion: '',
        postCssVersion: '',
        nextVersion: '',
        loaded: false
    });

    useEffect(() => {
        // Obtendo as versões instaladas
        const getTailwindVersion = async () => {
            try {
                const tw = await import('tailwindcss/package.json');
                const postcss = await import('postcss/package.json');
                const next = await import('next/package.json');

                setStatus({
                    tailwindVersion: tw.version,
                    postCssVersion: postcss.version,
                    nextVersion: next.version,
                    loaded: true
                });
            } catch (error) {
                console.error('Erro ao carregar versões:', error);
            }
        };

        getTailwindVersion();
    }, []);

    return (
        <div className="p-10">
            <h1 className="text-blue-500 text-4xl mb-4">Tailwind Test Page</h1>
            <p className="text-gray-700 mb-6">Esta página testa se o Tailwind CSS está funcionando corretamente.</p>

            {status.loaded ? (
                <div className="bg-green-100 p-4 rounded mb-6">
                    <p className="font-bold">Versões instaladas:</p>
                    <ul className="list-disc pl-5">
                        <li>Tailwind CSS: v{status.tailwindVersion}</li>
                        <li>PostCSS: v{status.postCssVersion}</li>
                        <li>Next.js: v{status.nextVersion}</li>
                    </ul>
                </div>
            ) : (
                <div className="bg-yellow-100 p-4 rounded mb-6">
                    <p>Carregando informações das versões...</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-red-200 p-4 rounded">Caixa Vermelha</div>
                <div className="bg-green-200 p-4 rounded">Caixa Verde</div>
                <div className="bg-blue-200 p-4 rounded">Caixa Azul</div>
            </div>

            <button className="mb-6 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                Botão de Teste
            </button>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">⚠️ Nota sobre Tailwind v4</h3>
                <p className="text-amber-700 mb-2">
                    Você está usando o Tailwind v4, que tem mudanças importantes na sintaxe:
                </p>
                <ul className="list-disc pl-5 text-amber-700 mb-2">
                    <li>Use <code className="bg-amber-100 px-1 rounded">@import "tailwindcss/preflight"</code> em vez de <code className="bg-amber-100 px-1 rounded">@tailwind base</code></li>
                    <li>A diretiva <code className="bg-amber-100 px-1 rounded">@tailwind components</code> foi removida</li>
                </ul>
                <p className="text-amber-700 text-sm">
                    Para mais detalhes, consulte o arquivo <a href="#" className="text-blue-600 underline">TAILWIND-V4-GUIA.md</a> na raiz do projeto.
                </p>
            </div>

            <div className="border-t pt-6">
                <h2 className="text-2xl font-bold mb-4">Componente de Teste para Tailwind v4</h2>
                <TailwindV4Test />

                <h2 className="text-2xl mb-4 mt-8">Diagnóstico do Tailwind</h2>
                <TailwindDiagnostic />

                <h2 className="text-2xl mb-4 mt-8">Componente de Teste</h2>
                <TailwindTest />
            </div>
        </div>
    );
}