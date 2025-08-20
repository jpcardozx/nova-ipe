"use client";
import { Suspense } from "react";
import ImovelDetalhesModular from "./ImovelDetalhesModular";

// Componente de proteção contra undefined
function ComponentGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
    if (children === undefined || children === null) {
        console.error('🚨 ComponentGuard: Componente undefined detectado!');
        return fallback || <div>Erro: Componente não disponível</div>;
    }
    return <>{children}</>;
}

export default function ImovelDetalhesClient(props: any) {
    // Verificação de props
    if (!props || typeof props !== 'object') {
        console.error('🚨 ImovelDetalhesClient: Props inválidas recebidas:', props);
        return <div>Erro: Dados do imóvel não disponíveis</div>;
    }

    // Verificação do componente ImovelDetalhesModular
    if (typeof ImovelDetalhesModular !== 'function') {
        console.error('🚨 ImovelDetalhesModular não é uma função válida:', typeof ImovelDetalhesModular);
        return <div>Erro: Componente ImovelDetalhesModular não disponível</div>;
    }

    return (
        <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                <p className="text-slate-600">Carregando detalhes do imóvel...</p>
            </div>
        </div>}>
            <ComponentGuard>
                <ImovelDetalhesModular {...props} />
            </ComponentGuard>
        </Suspense>
    );
}
