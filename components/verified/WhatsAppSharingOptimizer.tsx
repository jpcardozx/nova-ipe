'use client';

/**
 * WhatsAppSharingOptimizer.tsx
 * 
 * Componente para otimizar a compartilhabilidade de links no WhatsApp.
 * Adiciona meta tags específicas e injeta scripts necessários.
 * @version 1.0.0
 * @date 21/05/2025
 */

import { useEffect } from 'react';
import Script from 'next/script';
import WhatsAppMetaTags from './WhatsAppMetaTags';

interface WhatsAppSharingOptimizerProps {
    title?: string;
    description?: string;
    imageUrl?: string;
    pageUrl?: string;
}

/**
 * Otimiza o compartilhamento de links no WhatsApp
 * Combina meta tags e scripts para máxima compatibilidade
 */
export default function WhatsAppSharingOptimizer({
    title,
    description,
    imageUrl,
    pageUrl
}: WhatsAppSharingOptimizerProps) {

    // Adiciona os meta tags especialmente projetados para WhatsApp
    useEffect(() => {
        // Adiciona meta tags para forçar atualização de cache do WhatsApp
        if (typeof navigator !== 'undefined' && navigator.userAgent.includes('WhatsApp')) {
            // Cria as meta tags manualmente
            const metaTags = [
                { httpEquiv: 'cache-control', content: 'no-cache, must-revalidate, post-check=0, pre-check=0' },
                { httpEquiv: 'cache-control', content: 'max-age=0' },
                { httpEquiv: 'expires', content: '0' },
                { httpEquiv: 'expires', content: 'Tue, 01 Jan 1980 1:00:00 GMT' },
                { httpEquiv: 'pragma', content: 'no-cache' },
            ];
            metaTags.forEach(function (meta) {
                const tag = document.createElement('meta');
                tag.setAttribute('http-equiv', meta.httpEquiv);
                tag.setAttribute('content', meta.content);
                document.head.appendChild(tag);
            });
        }
    }, []);

    return (
        <>
            {/* Componente de meta tags otimizadas para WhatsApp */}
            <WhatsAppMetaTags
                title={title}
                description={description}
                imageUrl={imageUrl}
                url={pageUrl}
            />

            {/* Script para melhorar a detecção de links */}
            <Script id="whatsapp-link-detection" strategy="afterInteractive">
                {`
          // Este script ajuda o WhatsApp a detectar corretamente os meta dados da página
          if(typeof window !== 'undefined') {
            const forceLinkPreviewUpdate = () => {
              // Adiciona um parâmetro de timestamp para forçar atualização
              const whatsappLinkElements = document.querySelectorAll('a[href*="api.whatsapp.com"]');
              whatsappLinkElements.forEach(element => {
                const href = element.getAttribute('href');
                if (href && !href.includes('_t=')) {
                  element.setAttribute('href', href + (href.includes('?') ? '&' : '?') + '_t=' + Date.now());
                }
              });
            };
            
            // Executa após o carregamento da página
            window.addEventListener('load', forceLinkPreviewUpdate);
          }
        `}
            </Script>
        </>
    );
}

