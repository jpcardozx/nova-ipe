import { loadImage } from "@/lib/enhanced-image-loader";
import { extractSlugString } from "@/app/PropertyTypeFix";
import type { ImovelClient } from "@/src/types/imovel-client";
import { PropertyType } from '@/app/components/ui/property/PropertyCardUnified';

/**
 * Utilitário para transformar dados do Sanity em formato utilizável pelos componentes
 * Extrai e normaliza as informações de imóveis para exibição
 */
export function transformPropertyData(
  imovel: ImovelClient, 
  propertyType: PropertyType
) {
  try {
    if (!imovel || !imovel._id) {
      return null;
    }

    const processedImage = loadImage(
      imovel.imagem,
      '/images/property-placeholder.jpg',
      imovel.titulo || 'Imóvel'
    );

    const slug = extractSlugString(imovel.slug);

    return {
      id: imovel._id,
      title: imovel.titulo || 'Imóvel disponível',
      slug: slug || `imovel-${imovel._id}`,
      location: imovel['bairro'] || 'Guararema',
      city: 'Guararema',
      price: imovel.preco || 0,
      propertyType: propertyType,
      area: imovel.areaUtil || undefined,
      bedrooms: imovel.dormitorios || undefined,
      bathrooms: imovel.banheiros || undefined,
      parkingSpots: imovel.vagas || undefined,
      mainImage: {
        url: processedImage.url,
        alt: processedImage.alt
      },
      isHighlight: imovel.destaque || false,
      isPremium: imovel.destaque || false,
      isNew: Boolean(imovel.dataPublicacao && new Date(imovel.dataPublicacao) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    };
  } catch (error) {
    console.error(`Erro ao transformar imóvel: ${error}`);
    return null;
  }
}

/**
 * Utilitário para otimizar carregamento de múltiplas propriedades
 * Reduz a quantidade de propriedades mostradas em tela pequenas
 */
export function getResponsivePropertyCount(
  properties: any[], 
  screenSize: 'sm' | 'md' | 'lg' = 'lg'
) {
  if (!properties || properties.length === 0) {
    return [];
  }
  
  // Ajustar quantidade baseado no tamanho da tela
  const countMap = {
    sm: Math.min(2, properties.length),
    md: Math.min(4, properties.length),
    lg: Math.min(6, properties.length)
  };
  
  return properties.slice(0, countMap[screenSize]);
}

/**
 * Determina lotes de imóveis para serem pré-carregados
 * Útil para paginar e carregar dados de forma otimizada
 */
export function getPropertyBatches(properties: any[], batchSize = 6) {
  if (!properties || properties.length === 0) {
    return [];
  }
    const batches: any[][] = [];
  
  for (let i = 0; i < properties.length; i += batchSize) {
    batches.push(properties.slice(i, i + batchSize));
  }
  
  return batches;
}
