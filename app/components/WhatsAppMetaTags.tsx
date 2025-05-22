'use client';

/**
 * WhatsAppMetaTags.tsx
 * Componente que adiciona meta tags específicas para WhatsApp
 * @version 1.0.0
 * @date 21/05/2025
 */

import { useEffect } from 'react';
import Head from 'next/head';

interface WhatsAppMetaTagsProps {
    title?: string;
    description?: string;
    imageUrl?: string;
    url?: string;
}

/**
 * Componente que adiciona meta tags específicas para compatibilidade com WhatsApp
 * Adiciona tags direto no head para garantir que o WhatsApp as reconheça corretamente
 */
export default function WhatsAppMetaTags({
    title = 'Nova Ipê Imobiliária - Imóveis Premium em Guararema',
    description = 'Encontre propriedades exclusivas para compra e aluguel em Guararema e região. Atendimento personalizado e curadoria de imóveis de alto padrão.',
    imageUrl = '/images/og-image-whatsapp.jpg', // Usando a imagem específica para WhatsApp
    url,
}: WhatsAppMetaTagsProps) {
    // Determinar a URL absoluta da imagem
    const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://ipeimoveis.vercel.app';
    const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${domain}${imageUrl}`;
    const pageUrl = url || domain;

    useEffect(() => {
        // Adicionar tags diretamente ao head para maior compatibilidade com WhatsApp
        const insertMetaTags = () => {
            // Garantir que metadados antigos não persistam
            const existingTags = document.querySelectorAll('meta[data-whatsapp-meta="true"]');
            existingTags.forEach(tag => tag.remove());

            // Função auxiliar para criar e inserir meta tags
            const createMetaTag = (property: string, content: string) => {
                const tag = document.createElement('meta');
                tag.setAttribute('property', property);
                tag.setAttribute('content', content);
                tag.setAttribute('data-whatsapp-meta', 'true');
                document.head.appendChild(tag);
            };            // Adicionar todas as meta tags necessárias
            createMetaTag('og:title', title);
            createMetaTag('og:description', description);
            createMetaTag('og:image', absoluteImageUrl);
            createMetaTag('og:image:width', '1200');
            createMetaTag('og:image:height', '630');
            createMetaTag('og:image:alt', title);
            createMetaTag('og:url', pageUrl);
            createMetaTag('og:type', 'website');
            createMetaTag('og:site_name', 'Nova Ipê Imobiliária');

            // Tags adicionais para melhorar a compatibilidade com WhatsApp
            createMetaTag('whatsapp:card', 'summary_large_image');
            createMetaTag('whatsapp:title', title);
            createMetaTag('whatsapp:description', description);
            createMetaTag('whatsapp:image', absoluteImageUrl);
            createMetaTag('whatsapp:site', pageUrl);
        };

        insertMetaTags();

        // Limpar meta tags ao desmontar componente
        return () => {
            const tags = document.querySelectorAll('meta[data-whatsapp-meta="true"]');
            tags.forEach(tag => tag.remove());
        };
    }, [title, description, absoluteImageUrl, pageUrl]);

    return null;
}
