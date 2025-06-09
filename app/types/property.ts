export interface Property {
    id: string;
    title: string;
    slug: string;
    description?: string;
    location: {
        neighborhood?: string;
        city?: string;
    } | string;
    price: number;
    priceFormatted?: string;
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkingSpots?: number;
    mainImage?: {
        url: string;
        alt?: string;
    };
    photos?: {
        url: string;
        alt?: string;
    }[];
    isPremium?: boolean;
    isNew?: boolean;
    featured?: boolean;
    propertyType: 'sale' | 'rent' | 'featured';
    transactionType?: 'sale' | 'rent' | 'featured';
}

export interface ProcessedProperty {
  _id: string;
  id?: string; // Alias for _id
  titulo: string;
  title?: string; // Alias for titulo
  tipo: string;
  propertyType?: string; // Alias for tipo
  preco: number;
  price?: number; // Alias for preco
  descricao: string;
  description?: string; // Alias for descricao
  localizacao: string;
  location?: string; // Alias for localizacao
  imagens: Array<{
    asset: {
      _ref: string;
      url?: string;
    };
    alt?: string;
  }>;
  quartos?: number;
  bedrooms?: number; // Alias for quartos
  banheiros?: number;
  bathrooms?: number; // Alias for banheiros
  area?: number;
  garagem?: boolean;
  parkingSpots?: number; // Related to garagem
  slug: {
    current: string;
  };
  categoria: 'venda' | 'aluguel';
  destaque?: boolean;
  featured?: boolean; // Alias for destaque
  isPremium?: boolean; // Alias for destaque
  isNew?: boolean;
  mainImage?: {
    url: string;
    alt?: string;
  };
  isHighlight?: boolean; // Alias for destaque
}

export interface PropertySectionProps {
    title: string;
    description?: string;
    properties: Property[];
    badge?: string;
    viewAllLink?: string;
    viewAllText?: string;
    backgroundColor?: string;
}

// Additional types for PropertyCatalog
export interface PropertySearchParams {
    q?: string;
    tipo?: string;
    local?: string;
    precoMin?: string;
    precoMax?: string;
    dormitorios?: string;
    banheiros?: string;
    area?: string;
    comodidades?: string[];
    ordem?: string;
}

export interface PropertyData {
    _id: string;
    id?: string;
    titulo?: string;
    title?: string;
    slug: string;
    preco?: number;
    price?: number;
    finalidade?: 'Venda' | 'Aluguel' | 'Temporada';
    tipoImovel?: 'Casa' | 'Apartamento' | 'Terreno' | 'Comercial' | 'Outro';
    destaque?: boolean;
    featured?: boolean;
    bairro?: string;
    cidade?: string;
    estado?: string;
    descricao?: string;
    description?: string;
    dormitorios?: number;
    bedrooms?: number;
    banheiros?: number;
    bathrooms?: number;
    areaUtil?: number;
    area?: number;
    vagas?: number;
    parkingSpots?: number;
    galeria?: Array<{
        imagemUrl?: string;
        alt?: string;
        asset?: {
            _ref?: string;
            _type?: string;
        };
    }>;
    imagem?: {
        imagemUrl?: string;
        alt?: string;
        asset?: {
            _ref?: string;
            _type?: string;
        };
    };
    caracteristicas?: string[];
    amenities?: string[];
}
