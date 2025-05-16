'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Componente que gera tags de preview otimizadas para o WhatsApp
 * 
 * @param {Object} props
 * @param {string} props.title - Título a ser exibido na preview
 * @param {string} props.description - Descrição a ser exibida na preview
 * @param {string} props.imageUrl - URL da imagem a ser exibida na preview
 * @param {string} props.imageAlt - Texto alternativo para a imagem
 */
export default function WhatsAppPreviewCard({
    title = 'Nova Ipê Imobiliária - Imóveis em Guararema',
    description = 'Propriedades exclusivas em Guararema com atendimento personalizado',
    imageUrl = 'https://www.novaipe.com.br/images/og-image-whatsapp.jpg',
    imageAlt = 'Nova Ipê Imobiliária - Imóveis Premium em Guararema'
}) {
    const pathname = usePathname();
    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
        // Atualiza a URL atual para uso nas metatags
        const baseUrl = window.location.origin;
        setCurrentUrl(`${baseUrl}${pathname}`);
    }, [pathname]);

    // Só renderizar no cliente, depois que a URL estiver disponível
    if (!currentUrl) return null;

    return (
        <Head>
            {/* Metatags básicas */}
            <meta property="og:title" content={title} key="ogtitle" />
            <meta property="og:description" content={description} key="ogdesc" />
            <meta property="og:image" content={imageUrl} key="ogimage" />
            <meta property="og:url" content={currentUrl} key="ogurl" />

            {/* Metatags específicas para WhatsApp */}
            <meta property="whatsapp:title" content={title} key="wapptitle" />
            <meta property="whatsapp:description" content={description} key="wappdesc" />
            <meta property="whatsapp:image" content={imageUrl} key="wappimage" />
            <meta property="whatsapp:card" content="summary_large_image" key="wappcard" />

            {/* Compatibilidade com outras plataformas */}
            <meta name="twitter:card" content="summary_large_image" key="twcard" />
            <meta name="twitter:title" content={title} key="twtitle" />
            <meta name="twitter:description" content={description} key="twdesc" />
            <meta name="twitter:image" content={imageUrl} key="twimage" />
            <meta name="twitter:image:alt" content={imageAlt} key="twimagealt" />
        </Head>
    );
}
