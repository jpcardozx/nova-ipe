'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';

/**
 * Componente que adiciona metatags específicas para WhatsApp
 * para melhorar a visualização de links compartilhados
 * e otimiza o carregamento para acessos via WhatsApp
 */
export default function WhatsAppOptimizer() {
    const [appUrl, setAppUrl] = useState('');

    useEffect(() => {
        // Captura a URL atual para usar nas metatags
        setAppUrl(window.location.href);

        // Detecta se o acesso está vindo do WhatsApp
        const isFromWhatsApp = /WhatsApp/.test(navigator.userAgent) ||
            document.referrer.includes('whatsapp') ||
            window.location.href.includes('utm_source=whatsapp');

        // Otimizações específicas para WhatsApp
        if (isFromWhatsApp) {
            // Adiciona classe ao body para estilos específicos
            document.body.classList.add('from-whatsapp');

            // Remove estado de carregamento imediatamente
            document.documentElement.removeAttribute('data-loading-state');
            document.documentElement.setAttribute('data-loaded', 'true');

            // Força visibilidade imediata
            document.body.style.opacity = '1';
            document.body.style.visibility = 'visible';

            // Pré-carrega imagens críticas para acelerar renderização
            const preloadCriticalImages = () => {
                const criticalImages = [
                    '/images/logo.png',
                    '/images/hero-image.jpg',
                    '/images/og-image-whatsapp.jpg'
                ];

                criticalImages.forEach(src => {
                    const img = new Image();
                    img.src = src;
                });
            };

            preloadCriticalImages();
        }
    }, []);

    if (!appUrl) return null;

    return (
        <>
            <Head>
                {/* Tags específicas para WhatsApp que são inseridas dinamicamente */}
                <meta property="og:url" content={appUrl} key="ogurl" />
                <meta property="og:site_name" content="Nova Ipê Imobiliária" key="ogsitename" />
                <meta property="og:type" content="website" key="ogtype" />

                {/* Especificações para imagens de preview */}
                <meta property="og:image:width" content="1200" key="ogimagewidth" />
                <meta property="og:image:height" content="630" key="ogimageheight" />

                {/* WhatsApp específico */}
                <meta property="al:ios:url" content={appUrl} key="aliosurl" />
                <meta property="al:android:url" content={appUrl} key="alandroidurl" />
                <meta name="twitter:app:url:iphone" content={appUrl} key="twitterappiphone" />
                <meta name="twitter:app:url:ipad" content={appUrl} key="twitterappipad" />
                <meta name="twitter:app:url:googleplay" content={appUrl} key="twitterappgoogleplay" />

                {/* Facebook e outros ajustes */}
                <meta property="fb:pages" content="novaipeimobiliaria" key="fbpages" />
            </Head>
        </>
    );
}
