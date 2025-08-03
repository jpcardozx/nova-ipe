import React, { Suspense } from 'react';
import UnifiedLoading from './UnifiedLoading';

// Simple safe component wrapper
const SafeComponent = ({ children }: { children: React.ReactNode }) => {
    try {
        return <>{children}</>;
    } catch (error) {
        console.error('Component error:', error);
        return <div>Erro ao carregar componente</div>;
    }
};

/**
 * Adaptador cliente para componentes de servidor de propriedades
 * Resolve o problema de renderização de Server Components dentro de Client Components
 */

// Adaptador para PropertiesSale
export function PropertiesSaleAdapter() {
    return (
        <SafeComponent>
            <Suspense fallback={<UnifiedLoading height="600px" title="Carregando imóveis em destaque..." />}>
                {/* O conteúdo real é renderizado pela página principal - não pelo client component */}
                <div id="properties-sale-container" className="w-full">
                    {/* Espaço reservado para o conteúdo do servidor */}
                </div>
            </Suspense>
        </SafeComponent>
    );
}

// Adaptador para PropertiesRental
export function PropertiesRentalAdapter() {
    return (
        <SafeComponent>
            <Suspense fallback={<UnifiedLoading height="600px" title="Carregando imóveis para aluguel..." />}>
                {/* O conteúdo real é renderizado pela página principal - não pelo client component */}
                <div id="properties-rental-container" className="w-full">
                    {/* Espaço reservado para o conteúdo do servidor */}
                </div>
            </Suspense>
        </SafeComponent>
    );
}

export default PropertiesSaleAdapter;