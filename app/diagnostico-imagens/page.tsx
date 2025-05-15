'use client';

import React, { useEffect, useState } from 'react';
import { printImageDiagnostics } from '@/lib/image-diagnostics';

export default function ImageDiagnosticsPage() {
    const [diagnosticsRun, setDiagnosticsRun] = useState(false);
    const [imageIssues, setImageIssues] = useState<any[]>([]);

    useEffect(() => {
        // Output diagnostics to console
        printImageDiagnostics();
        setDiagnosticsRun(true);

        // Check for any recorded issues
        if (typeof window !== 'undefined' && window.__imageIssues) {
            setImageIssues(window.__imageIssues);
        }
    }, []);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Diagnóstico de Imagens</h1>

            <div className="bg-amber-100 p-4 rounded-lg mb-6">
                <p className="text-amber-800">
                    Esta página exibe estatísticas de diagnóstico para ajudar a detectar problemas com imagens.
                    <br />
                    Para dados detalhados, verifique o console do navegador.
                </p>
            </div>

            {diagnosticsRun && (
                <div className="bg-green-100 p-4 rounded-lg mb-8">
                    <p className="text-green-800">
                        ✅ Diagnóstico executado com sucesso. Veja os detalhes no console.
                    </p>
                </div>
            )}

            {imageIssues.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Problemas Detectados</h2>
                    <p className="mb-4">Foram encontrados {imageIssues.length} problemas com imagens:</p>

                    <div className="bg-white shadow overflow-hidden rounded-lg">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Timestamp
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Alt Text
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Propriedades
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {imageIssues.slice(0, 10).map((issue, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {issue.timestamp}
                                        </td>
                                        <td className="px-6 py-4">
                                            {issue.image?.alt || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {Object.keys(issue.image || {}).join(', ')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {imageIssues.length > 10 && (
                        <p className="mt-4 text-gray-600">
                            Exibindo 10 de {imageIssues.length} problemas.
                        </p>
                    )}
                </div>
            )}

            <div className="bg-gray-100 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Informações de Implementação</h2>
                <div className="space-y-4">
                    <p>
                        Implementamos correções robustas para lidar com múltiplos formatos de imagem:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Correção das <strong>queries GROQ</strong> para incluir <code>asset</code> e <code>_type</code> nos campos de imagem</li>
                        <li>Aprimoramento do <strong>mapImovelToClient</strong> para reconstruir objetos de imagem incompletos</li>
                        <li>Reforço do <strong>PropertyProcessor</strong> com múltiplas estratégias de recuperação de imagens</li>
                        <li>Adição de <strong>diagnósticos avançados</strong> para identificar problemas com imagens</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
