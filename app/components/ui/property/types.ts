// Exportando os tipos do PropertyCardUnified para manter compatibilidade
export type { 
  PropertyType,
  PropertyStatus,
  BasePropertyProps,
  PropertyCardUnifiedProps
} from './PropertyCardUnified';

// Definição da interface PropertyImage para uso nos componentes
export interface PropertyImage {
  url: string;
  alt?: string;
  blurDataURL?: string;
  imagemUrl?: string; // Suporte para formato legacy
  sanityImage?: any; // Suporte para referência direta do Sanity
}
