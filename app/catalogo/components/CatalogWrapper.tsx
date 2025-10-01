/**
 * Wrapper client para o catálogo - Versão Modular
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import CatalogHeroOptimized from '../../components/CatalogHeroOptimized';
import ModularCatalog from './ModularCatalog';
import { useUserAnalytics } from '../../hooks/useUserAnalytics';

interface CatalogWrapperProps {
    properties: any[];
}

export default function CatalogWrapper({ properties }: CatalogWrapperProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const analytics = useUserAnalytics();
    
    useEffect(() => {
        analytics.trackAction({
            type: 'view',
            data: { page: 'catalog', totalProperties: properties.length }
        });
    }, [analytics, properties.length]);

    const filteredProperties = useMemo(() => {
        if (!searchQuery.trim()) return properties;
        
        const query = searchQuery.toLowerCase();
        return properties.filter(property => 
            property.titulo?.toLowerCase().includes(query) ||
            property.endereco?.toLowerCase().includes(query) ||
            property.bairro?.toLowerCase().includes(query) ||
            property.cidade?.toLowerCase().includes(query) ||
            property.tipo?.toLowerCase().includes(query)
        );
    }, [properties, searchQuery]);
    
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        analytics.trackSearch(query, {}, filteredProperties.length);
    };

    return (
        <>
            <CatalogHeroOptimized 
                totalProperties={filteredProperties.length}
                onSearch={handleSearch}
            />
            <ModularCatalog 
                properties={filteredProperties}
                onSearch={handleSearch}
            />
        </>
    );
}
