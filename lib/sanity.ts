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
})

// Basic client-side fetcher
export async function sanityFetch<T>({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, any>;
}): Promise<T> {
  try {
    const data = await sanityClient.fetch<T>(query, params);
    return data;
  } catch (err) {
    console.error('Sanity fetch error:', err);
    throw new Error(`Failed to fetch from Sanity: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

// REMOVIDO: revalidateContent function
// Esta função usa revalidateTag que não é compatível com Client Components
// Para revalidação, use:
// 1. Em Server Components: importe de sanity.server.ts
// 2. Em Client Components: use SWR ou React Query para refetch
// 3. Para revalidação server-side: use API Routes com res.revalidate()