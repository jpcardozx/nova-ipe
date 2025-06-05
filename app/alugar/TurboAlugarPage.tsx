'use client';

import { getImoveisParaAlugar } from '@lib/sanity/fetchImoveis';
import ProfessionalPropertyPage from '../components/ProfessionalPropertyPage';
import type { ImovelClient } from '../../src/types/imovel-client';
import { useEffect } from 'react';

interface TurboAlugarPageProps {
    preloadedProperties?: ImovelClient[];
}

/**
 * TurboAlugarPage - Professional version with enhanced UX
 * 
 * Features:
 * - Professional design system with consistent color palette
 * - Enhanced search and filtering capabilities for rental properties
 * - Optimized loading states and error handling
 * - Responsive grid and list view modes
 * - Improved accessibility and animations
 */
export default function TurboAlugarPage({ preloadedProperties }: TurboAlugarPageProps) {
    // Create fetch function that returns the preloaded properties or fetches them
    const fetchFunction = async (): Promise<ImovelClient[]> => {
        if (preloadedProperties) {
            return preloadedProperties;
        }
        return await getImoveisParaAlugar();
    };

    // Log performance info in development
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            if (preloadedProperties) {
                console.log(`[Performance] Using ${preloadedProperties.length} preloaded rental properties from server`);
            } else {
                console.log('[Performance] No preloaded rental data available, fetching on client');
            }
        }
    }, [preloadedProperties]);

    return (
        <ProfessionalPropertyPage
            pageTitle="Imóveis para Alugar"
            pageDescription="Encontre o imóvel ideal para alugar em Guararema e região com excelente localização, segurança e ótimo custo-benefício."
            fetchPropertiesFunction={fetchFunction}
            propertyType="rent"
        />
    );
}
