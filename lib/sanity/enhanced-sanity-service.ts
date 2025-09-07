/**
 * Enhanced Sanity Service
 * Provides optimized caching and data fetching for Sanity CMS
 */

import { sanityClient } from '../sanity'

interface CacheOptions {
  revalidate?: number
  tags?: string[]
  forceFresh?: boolean
}

/**
 * Fetch data with optimized caching
 */
export async function fetchWithOptimizedCache<T>(
  query: string,
  params: Record<string, any> = {},
  options: CacheOptions = {}
): Promise<T> {
  const { revalidate = 3600, tags = ['sanity'] } = options

  try {
    return await sanityClient.fetch<T>(query, params, {
      next: { revalidate, tags }
    })
  } catch (error) {
    console.error('Enhanced Sanity fetch error:', error)
    throw error
  }
}

/**
 * Fetch data with cache invalidation
 */
export async function fetchWithInvalidation<T>(
  query: string,
  params: Record<string, any> = {},
  tags: string[] = []
): Promise<T> {
  return fetchWithOptimizedCache<T>(query, params, { revalidate: 0, tags })
}

/**
 * Batch fetch multiple queries
 */
export async function batchFetch<T>(
  queries: Array<{ query: string; params?: Record<string, any> }>,
  options: CacheOptions = {}
): Promise<T[]> {
  const promises = queries.map(({ query, params = {} }) =>
    fetchWithOptimizedCache<T>(query, params, options)
  )
  
  return Promise.all(promises)
}

export default {
  fetchWithOptimizedCache,
  fetchWithInvalidation,
  batchFetch
}
