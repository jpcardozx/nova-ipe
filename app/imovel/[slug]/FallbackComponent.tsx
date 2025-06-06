"use client";

import React from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import type { ImovelClient as ImovelDataType } from '../../../src/types/imovel-client';

interface FallbackProps {
    message?: string;
    error?: Error;
    slug?: string;
    imovel?: ImovelDataType;
}

/**
 * Componente de fallback para casos onde o componente principal falha
 */
export default function FallbackComponent({
    message = "Não foi possível carregar o conteúdo",
    error,
    slug,
    imovel
}: FallbackProps) {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-red-600 mb-4">
                    {message}
                </h1>

                {error && (
                    <div className="p-4 bg-red-50 rounded mb-6 border border-red-200">
                        <p className="font-medium">Erro: {error.message}</p>
                        {process.env.NODE_ENV === 'development' && (
                            <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-800 text-white rounded">
                                {error.stack}
                            </pre>
                        )}
                    </div>
                )}

                <div className="space-y-4">
                    {imovel && (
                        <div>
                            <h2 className="text-xl font-semibold">{imovel.titulo}</h2>
                            <p className="text-gray-600">{imovel.bairro}, {imovel.cidade}</p>
                        </div>
                    )}

                    <div className="flex space-x-4 mt-6">
                        <Link
                            href="/"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Voltar para a página inicial
                        </Link>

                        <Link
                            href="/imoveis"
                            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
                        >
                            Ver outros imóveis
                        </Link>
                    </div>

                    {slug && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Referência: {slug}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
