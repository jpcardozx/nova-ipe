import React from 'react';
// Versão da página principal que deve ser incluída no page.tsx (Server Component)
// Este arquivo deve ser incorporado ao page.tsx existente

// Imports de Server Components para propriedades
import { PropertiesSale, PropertiesRental } from './PropertyShowcaseServer';
import { Suspense } from 'react';
import { UnifiedLoading } from '../ui/UnifiedComponents';

// Adicionar dentro da função principal de página:
// Substitua a seção de propriedades no arquivo page.tsx por este código

{/* === SHOWCASE DE IMÓVEIS === */ }
<div className="py-16">
    {/* Seção de imóveis para venda */}
    <section id="properties-sale-container">
        <Suspense fallback={<UnifiedLoading variant="property" height="600px" title="Carregando imóveis em destaque..." />}>
            <PropertiesSale />
        </Suspense>
    </section>

    {/* Seção de imóveis para aluguel */}
    <section id="properties-rental-container">
        <Suspense fallback={<UnifiedLoading variant="property" height="600px" title="Carregando imóveis para aluguel..." />}>
            <PropertiesRental />
        </Suspense>
    </section>
</div>
