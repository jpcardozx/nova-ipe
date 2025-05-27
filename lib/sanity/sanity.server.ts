import { createClient } from "next-sanity"
import { projectId, dataset, apiVersion } from "../../studio/env"
import { revalidateTag } from "next/cache"

// Server-side Sanity client with revalidation capabilities
export const serverClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Always fetch fresh data on the server
    perspective: 'published',
    stega: {
        enabled: false,
    },
    token: process.env.SANITY_API_TOKEN,
    // Add retry mechanism and longer timeout
    requestTagPrefix: 'nova-ipe-server',
    timeout: 30000, // 30 second timeout
})

// Server-side fetcher with revalidation and improved error handling
export async function serverFetch<T>({
    query,
    params = {},
    tags = [],
}: {
    query: string;
    params?: Record<string, any>;
    tags?: string[];
}): Promise<T> {
    try {
        // Add timeout to prevent hanging requests
        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Sanity server fetch timeout')), 25000);
        });        // Race between the fetch and the timeout
        const data = await Promise.race([
            serverClient.fetch<T>(query, params, {
                next: { 
                    tags,
                    revalidate: 3600 // Default 1 hour cache
                },
            }),
            timeoutPromise
        ]) as T;

        return data;
    } catch (err) {
        console.error('Sanity server fetch error:', err);
        // Log detailed error information for debugging
        if (err instanceof Error) {
            console.error(`Error type: ${err.name}, Message: ${err.message}`);
            console.error(`Stack: ${err.stack}`);
        }

        // Return empty result instead of throwing to prevent page crashes
        return (Array.isArray({} as T) ? [] : {}) as T;
    }
}

// Server-side revalidation function
export async function revalidateSanityContent(type: string, id?: string, slug?: string) {
    try {
        const tagsToRevalidate = ['imoveis'];

        if (type === 'imovel') {
            tagsToRevalidate.push('imoveis');
            if (id) tagsToRevalidate.push(`imovel:${id}`);
            if (slug) tagsToRevalidate.push(`imovel:${slug}`);
        }

        // Revalidate all applicable tags
        for (const tag of tagsToRevalidate) {
            revalidateTag(tag);
        }
    } catch (err) {
        console.error('Failed to revalidate:', err);
    }
}
