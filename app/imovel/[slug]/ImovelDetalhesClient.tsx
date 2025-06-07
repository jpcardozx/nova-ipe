"use client";
import { Suspense } from "react";
import ImovelDetalhes from "./ImovelDetalhes";

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

    // Verificação do componente ImovelDetalhes
    if (typeof ImovelDetalhes !== 'function') {
        console.error('🚨 ImovelDetalhes não é uma função válida:', typeof ImovelDetalhes);
        return <div>Erro: Componente ImovelDetalhes não disponível</div>;
    }

    return (
        <Suspense fallback={<div>Carregando detalhes do imóvel...</div>}>
            <ComponentGuard>
                <ImovelDetalhes {...props} />
            </ComponentGuard>
        </Suspense>
    );
}
