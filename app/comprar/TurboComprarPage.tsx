'use client';

import { getImoveisParaVenda } from '@lib/sanity/fetchImoveis';
import ProfessionalPropertyPage from '../components/ProfessionalPropertyPage';
import type { ImovelClient } from '../../src/types/imovel-client';
import { useState, useEffect } from 'react';

interface TurboComprarPageProps {
    preloadedProperties?: ImovelClient[];
}

/**
 * TurboComprarPage - Professional version with enhanced UX
 * 
 * Features:
 * - Professional design system with consistent color palette
 * - Enhanced search and filtering capabilities
 * - Optimized loading states and error handling
 * - Responsive grid and list view modes
 * - Improved accessibility and animations
 */
export default function TurboComprarPage({ preloadedProperties }: TurboComprarPageProps) {
    // Create fetch function that returns the preloaded properties or fetches them
    const fetchFunction = async (): Promise<ImovelClient[]> => {
        if (preloadedProperties) {
            return preloadedProperties;
        }
        return await getImoveisParaVenda();
    };

    // Log performance info in development
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            if (preloadedProperties) {
                console.log(`[Performance] Using ${preloadedProperties.length} preloaded properties from server`);
            } else {
                console.log('[Performance] No preloaded data available, fetching on client');
            }
        }
    }, [preloadedProperties]);

    return (
        <ProfessionalPropertyPage
            pageTitle="Imóveis à Venda"
            pageDescription="Encontre o imóvel dos seus sonhos para comprar em Guararema e região com excelente valorização e localização premium."
            fetchPropertiesFunction={fetchFunction}
            propertyType="sale"
        />
    );
}