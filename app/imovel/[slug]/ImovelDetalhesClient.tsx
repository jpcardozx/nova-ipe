"use client";
import { Suspense } from "react";
import ImovelDetalhesNew from "./ImovelDetalhesNew";

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

    // Verificação do componente ImovelDetalhesNew
    if (typeof ImovelDetalhesNew !== 'function') {
        console.error('🚨 ImovelDetalhesNew não é uma função válida:', typeof ImovelDetalhesNew);
        return <div>Erro: Componente ImovelDetalhesNew não disponível</div>;
    }

    return (
        <Suspense fallback={<div>Carregando detalhes do imóvel...</div>}>
            <ComponentGuard>
                <ImovelDetalhesNew {...props} />
            </ComponentGuard>
        </Suspense>
    );
}
