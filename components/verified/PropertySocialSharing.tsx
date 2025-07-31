'use client';

/**
 * PropertySocialSharing.tsx
 * 
 * Componente para otimizar o compartilhamento de imóveis específicos.
 * @version 1.0.0
 * @date 21/05/2025
 */

import { useEffect } from 'react';
import WhatsAppSharingOptimizer from './WhatsAppSharingOptimizer';

interface PropertySocialSharingProps {
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    location: string;
    pageUrl?: string;
}

/**
 * Componente que otimiza o compartilhamento de páginas de imóveis individuais
 */
export default function PropertySocialSharing({
    title,
    description,
    imageUrl,
    price,
    location,
    pageUrl
}: PropertySocialSharingProps) {
    // Formatação de preço em BRL
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);

    // Título e descrição aprimorados para o WhatsApp
    const optimizedTitle = `${title} | ${formattedPrice}`;

    // Descrição otimizada: localização + início da descrição original
    const optimizedDescription = `${location} - ${description.substring(0, 150)}${description.length > 150 ? '...' : ''}`;

    return (
        <WhatsAppSharingOptimizer
            title={optimizedTitle}
            description={optimizedDescription}
            imageUrl={imageUrl}
            pageUrl={pageUrl}
        />
    );
}

