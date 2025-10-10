/**
 * Wrapper client para o catálogo - Versão Simplificada (SEM SEARCH)
 * Foco em filtros visuais e apresentação limpa
 */

'use client';

import { useEffect } from 'react';
import CatalogHeroOptimized from '../../components/CatalogHeroOptimized';
import ModularCatalog from './ModularCatalog';
import { useUserAnalytics } from '../../hooks/useUserAnalytics';

interface CatalogWrapperProps {
    properties: any[];
}

export default function CatalogWrapper({ properties }: CatalogWrapperProps) {
    const analytics = useUserAnalytics();
    
    useEffect(() => {
        analytics.trackAction({
            type: 'view',
            data: { page: 'catalog', totalProperties: properties.length }
        });
    }, [analytics, properties.length]);

    return (
        <>
            <CatalogHeroOptimized 
                totalProperties={properties.length}
            />
            <ModularCatalog 
                properties={properties}
            />
        </>
    );
}
