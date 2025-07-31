'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ImageOff, Home } from 'lucide-react';

// Versão mais robusta de getUrl que lida melhor com diferentes formatos
function getImageUrlFixed(image: any): string {
    if (!image) return '';

    // Caso 1: URL direta
    if (typeof image === 'string') return image;

    // Caso 2: Objeto tem URL
    if (image.url) return image.url;
    if (image.imagemUrl) return image.imagemUrl;

    // Caso 3: Asset com URL
    if (image.asset?.url) return image.asset.url;

    // Caso 4: Asset com _ref (caso problemático)
    if (image.asset?._ref) {
        // Esta é uma lógica simplificada para construir a URL do Sanity
        // baseada na referência do asset
        const ref = image.asset._ref;
        if (ref.startsWith('image-')) {
            const [, id, dimensoes] = ref.split('-');
            if (id) {
                return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'pqrly3zx'}/${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}/${id}-${dimensoes || 'jpg'}`;
            }
        }
    }

    // Fallback
    return '';
}

interface FixedImageProps {
    image: any;
    alt?: string;
    width?: number;
    height?: number;
    fill?: boolean;
    sizes?: string;
    className?: string;
    priority?: boolean;
    quality?: number;
    onLoad?: () => void;
    fallbackUrl?: string;
}

export default function EnhancedImage({
    image,
    alt = '',
    width,
    height,
    fill = false,
    sizes,
    className,
    priority = false,
    quality = 80,
    onLoad,
    fallbackUrl = '/images/property-placeholder.jpg'
}: FixedImageProps) {
    const [loadState, setLoadState] = useState<'loading' | 'success' | 'error'>('loading');
    const [isHovered, setIsHovered] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [processedImage, setProcessedImage] = useState<any>(image);

    // Processar e validar a imagem
    useEffect(() => {
        // Importar dinamicamente para evitar problemas de ciclo
        import('@/lib/image-monitor').then(({ ensureValidImage, trackImageUsage }) => {
            try {
                // Garantir que a imagem está válida
                const validImage = ensureValidImage(image);
                setProcessedImage(validImage);

                // Extrair URL da imagem validada
                const url = getImageUrlFixed(validImage);
                setImageUrl(url || fallbackUrl);

                // Rastrear uso para monitoramento
                trackImageUsage('EnhancedImage', validImage, 'loading');
            } catch (error) {
                console.error('[EnhancedImage] Erro ao processar imagem:', error);
                setImageUrl(fallbackUrl);
            }
        }).catch(err => {
            console.error('[EnhancedImage] Falha ao importar monitoria:', err);
            // Fallback direto sem o sistema de monitoramento
            const url = getImageUrlFixed(image);
            setImageUrl(url || fallbackUrl);
        });
    }, [image, fallbackUrl]);

    // Registrar resultado do carregamento para monitoramento
    useEffect(() => {
        if (loadState !== 'loading' && processedImage) {
            import('@/lib/image-monitor').then(({ trackImageUsage }) => {
                trackImageUsage('EnhancedImage', processedImage, loadState);
            }).catch(() => { });
        }
    }, [loadState, processedImage]);

    // Se não temos uma imagem válida, mostrar fallback
    if (loadState === 'error' || !imageUrl) {
        return (
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center",
                    "bg-gradient-to-b from-stone-100 to-stone-200",
                    "border border-stone-200 rounded-md overflow-hidden",
                    className
                )}
                style={{
                    width: fill ? '100%' : width,
                    height: fill ? '100%' : height,
                }}
            >
                <div className="flex items-center justify-center p-3 mb-2 rounded-full bg-stone-100">
                    <Home className="w-6 h-6 text-amber-500" />
                </div>
                <p className="text-xs text-stone-500">{alt || 'Imagem não disponível'}</p>
            </div>
        );
    }

    return (
        <div
            className={cn("relative overflow-hidden", className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >      <Image
                src={imageUrl}
                alt={alt || (processedImage?.alt || 'Imagem')}
                width={!fill ? (width || 800) : undefined}
                height={!fill ? (height || 600) : undefined}
                fill={fill}
                sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
                priority={priority}
                quality={quality}
                className={cn(
                    "object-cover duration-700 ease-in-out",
                    isHovered ? "scale-105" : "scale-100",
                    loadState === 'loading' ? "grayscale blur-sm" : "grayscale-0 blur-0"
                )}
                onLoad={() => {
                    setLoadState('success');
                    if (onLoad) onLoad();
                }}
                onError={() => {
                    console.error(`[EnhancedImage] Erro ao carregar imagem: ${imageUrl}`);
                    setLoadState('error');
                }}
            />
        </div>
    );
}

