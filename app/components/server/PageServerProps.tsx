import React from 'react';
// Enhanced Server Components version using PremiumPropertyCatalog
// This file demonstrates how to use the premium property catalog system in server components

// Imports of Premium Server Components for properties
import { PropertiesSale, PropertiesRental } from './PropertyShowcaseServer';
import { Suspense } from 'react';
import { UnifiedLoading } from '../ui/UnifiedComponents';

// Example integration for server-side property sections
// Replace property sections in page.tsx with this premium approach

{/* === PREMIUM PROPERTY SHOWCASE === */ }
<div className="py-16 space-y-16">
    {/* Premium property sections with enhanced design */}
    <section id="properties-sale-container" className="relative">
        <Suspense fallback={
            <UnifiedLoading
                variant="property"
                height="600px"
                title="Carregando imóveis premium para venda..."
            />
        }>
            <PropertiesSale />
        </Suspense>
    </section>

    {/* Premium rental properties section */}
    <section id="properties-rental-container" className="relative">
        <Suspense fallback={
            <UnifiedLoading
                variant="property"
                height="600px"
                title="Carregando imóveis premium para aluguel..."
            />
        }>
            <PropertiesRental />
        </Suspense>
    </section>
</div>
