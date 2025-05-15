'use client';

import React, { useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Componente de redirecionamento para a nova versão do site
 * - Redireciona automaticamente para a nova página após um curto delay
 * - Fornece opção para usuários irem diretamente para a nova página
 * - Mantém opção de voltar para a versão antiga se necessário
 */
export default function RedirectPage() {
    const router = useRouter(); useEffect(() => {
        // Registra a visita no localStorage para controle
        localStorage.setItem('saw_redirect_page', 'true');

        // Redireciona automaticamente depois de um curto período
        const timer = setTimeout(() => {
            router.push('/');  // Redirecionamos para a página inicial em vez da página aprimorada
        }, 3500);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-white">
            <div className="max-w-lg w-full p-8 bg-white rounded-xl shadow-lg text-center">
                <div className="mb-6">
                    <img
                        src="/images/logo-ipe.png"
                        alt="Ipê Imobiliária"
                        className="h-16 mx-auto"
                    />
                </div>

                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                    Bem-vindo à nova versão da Ipê Imobiliária
                </h1>

                <p className="text-gray-600 mb-8">
                    Desenvolvemos uma experiência mais moderna para você encontrar seu imóvel ideal em Guararema. Redirecionando automaticamente em instantes...
                </p>                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                    <Link
                        href="/"
                        className="w-full sm:w-auto px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
                    >
                        Ir para nova versão agora
                    </Link>

                    <Link
                        href="/versao-anterior"
                        className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Continuar na versão anterior
                    </Link>
                </div>

                <div className="mt-8">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-amber-600 h-1.5 rounded-full animate-progress"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
