'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';

/**
 * Componente que adiciona metatags específicas para WhatsApp
 * para melhorar a visualização de links compartilhados
 */
export default function WhatsAppOptimizer() {
    const [appUrl, setAppUrl] = useState('');

    useEffect(() => {
        // Captura a URL atual para usar nas metatags
        setAppUrl(window.location.href);

        // Detecta se o acesso está vindo do WhatsApp
        const isFromWhatsApp = /WhatsApp/.test(navigator.userAgent) ||
            document.referrer.includes('whatsapp');

        // Podemos fazer otimizações adicionais se for do WhatsApp
        if (isFromWhatsApp) {
            // Adiciona classe ao body para estilos específicos
            document.body.classList.add('from-whatsapp');
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
