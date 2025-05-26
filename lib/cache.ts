// Remove React import as it's not needed in this file
import { unstable_cache } from 'next/cache';

/**
 * Sistema de cache otimizado para Next.js App Router
 * Implementa estratégias de cache diferenciadas por tipo de conteúdo
 */

// Configurações de cache por tipo de dados
const CACHE_CONFIGS = {
  // Dados que mudam raramente (configurações, páginas estáticas)
  static: {
    revalidate: 60 * 60 * 24, // 24 horas
    tags: ['static-content']
  },
  
  // Dados de imóveis (mudam moderadamente)
  properties: {
    revalidate: 60 * 30, // 30 minutos
    tags: ['properties', 'real-estate']
  },
  
  // Dados de destaque (atualizados frequentemente)
  featured: {
    revalidate: 60 * 15, // 15 minutos
    tags: ['featured-properties', 'highlights']
  },
  
  // Dados de usuário/sessão (cache curto)
  user: {
    revalidate: 60 * 5, // 5 minutos
    tags: ['user-data']
  },
  
  // Dados críticos para SEO
  seo: {
    revalidate: 60 * 60 * 6, // 6 horas
    tags: ['seo-data', 'metadata']
  }
} as const;

type CacheType = keyof typeof CACHE_CONFIGS;

/**
 * Wrapper para unstable_cache com configurações otimizadas
 */
export function createCachedFunction<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  cacheType: CacheType,
  keyPrefix?: string
) {
  const config = CACHE_CONFIGS[cacheType];
  
  return unstable_cache(
    fn,
    [keyPrefix || fn.name, cacheType],
    {
      revalidate: config.revalidate,
      tags: config.tags ? [...config.tags] : undefined
    }
  );
}

/**
 * Cache para dados de imóveis
 */
export const cacheProperties = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyPrefix?: string
) => createCachedFunction(fn, 'properties', keyPrefix);

/**
 * Cache para dados em destaque
 */
export const cacheFeatured = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyPrefix?: string
) => createCachedFunction(fn, 'featured', keyPrefix);

/**
 * Cache para dados estáticos
 */
export const cacheStatic = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyPrefix?: string
) => createCachedFunction(fn, 'static', keyPrefix);

/**
 * Cache para dados de SEO
 */
export const cacheSEO = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyPrefix?: string
) => createCachedFunction(fn, 'seo', keyPrefix);

/**
 * Utilitários para revalidação de cache
 */
export const cacheUtils = {
  /**
   * Revalida cache de imóveis
   */
  revalidateProperties: async () => {
    const { revalidateTag } = await import('next/cache');
    revalidateTag('properties');
    revalidateTag('real-estate');
  },
  
  /**
   * Revalida cache de destaques
   */
  revalidateFeatured: async () => {
    const { revalidateTag } = await import('next/cache');
    revalidateTag('featured-properties');
    revalidateTag('highlights');
  },
  
  /**
   * Revalida todo o cache
   */
  revalidateAll: async () => {
    const { revalidateTag } = await import('next/cache');
    Object.values(CACHE_CONFIGS).forEach(config => {
      config.tags.forEach(tag => revalidateTag(tag));
    });
  }
};

/**
 * Hook para cache do lado do cliente (Query style)
 */
export function useClientCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    staleTime?: number;
    cacheTime?: number;
    refetchOnWindowFocus?: boolean;
  } = {}
) {
  if (typeof window === 'undefined') {
    // No servidor, não usar cache do cliente
    return { data: null, isLoading: true, error: null };
  }

  const {
    staleTime = 5 * 60 * 1000, // 5 minutos
    cacheTime = 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus = false
  } = options;

  // Implementação simplificada do cache do cliente
  // Em um projeto real, você usariaQuery ou SWR
  
  const cacheKey = `client-cache-${key}`;
  const cachedData = localStorage.getItem(cacheKey);
  const cachedTime = localStorage.getItem(`${cacheKey}-time`);
  
  const isStale = !cachedTime || 
    Date.now() - parseInt(cachedTime) > staleTime;
  
  if (cachedData && !isStale) {
    return {
      data: JSON.parse(cachedData),
      isLoading: false,
      error: null
    };
  }
  
  // Retorna loading state para implementação completa
  return {
    data: cachedData ? JSON.parse(cachedData) : null,
    isLoading: true,
    error: null
  };
}

/**
 * Configuração para headers de cache HTTP
 */
export const getCacheHeaders = (cacheType: CacheType) => {
  const config = CACHE_CONFIGS[cacheType];
  const maxAge = config.revalidate;
  
  return {
    'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
    'CDN-Cache-Control': `public, max-age=${maxAge}`,
    'Vercel-CDN-Cache-Control': `public, max-age=${maxAge}`
  };
};

/**
 * Middleware para cache de API routes
 */
export function withCache(cacheType: CacheType) {
  return function <T extends any[], R>(
    handler: (...args: T) => Promise<R>
  ) {
    return async (...args: T) => {
      const response = await handler(...args);
      const headers = getCacheHeaders(cacheType);
      
      // Se é uma Response, adicionar headers
      if (response instanceof Response) {
        Object.entries(headers).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      }
      
      return response;
    };
  };
}
