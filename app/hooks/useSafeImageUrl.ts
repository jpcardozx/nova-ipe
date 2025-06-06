'use client';

import { useMemo } from 'react';

/**
 * Hook que processa uma imagem do Sanity para garantir compatibilidade
 * com o componente SimpleResponsiveImage
 * 
 * @param image Objeto de imagem que pode estar em diferentes formatos
 * @param fallbackUrl URL a ser usada caso a imagem não tenha URL
 * @returns Objeto de imagem normalizado com url e alt
 */
export function useSafeImageUrl(image: any, fallbackUrl: string = '/images/property-placeholder.jpg') {
    return useMemo(() => {
        try {
            // Se for null ou undefined
            if (!image) {
                return {
                    url: fallbackUrl,
                    alt: 'Imagem não disponível'
                };
            }

            // Se for uma URL direta (string)
            if (typeof image === 'string') {
                return {
                    url: image,
                    alt: 'Imagem'
                };
            }

            // Se for um objeto com formato esperado
            if (typeof image === 'object') {
                // Tentar extrair URL de várias propriedades possíveis
                const url = image.url ||
                    image.imagemUrl ||
                    (image.asset && image.asset.url) ||
                    fallbackUrl;

                // Tentar extrair texto alternativo
                const alt = image.alt || 'Imagem';

                return { url, alt };
            }

            // Fallback para caso nenhum formato reconhecido
            return {
                url: fallbackUrl,
                alt: 'Imagem não disponível'
            };
        } catch (error) {
            console.error('Erro ao processar URL da imagem:', error);
            return {
                url: fallbackUrl,
                alt: 'Erro ao carregar imagem'
            };
        }
    }, [image, fallbackUrl]);
}
