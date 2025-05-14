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
})

// Server-side fetcher with revalidation
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
        const data = await serverClient.fetch<T>(query, params, {
            cache: 'force-cache',
            next: { tags },
        });
        return data;
    } catch (err) {
        console.error('Sanity fetch error:', err);
        throw new Error(`Failed to fetch from Sanity: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
