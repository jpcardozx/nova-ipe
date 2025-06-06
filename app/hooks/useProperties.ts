'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getImoveisDestaqueVenda, getImoveisAluguel } from '@/lib/queries';
import { loadImage } from '@/lib/enhanced-image-loader';
import { extractSlugString } from '@/app/PropertyTypeFix';
import type { ImovelClient } from '@/src/types/imovel-client';
import type { PropertyType, PropertyCardUnifiedProps as PropertyCardProps } from '@/app/components/ui/property/PropertyCardUnified';

export interface UsePropertiesOptions {
  type: 'sale' | 'rent';
  initialFilter?: string;
  initialSort?: string;
  pageSize?: number;
}

export interface UsePropertiesReturn {
  // Data
  properties: PropertyCardProps[];
  filteredProperties: PropertyCardProps[];
  loading: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  
  // Filters
  activeFilter: string;
  activeSort: string;
  searchQuery: string;
  
  // Actions
  setFilter: (filter: string) => void;
  setSort: (sort: string) => void;
  setSearchQuery: (query: string) => void;
  loadMore: () => void;
  refresh: () => void;
  
  // Stats
  stats: {
    total: number;
    featured: number;
    averagePrice: number;
    priceRange: { min: number; max: number };
  };
}

// Transform property data
function transformPropertyData(imovel: ImovelClient, propertyType: PropertyType): PropertyCardProps | null {
  try {
    if (!imovel || !imovel._id) return null;

    const processedImage = loadImage(
      imovel.imagem,
      '/images/property-placeholder.jpg',
      imovel.titulo || 'Imóvel'
    );

    const slug = extractSlugString(imovel.slug);
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    return {
      id: imovel._id,
      title: imovel.titulo || 'Imóvel disponível',
      slug: slug || `imovel-${imovel._id}`,
      location: imovel.bairro || 'Guararema',
      city: 'Guararema',
      price: imovel.preco || 0,
      propertyType,
      area: imovel.areaUtil,
      bedrooms: imovel.dormitorios,
      bathrooms: imovel.banheiros,
      parkingSpots: imovel.vagas,
      mainImage: {
        url: processedImage.url || '/images/property-placeholder.jpg',
        alt: processedImage.alt || 'Imagem do imóvel'
      },
      isHighlight: Boolean(imovel.destaque),
      isPremium: Boolean(imovel.destaque),
      isNew: Boolean(imovel.dataPublicacao && new Date(imovel.dataPublicacao) > new Date(thirtyDaysAgo))
    };
  } catch (error) {
    console.error(`Erro ao transformar imóvel: ${error}`);
    return null;
  }
}

// Filter properties
function filterProperties(properties: PropertyCardProps[], filter: string): PropertyCardProps[] {
  switch (filter) {
    case 'house':
      return properties.filter(p => p.propertyType === 'sale' || p.propertyType === 'rent');
    case 'lot':
      return properties.filter(p => p.area && p.area > 500); // Assuming lots are larger
    case 'apartment':
      return properties.filter(p => p.bedrooms && p.bedrooms <= 3); // Assuming apartments are smaller
    case 'featured':
      return properties.filter(p => p.isHighlight);
    default:
      return properties;
  }
}

// Sort properties
function sortProperties(properties: PropertyCardProps[], sort: string): PropertyCardProps[] {
  const sorted = [...properties];
  
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'area-desc':
      return sorted.sort((a, b) => (b.area || 0) - (a.area || 0));
    case 'featured':
      return sorted.sort((a, b) => (b.isHighlight ? 1 : 0) - (a.isHighlight ? 1 : 0));
    case 'recent':
    default:
      return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }
}

// Search properties
function searchProperties(properties: PropertyCardProps[], query: string): PropertyCardProps[] {
  if (!query.trim()) return properties;
  
  const lowerQuery = query.toLowerCase();
  return properties.filter(p => 
    p.title.toLowerCase().includes(lowerQuery) ||
    p.location.toLowerCase().includes(lowerQuery) ||
    (p.city && p.city.toLowerCase().includes(lowerQuery))
  );
}

// Calculate stats
function calculateStats(properties: PropertyCardProps[]): UsePropertiesReturn['stats'] {
  if (properties.length === 0) {
    return {
      total: 0,
      featured: 0,
      averagePrice: 0,
      priceRange: { min: 0, max: 0 }
    };
  }

  const prices = properties.map(p => p.price).filter(Boolean);
  const featured = properties.filter(p => p.isHighlight).length;

  return {
    total: properties.length,
    featured,
    averagePrice: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
    priceRange: {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 0
    }
  };
}

export function useProperties({
  type,
  initialFilter = 'all',
  initialSort = 'recent',
  pageSize = 12
}: UsePropertiesOptions): UsePropertiesReturn {
  // State
  const [properties, setProperties] = useState<PropertyCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [activeSort, setActiveSort] = useState(initialSort);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch properties
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchFunction = type === 'sale' ? getImoveisDestaqueVenda : getImoveisAluguel;
      const propertyType: PropertyType = type === 'sale' ? 'sale' : 'rent';

      const imoveis = await fetchFunction();
      const transformedProperties = imoveis
        .map(imovel => transformPropertyData(imovel, propertyType))
        .filter(Boolean) as PropertyCardProps[];

      setProperties(transformedProperties);
    } catch (err) {
      console.error('Erro ao buscar propriedades:', err);
      setError('Erro ao carregar propriedades. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [type]);

  // Effect to fetch data
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Filtered and sorted properties
  const filteredProperties = useMemo(() => {
    let result = filterProperties(properties, activeFilter);
    result = searchProperties(result, searchQuery);
    result = sortProperties(result, activeSort);
    return result;
  }, [properties, activeFilter, activeSort, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / pageSize);
  const paginatedProperties = filteredProperties.slice(0, currentPage * pageSize);
  const hasMore = currentPage < totalPages;

  // Stats
  const stats = useMemo(() => calculateStats(filteredProperties), [filteredProperties]);

  // Actions
  const setFilter = useCallback((filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  }, []);

  const setSort = useCallback((sort: string) => {
    setActiveSort(sort);
    setCurrentPage(1);
  }, []);

  const setSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const loadMore = useCallback(() => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore]);

  const refresh = useCallback(() => {
    setCurrentPage(1);
    fetchProperties();
  }, [fetchProperties]);

  return {
    // Data
    properties,
    filteredProperties: paginatedProperties,
    loading,
    error,
    
    // Pagination
    currentPage,
    totalPages,
    hasMore,
    
    // Filters
    activeFilter,
    activeSort,
    searchQuery,
    
    // Actions
    setFilter,
    setSort,
    setSearchQuery: setSearch,
    loadMore,
    refresh,
    
    // Stats
    stats
  };
}

export default useProperties;
