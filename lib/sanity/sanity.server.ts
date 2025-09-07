import { createClient } from "next-sanity"

const serverClient = createClient({
    projectId: '0nks58lj',
    dataset: 'production',
    apiVersion: '2023-05-03',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

export async function serverFetch<T>(
    query: string,
    params: Record<string, any> = {}
): Promise<T> {
    try {
        return await serverClient.fetch<T>(query, params)
    } catch (error) {
        console.error('Sanity server fetch error:', error)
        throw error
    }
}

export { serverClient }
