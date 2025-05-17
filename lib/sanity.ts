// lib/sanity.ts (ou lib/sanity/index.ts)
import { createClient } from "next-sanity"
import { projectId, dataset, apiVersion } from "../studio/env"

// Client-side Sanity client for browser usage
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Enable CDN caching for production
  perspective: 'published',
  stega: {
    enabled: false, // Disable stega in production to optimize response size
  },
  // Add retry mechanism and longer timeout
  requestTagPrefix: 'nova-ipe-site',
  timeout: 30000, // 30 second timeout
})

// Basic client-side fetcher with improved error handling
export async function sanityFetch<T>({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, any>;
}): Promise<T> {
  try {
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Sanity fetch timeout')), 20000);
    });

    // Race between the fetch and the timeout
    const data = await Promise.race([
      sanityClient.fetch<T>(query, params),
      timeoutPromise
    ]) as T;

    return data;
  } catch (err) {
    console.error('Sanity fetch error:', err);
    if (err instanceof Error && err.message.includes('ETIMEDOUT')) {
      console.error('Sanity request timed out. Consider increasing timeout or checking connection.');
    }
    // Return empty result instead of throwing to prevent page crashes
    return (Array.isArray({} as T) ? [] : {}) as T;
  }
}

// REMOVIDO: revalidateContent function
// Esta função usa revalidateTag que não é compatível com Client Components
// Para revalidação, use:
// 1. Em Server Components: importe de sanity.server.ts
// 2. Em Client Components: use SWR ou React Query para refetch
// 3. Para revalidação server-side: use API Routes com res.revalidate()